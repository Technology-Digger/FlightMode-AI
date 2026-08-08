import { GATEWAY_NAME } from "@/constants/app";
import type { GatewayHealth } from "@/types/providers";
import { apiRequest } from "@/services/apiClient";

/**
 * Gateway health service.
 *
 * Fetches real gateway status from the FastAPI backend.
 */
export async function getGatewayHealth(): Promise<GatewayHealth> {
  return await apiRequest<GatewayHealth>("/health");
}

export function getGatewayName(): string {
  return GATEWAY_NAME;
}
