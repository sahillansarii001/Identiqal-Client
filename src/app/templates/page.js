"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar.jsx";
import { Footer } from "@/components/marketing/Footer.jsx";
import {
  Search,
  SlidersHorizontal,
  Heart,
  Eye,
  Check,
  X,
  Monitor,
  Smartphone,
  Tablet,
  Moon,
  Sun,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  Maximize2,
  ChevronRight,
} from "lucide-react";

// Mock Templates Data aligned with design theme
const initialTemplates = [
  {
    id: "linear-dark",
    name: "Linear Dark",
    category: "Developer",
    styles: ["Dark", "Minimal", "Modern"],
    colors: ["#1F1F1F", "#5A3342"],
    badge: "AI PICK",
    rating: 5.0,
    author: "Identiqal Studio",
    description:
      "Inspired by modern software design systems. Features subtle gold-borders, dark-mode blocks, and active calendar integrations.",
  },
  {
    id: "studio-minimalist",
    name: "Studio Minimalist",
    category: "Designer",
    styles: ["Minimal", "Modern", "Portfolio"],
    colors: ["#FAF8F6", "#1F1F1F"],
    badge: "NEW",
    rating: 4.8,
    author: "Identiqal Studio",
    description:
      "A clean, typography-focused layout featuring a single avatar, simple bios, and a pristine vertical block arrangement.",
  },
  {
    id: "gold-luxury",
    name: "Gold Luxury",
    category: "Freelancer",
    styles: ["Luxury", "Glassmorphism", "Portfolio"],
    colors: ["#FAF8F6", "#C89B5B", "#5A3342"],
    badge: "PREMIUM",
    rating: 4.9,
    author: "Identiqal Studio",
    description:
      "Ivory layouts accented with warm gold details, italics, and custom glassmorphism borders for premium professionals.",
  },
  {
    id: "startup-bold",
    name: "Startup Bold",
    category: "Startup",
    styles: ["Modern", "Gradient", "Corporate"],
    colors: ["#FAF8F6", "#5A3342", "#C89B5B"],
    badge: "TRENDING",
    rating: 4.7,
    author: "Identiqal Studio",
    description:
      "Dynamic gradient-filled blocks, floating contact forms, and custom inquiry blocks built for launching team pages.",
  },
  {
    id: "agency-creative",
    name: "Agency Creative",
    category: "Agency",
    styles: ["Glassmorphism", "Modern", "Portfolio"],
    colors: ["#FFFFFF", "#5A3342", "#C89B5B"],
    badge: "POPULAR",
    rating: 4.9,
    author: "Identiqal Studio",
    description:
      "Strong grid visuals, custom social layouts, embedded client testimonial carousels, and portfolio photo links.",
  },
  {
    id: "photographer-gallery",
    name: "Studio Photographer",
    category: "Photographer",
    styles: ["Minimal", "Modern", "Portfolio"],
    colors: ["#1F1F1F", "#E9E2DC"],
    badge: "PREMIUM",
    rating: 4.8,
    author: "Identiqal Studio",
    description:
      "Optimized photo grid galleries, minimal profiles, dark mode triggers, and high-resolution picture background states.",
  },
  {
    id: "healthcare-pro",
    name: "Healthcare Pro",
    category: "Healthcare",
    styles: ["Corporate", "Modern"],
    colors: ["#FAF8F6", "#22C55E", "#C89B5B"],
    badge: "NEW",
    rating: 4.6,
    author: "Identiqal Studio",
    description:
      "Tailored for doctors and practitioners. Features direct appointment booking link integrations and clinic maps.",
  },
  {
    id: "realestate-clean",
    name: "Real Estate Clean",
    category: "Real Estate",
    styles: ["Corporate", "Minimal"],
    colors: ["#FFFFFF", "#5A3342", "#C89B5B"],
    badge: "TRENDING",
    rating: 4.7,
    author: "Identiqal Studio",
    description:
      "Clean layouts with prominent phone CTA buttons, photo showcases, lead forms, and agency logo locking blocks.",
  },
];

const categories = [
  "All Templates",
  "Business",
  "Developer",
  "Freelancer",
  "Designer",
  "Creator",
  "Photographer",
  "Agency",
  "Startup",
  "Student",
  "Healthcare",
  "Real Estate",
];

const stylesList = [
  "Minimal",
  "Luxury",
  "Dark",
  "Modern",
  "Glassmorphism",
  "Gradient",
  "Corporate",
  "Portfolio",
];

const colorsList = [
  { name: "burgundy", hex: "#5A3342" },
  { name: "gold", hex: "#C89B5B" },
  { name: "white", hex: "#FAF8F6" },
  { name: "dark", hex: "#1F1F1F" },
  { name: "secondary", hex: "#6B6B6B" },
  { name: "muted", hex: "#8A8A8A" },
];

export default function TemplatesPage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortBy, setSortBy] = useState("Popular");
  const [favorites, setFavorites] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Viewport and theme states for Preview Modal
  const [previewViewport, setPreviewViewport] = useState("mobile");
  const [previewTheme, setPreviewTheme] = useState("light");

  // AI Questionnaire state
  const [aiQuizStep, setAiQuizStep] = useState(0); // 0: Closed, 1: Step 1, 2: Step 2, 3: Step 3, 4: Result
  const [aiAnswers, setAiAnswers] = useState({
    profession: "",
    goal: "",
    style: "",
  });
  const [aiRecommendation, setAiRecommendation] = useState(null);

  // Favorites logic
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Filter styles list
  const toggleStyleFilter = (style) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  // Filter colors list
  const toggleColorFilter = (hex) => {
    if (selectedColors.includes(hex)) {
      setSelectedColors(selectedColors.filter((c) => c !== hex));
    } else {
      setSelectedColors([...selectedColors, hex]);
    }
  };

  // Clear filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Templates");
    setSelectedStyles([]);
    setSelectedColors([]);
    setSortBy("Popular");
    setAiRecommendation(null);
  };

  // AI Recommendation logic
  const handleAiQuizSubmit = () => {
    // Determine recommendation based on inputs
    let matchId = "studio-minimalist";
    if (aiAnswers.profession === "Developer") {
      matchId = "linear-dark";
    } else if (
      aiAnswers.style === "Luxury & Gold" ||
      aiAnswers.profession === "Freelancer"
    ) {
      matchId = "gold-luxury";
    } else if (
      aiAnswers.goal === "Capture Leads" ||
      aiAnswers.profession === "Startup"
    ) {
      matchId = "startup-bold";
    } else if (
      aiAnswers.profession === "Designer" ||
      aiAnswers.style === "Creative & Glass"
    ) {
      matchId = "agency-creative";
    }

    const template = initialTemplates.find((t) => t.id === matchId);
    setAiRecommendation(template);
    setAiQuizStep(4); // show result
  };

  // Filter templates lists
  const filteredTemplates = useMemo(() => {
    return initialTemplates
      .filter((t) => {
        // Search matches
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          t.name.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower) ||
          t.styles.some((s) => s.toLowerCase().includes(searchLower));

        // Category matches
        const matchesCategory =
          selectedCategory === "All Templates" ||
          t.category.toLowerCase() === selectedCategory.toLowerCase();

        // Style matches
        const matchesStyles =
          selectedStyles.length === 0 ||
          selectedStyles.every((style) => t.styles.includes(style));

        // Color matches (checks if template's colors overlay color list match)
        const matchesColors =
          selectedColors.length === 0 ||
          selectedColors.some((colorHex) =>
            t.colors.some((c) => c.toLowerCase() === colorHex.toLowerCase()),
          );

        return (
          matchesSearch && matchesCategory && matchesStyles && matchesColors
        );
      })
      .sort((a, b) => {
        if (sortBy === "Newest") return a.badge === "NEW" ? -1 : 1;
        if (sortBy === "Popular") return b.rating - a.rating;
        if (sortBy === "Trending") return a.badge === "TRENDING" ? -1 : 1;
        if (sortBy === "AI Recommended") return a.badge === "AI PICK" ? -1 : 1;
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedStyles, selectedColors, sortBy]);

  // Featured Carousel items
  const featuredTemplates = useMemo(() => {
    return initialTemplates.filter(
      (t) => t.badge === "PREMIUM" || t.badge === "AI PICK",
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F6] text-[#1F1F1F]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* HERO SECTION */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[#5A3342]/5 blur-[120px]" />
            <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full bg-[#C89B5B]/5 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            {/* Left content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight text-[#1F1F1F]">
                Choose a Template. <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#5A3342] to-[#C89B5B]">
                  Build Your Identity.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-brand-secondary max-w-xl font-medium">
                Professionally designed templates for developers, creators,
                freelancers, businesses, agencies, students and networking
                professionals.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a href="#marketplace">
                  <button className="bg-[#5A3342] text-white hover:bg-[#6A3B4B] font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md">
                    Browse Templates
                  </button>
                </a>
                <Link href="/signup">
                  <button className="bg-white border border-[#E9E2DC] hover:border-[#5A3342]/30 text-[#5A3342] font-semibold px-6 py-3.5 rounded-xl transition-all">
                    Start From Scratch
                  </button>
                </Link>
              </div>
            </div>

            {/* Right content: floating previews */}
            <div className="lg:col-span-5 relative h-[380px] hidden lg:flex justify-center items-center">
              {/* Stacked template 1 */}
              <div className="absolute top-4 left-6 w-[200px] bg-white border border-[#E9E2DC] p-4 rounded-2xl shadow-lg shadow-[#5A3342]/5 -rotate-6 animate-float z-10 select-none">
                <div className="w-10 h-10 rounded-full bg-[#5A3342]/10 flex items-center justify-center text-[#5A3342] font-bold mb-3">
                  AM
                </div>
                <div className="h-3 w-2/3 bg-[#5A3342]/10 rounded mb-2" />
                <div className="h-2 w-1/2 bg-[#5A3342]/5 rounded mb-4" />
                <div className="space-y-1.5">
                  <div className="h-6 bg-[#5A3342] rounded-md animate-pulse" />
                  <div className="h-6 bg-white border border-[#E9E2DC] rounded-md" />
                </div>
              </div>

              {/* Stacked template 2 */}
              <div className="absolute bottom-4 right-6 w-[210px] bg-[#1F1F1F] border border-zinc-800 p-4 rounded-2xl shadow-2xl rotate-[8deg] animate-float-slow z-20 select-none">
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#5A3342] to-[#C89B5B] mb-3" />
                <div className="h-3 w-1/2 bg-white/20 rounded mb-2" />
                <div className="h-2 w-1/3 bg-white/10 rounded mb-4" />
                <div className="space-y-1.5">
                  <div className="h-6 bg-white rounded-md animate-pulse" />
                  <div className="h-6 bg-zinc-900 border border-zinc-800 rounded-md" />
                </div>
              </div>

              {/* Stacked template 3 */}
              <div className="absolute top-1/3 right-12 w-[190px] bg-[#FAF8F6] border border-[#C89B5B]/20 p-4 rounded-2xl shadow-xl shadow-[#5A3342]/3 rotate-1 animate-float-fast z-15 select-none">
                <div className="w-8 h-8 rounded-full bg-[#C89B5B]/20 border border-[#C89B5B]/30 flex items-center justify-center text-[#C89B5B] font-bold text-xs mb-3">
                  JD
                </div>
                <div className="h-2.5 w-3/4 bg-[#5A3342]/20 rounded mb-2" />
                <div className="space-y-1.5">
                  <div className="h-5 bg-[#5A3342] rounded-md" />
                  <div className="h-5 bg-[#C89B5B]/15 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED CAROUSEL */}
        <section className="py-8 bg-white border-y border-[#E9E2DC] overflow-hidden select-none">
          <div className="max-w-7xl mx-auto px-6 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A3342] flex items-center gap-1">
              <Sparkles size={10} className="text-[#C89B5B]" />
              Featured Premium Styles
            </span>
          </div>

          <div className="relative w-full overflow-hidden flex items-center">
            <style jsx>{`
              .animate-marquee-templates {
                animation: marquee 35s linear infinite;
              }
            `}</style>
            <div className="flex space-x-8 animate-marquee-templates min-w-full py-2">
              {[
                ...featuredTemplates,
                ...featuredTemplates,
                ...featuredTemplates,
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTemplate(item)}
                  className="bg-[#FAF8F6] border border-[#E9E2DC] hover:border-[#5A3342]/30 p-5 rounded-2xl w-[260px] shrink-0 cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 rounded-full bg-[#5A3342] text-white font-bold text-[8px]">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-bold text-[#C89B5B]">
                        ★ {item.rating}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#1F1F1F]">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-brand-secondary">
                        {item.category} • {item.styles.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E9E2DC] flex items-center justify-between text-[10px] font-bold text-[#5A3342]">
                    <span>View Blueprint</span>
                    <Maximize2 size={10} className="text-[#C89B5B]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI RECOMMENDED SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          {aiQuizStep === 0 ? (
            <div className="bg-[#5A3342]/5 border border-[#5A3342]/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <h3 className="text-lg font-bold text-[#1F1F1F] flex items-center gap-1.5">
                  <Sparkles className="text-[#C89B5B]" size={18} />
                  Not sure which design suits you?
                </h3>
                <p className="text-xs text-brand-secondary max-w-xl">
                  Take a quick 3-question AI design match quiz. We will
                  recommend the perfect smart landing templates based on your
                  objectives and field.
                </p>
              </div>
              <button
                onClick={() => setAiQuizStep(1)}
                className="bg-[#5A3342] text-white hover:bg-[#6A3B4B] text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center space-x-1.5"
              >
                <span>Find My Template</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="bg-white border border-[#E9E2DC] rounded-2xl p-6 sm:p-8 space-y-6 text-left shadow-sm shadow-[#5A3342]/3">
              <div className="flex items-center justify-between border-b border-[#E9E2DC] pb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} className="text-[#C89B5B]" />
                  <span className="text-sm font-bold text-[#1F1F1F]">
                    AI Recommended Assistant
                  </span>
                </div>
                <button
                  onClick={() => setAiQuizStep(0)}
                  className="text-brand-secondary hover:text-[#1F1F1F]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Step 1: Profession */}
              {aiQuizStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-brand-secondary">
                    STEP 1 of 3: What is your primary profession?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Developer",
                      "Designer",
                      "Freelancer",
                      "Startup Leader",
                      "Creator",
                    ].map((prof) => (
                      <button
                        key={prof}
                        onClick={() => {
                          setAiAnswers({ ...aiAnswers, profession: prof });
                          setAiQuizStep(2);
                        }}
                        className="px-4 py-2.5 rounded-xl border border-[#E9E2DC] hover:border-[#5A3342] text-xs font-semibold text-[#1F1F1F] bg-white transition-all hover:bg-[#5A3342]/5"
                      >
                        {prof}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Goal */}
              {aiQuizStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-brand-secondary">
                    STEP 2 of 3: What is your primary networking goal?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Build Portfolio",
                      "Capture Leads",
                      "Share Social Links",
                      "Book Appointments",
                    ].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => {
                          setAiAnswers({ ...aiAnswers, goal: goal });
                          setAiQuizStep(3);
                        }}
                        className="px-4 py-2.5 rounded-xl border border-[#E9E2DC] hover:border-[#5A3342] text-xs font-semibold text-[#1F1F1F] bg-white transition-all hover:bg-[#5A3342]/5"
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setAiQuizStep(1)}
                    className="text-[10px] font-bold text-brand-secondary underline pt-2 block"
                  >
                    ← Back to Step 1
                  </button>
                </div>
              )}

              {/* Step 3: Style */}
              {aiQuizStep === 3 && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-brand-secondary">
                    STEP 3 of 3: Which style aesthetic feels best?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Clean & Minimal",
                      "Dark & Tech",
                      "Luxury & Gold",
                      "Creative & Glass",
                    ].map((style) => (
                      <button
                        key={style}
                        onClick={() => {
                          const updated = { ...aiAnswers, style: style };
                          setAiAnswers(updated);
                          // Submit directly since this is the final step
                          setTimeout(() => {
                            let matchId = "studio-minimalist";
                            if (updated.profession === "Developer")
                              matchId = "linear-dark";
                            else if (
                              updated.style === "Luxury & Gold" ||
                              updated.profession === "Freelancer"
                            )
                              matchId = "gold-luxury";
                            else if (
                              updated.goal === "Capture Leads" ||
                              updated.profession === "Startup Leader"
                            )
                              matchId = "startup-bold";
                            else if (
                              updated.profession === "Designer" ||
                              updated.style === "Creative & Glass"
                            )
                              matchId = "agency-creative";

                            const match = initialTemplates.find(
                              (t) => t.id === matchId,
                            );
                            setAiRecommendation(match);
                            setAiQuizStep(4);
                          }, 50);
                        }}
                        className="px-4 py-2.5 rounded-xl border border-[#E9E2DC] hover:border-[#5A3342] text-xs font-semibold text-[#1F1F1F] bg-white transition-all hover:bg-[#5A3342]/5"
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setAiQuizStep(2)}
                    className="text-[10px] font-bold text-brand-secondary underline pt-2 block"
                  >
                    ← Back to Step 2
                  </button>
                </div>
              )}

              {/* Step 4: Result */}
              {aiQuizStep === 4 && aiRecommendation && (
                <div className="space-y-4 bg-[#5A3342]/5 border border-[#5A3342]/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-bold bg-[#C89B5B]/15 text-[#C89B5B] border border-[#C89B5B]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      AI Recommendation Match
                    </span>
                    <h4 className="font-extrabold text-base text-[#1F1F1F]">
                      {aiRecommendation.name}
                    </h4>
                    <p className="text-xs text-brand-secondary max-w-lg">
                      {aiRecommendation.description}
                    </p>
                  </div>
                  <div className="flex space-x-3 shrink-0">
                    <button
                      onClick={() => setSelectedTemplate(aiRecommendation)}
                      className="bg-white border border-[#E9E2DC] text-[#5A3342] text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-[#FAF8F6] transition-all shadow-sm"
                    >
                      Preview Blueprint
                    </button>
                    <button
                      onClick={() => {
                        // Apply AI Pick to sorting and category matching
                        setSortBy("AI Recommended");
                        setSelectedCategory(aiRecommendation.category);
                        setAiQuizStep(0);
                      }}
                      className="bg-[#5A3342] hover:bg-[#6A3B4B] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm"
                    >
                      Show in Grid
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* MARKETPLACE SEARCH + GRID */}
        <section
          id="marketplace"
          className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-8 pt-6"
        >
          {/* SEARCH BAR (Centered spanning grid top) */}
          <div className="lg:col-span-12 flex flex-col items-center justify-center space-y-4 mb-6">
            <div className="relative w-full max-w-2xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary"
                size={18}
              />
              <input
                type="text"
                placeholder="Search templates by name, style, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#E9E2DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#5A3342] text-sm text-[#1F1F1F] shadow-sm shadow-[#5A3342]/3 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-secondary hover:text-[#1F1F1F]"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* FILTER SIDEBAR */}
          <div className="lg:col-span-3 space-y-6">
            <div className="sticky top-24 bg-white border border-[#E9E2DC] rounded-2xl p-6 space-y-6 shadow-sm shadow-[#5A3342]/3 text-left">
              <div className="flex items-center justify-between border-b border-[#E9E2DC] pb-3">
                <h3 className="font-bold text-sm text-[#1F1F1F] flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-[#5A3342]" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-brand-secondary hover:text-[#5A3342] underline transition-colors"
                >
                  Reset All
                </button>
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-[#1F1F1F] uppercase tracking-wider">
                  Category
                </h4>
                <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? "bg-[#5A3342] text-white"
                          : "text-brand-secondary hover:bg-[#FAF8F6] hover:text-[#1F1F1F]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style selector */}
              <div className="space-y-2 border-t border-[#E9E2DC] pt-4">
                <h4 className="text-[11px] font-black text-[#1F1F1F] uppercase tracking-wider">
                  Style
                </h4>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {stylesList.map((style) => {
                    const isChecked = selectedStyles.includes(style);
                    return (
                      <button
                        key={style}
                        onClick={() => toggleStyleFilter(style)}
                        className="flex items-center space-x-2 w-full text-left py-1 text-xs font-medium text-brand-secondary hover:text-[#1F1F1F]"
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                            isChecked
                              ? "bg-[#5A3342] border-[#5A3342]"
                              : "border-[#E9E2DC]"
                          }`}
                        >
                          {isChecked && (
                            <Check
                              size={8}
                              className="text-white"
                              strokeWidth={4}
                            />
                          )}
                        </div>
                        <span>{style}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color selector */}
              <div className="space-y-2 border-t border-[#E9E2DC] pt-4">
                <h4 className="text-[11px] font-black text-[#1F1F1F] uppercase tracking-wider">
                  Color
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {colorsList.map((col) => {
                    const isSelected = selectedColors.includes(col.hex);
                    return (
                      <button
                        key={col.name}
                        onClick={() => toggleColorFilter(col.hex)}
                        style={{ backgroundColor: col.hex }}
                        className={`w-6 h-6 rounded-full border border-black/5 flex items-center justify-center shadow-sm relative hover:scale-110 transition-transform ${
                          isSelected
                            ? "ring-2 ring-[#5A3342] ring-offset-2"
                            : ""
                        }`}
                        title={col.name}
                      >
                        {isSelected && (
                          <Check
                            size={10}
                            className={
                              col.name === "white" ? "text-black" : "text-white"
                            }
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sorting */}
              <div className="space-y-2 border-t border-[#E9E2DC] pt-4">
                <h4 className="text-[11px] font-black text-[#1F1F1F] uppercase tracking-wider">
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs font-semibold px-2 py-2.5 rounded-lg border border-[#E9E2DC] bg-white focus:outline-none focus:ring-1 focus:ring-[#5A3342]"
                >
                  <option value="Popular">Most Popular (★)</option>
                  <option value="Newest">Newest Designs</option>
                  <option value="Trending">Trending Hot</option>
                  <option value="AI Recommended">AI Recommended</option>
                </select>
              </div>
            </div>
          </div>

          {/* TEMPLATE GALLERY GRID */}
          <div className="lg:col-span-9 space-y-6">
            {filteredTemplates.length === 0 ? (
              <div className="bg-white border border-[#E9E2DC] rounded-2xl p-16 text-center space-y-4">
                <p className="text-sm font-semibold text-brand-secondary">
                  No templates matched your current filter selections.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#5A3342] hover:bg-[#6A3B4B] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => {
                  const isFavorited = favorites.includes(template.id);
                  return (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className="group bg-white border border-[#E9E2DC] hover:border-[#5A3342]/30 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-[#5A3342]/5 relative text-left"
                    >
                      {/* Badge / Ribbon */}
                      {template.badge && (
                        <span
                          className={`absolute top-3.5 left-3.5 z-10 px-2 py-0.5 text-white text-[8px] font-black uppercase tracking-wider rounded ${
                            template.badge === "AI PICK"
                              ? "bg-[#C89B5B]"
                              : "bg-[#5A3342]"
                          }`}
                        >
                          {template.badge}
                        </span>
                      )}

                      {/* Mock Graphic Container */}
                      <div className="h-44 bg-[#FAF8F6] border-b border-[#E9E2DC] relative flex items-center justify-center p-4 overflow-hidden group-hover:bg-[#FAF8F6]/50 transition-colors">
                        {/* CSS Card Representation inside card */}
                        <div className="w-[110px] bg-white border border-[#E9E2DC] p-3 rounded-xl shadow-md rotate-[-4deg] group-hover:scale-105 group-hover:rotate-0 transition-all duration-300">
                          <div className="w-6 h-6 rounded-full bg-linear-to-tr from-[#5A3342] to-[#C89B5B] mb-2" />
                          <div className="h-1.5 w-3/4 bg-slate-200 rounded mb-1" />
                          <div className="h-1 w-1/2 bg-slate-100 rounded mb-3" />
                          <div className="space-y-1">
                            <div className="h-3.5 bg-[#5A3342] rounded" />
                            <div className="h-3.5 bg-slate-50 border border-[#E9E2DC] rounded" />
                          </div>
                        </div>

                        {/* Favorite button */}
                        <button
                          onClick={(e) => toggleFavorite(template.id, e)}
                          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white border border-[#E9E2DC] flex items-center justify-center hover:scale-110 shadow-sm transition-transform"
                        >
                          <Heart
                            size={11}
                            fill={isFavorited ? "#5A3342" : "none"}
                            className={
                              isFavorited ? "text-[#5A3342]" : "text-brand-secondary"
                            }
                          />
                        </button>
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#5A3342]">
                            {template.category}
                          </span>
                          <span className="text-[10px] font-bold text-[#C89B5B]">
                            ★ {template.rating}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-[#1F1F1F]">
                          {template.name}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {template.styles.map((style) => (
                            <span
                              key={style}
                              className="text-[8px] font-semibold bg-[#FAF8F6] text-brand-secondary border border-[#E9E2DC] px-1.5 py-0.5 rounded"
                            >
                              {style}
                            </span>
                          ))}
                        </div>

                        {/* Actions drawer (slides up on hover) */}
                        <div className="pt-3 mt-1 border-t border-[#E9E2DC] flex justify-between items-center text-[10px] font-bold text-[#5A3342] hover:text-[#6A3B4B]">
                          <span>Preview Design</span>
                          <ChevronRight size={10} className="text-[#C89B5B]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-7xl mx-auto px-6 pt-24 text-center">
          <div className="bg-[#5A3342] border border-[#E9E2DC] rounded-3xl p-12 sm:p-16 relative overflow-hidden shadow-xl shadow-[#5A3342]/10 text-center">
            {/* Glow backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#C89B5B]/10 blur-[80px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Make a premium first impression today.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
                No credit card required. Connect your accounts, lock custom
                templates, and share via NFC or redirectable link slugs.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <Link href="/signup">
                  <button className="bg-[#C89B5B] hover:bg-[#b0874c] text-white font-bold text-xs px-6 py-3 rounded-lg shadow-md transition-all">
                    Get Started Free
                  </button>
                </Link>
                <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs px-6 py-3 rounded-lg backdrop-blur-sm transition-all">
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* FULLSCREEN PREVIEW MODAL */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            key="previewModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#1F1F1F]/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6"
          >
            {/* Modal Card wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, y: 20, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl bg-[#FAF8F6] border border-[#E9E2DC] rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden"
            >
              {/* Modal Top Header */}
              <div className="bg-white border-b border-[#E9E2DC] px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3 text-left">
                  <h3 className="font-extrabold text-base text-[#1F1F1F]">
                    {selectedTemplate.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-[#5A3342]/10 text-[#5A3342] text-[9px] font-bold rounded-full uppercase">
                    {selectedTemplate.category}
                  </span>
                </div>

                {/* Viewport & Color control centers */}
                <div className="hidden sm:flex items-center space-x-6">
                  {/* Viewports */}
                  <div className="flex border border-[#E9E2DC] rounded-lg p-0.5 bg-[#FAF8F6]">
                    <button
                      onClick={() => setPreviewViewport("desktop")}
                      className={`p-1.5 rounded-md ${previewViewport === "desktop" ? "bg-white shadow-sm text-[#5A3342]" : "text-brand-secondary hover:text-[#1F1F1F]"}`}
                      title="Desktop Preview"
                    >
                      <Monitor size={14} />
                    </button>
                    <button
                      onClick={() => setPreviewViewport("tablet")}
                      className={`p-1.5 rounded-md ${previewViewport === "tablet" ? "bg-white shadow-sm text-[#5A3342]" : "text-brand-secondary hover:text-[#1F1F1F]"}`}
                      title="Tablet Preview"
                    >
                      <Tablet size={14} />
                    </button>
                    <button
                      onClick={() => setPreviewViewport("mobile")}
                      className={`p-1.5 rounded-md ${previewViewport === "mobile" ? "bg-white shadow-sm text-[#5A3342]" : "text-brand-secondary hover:text-[#1F1F1F]"}`}
                      title="Mobile Preview"
                    >
                      <Smartphone size={14} />
                    </button>
                  </div>

                  {/* Dark/Light mode previews */}
                  <div className="flex border border-[#E9E2DC] rounded-lg p-0.5 bg-[#FAF8F6]">
                    <button
                      onClick={() => setPreviewTheme("light")}
                      className={`p-1.5 rounded-md ${previewTheme === "light" ? "bg-white shadow-sm text-[#5A3342]" : "text-brand-secondary hover:text-[#1F1F1F]"}`}
                      title="Light Mode Preview"
                    >
                      <Sun size={14} />
                    </button>
                    <button
                      onClick={() => setPreviewTheme("dark")}
                      className={`p-1.5 rounded-md ${previewTheme === "dark" ? "bg-white shadow-sm text-[#5A3342]" : "text-brand-secondary hover:text-[#1F1F1F]"}`}
                      title="Dark Mode Preview"
                    >
                      <Moon size={14} />
                    </button>
                  </div>
                </div>

                {/* Close CTA */}
                <div className="flex items-center space-x-3">
                  <Link href="/signup">
                    <button className="bg-[#5A3342] hover:bg-[#6A3B4B] text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm">
                      Use Template
                    </button>
                  </Link>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="p-1.5 rounded-lg border border-[#E9E2DC] text-brand-secondary hover:text-[#1F1F1F] hover:bg-slate-100 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Modal Body: Active Viewport Device Mockup */}
              <div className="flex-1 p-6 flex justify-center items-center overflow-hidden bg-slate-100 relative">
                {/* Device shell — viewport size changes */}
                <motion.div
                  layout
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`transition-[width,height,border-radius] duration-350 border flex flex-col justify-between overflow-hidden ${
                    previewViewport === "desktop"
                      ? "w-full max-w-4xl h-[70vh] rounded-xl shadow-lg"
                      : previewViewport === "tablet"
                        ? "w-[520px] max-w-[90vw] h-[65vh] border-8 border-zinc-900 rounded-[28px] shadow-2xl"
                        : "w-[290px] h-[60vh] border-8 border-zinc-900 rounded-[32px] shadow-2xl"
                  } ${previewTheme === "dark" ? "border-zinc-800" : "border-[#E9E2DC]"}`}
                >
                  {/* Theme content — fades when switching light/dark */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={previewTheme}
                      initial={{ opacity: 0, scale: 0.97, filter: "blur(5px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.97, filter: "blur(5px)" }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className={`p-6 space-y-5 flex flex-col justify-between min-h-full h-full overflow-y-auto ${
                        previewTheme === "dark" ? "bg-zinc-950" : "bg-[#FAF8F6]"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-full bg-linear-to-tr from-[#5A3342] to-[#C89B5B] flex items-center justify-center text-white font-bold">
                            AM
                          </div>
                          <span
                            className={`text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                              previewTheme === "dark"
                                ? "bg-zinc-900 text-zinc-400 border-zinc-800"
                                : "bg-slate-100 text-slate-600 border-[#E9E2DC]"
                            }`}
                          >
                            ★ Active Blueprint
                          </span>
                        </div>

                        <div className="space-y-1 text-left">
                          <h4
                            className={`font-black text-sm ${previewTheme === "dark" ? "text-white" : "text-[#1F1F1F]"}`}
                          >
                            {selectedTemplate.name} Design
                          </h4>
                          <p className="text-[10px] text-[#5A3342] font-semibold">
                            {selectedTemplate.category} Customizer
                          </p>
                          <p
                            className={`text-[9px] ${previewTheme === "dark" ? "text-zinc-500" : "text-brand-secondary"}`}
                          >
                            {selectedTemplate.author}
                          </p>
                        </div>

                        <p
                          className={`text-[10px] leading-relaxed text-left border-t pt-3 ${
                            previewTheme === "dark"
                              ? "text-zinc-400 border-zinc-800"
                              : "text-brand-secondary border-slate-200"
                          }`}
                        >
                          {selectedTemplate.description}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-1.5 my-4">
                        <button className="w-full py-2 bg-[#5A3342] text-white text-[10px] font-bold rounded-lg hover:bg-[#6A3B4B] transition-colors">
                          Save Contact Blueprint
                        </button>
                        <button
                          className={`w-full py-2 text-[10px] font-semibold rounded-lg border transition-colors ${
                            previewTheme === "dark"
                              ? "bg-zinc-900 border-zinc-800 text-white"
                              : "bg-white border-[#E9E2DC] text-[#5A3342]"
                          }`}
                        >
                          Explore Links
                        </button>
                      </div>

                      {/* Contact list */}
                      <div className="space-y-2 text-left">
                        <h5 className="text-[8px] font-black uppercase text-[#5A3342]">
                          Social Registry Links
                        </h5>
                        <div
                          className={`p-2.5 rounded-lg space-y-1.5 border ${
                            previewTheme === "dark"
                              ? "bg-zinc-900/60 border-zinc-800"
                              : "bg-white border-[#E9E2DC]"
                          }`}
                        >
                          <div className="flex items-center space-x-2 text-[9px]">
                            <span>📬</span>
                            <span
                              className={
                                previewTheme === "dark"
                                  ? "text-zinc-300"
                                  : "text-brand-secondary"
                              }
                            >
                              inquiry@company.com
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-[9px]">
                            <span>💼</span>
                            <span
                              className={
                                previewTheme === "dark"
                                  ? "text-zinc-300"
                                  : "text-brand-secondary"
                              }
                            >
                              linkedin.com/in/alex
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
