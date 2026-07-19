import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cardService } from "../services/cardService.js";

export const useCards = () => {
  const queryClient = useQueryClient();

  const cardsQuery = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const response = await cardService.getCards();
      return response.data;
    },
  });

  const createCardMutation = useMutation({
    mutationFn: async ({ slug, title }) => {
      const response = await cardService.createCard(slug, title);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: async ({ cardId, cardData }) => {
      const response = await cardService.updateCard(cardId, cardData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ["public-card", data.slug] });
    },
  });

  const publishCardMutation = useMutation({
    mutationFn: async ({ cardId, isPublished }) => {
      const response = await cardService.publishCard(cardId, isPublished);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card", variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ["public-card", data.slug] });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (cardId) => {
      const response = await cardService.deleteCard(cardId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return {
    cards: cardsQuery.data || [],
    isLoading: cardsQuery.isLoading,
    isError: cardsQuery.isError,
    error: cardsQuery.error,
    refetch: cardsQuery.refetch,

    createCard: createCardMutation.mutateAsync,
    isCreating: createCardMutation.isPending,

    updateCard: updateCardMutation.mutateAsync,
    isUpdating: updateCardMutation.isPending,

    publishCard: publishCardMutation.mutateAsync,
    isPublishing: publishCardMutation.isPending,

    deleteCard: deleteCardMutation.mutateAsync,
    isDeleting: deleteCardMutation.isPending,
  };
};
