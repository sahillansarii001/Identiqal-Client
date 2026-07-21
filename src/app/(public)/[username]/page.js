import React from "react";
import { cardService } from "@/services/cardService.js";
import { SectionRenderer } from "@/components/builder/SectionRenderer.jsx";
import { Compass, QrCode } from "lucide-react";
import AnalyticsLogger from "./AnalyticsLogger.jsx";

// Incremental Static Regeneration (ISR) revalidation limit
export const revalidate = 0; // Set to 0 to disable cache during active development

export default async function PublicCardPage(props) {
  const params = await props.params;
  const { username } = params;

  let cardData = null;
  let errorMsg = "";

  try {
    const response = await cardService.getPublicCard(username);
    if (response.success) {
      cardData = response.data;
    }
  } catch (err) {
    errorMsg = err.message || "Card is not published or does not exist";
  }

  if (errorMsg || !cardData) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 items-center justify-center p-4 text-center">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-sm">
          <Compass size={48} className="mx-auto text-slate-700 animate-pulse" />
          <h2 className="text-base font-bold text-slate-200">Card Offline</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The requested business card link <strong>/{username}</strong> is
            either private, draft-only, or does not exist.
          </p>
        </div>
      </div>
    );
  }

  const { card, displayPreset, colorTheme, footerPreset } = cardData;
  const sections = card.sections || [];

  // Map backend presets to the theme structure SectionRenderer expects
  const theme = {
    colors: {
      primary: colorTheme?.primary || '#000000',
      text: colorTheme?.text || '#1A1A1A',
      background: colorTheme?.background || '#ffffff',
      accent: colorTheme?.accent || '#000000',
    },
    font: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-12 px-4 select-none"
      style={{ backgroundColor: colorTheme?.background || '#090d16' }}
    >
      {/* Analytics view event tracker (client logger) */}
      <AnalyticsLogger cardId={card._id} />

      {/* Main card mock body */}
      <div className="w-full max-w-[720px]">
        {/* Render sections sequentially */}
        {sections.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            This card has no content sections to display yet.
          </div>
        ) : (
          <div
            className="w-full rounded-[28px] border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
            style={{ 
              backgroundColor: colorTheme?.background || '#ffffff',
              borderColor: 'rgba(0,0,0,0.06)'
            }}
          >
            {sections.map((sec, idx) => (
              <React.Fragment key={sec.sectionId}>
                <div className="w-full">
                  <SectionRenderer
                    section={{ 
                      ...sec, 
                      cardId: card._id,
                      imageUrl: card.imageUrl,
                      imageScale: card.imageScale,
                      imagePositionX: card.imagePositionX,
                      imagePositionY: card.imagePositionY,
                      imageOpacity: card.imageOpacity,
                      overlayType: card.overlayType,
                    }}
                    theme={theme}
                    displayPreset={displayPreset}
                    colorTheme={colorTheme}
                    previewMode={false}
                  />
                </div>
                {idx < sections.length - 1 && (
                  <div
                    className="w-full h-px"
                    style={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Footer info branding */}
        <div className="text-center pt-8 border-t border-slate-900/10">
          <p
            className="text-[9px] font-semibold uppercase tracking-widest opacity-60"
            style={{ color: colorTheme?.text || '#212529' }}
          >
            Powered by Identiqal SaaS
          </p>
        </div>
      </div>
    </div>
  );
}
