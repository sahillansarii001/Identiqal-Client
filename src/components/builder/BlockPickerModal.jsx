import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCardBuilderStore } from "@/store/cardBuilderStore";
import { X, User, Link as LinkIcon, Image as ImageIcon, MessageSquare, FormInput, QrCode } from "lucide-react";

const BLOCKS = [
  { id: 'about', type: 'about', label: 'About', icon: User, desc: 'Headline, bio, and images' },
  { id: 'links', type: 'links', label: 'Links', icon: LinkIcon, desc: 'Social and custom URLs' },
  { id: 'gallery', type: 'gallery', label: 'Gallery', icon: ImageIcon, desc: 'Photo grid with captions' },
  { id: 'video', type: 'video', label: 'Video', icon: ImageIcon, desc: 'YouTube, Vimeo, or upload' },
  { id: 'testimonials', type: 'testimonials', label: 'Testimonials', icon: MessageSquare, desc: 'Client reviews' },
  { id: 'form', type: 'form', label: 'Contact Form', icon: FormInput, desc: 'Lead generation form' },
  { id: 'qrcode', type: 'qrcode', label: 'QR Code', icon: QrCode, desc: 'Scan to connect' },
];

export const BlockPickerModal = () => {
  const { isBlockPickerOpen, setBlockPickerOpen, sections, addSection, updateQrCode } = useCardBuilderStore();

  const handleAddBlock = (block) => {
    const order = sections.length > 0 ? Math.max(...sections.map(s => s.order || 0)) + 1 : 1;
    const sectionId = `${block.type}-${Date.now()}`;
    addSection({ type: block.type, sectionId, isVisible: true, order, data: {} });
    
    if (block.type === 'qrcode') {
      updateQrCode({ showQRCode: true });
    }
    setBlockPickerOpen(false);
  };

  return (
    <AnimatePresence>
      {isBlockPickerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBlockPickerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#181518] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Block</h3>
              <button
                onClick={() => setBlockPickerOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3 no-scrollbar">
              {BLOCKS.map((block) => {
                const Icon = block.icon;
                // For QR code, check if it's already active to prevent duplicates if we only want one
                // But for now, let's just let them click it
                return (
                  <button
                    key={block.id}
                    onClick={() => handleAddBlock(block)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#151215] shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform border border-gray-100 dark:border-white/5">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{block.label}</h4>
                      <p className="text-xs text-gray-500">{block.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
