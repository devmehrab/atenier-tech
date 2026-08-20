"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IOrganization } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { updateOrganizationAction } from "@/lib/actions/organization.actions";
import { Settings, Save, ShieldCheck, DollarSign } from "lucide-react";

interface SettingsClientFormProps {
  initialData: IOrganization;
}

export function SettingsClientForm({ initialData }: SettingsClientFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    defaultCurrency: initialData.settings?.defaultCurrency || "USD",
    unitSystem: initialData.settings?.unitSystem || "SQFT",
    allowAgentListings: initialData.settings?.allowAgentListings ?? true,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateOrganizationAction({
        name: initialData.name,
        slug: initialData.slug,
        city: initialData.city || "New York",
        country: initialData.country || "US",
        settings: {
          defaultCurrency: settings.defaultCurrency,
          unitSystem: settings.unitSystem as "SQFT" | "SQM",
          allowAgentListings: settings.allowAgentListings,
        },
      });

      if (res.success) {
        success("Settings updated successfully!");
        router.refresh();
      } else {
        error(res.message || "Failed to update settings");
      }
    } catch (err: any) {
      error(err.message || "Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
            <Settings className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-card-foreground">Regional & Measurement Preferences</h3>
            <p className="text-xs text-muted-foreground">Defaults used when creating properties</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Default Portfolio Currency
            </label>
            <Select
              value={settings.defaultCurrency}
              onChange={(e) =>
                setSettings({ ...settings, defaultCurrency: e.target.value })
              }
            >
              <option value="USD">USD ($) - United States Dollar</option>
              <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="CAD">CAD ($) - Canadian Dollar</option>
              <option value="AUD">AUD ($) - Australian Dollar</option>
              <option value="AED">AED - UAE Dirham</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-card-foreground mb-1">
              Default Floor Measurement Unit
            </label>
            <Select
              value={settings.unitSystem}
              onChange={(e) =>
                setSettings({ ...settings, unitSystem: e.target.value as "SQFT" | "SQM" })
              }
            >
              <option value="SQFT">Square Feet (sq ft)</option>
              <option value="SQM">Square Meters (m²)</option>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-card-foreground">
                Allow Staff Agents to Publish Listings Directly
              </h4>
              <p className="text-xs text-muted-foreground">
                When enabled, invited agents can publish listings to the live website without owner review.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowAgentListings}
              onChange={(e) =>
                setSettings({ ...settings, allowAgentListings: e.target.checked })
              }
              className="h-5 w-5 rounded border-input text-primary accent-primary focus:ring-ring cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={loading} size="lg" className="gap-2 font-bold shadow-md">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </form>
  );
}

