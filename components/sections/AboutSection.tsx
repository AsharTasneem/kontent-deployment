import Image from "next/image";
import { PageSection } from "@/kontentClient";

interface AboutSectionProps {
  section: PageSection;
  locale: string;
}

interface Statistic {
  value: string;
  title: string;
  description: string;
}

export default function AboutSection({ section, locale }: AboutSectionProps) {
  const title = section.elements?.title?.value ?? "";
  const description = section.elements?.description?.value ?? "";
  const thumbnailTitle = section.elements?.thumbnail_title?.value ?? "";
  const thumbnailImage = section.elements?.thumbnail?.value?.[0]?.url ?? "";

  const statisticsLinked = section.elements?.statistics_grid?.linkedItems ?? [];
  const statistics: Statistic[] = statisticsLinked.map((item: any) => ({
    value: item.elements?.statistic_values?.value ?? "",
    title: item.elements?.statistic_title?.value ?? "",
    description: item.elements?.statistic_description?.value ?? "",
  }));

  const descriptionParagraphs = description
    .split(/\n+/)
    .filter((p: string) => p.trim());

  return (
    <section className="section-about relative py-24 px-6 lg:px-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-[var(--gold-100)]/30 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[var(--gold-50)]/40 blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="section-fade-in text-center mb-20">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-600)] mb-4">
            {locale === "ar" ? "من نحن" : "About Us"}
          </span>

          {title && (
            <h2
              className="text-3xl font-bold text-[var(--stone-900)] sm:text-4xl lg:text-5xl leading-tight max-w-4xl mx-auto break-words"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h2>
          )}

          <div className="gold-divider mt-8 mx-auto w-24" />
        </div>

        {/* Content Grid: Description + Thumbnail */}
        <div className="section-fade-in grid grid-cols-1 gap-16 lg:grid-cols-2 items-center mb-24">
          {/* Description */}
          <div>
            {descriptionParagraphs.length > 0 && (
              <div className="relative rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-[var(--stone-200)]">
                {/* Gold left accent */}
                <div className="absolute top-8 bottom-8 left-0 w-[3px] rounded-full bg-gradient-to-b from-[var(--gold-400)] to-[var(--gold-300)]" />

                {descriptionParagraphs.map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className={`text-base leading-[1.8] text-[var(--stone-600)] break-words sm:text-lg ${
                      index > 0 ? "mt-5" : ""
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {thumbnailTitle && (
              <p className="mt-8 text-sm font-medium text-[var(--gold-700)] italic px-4 border-l-2 border-[var(--gold-400)]">
                {thumbnailTitle}
              </p>
            )}
          </div>

          {/* Thumbnail Image with decorative frame */}
          {thumbnailImage && (
            <div className="image-frame">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={thumbnailImage}
                  alt={thumbnailTitle || title || "About"}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                {/* Subtle warm overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-900)]/20 to-transparent" />
              </div>
            </div>
          )}
        </div>

        {/* Statistics Grid */}
        {statistics.length > 0 && (
          <div className="section-fade-in">
            <div
              className={`grid gap-6 mx-auto max-w-5xl ${
                statistics.length === 1
                  ? "grid-cols-1 max-w-sm"
                  : statistics.length === 2
                  ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
                  : statistics.length === 3
                  ? "grid-cols-1 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-4"
              }`}
            >
              {statistics.map((stat, index) => (
                <div
                  key={index}
                  className="stat-card rounded-2xl border border-[var(--stone-200)] bg-white p-6 sm:p-8 text-center break-words"
                >
                  {/* Value */}
                  <div
                    className="gold-gradient-text text-4xl font-bold sm:text-5xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </div>

                  {/* Title */}
                  {stat.title && (
                    <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--stone-800)]">
                      {stat.title}
                    </div>
                  )}

                  {/* Description */}
                  {stat.description && (
                    <div className="mt-2 text-sm text-[var(--stone-500)] leading-relaxed">
                      {stat.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
