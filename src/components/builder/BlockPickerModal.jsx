import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCardBuilderStore } from "@/store/cardBuilderStore";
import {
  X,
  Search,
  User,
  Link,
  MessageSquare,
  FormInput,
  Image as ImageIcon,
  MapPin,
  Video,
  Calendar,
  Share2,
} from "lucide-react";

const LIBRARY_COMPONENTS = [
  {
    category: "Essentials",
    items: [
      {
        type: "about",
        label: "Profile Header",
        description: "Your photo, name & title.",
        icon: User,
        color: "bg-blue-500",
      },
      {
        type: "links",
        label: "Social Links",
        description: "Connect all your profiles.",
        icon: Link,
        color: "bg-purple-500",
      },
    ],
  },
  {
    category: "Content",
    items: [
      {
        type: "gallery",
        label: "Image Gallery",
        description: "Showcase your portfolio.",
        icon: ImageIcon,
        color: "bg-emerald-500",
      },
      {
        type: "video",
        label: "Video Embed",
        description: "YouTube or Vimeo videos.",
        icon: Video,
        color: "bg-red-500",
      },
      {
        type: "testimonials",
        label: "Testimonials",
        description: "What others say about you.",
        icon: MessageSquare,
        color: "bg-amber-500",
      },
    ],
  },
  {
    category: "Business",
    items: [
      {
        type: "form",
        label: "Contact Form",
        description: "Capture visitor details.",
        icon: FormInput,
        color: "bg-indigo-500",
      },
      {
        type: "calendar",
        label: "Book Meeting",
        description: "Calendly integration.",
        icon: Calendar,
        color: "bg-cyan-500",
      },
      {
        type: "map",
        label: "Location Map",
        description: "Show your business address.",
        icon: MapPin,
        color: "bg-orange-500",
      },
    ],
  },
];

export const BlockPickerModal = () => {
  const { isBlockPickerOpen, setBlockPickerOpen, addSection } =
    useCardBuilderStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Essentials");

  if (!isBlockPickerOpen) return null;

  const handleAddSection = (type) => {
    const sectionId = `${type}-${Math.random().toString(36).substring(2, 9)}`;
    const newSection = {
      sectionId,
      type,
      order: 999,
      isVisible: true,
      data:
        {
          about: {
            headline: "My Professional Title",
            bio: "Tell visitors details about your work...",
            avatarUrl: "",
          },
          links: {
            links: [{ label: "Personal Website", url: "https://example.com" }],
          },
          testimonials: {
            quote: "John is an excellent engineer...",
            authorName: "Sarah Smith",
            authorTitle: "Director, TechCorp",
          },
          form: {
            title: "Book a Consultation",
            emailRecipient: "you@company.com",
            submitButtonText: "Submit Inquiry",
            fields: [
              {
                fieldId: "field-1",
                label: "Full Name",
                type: "text",
                required: true,
              },
            ],
          },
          gallery: { title: "Product Portfolio", images: [] },
        }[type] || {},
    };
    addSection(newSection);
    setBlockPickerOpen(false);
  };

  const filteredGroups = LIBRARY_COMPONENTS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((group) => group.items.length > 0);

  const activeGroup = searchQuery
    ? filteredGroups
    : filteredGroups.filter((g) => g.category === activeTab);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-end p-4 sm:p-6 lg:pr-12 xl:pr-24">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setBlockPickerOpen(false)}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Block</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enhance your digital card with new features.
              </p>
            </div>
            <button
              onClick={() => setBlockPickerOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-64 border-r border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 py-6 pl-12 pr-6 shrink-0">
              <div className="space-y-1">
                {LIBRARY_COMPONENTS.map((group) => (
                  <button
                    key={group.category}
                    onClick={() => {
                      setActiveTab(group.category);
                      setSearchQuery("");
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === group.category && !searchQuery
                        ? "bg-white dark:bg-white/15 shadow-sm text-primary dark:text-white border border-gray-200 dark:border-white/10"
                        : "text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    {group.category}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
              {/* Search Bar */}
              <div className="p-6 pb-2 sticky top-0 bg-white z-10">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search blocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Grid Layout */}
              <div className="flex-1 overflow-y-auto p-6 pt-4 no-scrollbar">
                {activeGroup.map((group) => (
                  <div key={group.category} className="mb-8 last:mb-0">
                    {searchQuery && (
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 ml-1">
                        {group.category}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {group.items.map((item) => (
                        <motion.div
                          key={item.type}
                          whileHover={{ y: -4, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddSection(item.type)}
                          className="group relative bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-xl text-white ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0`}
                            >
                              <item.icon size={24} />
                            </div>
                            <div className="flex-1 pr-16">
                              <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {item.label}
                              </h4>
                              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* Add button overlay on hover */}
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <div className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-full shadow-lg shadow-primary/20 pointer-events-none">
                              Add
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}

                {activeGroup.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <Search size={32} className="mb-3 opacity-20" />
                    <p>No blocks found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
