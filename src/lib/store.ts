import { create } from "zustand";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  campaignName: string;
  status: "pending" | "contacted" | "responded" | "converted" | null;
  lastContactDate: Date | null;
}

interface Campaign {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  totalLeads: number;
  successfulLeads: number;
  responseRate: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  selectedLead: Lead | null;
  selectedCampaign: Campaign | null;
  leadDetailOpen: boolean;

  // Filter State
  leadsFilter: string;
  campaignsFilter: string;
  statusFilter: string;

  // Actions
  toggleSidebar: () => void;
  setSelectedLead: (lead: Lead | null) => void;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  setLeadDetailOpen: (open: boolean) => void;
  setLeadsFilter: (filter: string) => void;
  setCampaignsFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
}
export const useAppStore = create<AppState>((set) => ({
  // Initial state
  sidebarCollapsed: false,
  selectedLead: null,
  selectedCampaign: null,
  leadDetailOpen: false,
  leadsFilter: "",
  campaignsFilter: "",
  statusFilter: "all",

  // Actions
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  setLeadDetailOpen: (open) => set({ leadDetailOpen: open }),
  setLeadsFilter: (filter) => set({ leadsFilter: filter }),
  setCampaignsFilter: (filter) => set({ campaignsFilter: filter }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
}));

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export type { Lead, Campaign, User };
