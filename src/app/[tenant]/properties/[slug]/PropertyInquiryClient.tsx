"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/tenant/ContactModal";
import { MessageSquare, Phone, Mail, Calendar } from "lucide-react";

interface PropertyInquiryClientProps {
  organizationId: string;
  propertyId: string;
  propertyTitle: string;
  organizationName: string;
  whatsapp?: string;
  phone?: string;
}

export function PropertyInquiryClient({
  organizationId,
  propertyId,
  propertyTitle,
  organizationName,
  whatsapp,
  phone,
}: PropertyInquiryClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const cleanWhatsApp = whatsapp?.replace(/[^0-9]/g, "");
  const whatsappUrl = cleanWhatsApp
    ? `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
      `আসসালামু আলাইকুম ${organizationName}, আমি "${propertyTitle}" প্রপার্টি সম্পর্কে বিস্তারিত জানতে আগ্রহী। এটি কি এখনো এভেইলেবল আছে?`
    )}`
    : null;

  return (
    <>
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-card-foreground">
          এই প্রপার্টি সম্পর্কে জানতে চান?
        </h3>
        <p className="text-xs text-muted-foreground">
          সরাসরি কথা বলুন অথবা সাইট ভিজিটের জন্য মেসেজ পাঠান।
        </p>

        <div className="space-y-2.5">
          <Button
            onClick={() => setModalOpen(true)}
            size="lg"
            className="w-full h-11 text-sm font-semibold shadow gap-2"
          >
            <Calendar className="h-4 w-4" />
            ভিজিট শিডিউল / মেসেজ পাঠান
          </Button>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp-এ সরাসরি চ্যাট
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-border/60 bg-muted/50 py-2.5 px-4 text-xs font-semibold text-card-foreground hover:bg-muted transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              সরাসরি কল: {phone}
            </a>
          )}
        </div>
      </div>

      <ContactModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        organizationId={organizationId}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
      />
    </>
  );
}

