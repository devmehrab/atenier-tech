import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { IProperty, IOrganization, IUser } from "@/lib/types";
import { generateBrochureHtml } from "./generateBrochureHtml";

interface GenerateBrochurePdfOptions {
  property: IProperty;
  organization?: Partial<IOrganization> | null;
  agent?: Partial<IUser> | null;
  publicUrl?: string;
  sourceElement?: HTMLElement | null;
}

/**
 * Generates and triggers download of a high-resolution A4 PDF brochure
 * using jsPDF and html2canvas without relying on browser print dialogs.
 * Fully compatible across mobile (iOS/Android) and desktop.
 */
export async function downloadBrochurePdf({
  property,
  organization,
  agent,
  publicUrl,
  sourceElement,
}: GenerateBrochurePdfOptions): Promise<void> {
  let targetElement: HTMLElement;
  let cleanupContainer: HTMLElement | null = null;

  if (sourceElement) {
    targetElement = sourceElement;
  } else {
    // Generate clean offscreen DOM element
    const html = generateBrochureHtml({
      property,
      organization,
      agent,
      publicUrl,
    });

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-99999px";
    wrapper.style.top = "0";
    wrapper.style.width = "794px"; // Standard A4 width at 96 DPI
    wrapper.style.backgroundColor = "#ffffff";
    wrapper.style.zIndex = "-9999";
    wrapper.innerHTML = html;

    document.body.appendChild(wrapper);
    cleanupContainer = wrapper;
    targetElement = (wrapper.querySelector(".brochure-container") as HTMLElement) || wrapper;
  }

  try {
    // Pre-load all images to avoid canvas blank spots
    const images = Array.from(targetElement.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalHeight !== 0) {
              resolve();
            } else {
              img.crossOrigin = "anonymous";
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          })
      )
    );

    // Give web fonts and styles a brief render tick
    await new Promise((r) => setTimeout(r, 150));

    // Capture at high resolution (scale: 2 = ~200-300 DPI retina clarity)
    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    // Create jsPDF A4 portrait document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = 210; // A4 standard width in mm
    const pdfHeight = 297; // A4 standard height in mm
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight <= pdfHeight) {
      // Fits on a single A4 page
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight, undefined, "FAST");
    } else {
      // Multi-page pagination
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
        heightLeft -= pdfHeight;
      }
    }

    const cleanTitle = (property.title || "property")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40);
    const filename = `${cleanTitle}-brochure.pdf`;

    pdf.save(filename);
  } catch (error) {
    console.error("Failed to generate PDF brochure:", error);
    throw error;
  } finally {
    if (cleanupContainer && document.body.contains(cleanupContainer)) {
      document.body.removeChild(cleanupContainer);
    }
  }
}
