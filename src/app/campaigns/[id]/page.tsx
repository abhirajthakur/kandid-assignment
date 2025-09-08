// "use client";

import { CampaignDetails } from "@/components/campaigns/campaign-details";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Campaign Details"
          subtitle="Manage and track your campaign performance"
          showCreateButton={false}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <CampaignDetails campaignId={id} />
        </main>
      </div>
    </div>
  );
}
