import React from "react";
import { PageSection } from "@/kontentClient";
import HeroSection from "../sections/HeroSection";
import AboutSection from "../sections/AboutSection";
import BannerSection from "../sections/BannerSection";

// ─── Section Component Type ─────────────────────────────────────
// Each section component receives the section data and locale.
// ─────────────────────────────────────────────────────────────────

type SectionComponent = React.ComponentType<{
  section: PageSection;
  locale: string;
}>;

// ─── Section Registry ───────────────────────────────────────────
// Map Kontent.ai content-type codenames → React components.
// To add a new section:
//   1. Create the component in ../sections/
//   2. Import it above
//   3. Add its type codename here
// ─────────────────────────────────────────────────────────────────

const SECTION_REGISTRY: Record<string, SectionComponent> = {
  hero_section: HeroSection,
  about_section: AboutSection,
  banner_section: BannerSection,
};

// ─── Props ──────────────────────────────────────────────────────

interface ComponentGenerationProps {
  /** Ordered array of page sections from the CMS API */
  data?: PageSection[];
  /** Current locale (e.g. "en" or "ar") */
  locale?: string;
  /** Optional breadcrumb data for banner-type sections */
  breadcrumb?: any[];
}

// ─── Component ──────────────────────────────────────────────────

/**
 * ComponentGeneration
 *
 * Dynamically renders CMS page sections in the order returned
 * by the API. Each section's `type` is looked up in the
 * SECTION_REGISTRY to find the matching React component.
 *
 * Sections whose type is not registered are silently skipped
 * in production and shown as debug placeholders in development.
 */
export default function ComponentGeneration({
  data,
  locale = "en",
  breadcrumb,
}: ComponentGenerationProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <>
      {data.map((section, index) => {
        const sectionType = section.type;

        if (!sectionType) return null;

        const Component = SECTION_REGISTRY[sectionType];

        // ── Unregistered section fallback ──
        if (!Component) {
          if (process.env.NODE_ENV === "development") {
            return (
              <section
                key={`unregistered-${section.codename}-${index}`}
                className="py-12 px-6 bg-amber-50 border-y-2 border-dashed border-amber-300"
              >
                <div className="mx-auto max-w-4xl text-center">
                  <p className="text-sm font-medium text-amber-800">
                    ⚠️ Unregistered section type:{" "}
                    <code className="bg-amber-100 px-2 py-0.5 rounded">
                      {sectionType}
                    </code>
                  </p>
                  <p className="mt-1 text-xs text-amber-600">
                    Codename: {section.codename} · Name: {section.name}
                  </p>
                </div>
              </section>
            );
          }
          return null;
        }

        // ── Stable key: prefer CMS id, fall back to codename + index ──
        const key = section.codename || `${sectionType}-${index}`;

        return (
          <div key={key} id={section.sectionId}>
            <Component section={section} locale={locale} />
          </div>
        );
      })}
    </>
  );
}
