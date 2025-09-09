"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeads } from "@/hooks/use-data";
import { useDebouncedSearch } from "@/hooks/use-debounce";
import { Lead, useAppStore } from "@/lib/store";
import { type PaginationParams } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { Filter, Search } from "lucide-react";
import { useState, useEffect } from "react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  responded: "bg-green-100 text-green-800 border-green-200",
  converted: "bg-purple-100 text-purple-800 border-purple-200",
};

const activityIcons = {
  pending: "⏳",
  contacted: "📧",
  responded: "✅",
  converted: "🎉",
};

export function LeadsTable() {
  const { setSelectedLead, setLeadDetailOpen } = useAppStore();

  // Debounced search
  const { searchValue, debouncedSearchValue, setSearchValue } = useDebouncedSearch('', 300);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  // Update pagination when debounced search value changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: 1, // Reset to first page when search changes
      search: debouncedSearchValue || undefined, // Convert empty string to undefined
    }));
  }, [debouncedSearchValue]);

  const {
    data: leadsData,
    isLoading,
    error,
  } = useLeads(pagination);

  const leads = leadsData?.success ? leadsData.data : [];
  const meta = leadsData?.success ? leadsData.meta : null;

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setLeadDetailOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit: number) => {
    setPagination(prev => ({ ...prev, page: 1, limit }));
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search leads by name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Campaign Name</TableHead>
              <TableHead className="text-center">Activity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading leads...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-red-600"
                >
                  Failed to load leads
                </TableCell>
              </TableRow>
            ) : leads?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No leads found
                </TableCell>
              </TableRow>
            ) : (
              leads?.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleLeadClick(lead)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
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
                      <span className="text-lg">
                        {activityIcons[lead.status || "pending"]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        statusColors[lead.status || "pending"],
                      )}
                    >
                      {(lead.status === "pending" || !lead.status) &&
                        "⏳ Pending Approval"}
                      {lead.status === "contacted" && "📧 Contacted"}
                      {lead.status === "responded" && "✅ Responded"}
                      {lead.status === "converted" && "🎉 Converted"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && (
        <div className="mt-6">
          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
