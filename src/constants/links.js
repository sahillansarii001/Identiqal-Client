import {
  ChevronLeft, ChevronRight, Upload, Trash2, Plus, Check, Sparkles,
  Share2, ExternalLink, Eye, User, Image as ImgIcon, Sun, Layers, Move,
  Globe, Camera, Briefcase, Code, Video, MessageCircle, Mail, Phone,
  Link2, GripVertical, RefreshCw, Contrast, Droplets, ZoomIn, Minus,
  Smartphone, Search, Cake, MapPin, FileText, StickyNote, Music,
  Play, Radio, Coffee, ShoppingBag, Download, DollarSign, Headphones,
  HelpCircle, Calendar, Users, Tv, Mic, MessageSquare
} from 'lucide-react';

export const LINK_PLATFORMS = [
  // Personal
  { id: 'phone', label: 'Phone', prefix: 'tel:', icon: Phone, allowDuplicates: false },
  { id: 'email', label: 'Email', prefix: 'mailto:', icon: Mail, allowDuplicates: false },
  { id: 'whatsapp', label: 'WhatsApp', prefix: 'https://wa.me/', icon: MessageCircle, allowDuplicates: false },
  { id: 'sms', label: 'SMS', prefix: 'sms:', icon: MessageSquare, allowDuplicates: false },
  { id: 'personal_website', label: 'Personal Website', prefix: 'https://', icon: Globe, allowDuplicates: false },
  { id: 'instagram', label: 'Instagram', prefix: 'https://instagram.com/', icon: Camera, allowDuplicates: false },
  { id: 'facebook', label: 'Facebook', prefix: 'https://facebook.com/', icon: Users, allowDuplicates: false },
  { id: 'snapchat', label: 'Snapchat', prefix: 'https://snapchat.com/add/', icon: Camera, allowDuplicates: false },
  { id: 'x_twitter', label: 'X (Twitter)', prefix: 'https://x.com/', icon: Globe, allowDuplicates: false },
  { id: 'telegram', label: 'Telegram', prefix: 'https://t.me/', icon: MessageCircle, allowDuplicates: false },
  { id: 'discord', label: 'Discord', prefix: 'https://discord.gg/', icon: MessageSquare, allowDuplicates: false },
  { id: 'spotify', label: 'Spotify', prefix: 'https://open.spotify.com/', icon: Music, allowDuplicates: false },
  { id: 'netflix', label: 'Netflix Profile', prefix: 'https://netflix.com/', icon: Tv, allowDuplicates: false },
  { id: 'pinterest', label: 'Pinterest', prefix: 'https://pinterest.com/', icon: Camera, allowDuplicates: false },
  { id: 'location', label: 'Location', prefix: 'https://maps.google.com/', icon: MapPin, allowDuplicates: false },
  { id: 'birthday', label: 'Birthday', prefix: '', icon: Cake, allowDuplicates: false },
  { id: 'notes', label: 'Notes', prefix: '', icon: StickyNote, allowDuplicates: false },
  { id: 'custom', label: 'Custom Link', prefix: 'https://', icon: Link2, allowDuplicates: true },

  // Creator
  { id: 'youtube', label: 'YouTube', prefix: 'https://youtube.com/@', icon: Video, allowDuplicates: false },
  { id: 'tiktok', label: 'TikTok', prefix: 'https://tiktok.com/@', icon: Video, allowDuplicates: false },
  { id: 'twitch', label: 'Twitch', prefix: 'https://twitch.tv/', icon: Tv, allowDuplicates: false },
  { id: 'facebook_page', label: 'Facebook Page', prefix: 'https://facebook.com/', icon: Users, allowDuplicates: false },
  { id: 'threads', label: 'Threads', prefix: 'https://threads.net/', icon: MessageSquare, allowDuplicates: false },
  { id: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/', icon: Briefcase, allowDuplicates: false },
  { id: 'behance', label: 'Behance', prefix: 'https://behance.net/', icon: ImgIcon, allowDuplicates: false },
  { id: 'dribbble', label: 'Dribbble', prefix: 'https://dribbble.com/', icon: ImgIcon, allowDuplicates: false },
  { id: 'soundcloud', label: 'SoundCloud', prefix: 'https://soundcloud.com/', icon: Music, allowDuplicates: false },
  { id: 'apple_music', label: 'Apple Music', prefix: 'https://music.apple.com/', icon: Music, allowDuplicates: false },
  { id: 'podcast', label: 'Podcast', prefix: 'https://', icon: Mic, allowDuplicates: false },
  { id: 'newsletter', label: 'Newsletter', prefix: 'https://', icon: Mail, allowDuplicates: false },
  { id: 'blog', label: 'Blog', prefix: 'https://', icon: FileText, allowDuplicates: false },
  { id: 'portfolio', label: 'Portfolio', prefix: 'https://', icon: Briefcase, allowDuplicates: false },
  { id: 'buy_me_coffee', label: 'Buy Me a Coffee', prefix: 'https://buymeacoffee.com/', icon: Coffee, allowDuplicates: false },
  { id: 'patreon', label: 'Patreon', prefix: 'https://patreon.com/', icon: DollarSign, allowDuplicates: false },
  { id: 'kofi', label: 'Ko-fi', prefix: 'https://ko-fi.com/', icon: Coffee, allowDuplicates: false },
  { id: 'gumroad', label: 'Gumroad', prefix: 'https://gumroad.com/', icon: ShoppingBag, allowDuplicates: false },
  { id: 'amazon_store', label: 'Amazon Storefront', prefix: 'https://amazon.com/shop/', icon: ShoppingBag, allowDuplicates: false },
  { id: 'merch_store', label: 'Merchandise Store', prefix: 'https://', icon: ShoppingBag, allowDuplicates: false },
  { id: 'discord_community', label: 'Discord Community', prefix: 'https://discord.gg/', icon: Users, allowDuplicates: false },
  { id: 'telegram_channel', label: 'Telegram Channel', prefix: 'https://t.me/', icon: MessageCircle, allowDuplicates: false },
  { id: 'whatsapp_channel', label: 'WhatsApp Channel', prefix: 'https://whatsapp.com/channel/', icon: MessageCircle, allowDuplicates: false },

  // Business
  { id: 'website', label: 'Website', prefix: 'https://', icon: Globe, allowDuplicates: false },
  { id: 'company_profile', label: 'Company Profile', prefix: 'https://', icon: Briefcase, allowDuplicates: false },
  { id: 'product_catalog', label: 'Product Catalogue', prefix: 'https://', icon: ShoppingBag, allowDuplicates: false },
  { id: 'services', label: 'Services', prefix: 'https://', icon: Layers, allowDuplicates: false },
  { id: 'contact_us', label: 'Contact Us', prefix: 'mailto:', icon: Mail, allowDuplicates: false },
  { id: 'whatsapp_business', label: 'WhatsApp Business', prefix: 'https://wa.me/', icon: MessageCircle, allowDuplicates: false },
  { id: 'book_appointment', label: 'Book Appointment', prefix: 'https://', icon: Calendar, allowDuplicates: false },
  { id: 'request_quote', label: 'Request Quote', prefix: 'https://', icon: FileText, allowDuplicates: false },
  { id: 'calendar_booking', label: 'Calendar Booking', prefix: 'https://', icon: Calendar, allowDuplicates: false },
  { id: 'linkedin_company', label: 'LinkedIn Company', prefix: 'https://linkedin.com/company/', icon: Briefcase, allowDuplicates: false },
  { id: 'pdf_brochure', label: 'PDF Brochure', prefix: 'https://', icon: FileText, allowDuplicates: false },
  { id: 'pricing', label: 'Pricing', prefix: 'https://', icon: DollarSign, allowDuplicates: false },
  { id: 'customer_support', label: 'Customer Support', prefix: 'https://', icon: Headphones, allowDuplicates: false },
  { id: 'faq', label: 'FAQ', prefix: 'https://', icon: HelpCircle, allowDuplicates: false },
  { id: 'live_chat', label: 'Live Chat', prefix: 'https://', icon: MessageCircle, allowDuplicates: false },
  { id: 'download_app', label: 'Download App', prefix: 'https://', icon: Download, allowDuplicates: false },
];

export const CATEGORIES = {
  personal: {
    links: ['phone', 'email', 'whatsapp', 'sms', 'personal_website', 'instagram', 'facebook', 'snapchat', 'x_twitter', 'telegram', 'discord', 'spotify', 'netflix', 'pinterest', 'location', 'birthday', 'notes', 'custom'],
    popular: ['phone', 'email', 'instagram']
  },
  creator: {
    links: ['youtube', 'instagram', 'tiktok', 'twitch', 'facebook_page', 'x_twitter', 'threads', 'linkedin', 'behance', 'dribbble', 'pinterest', 'spotify', 'soundcloud', 'apple_music', 'podcast', 'newsletter', 'blog', 'portfolio', 'buy_me_coffee', 'patreon', 'kofi', 'gumroad', 'amazon_store', 'merch_store', 'discord_community', 'telegram_channel', 'whatsapp_channel', 'custom'],
    popular: ['youtube', 'instagram', 'tiktok']
  },
  business: {
    links: ['website', 'company_profile', 'product_catalog', 'services', 'contact_us', 'phone', 'whatsapp_business', 'email', 'location', 'book_appointment', 'request_quote', 'calendar_booking', 'linkedin_company', 'facebook', 'instagram', 'youtube', 'pdf_brochure', 'pricing', 'customer_support', 'faq', 'live_chat', 'download_app', 'custom'],
    popular: ['website', 'whatsapp_business', 'book_appointment']
  }
};
