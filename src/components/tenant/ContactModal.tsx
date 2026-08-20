"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { submitLeadAction } from "@/lib/actions/lead.actions";
import { Send, CheckCircle2 } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  propertyId?: string;
  propertyTitle?: string;
}

export function ContactModal({
  open,
  onOpenChange,
  organizationId,
  propertyId,
  propertyTitle,
}: ContactModalProps) {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: propertyTitle
      ? `Hi, I am interested in "${propertyTitle}". Please provide more details or schedule a viewing.`
      : "Hi, I am interested in your property listings. Please contact me.",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await submitLeadAction({
        organizationId,
        propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      if (res.success) {
        setSubmitted(true);
        success("Your inquiry has been sent to the agency!");
      } else {
        error(res.message || "Failed to submit inquiry");
      }
    } catch (err: any) {
      error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    if (submitted) {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {submitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Inquiry Sent!</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            The agency has received your message and will reach out to you via phone or email shortly.
          </p>
          <div className="pt-4">
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Inquire About This Property</DialogTitle>
            <DialogDescription>
              {propertyTitle ? `Listing: ${propertyTitle}` : "Send a message directly to the agency"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Your Full Name *
              </label>
              <Input
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Phone / WhatsApp
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Message *
              </label>
              <Textarea
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
          </div>


          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="gap-1.5">
              <Send className="h-4 w-4" />
              Send Inquiry
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
}
