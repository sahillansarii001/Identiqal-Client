"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore.js";
import { authService } from "@/services/authService.js";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        const response = await authService.refresh();
        const token =
          response.data?.token || response.data?.data?.token || response.token;
        const user =
          response.data?.user || response.data?.data?.user || response.user;

        if (token && user && mounted) {
          setAuth(token, user);
        } else if (mounted) {
          clearAuth();
        }
      } catch (err) {
        if (mounted) clearAuth();
      }
    };
    initAuth();

    return () => {
      mounted = false;
    };
  }, [setAuth, clearAuth]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
