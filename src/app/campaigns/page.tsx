"use client";

import { CampaignsTable } from "@/components/campaigns/campaigns-table";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function CampaignsPage() {
  const { data: session } = useSession();
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Campaigns"
          subtitle="Manage your campaigns and track their performance."
          showCreateButton={true}
          createButtonText="Create Campaign"
          onCreateClick={() => console.log("Create campaign")}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <CampaignsTable />
        </main>
      </div>
    </div>
  );
}
