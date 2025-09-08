"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useCampaigns } from "@/hooks/use-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const statusColors = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  active: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

export function CampaignsTable() {
  const router = useRouter();
  const { campaignsFilter, setCampaignsFilter } = useAppStore();
  const { data: campaignsData, isLoading, error } = useCampaigns();

  const campaigns = campaignsData?.success ? campaignsData.data : [];

  const filteredCampaigns = campaigns?.filter((campaign) =>
    campaign.name.toLowerCase().includes(campaignsFilter.toLowerCase()),
  );

  const handleCampaignClick = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
            value={campaignsFilter}
            onChange={(e) => setCampaignsFilter(e.target.value)}
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
          className="border-b-2 border-primary text-primary"
        >
          All Campaigns
        </Button>
        <Button variant="ghost" className="text-muted-foreground">
          Active
        </Button>
        <Button variant="ghost" className="text-muted-foreground">
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
            ) : filteredCampaigns?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              filteredCampaigns?.map((campaign) => (
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
    </div>
  );
}
