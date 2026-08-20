"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orgUpdateSchema, OrgUpdateInput } from "@/lib/validations/organization";
import { updateOrganizationAction } from "@/lib/actions/organization.actions";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IOrganization, ICloudinaryImage } from "@/lib/types";
import { slugify } from "@/lib/utils/slugify";
import {
  Building,
  UploadCloud,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Palette,
  Save,
  CheckCircle,
} from "lucide-react";

interface ProfileClientFormProps {
  initialData: IOrganization;
}

export function ProfileClientForm({ initialData }: ProfileClientFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrgUpdateInput>({
    resolver: zodResolver(orgUpdateSchema),
    defaultValues: {
      name: initialData.name,
      slug: initialData.slug,
      description: initialData.description || "",
      phone: initialData.phone || "",
      email: initialData.email || "",
      whatsapp: initialData.whatsapp || "",
      address: initialData.address || "",
      city: initialData.city || "",
      country: initialData.country || "US",
      logo: initialData.logo || null,
      coverImage: initialData.coverImage || null,
      socialLinks: {
        website: initialData.socialLinks?.website || "",
        facebook: initialData.socialLinks?.facebook || "",
        instagram: initialData.socialLinks?.instagram || "",
        linkedin: initialData.socialLinks?.linkedin || "",
        twitter: initialData.socialLinks?.twitter || "",
      },
      branding: {
        primaryColor: initialData.branding?.primaryColor || "#15803d",
        accentColor: initialData.branding?.accentColor || "#c5a059",
        tagline: initialData.branding?.tagline || "",
      },
    },
  });

  const watchLogo = watch("logo");
  const watchCover = watch("coverImage");
  const watchSlug = watch("slug");

  const handleFileUpload = async (
    file: File,
    type: "logo" | "cover"
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    if (type === "logo") setUploadingLogo(true);
    else setUploadingCover(true);

    try {
      const res = await fetch("/api/upload/direct", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.image) {
        if (type === "logo") {
          setValue("logo", data.image);
        } else {
          setValue("coverImage", data.image);
        }
        success(`${type === "logo" ? "Logo" : "Cover"} uploaded successfully`);
      } else {
        error(data.error || "Failed to upload image");
      }
    } catch (err: any) {
      error(err.message || "Upload error");
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingCover(false);
    }
  };

  const onSubmit = async (data: OrgUpdateInput) => {
    setSubmitting(true);
    try {
      const res = await updateOrganizationAction(data);
      if (res.success) {
        success(res.message || "Agency profile updated!");
        router.refresh();
      } else {
        error(res.message || "Failed to update profile");
      }
    } catch (err: any) {
      error(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. Identity & Handle */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <Building className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Agency Identity & Slug</h3>
            <p className="text-xs text-muted-foreground">Public name, URL handle, and agency description</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Agency Name *
            </label>
            <Input error={errors.name?.message} {...register("name")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Public URL Slug *
            </label>
            <Input
              error={errors.slug?.message}
              {...register("slug", {
                onChange: (e) => setValue("slug", slugify(e.target.value)),
              })}
            />
            <span className="text-[11px] font-mono text-primary mt-1 block">
              Live link: /{watchSlug || "agency-handle"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-card-foreground mb-1">
            Agency Tagline / Slogan
          </label>
          <Input
            placeholder="e.g. Elevating Premier Urban Living Since 2012"
            {...register("branding.tagline")}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-card-foreground mb-1">
            Agency Bio & Description
          </label>
          <Textarea
            rows={4}
            placeholder="Tell clients about your brokerage background, market specialization, and values..."
            {...register("description")}
          />
        </div>
      </div>

      {/* 2. Visual Media: Logo & Cover Image */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <Palette className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Brand Imagery & Colors</h3>
            <p className="text-xs text-muted-foreground">Logo, hero background, and custom branding theme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-card-foreground">
              Agency Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-muted border border-border/60 flex items-center justify-center">
                {watchLogo?.secureUrl ? (
                  <Image
                    src={watchLogo.secureUrl}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Building className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div>
                <input
                  type="file"
                  ref={logoInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f, "logo");
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={uploadingLogo}
                  onClick={() => logoInputRef.current?.click()}
                >
                  Upload Logo
                </Button>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Square format, PNG or JPG (min 200x200)
                </p>
              </div>
            </div>
          </div>

          {/* Cover Hero Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-card-foreground">
              Hero Cover Background
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-36 rounded-2xl overflow-hidden bg-muted border border-border/60 flex items-center justify-center">
                {watchCover?.secureUrl ? (
                  <Image
                    src={watchCover.secureUrl}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div>
                <input
                  type="file"
                  ref={coverInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f, "cover");
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={uploadingCover}
                  onClick={() => coverInputRef.current?.click()}
                >
                  Upload Cover
                </Button>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Landscape real estate photo (16:9)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Primary Brand Color (Hex)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-10 w-12 rounded border border-input cursor-pointer bg-transparent"
                {...register("branding.primaryColor")}
              />
              <Input {...register("branding.primaryColor")} className="font-mono text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Accent Color (Hex)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-10 w-12 rounded border border-input cursor-pointer bg-transparent"
                {...register("branding.accentColor")}
              />
              <Input {...register("branding.accentColor")} className="font-mono text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Contact & Social Channels */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Direct Contact & Social Media</h3>
            <p className="text-xs text-muted-foreground">Phone, WhatsApp CTA, and social channels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Office Phone
            </label>
            <Input placeholder="+1 (555) 123-4567" {...register("phone")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              WhatsApp Number (with country code)
            </label>
            <Input placeholder="+15551234567" {...register("whatsapp")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Official Email
            </label>
            <Input type="email" placeholder="contact@agency.com" {...register("email")} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Street Address
            </label>
            <Input placeholder="Suite 400, 100 Main Street" {...register("address")} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              City *
            </label>
            <Input placeholder="New York" {...register("city")} />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-3 pt-4 border-t border-border/50">
          <label className="block text-xs font-bold text-card-foreground">
            Social Channels & Website
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Website URL: https://..." {...register("socialLinks.website")} />
            <Input placeholder="Facebook URL: https://facebook.com/..." {...register("socialLinks.facebook")} />
            <Input placeholder="Instagram URL: https://instagram.com/..." {...register("socialLinks.instagram")} />
            <Input placeholder="LinkedIn URL: https://linkedin.com/..." {...register("socialLinks.linkedin")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={submitting} size="lg" className="gap-2 font-bold shadow-md">
          <Save className="h-4 w-4" />
          Save Agency Branding
        </Button>
      </div>
    </form>
  );
}

