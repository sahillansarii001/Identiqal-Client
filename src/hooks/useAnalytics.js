import { useQuery, useMutation } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService.js";

export const useAnalytics = (cardId) => {
  const analyticsQuery = useQuery({
    queryKey: ["analytics", cardId],
    queryFn: async () => {
      const response = await analyticsService.getAnalytics(cardId);
      return response.data;
    },
    enabled: !!cardId,
  });

  const logEventMutation = useMutation({
    mutationFn: async ({ type, metadata }) => {
      const response = await analyticsService.logEvent(cardId, type, metadata);
      return response.data;
    },
  });

  return {
    analytics: analyticsQuery.data || {
      totals: {},
      devices: {},
      referrers: {},
    },
    isLoading: analyticsQuery.isLoading,
    isError: analyticsQuery.isError,
    error: analyticsQuery.error,
    refetch: analyticsQuery.refetch,

    logEvent: logEventMutation.mutateAsync,
  };
};
