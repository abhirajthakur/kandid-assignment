"use client";

import { useRouter } from "next/navigation";
import { useCampaigns } from "@/hooks/use-data";
import { useDebouncedSearch } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type PaginationParams } from "@/lib/pagination";
import { useState, useEffect } from "react";

const statusColors = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  active: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

export function CampaignsTable() {
  const router = useRouter();
  const { searchValue, debouncedSearchValue, setSearchValue } = useDebouncedSearch('', 300);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    search: debouncedSearchValue,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: 1,
      search: debouncedSearchValue,
    }));
  }, [debouncedSearchValue]);

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: 1,
      status: statusFilter === "all" ? undefined : statusFilter,
    }));
  }, [statusFilter]);

  const { data: campaignsData, isLoading, error } = useCampaigns(pagination);

  const campaigns = campaignsData?.success ? campaignsData.data : [];
  const meta = campaignsData?.success ? campaignsData.meta : null;

  const handleCampaignClick = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
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
            placeholder="Search campaigns by name..."
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

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setStatusFilter("all")}
          className={cn(
            "border-b-2",
            statusFilter === "all"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          All Campaigns
        </Button>
        <Button
          variant="ghost"
          onClick={() => setStatusFilter("active")}
          className={cn(
            "border-b-2",
            statusFilter === "active"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Active
        </Button>
        <Button
          variant="ghost"
          onClick={() => setStatusFilter("inactive")}
          className={cn(
            "border-b-2",
            statusFilter === "inactive"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Inactive
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Campaign Name</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Total Leads</TableHead>
              <TableHead className="text-center">Request Status</TableHead>
              <TableHead className="text-center">Connection Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading campaigns...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-red-600"
                >
                  Failed to load campaigns
                </TableCell>
              </TableRow>
            ) : campaigns?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              campaigns?.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleCampaignClick(campaign.id)}
                >
                  <TableCell>
                    <div className="font-medium text-foreground">
                      {campaign.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        statusColors[campaign.status!],
                      )}
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{campaign.totalLeads}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{campaign.totalLeads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">0</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">📊 0</span>
                      </div>
                    </div>
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
