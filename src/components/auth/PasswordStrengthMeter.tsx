"use client";

import React from "react";
import { Check, X, ShieldAlert, ShieldCheck } from "lucide-react";

interface PasswordStrengthMeterProps {
  password?: string;
  confirmPassword?: string;
  showMatchIndicator?: boolean;
}

export interface PasswordRule {
  id: string;
  label: string;
  valid: boolean;
}

export function checkPasswordStrength(password: string) {
  const rules: PasswordRule[] = [
    {
      id: "length",
      label: "কমপক্ষে ৮টি অক্ষর (Min 8 characters)",
      valid: password.length >= 8,
    },
    {
      id: "upper",
      label: "একটি বড় হাতের অক্ষর (One uppercase letter A-Z)",
      valid: /[A-Z]/.test(password),
    },
    {
      id: "lower",
      label: "একটি ছোট হাতের অক্ষর (One lowercase letter a-z)",
      valid: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "একটি সংখ্যা (One number 0-9)",
      valid: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "একটি বিশেষ চিহ্ন (One symbol @, #, $, %, etc.)",
      valid: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\]/.test(password),
    },
  ];

  const validCount = rules.filter((r) => r.valid).length;

  let score = 0;
  let label = "দুর্বল (Weak)";
  let color = "bg-destructive";
  let textColor = "text-destructive";

  if (validCount === 0) {
    score = 0;
    label = "";
  } else if (validCount <= 2) {
    score = 1;
    label = "দুর্বল (Weak)";
    color = "bg-red-500";
    textColor = "text-red-500";
  } else if (validCount === 3) {
    score = 2;
    label = "মোটামুটি (Fair)";
    color = "bg-amber-500";
    textColor = "text-amber-500";
  } else if (validCount === 4) {
    score = 3;
    label = "ভালো (Good)";
    color = "bg-emerald-500";
    textColor = "text-emerald-500";
  } else if (validCount === 5) {
    score = 4;
    label = "খুব শক্তিশালী (Strong)";
    color = "bg-green-500";
    textColor = "text-green-500";
  }

  const isStrong = validCount === 5;

  return { rules, score, label, color, textColor, isStrong, validCount };
}

export function PasswordStrengthMeter({
  password = "",
  confirmPassword,
  showMatchIndicator = true,
}: PasswordStrengthMeterProps) {
  if (!password) {
    return null;
  }

  const { rules, score, label, color, textColor, isStrong } =
    checkPasswordStrength(password);

  const passwordsMatch =
    confirmPassword !== undefined &&
    confirmPassword.length > 0 &&
    password === confirmPassword;
  const passwordsMismatch =
    confirmPassword !== undefined &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  return (
    <div className="mt-2.5 p-3 rounded-xl bg-card/70 border border-border/60 text-xs space-y-2.5 transition-all">
      {/* Strength Bar & Label */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
            {isStrong ? (
              <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
            )}
            পাসওয়ার্ড সিকিউরিটি মাত্রা:
          </span>
          <span className={`text-[11px] font-bold ${textColor}`}>
            {label}
          </span>
        </div>

        {/* 4 segments indicator */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-300 ${
                score >= step ? color : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Rules Checklist */}
      <div className="space-y-1 pt-1">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`flex items-center gap-1.5 text-[11px] transition-colors ${
              rule.valid
                ? "text-emerald-500 font-medium"
                : "text-muted-foreground"
            }`}
          >
            {rule.valid ? (
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            )}
            <span>{rule.label}</span>
          </div>
        ))}
      </div>

      {/* Confirm Password Matching Status */}
      {showMatchIndicator && confirmPassword !== undefined && confirmPassword.length > 0 && (
        <div className="pt-2 border-t border-border/40">
          {passwordsMatch ? (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
              <Check className="h-3.5 w-3.5" />
              <span>উভয় পাসওয়ার্ড মিলেছে (Passwords match)</span>
            </div>
          ) : passwordsMismatch ? (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-destructive">
              <X className="h-3.5 w-3.5" />
              <span>পাসওয়ার্ড দুটি মিলছে না (Passwords do not match)</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
