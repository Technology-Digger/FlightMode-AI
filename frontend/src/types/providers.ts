import type { LucideIcon } from "lucide-react";

export type ProviderStatus = "operational" | "degraded" | "outage";

export interface AIProvider {
  id: string;
  name: string;
  vendor: string;
  model: string;
  description: string;
  status: ProviderStatus;
  latencyMs: number;
  costPer1k: number;
  capabilities: string[];
  color: string;
  icon: LucideIcon;
  preferred?: boolean;
}

export interface ProviderHealth {
  providerId: string;
  status: ProviderStatus;
  latencyMs: number;
  lastChecked: number;
}

export interface GatewayHealth {
  status: "online" | "degraded" | "offline";
  version: string;
  latencyMs: number;
  uptimePct: number;
  providers: ProviderHealth[];
  lastChecked: number;
}
