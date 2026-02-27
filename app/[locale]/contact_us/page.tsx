import { getPageSections } from "@/kontentClient";
import SectionRenderer from "@/components/SectionRenderer";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactUsPage({ params }: PageProps) {
  const { locale } = await params;

  const { pageData, sections } = await getPageSections("contact_us", locale);

  if (!pageData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-gray-600">No content found</p>
          <p className="mt-1 text-sm text-gray-400">Locale: {locale}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* ── Dynamic Page Sections ── */}
      <SectionRenderer sections={sections} locale={locale} />
    </div>
  );
}
