import Image from "next/image";
import { PageSection } from "@/kontentClient";

interface HeroSectionProps {
  section: PageSection;
  locale: string;
}

export default function HeroSection({ section, locale }: HeroSectionProps) {
  const title = section.elements?.untitled_text?.value ?? "";
  const description = section.elements?.herodescription?.value ?? "";
  const heroImage = section.elements?.hero_image?.value?.[0]?.url ?? "";

  return (
    <section className="hero-section relative w-full overflow-hidden flex items-end grain-overlay">
      {/* Background Image */}
      {heroImage && (
        <Image
          src={heroImage}
          alt={title || "Hero background"}
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
      )}

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
      {/* Warm gold tint */}
      <div className="absolute inset-0 bg-[var(--gold-900)]/10 mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-28 pt-44 lg:px-20 lg:pb-36">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            {/* Golden accent line */}
            <div className="hero-animate-1 mb-8 h-[3px] w-14 rounded-full bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-300)]" />

            {/* Title */}
            <h1
              className="hero-animate-2 text-4xl font-bold leading-[1.15] text-white break-words sm:text-5xl md:text-6xl lg:text-[4.25rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="hero-animate-3 mt-8 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg lg:text-xl">
                {description}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="hero-animate-4 mt-12 flex flex-wrap items-center gap-4">
              {/* Primary CTA — Gold */}
              <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-400)] px-9 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-[var(--gold-500)]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--gold-500)]/30 hover:-translate-y-0.5">
                <span className="relative z-10">
                  {locale === "ar" ? "اكتشف المزيد" : "Explore More"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-500)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>

              {/* Secondary CTA — Glass */}
              <button className="group flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-[var(--gold-400)]/40 hover:bg-white/5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-[var(--gold-400)]/20">
                  <svg
                    className="h-4 w-4 translate-x-0.5 text-white/80 transition-colors group-hover:text-[var(--gold-300)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </span>
                {locale === "ar" ? "شاهد الفيديو" : "Watch Video"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
            {locale === "ar" ? "اسحب لأسفل" : "Scroll"}
          </span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>

      {/* Bottom fade to page */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent z-[2]" />
    </section>
  );
}
