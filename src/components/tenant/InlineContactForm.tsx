"use client";

import { ContactModal } from "@/components/tenant/ContactModal";

export function InlineContactForm({ organizationId }: { organizationId: string }) {
    return (
        <ContactModal
            open={true}
            onOpenChange={() => { }}
            organizationId={organizationId}
        />
    );
}