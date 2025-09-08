"use server";

import { db } from "@/db";
import { insertLeadsSchema, leadsTable, updateLeadsSchema } from "@/db/schema";
import { and, desc, eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllLeads(filters?: {
  status?: string;
  campaign?: string;
  search?: string;
}) {
  try {
    let query = db.select().from(leadsTable);

    const conditions = [];

    if (filters?.status && filters.status !== "all") {
      conditions.push(eq(leadsTable.status, filters.status as "pending" | "contacted" | "responded" | "converted"));
    }

    if (filters?.campaign) {
      conditions.push(like(leadsTable.campaignName, `%${filters.campaign}%`));
    }

    if (filters?.search) {
      conditions.push(like(leadsTable.name, `%${filters.search}%`));
    }

    if (conditions.length > 0) {
      // @ts-expect-error - Drizzle ORM type inference issue with dynamic conditions
      query = query.where(and(...conditions));
    }

    const leads = await query.orderBy(desc(leadsTable.lastContactDate));

    return {
      success: true,
      data: leads,
    };
  } catch (error) {
    console.error("Error fetching leads:", error);
    return {
      success: false,
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

export async function getRecentActivity(limit = 10) {
  try {
    const recentLeads = await db
      .select()
      .from(leadsTable)
      .orderBy(desc(leadsTable.lastContactDate))
      .limit(limit);

    return {
      success: true,
      data: recentLeads.map((lead) => ({
        ...lead,
        title: `${lead.company}`, // Using company as title for activity
        campaign: lead.campaignName,
      })),
    };
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return {
      success: false,
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
