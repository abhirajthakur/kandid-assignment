"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  X,
} from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  responded: "bg-green-100 text-green-800 border-green-200",
  converted: "bg-purple-100 text-purple-800 border-purple-200",
};

export function LeadDetailSheet() {
  const { selectedLead, leadDetailOpen, setLeadDetailOpen, setSelectedLead } =
    useAppStore();

  if (!leadDetailOpen || !selectedLead) return null;

  const handleClose = () => {
    setLeadDetailOpen(false);
    setSelectedLead(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={handleClose} />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-96 bg-popover border-l border-border z-50 shadow-lg animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-popover-foreground">
              Lead Profile
            </h2>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Profile Section */}
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground font-medium">
                  {selectedLead.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-popover-foreground mb-1">
                {selectedLead.name}
              </h3>
              <p className="text-muted-foreground mb-3">{selectedLead.title}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {selectedLead.campaignName}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize text-xs",
                    statusColors[selectedLead.status!],
                  )}
                >
                  {selectedLead.status === "pending" && "Pending Approval"}
                  {selectedLead.status === "contacted" && "Contacted"}
                  {selectedLead.status === "responded" && "Responded"}
                  {selectedLead.status === "converted" && "Converted"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Additional Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Additional Profile Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-popover-foreground">
                    {selectedLead.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-popover-foreground">
                    {selectedLead.company}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-popover-foreground">
                    Last contact: {selectedLead.lastContactDate?.toString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-popover-foreground">
                        Invitation Request
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Message: Hi Om, I&apos;m building consultative AI... See
                      More
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-popover-foreground">
                        Connection Status
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Check connection status
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-popover-foreground">
                        Replied
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">View Reply</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-border space-y-3">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Update Status
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
