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
        `Hello ${organizationName}, I am inquiring about "${propertyTitle}". Is it still available?`
      )}`
    : null;

  return (
    <>
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-card-foreground">
          Interested in this property?
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Request a private tour or direct consultation with the listing agent.
        </p>

        <div className="space-y-2.5">
          <Button
            onClick={() => setModalOpen(true)}
            size="lg"
            className="w-full h-11 text-sm font-bold shadow gap-2"
          >
            <Calendar className="h-4 w-4" />
            Book a Viewing / Inquire
          </Button>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-border/60 bg-muted/50 py-2.5 px-4 text-xs font-semibold text-card-foreground hover:bg-muted transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              Direct Call: {phone}
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

