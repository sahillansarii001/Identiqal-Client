import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../services/leadService.js';

export const useLeads = (cardId) => {
  const queryClient = useQueryClient();

  const leadsQuery = useQuery({
    queryKey: ['leads', cardId],
    queryFn: async () => {
      const response = await leadService.getLeads(cardId);
      return response.data;
    },
    enabled: !!cardId, // Only fetch if cardId is available
  });

  const submitLeadMutation = useMutation({
    mutationFn: async (leadData) => {
      const response = await leadService.submitLead(cardId, leadData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', cardId] });
    },
  });

  return {
    leads: leadsQuery.data || [],
    isLoading: leadsQuery.isLoading,
    isError: leadsQuery.isError,
    error: leadsQuery.error,
    refetch: leadsQuery.refetch,
    
    submitLead: submitLeadMutation.mutateAsync,
    isSubmitting: submitLeadMutation.isPending,
  };
};
