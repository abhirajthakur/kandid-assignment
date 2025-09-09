"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import { useAppStore, useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Linkedin,
  LogOut,
  Megaphone,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Campaign", href: "/campaigns", icon: Megaphone },
  { name: "Messages", href: "/messages", icon: MessageSquare, badge: "10+" },
  { name: "LinkedIn Accounts", href: "/linkedin", icon: Linkedin },
];

const settingsItems = [
  { name: "Setting & Billing", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Use session data if available, otherwise fall back to store
  const currentUser = session?.user || user;

  const handleLogout = async () => {
    try {
      await signOut();
      logout();
      router.push("/login");
    } catch {
      // Fallback logout if server action fails
      logout();
      router.push("/login");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                LB
              </span>
            </div>
            <span className="font-semibold text-sidebar-foreground">
              LinkBird
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2 h-auto">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-medium">
                    {currentUser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-sidebar-foreground">
                      {currentUser?.name || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Personal
                    </span>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <div className="mb-4">
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Overview
              </h3>
            )}
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start mb-1",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                      sidebarCollapsed && "px-2",
                    )}
                  >
                    <item.icon
                      className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")}
                    />
                    {!sidebarCollapsed && (
                      <>
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div>
            {!sidebarCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Settings
              </h3>
            )}
            {settingsItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start mb-1",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                      sidebarCollapsed && "px-2",
                    )}
                  >
                    <item.icon
                      className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")}
                    />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Admin Panel */}
      <div className="p-4 border-t border-sidebar-border">
        {!sidebarCollapsed && (
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Admin Panel
            </h3>
          </div>
        )}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
              sidebarCollapsed && "px-2",
            )}
          >
            <Settings className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")} />
            {!sidebarCollapsed && <span>Activity logs</span>}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
              sidebarCollapsed && "px-2",
            )}
          >
            <Users className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")} />
            {!sidebarCollapsed && <span>User logs</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
