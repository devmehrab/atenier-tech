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
      ? `আসসালামু আলাইকুম, আমি "${propertyTitle}" প্রপার্টিটি দেখতে এবং বিস্তারিত জানতে আগ্রহী।`
      : "আসসালামু আলাইকুম, আমি আপনাদের প্রপার্টি লিস্টিং সম্পর্কে বিস্তারিত জানতে আগ্রহী।",
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
        success("আপনার বার্তা সফলভাবে এজেন্সির কাছে পাঠানো হয়েছে!");
      } else {
        error(res.message || "বার্তা পাঠানো সম্ভব হয়নি");
      }
    } catch (err: any) {
      error(err.message || "একটি অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে");
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
        <div className="py-6 text-center space-y-4 font-sans">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">মেসেজ সফলভাবে পাঠানো হয়েছে!</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto font-light">
            এজেন্সির দায়িত্বপ্রাপ্ত প্রতিনিধি খুব শীঘ্রই আপনার মোবাইল বা WhatsApp-এ যোগাযোগ করবেন।
          </p>
          <div className="pt-4">
            <Button onClick={handleClose} className="w-full font-medium">
              ঠিক আছে
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <DialogHeader>
            <DialogTitle>প্রপার্টি সংক্রান্ত তথ্য ও ইনকোয়ারি</DialogTitle>
            <DialogDescription>
              {propertyTitle ? `লিস্টিং: ${propertyTitle}` : "এজেন্সির প্রতিনিধির কাছে সরাসরি বার্তা পাঠান"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                আপনার নাম *
              </label>
              <Input
                required
                placeholder="উদাঃ মোঃ আনিসুর রহমান"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  ইমেইল এড্রেস *
                </label>
                <Input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  মোবাইল / WhatsApp নম্বর *
                </label>
                <Input
                  type="tel"
                  required
                  placeholder="+880 1700-000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                বার্তা (Message) *
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
              বাতিল
            </Button>
            <Button type="submit" isLoading={loading} className="gap-1.5 font-medium">
              <Send className="h-4 w-4" />
              মেসেজ পাঠান
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
}
