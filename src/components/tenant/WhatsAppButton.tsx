import { MessageSquare } from "lucide-react";

interface WhatsAppButtonProps {
  phone?: string;
  agencyName?: string;
  propertyTitle?: string;
  floating?: boolean;
}

export function WhatsAppButton({
  phone,
  agencyName = "Agency",
  propertyTitle,
  floating = false,
}: WhatsAppButtonProps) {
  if (!phone) return null;

  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const defaultText = propertyTitle
    ? `আসসালামু আলাইকুম ${agencyName}, আমি "${propertyTitle}" প্রপার্টি সম্পর্কে বিস্তারিত জানতে আগ্রহী।`
    : `আসসালামু আলাইকুম ${agencyName}, আমি আপনাদের প্রপার্টি লিস্টিং সম্পর্কে বিস্তারিত জানতে আগ্রহী।`;

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`;

  if (floating) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-3.5 md:px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-2xl transition-all hover:bg-primary/90 hover:scale-105 font-sans"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="hidden sm:inline">WhatsApp চ্যাট</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all w-full sm:w-auto font-sans"
    >
      <MessageSquare className="h-4 w-4" />
      WhatsApp-এ চ্যাট করুন
    </a>
  );
}

