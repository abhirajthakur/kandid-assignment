"use client";

import { Header } from "@/components/header";
import { LeadDetailSheet } from "@/components/leads/lead-detail-sheet";
import { LeadsTable } from "@/components/leads/leads-table";
import { Sidebar } from "@/components/sidebar";
import { useSession } from "@/lib/auth-client";

export default function LeadsPage() {
  const { data: session } = useSession();
  if (!session || !session?.user) {
    return;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Leads"
          subtitle="Manage and track your leads across all campaigns"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <LeadsTable />
          <LeadDetailSheet />
        </main>
      </div>
    </div>
  );
}
