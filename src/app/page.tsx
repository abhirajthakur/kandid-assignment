"use client";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SimplePagination } from "@/components/ui/pagination";
import { useCampaigns, useRecentActivity } from "@/hooks/use-data";
import { useSession } from "@/lib/auth-client";
import { type PaginationParams } from "@/lib/pagination";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  // All hooks must be called at the top level, before any conditional logic
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Pagination state
  const [campaignsPagination, setCampaignsPagination] = useState<PaginationParams>({
    page: 1,
    limit: 5, // Show fewer campaigns on dashboard
  });

  const [activityPagination, setActivityPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10, // Show more activities
  });

  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    error: campaignsError,
  } = useCampaigns(campaignsPagination);

  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
  } = useRecentActivity(activityPagination);

  // Handle redirect to login if no session
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Show loading state while session is being fetched
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Return null while redirecting
  if (!session) {
    return null;
  }

  const campaigns = campaignsData?.success ? campaignsData.data : [];
  const campaignsMeta = campaignsData?.success ? campaignsData.meta : null;

  const activities = activityData?.success ? activityData.data : [];
  const activitiesMeta = activityData?.success ? activityData.meta : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "paused":
        return "text-yellow-600 bg-yellow-50";
      case "completed":
        return "text-blue-600 bg-blue-50";
      case "draft":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-purple-600 bg-purple-50";
      case "contacted":
        return "text-orange-600 bg-orange-50";
      case "responded":
        return "text-blue-600 bg-blue-50";
      case "converted":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // TODO: Replace with real LinkedIn accounts data when available
  const linkedInAccounts: Array<{
    name: string;
    email: string;
    requests: string;
    progress: number;
  }> = [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard"
          subtitle="Overview of your campaigns and recent activity."
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Campaigns
                  </h2>
                  <select className="text-sm border border-gray-200 rounded-md px-3 py-1">
                    <option>All Campaigns</option>
                  </select>
                </div>
                <div className="space-y-3">
                  {campaignsLoading ? (
                    <div className="text-center py-4">Loading campaigns...</div>
                  ) : campaignsError ? (
                    <div className="text-center py-4 text-red-600">
                      Failed to load campaigns
                    </div>
                  ) : campaigns?.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No campaigns found
                    </div>
                  ) : (
                    campaigns?.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-gray-900">{campaign.name}</span>
                        <Badge
                          className={getStatusColor(
                            campaign.status || "active",
                          )}
                        >
                          {campaign.status || "Active"}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>

                {/* Campaigns Pagination */}
                {campaignsMeta && (
                  <div className="mt-4 pt-4 border-t">
                    <SimplePagination
                      meta={campaignsMeta}
                      onPageChange={(page) =>
                        setCampaignsPagination(prev => ({ ...prev, page }))
                      }
                    />
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  LinkedIn Accounts
                </h2>
                <div className="space-y-4">
                  {linkedInAccounts.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No LinkedIn accounts connected
                    </div>
                  ) : (
                    linkedInAccounts.map((account) => (
                      <div
                        key={account.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {account.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {account.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {account.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className="text-blue-600 bg-blue-50">
                            Connected
                          </Badge>
                          <Progress value={account.progress} className="w-16" />
                          <span className="text-xs text-gray-500">
                            {account.requests}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <select className="text-sm border border-gray-200 rounded-md px-3 py-1">
                  <option>Most Recent</option>
                </select>
              </div>
              <div className="space-y-4">
                {activityLoading ? (
                  <div className="text-center py-4">
                    Loading recent activity...
                  </div>
                ) : activityError ? (
                  <div className="text-center py-4 text-red-600">
                    Failed to load recent activity
                  </div>
                ) : activities?.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No recent activity
                  </div>
                ) : (
                  activities?.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">
                          {activity.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.campaign}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge
                          className={getActivityStatusColor(
                            activity.status || "pending",
                          )}
                        >
                          {activity.status || "pending"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Recent Activity Pagination */}
              {activitiesMeta && (
                <div className="mt-4 pt-4 border-t">
                  <SimplePagination
                    meta={activitiesMeta}
                    onPageChange={(page) =>
                      setActivityPagination(prev => ({ ...prev, page }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
