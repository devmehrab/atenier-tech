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
    ? `Hello ${agencyName}, I'm interested in "${propertyTitle}". Is it still available?`
    : `Hello ${agencyName}, I would like to inquire about your property listings.`;

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`;

  if (floating) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-2xl transition-all hover:bg-primary/90 hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="hidden sm:inline">WhatsApp Inquiry</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all w-full sm:w-auto"
    >
      <MessageSquare className="h-4 w-4" />
      Chat on WhatsApp
    </a>
  );
}

