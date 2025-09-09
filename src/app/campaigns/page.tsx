"use client";

import { CampaignsTable } from "@/components/campaigns/campaigns-table";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CampaignsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

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

  if (!session) {
    return null;
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
