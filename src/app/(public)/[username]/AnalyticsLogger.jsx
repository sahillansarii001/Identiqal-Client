"use client";

import React, { useEffect } from "react";
import { analyticsService } from "@/services/analyticsService.js";

export default function AnalyticsLogger({ cardId }) {
  useEffect(() => {
    const logPageView = async () => {
      try {
        const referrer = document.referrer
          ? new URL(document.referrer).hostname
          : "direct";
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        await analyticsService.logEvent(cardId, "view", {
          referrer,
          deviceType: isMobile ? "mobile" : "desktop",
        });
      } catch (err) {
        console.error("Failed to log page view analytics", err);
      }
    };

    if (cardId) {
      logPageView();
    }
  }, [cardId]);

  return null;
}
