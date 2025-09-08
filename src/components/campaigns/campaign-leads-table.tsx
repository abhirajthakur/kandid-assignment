"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lead } from "@/lib/store";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Filter, Search } from "lucide-react";
import { useState } from "react";

const statusColors = {
  pending: "bg-purple-100 text-purple-800 border-purple-200",
  contacted: "bg-yellow-100 text-yellow-800 border-yellow-200",
  responded: "bg-blue-100 text-blue-800 border-blue-200",
  converted: "bg-green-100 text-green-800 border-green-200",
};

interface CampaignLeadsTableProps {
  leads: Lead[] | undefined;
}

export function CampaignLeadsTable({ leads }: CampaignLeadsTableProps) {
  const { setSelectedLead } = useAppStore();
  const [searchFilter, setSearchFilter] = useState("");

  const filteredLeads = leads?.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search leads..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Campaign Name</TableHead>
              <TableHead className="text-center">Activity</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads?.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedLead(lead)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                        {lead.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">
                        {lead.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {lead.email || lead.title}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-foreground">{lead.campaignName}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", statusColors[lead.status!])}
                  >
                    {lead.status === "pending"
                      ? "Pending Approval"
                      : lead.status === "contacted"
                        ? "Sent 7 mins ago"
                        : lead.status === "responded"
                          ? "Followup 10 mins ago"
                          : "Do Not Contact"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
