import Image from "next/image";
import { PageSection } from "@/kontentClient";

interface BannerSectionProps {
  section: PageSection;
  locale: string;
}

export default function BannerSection({ section, locale }: BannerSectionProps) {
  const title =
    section.elements?.title?.value ??
    section.elements?.untitled_text?.value ??
    "";
  const subtitle =
    section.elements?.subtitle?.value ??
    section.elements?.description?.value ??
    "";
  const bgImage =
    section.elements?.background_image?.value?.[0]?.url ??
    section.elements?.hero_image?.value?.[0]?.url ??
    "";

  return (
    <section
      className="section-banner relative py-28 px-6 lg:px-20 overflow-hidden"
      id={`section-${section.codename}`}
    >
      {/* Background */}
      {bgImage ? (
        <>
          <Image
            src={bgImage}
            alt={title || "Banner"}
            fill
            className="object-cover object-center"
            quality={85}
          />
          {/* Dark navy overlay with warm gold edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1220]/90 via-[#0c1220]/75 to-[#0c1220]/85" />
          <div className="absolute inset-0 bg-[var(--gold-900)]/10 mix-blend-overlay" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1220] to-[#162032]" />
      )}

      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold-400)]/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {title && (
          <h2
            className="section-fade-in text-3xl font-bold text-white sm:text-4xl lg:text-5xl leading-tight tracking-tight break-words"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="section-fade-in mt-6 text-base text-white/70 sm:text-lg leading-relaxed tracking-wide max-w-3xl mx-auto break-words">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold-400)]/50 to-transparent" />
    </section>
  );
}
