"use server";

import { db } from "@/db";
import {
  campaignTable,
  insertLeadsSchema,
  leadsTable,
  updateLeadsSchema,
} from "@/db/schema";
import {
  calculatePagination,
  createPaginationMeta,
  type PaginatedResponse,
  type PaginationParams,
} from "@/lib/pagination";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllLeads(
  params: PaginationParams = {},
): Promise<PaginatedResponse<typeof leadsTable.$inferSelect & { campaignName?: string | null }>> {
  try {
    const { page, limit, offset } = calculatePagination(params);

    // Build where conditions
    const conditions = [];

    if (params.status && params.status !== "all") {
      conditions.push(
        eq(
          leadsTable.status,
          params.status as "pending" | "contacted" | "responded" | "converted",
        ),
      );
    }

    if (params.campaign) {
      conditions.push(ilike(campaignTable.name, `%${params.campaign}%`));
    }

    if (params.search) {
      conditions.push(ilike(leadsTable.name, `%${params.search}%`));
    }

    // Get total count
    let countQuery = db
      .select({ count: count() })
      .from(leadsTable)
      .leftJoin(campaignTable, eq(leadsTable.campaignId, campaignTable.id));
    if (conditions.length > 0) {
      // @ts-expect-error - Drizzle typing issue with dynamic conditions
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ count: total }] = await countQuery;

    // Get paginated data with campaign name
    let dataQuery = db
      .select({
        id: leadsTable.id,
        name: leadsTable.name,
        email: leadsTable.email,
        company: leadsTable.company,
        title: leadsTable.title,
        campaignId: leadsTable.campaignId,
        campaignName: campaignTable.name,
        status: leadsTable.status,
        lastContactDate: leadsTable.lastContactDate,
      })
      .from(leadsTable)
      .leftJoin(campaignTable, eq(leadsTable.campaignId, campaignTable.id));

    if (conditions.length > 0) {
      // @ts-expect-error - Drizzle typing issue with dynamic conditions
      dataQuery = dataQuery.where(and(...conditions));
    }

    const leads = await dataQuery
      .orderBy(desc(leadsTable.lastContactDate))
      .limit(limit)
      .offset(offset);

    const meta = createPaginationMeta(page, limit, total);

    return {
      success: true,
      data: leads,
      meta,
    };
  } catch (error) {
    console.error("Error fetching leads:", error);
    return {
      success: false,
      data: [],
      meta: createPaginationMeta(1, 10, 0),
      error: "Failed to fetch leads",
    };
  }
}

export async function getLeadById(id: string) {
  try {
    const lead = await db
      .select()
      .from(leadsTable)
      .where(eq(leadsTable.id, id))
      .limit(1);

    if (lead.length === 0) {
      return {
        success: false,
        error: "Lead not found",
      };
    }

    return {
      success: true,
      data: lead[0],
    };
  } catch (error) {
    console.error("Error fetching lead:", error);
    return {
      success: false,
      error: "Failed to fetch lead",
    };
  }
}

export async function getRecentActivity(
  params: PaginationParams = {},
): Promise<PaginatedResponse<typeof leadsTable.$inferSelect & { campaignName?: string | null; title: string; campaign: string | null }>> {
  try {
    const { page, limit, offset } = calculatePagination({
      ...params,
      limit: params.limit || 10, // Default to 10 for recent activity
    });

    // Get total count
    const [{ count: total }] = await db
      .select({ count: count() })
      .from(leadsTable);

    // Get paginated data with campaign name
    const recentLeads = await db
      .select({
        id: leadsTable.id,
        name: leadsTable.name,
        email: leadsTable.email,
        company: leadsTable.company,
        title: leadsTable.title,
        campaignId: leadsTable.campaignId,
        campaignName: campaignTable.name,
        status: leadsTable.status,
        lastContactDate: leadsTable.lastContactDate,
      })
      .from(leadsTable)
      .leftJoin(campaignTable, eq(leadsTable.campaignId, campaignTable.id))
      .orderBy(desc(leadsTable.lastContactDate))
      .limit(limit)
      .offset(offset);

    const meta = createPaginationMeta(page, limit, total);

    return {
      success: true,
      data: recentLeads.map((lead) => ({
        ...lead,
        title: `${lead.company}`, // Using company as title for activity
        campaign: lead.campaignName,
      })),
      meta,
    };
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return {
      success: false,
      data: [],
      meta: createPaginationMeta(1, 10, 0),
      error: "Failed to fetch recent activity",
    };
  }
}

export async function createLead(data: {
  name: string;
  email: string;
  company: string;
  campaignName: string;
  status?: "pending" | "contacted" | "responded" | "converted";
}) {
  try {
    const validatedFields = insertLeadsSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error,
      };
    }

    const newLead = await db
      .insert(leadsTable)
      .values(validatedFields.data)
      .returning();

    revalidatePath("/leads");
    revalidatePath("/");

    return {
      success: true,
      data: newLead[0],
    };
  } catch (error) {
    console.error("Error creating lead:", error);
    if (error instanceof Error && error.message.includes("unique")) {
      return {
        success: false,
        error: "A lead with this email already exists",
      };
    }
    return {
      success: false,
      error: "Failed to create lead",
    };
  }
}

export async function updateLead(data: {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  campaignName?: string;
  status?: "pending" | "contacted" | "responded" | "converted";
}) {
  try {
    const validatedFields = updateLeadsSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error,
      };
    }

    const { id, ...updateData } = validatedFields.data;

    // Update lastContactDate when status changes
    if (updateData.status) {
      updateData.lastContactDate = new Date();
    }

    const updatedLead = await db
      .update(leadsTable)
      .set(updateData)
      .where(eq(leadsTable.id, id as string))
      .returning();

    if (updatedLead.length === 0) {
      return {
        success: false,
        error: "Lead not found",
      };
    }

    revalidatePath("/leads");
    revalidatePath("/");

    return {
      success: true,
      data: updatedLead[0],
    };
  } catch (error) {
    console.error("Error updating lead:", error);
    if (error instanceof Error && error.message.includes("unique")) {
      return {
        success: false,
        error: "A lead with this email already exists",
      };
    }
    return {
      success: false,
      error: "Failed to update lead",
    };
  }
}

export async function updateLeadStatus(
  id: string,
  status: "pending" | "contacted" | "responded" | "converted",
) {
  try {
    const updatedLead = await db
      .update(leadsTable)
      .set({
        status,
        lastContactDate: new Date(),
      })
      .where(eq(leadsTable.id, id))
      .returning();

    if (updatedLead.length === 0) {
      return {
        success: false,
        error: "Lead not found",
      };
    }

    revalidatePath("/leads");
    revalidatePath("/");

    return {
      success: true,
      data: updatedLead[0],
    };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return {
      success: false,
      error: "Failed to update lead status",
    };
  }
}

export async function deleteLead(id: string) {
  try {
    const deletedLead = await db
      .delete(leadsTable)
      .where(eq(leadsTable.id, id))
      .returning();

    if (deletedLead.length === 0) {
      return {
        success: false,
        error: "Lead not found",
      };
    }

    revalidatePath("/leads");
    revalidatePath("/");

    return {
      success: true,
      data: deletedLead[0],
    };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return {
      success: false,
      error: "Failed to delete lead",
    };
  }
}
