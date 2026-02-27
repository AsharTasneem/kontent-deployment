import { PageSection } from "@/kontentClient";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import BannerSection from "./sections/BannerSection";

// ─── Section Type Registry ───────────────────────────────────────
// Map Kontent.ai content type codenames → React components.
// To add a new section: create a component, then add its mapping here.
// ─────────────────────────────────────────────────────────────────

type SectionComponent = React.ComponentType<{ section: PageSection; locale: string }>;

const SECTION_MAP: Record<string, SectionComponent> = {
  hero_section: HeroSection,
  about_section: AboutSection,
  banner_section: BannerSection,
};

interface SectionRendererProps {
  sections: PageSection[];
  locale: string;
}

export default function SectionRenderer({ sections, locale }: SectionRendererProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => {
        const Component = SECTION_MAP[section.type];

        // Skip unregistered section types in production, show debug info in dev
        if (!Component) {
          if (process.env.NODE_ENV === "development") {
            return (
              <section
                key={`fallback-${section.codename}-${index}`}
                className="py-12 px-6 bg-amber-50 border-y-2 border-dashed border-amber-300"
              >
                <div className="mx-auto max-w-4xl text-center">
                  <p className="text-sm font-medium text-amber-800">
                    ⚠️ Unregistered section type: <code className="bg-amber-100 px-2 py-0.5 rounded">{section.type}</code>
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

        return (
          <div key={`${section.codename}-${index}`} id={section.sectionId}>
            <Component section={section} locale={locale} />
          </div>
        );
      })}
    </>
  );
}
