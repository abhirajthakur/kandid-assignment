"use server";

import { db } from "@/db";
import {
  campaignTable,
  insertCampaignSchema,
  updateCampaignSchema,
} from "@/db/schema";
import {
  calculatePagination,
  createPaginationMeta,
  type PaginatedResponse,
  type PaginationParams,
} from "@/lib/pagination";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAllCampaigns(
  params: PaginationParams = {},
): Promise<PaginatedResponse<typeof campaignTable.$inferSelect>> {
  try {
    const { page, limit, offset } = calculatePagination(params);

    // Build where conditions
    const conditions = [];
    if (params.search) {
      conditions.push(ilike(campaignTable.name, `%${params.search}%`));
    }
    if (params.status) {
      if (params.status === "active") {
        conditions.push(eq(campaignTable.status, "active"));
      } else if (params.status === "inactive") {
        // Inactive includes draft, paused, and completed
        conditions.push(
          or(
            eq(campaignTable.status, "draft"),
            eq(campaignTable.status, "paused"),
            eq(campaignTable.status, "completed"),
          ),
        );
      }
    }

    // Get total count
    let countQuery = db.select({ count: count() }).from(campaignTable);
    if (conditions.length > 0) {
      // @ts-expect-error - Drizzle typing issue with dynamic conditions
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ count: total }] = await countQuery;

    // Get paginated data
    let dataQuery = db
      .select()
      .from(campaignTable)
      .orderBy(desc(campaignTable.createdAt));

    if (conditions.length > 0) {
      // @ts-expect-error - Drizzle typing issue with dynamic conditions
      dataQuery = dataQuery.where(and(...conditions));
    }

    const campaigns = await dataQuery.limit(limit).offset(offset);

    const meta = createPaginationMeta(page, limit, total);

    return {
      success: true,
      data: campaigns,
      meta,
    };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return {
      success: false,
      data: [],
      meta: createPaginationMeta(1, 10, 0),
      error: "Failed to fetch campaigns",
    };
  }
}

export async function getCampaignById(id: string) {
  try {
    const campaign = await db
      .select()
      .from(campaignTable)
      .where(eq(campaignTable.id, id))
      .limit(1);

    if (campaign.length === 0) {
      return {
        success: false,
        error: "Campaign not found",
      };
    }

    return {
      success: true,
      data: campaign[0],
    };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return {
      success: false,
      error: "Failed to fetch campaign",
    };
  }
}

export async function createCampaign(data: {
  name: string;
  totalLeads: number;
  successfulLeads: number;
  responseRate?: number;
}) {
  try {
    const validatedFields = insertCampaignSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error,
      };
    }

    const responseRate =
      validatedFields.data.responseRate ??
      Math.round(
        (validatedFields.data.successfulLeads /
          validatedFields.data.totalLeads) *
          100,
      );

    const newCampaign = await db
      .insert(campaignTable)
      .values({
        ...validatedFields.data,
        responseRate,
      })
      .returning();

    revalidatePath("/campaigns");
    revalidatePath("/");

    return {
      success: true,
      data: newCampaign[0],
    };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return {
      success: false,
      error: "Failed to create campaign",
    };
  }
}

export async function updateCampaign(data: {
  id: string;
  name?: string;
  totalLeads?: number;
  successfulLeads?: number;
  responseRate?: number;
  status?: "draft" | "active" | "paused" | "completed";
}) {
  try {
    const validatedFields = updateCampaignSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error,
      };
    }

    const { id, ...updateData } = validatedFields.data;

    if (
      updateData.totalLeads &&
      updateData.successfulLeads &&
      !updateData.responseRate
    ) {
      updateData.responseRate = Math.round(
        (updateData.successfulLeads / updateData.totalLeads) * 100,
      );
    }

    const updatedCampaign = await db
      .update(campaignTable)
      .set(updateData)
      .where(eq(campaignTable.id, id as string))
      .returning();

    if (updatedCampaign.length === 0) {
      return {
        success: false,
        error: "Campaign not found",
      };
    }

    revalidatePath("/campaigns");
    revalidatePath("/");

    return {
      success: true,
      data: updatedCampaign[0],
    };
  } catch (error) {
    console.error("Error updating campaign:", error);
    return {
      success: false,
      error: "Failed to update campaign",
    };
  }
}

export async function deleteCampaign(id: string) {
  try {
    const deletedCampaign = await db
      .delete(campaignTable)
      .where(eq(campaignTable.id, id))
      .returning();

    if (deletedCampaign.length === 0) {
      return {
        success: false,
        error: "Campaign not found",
      };
    }

    revalidatePath("/campaigns");
    revalidatePath("/");

    return {
      success: true,
      data: deletedCampaign[0],
    };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return {
      success: false,
      error: "Failed to delete campaign",
    };
  }
}
