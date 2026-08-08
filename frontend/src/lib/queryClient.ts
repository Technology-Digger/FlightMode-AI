import { QueryClient } from "@tanstack/react-query";

/**
 * Global TanStack Query client.
 *
 * The service layer currently returns typed mock data, but everything is wired
 * through useQuery/useMutation so a real FastAPI gateway can be connected
 * without touching the UI.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
