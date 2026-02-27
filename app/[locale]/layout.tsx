import type { Metadata } from "next";
import { headers } from "next/headers";
import { getStartupData } from "@/kontentClient";
import Header from "@/components/Header";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الصفحة الرئيسية" : "Home",
    description:
      locale === "ar"
        ? "تحويل العقارات في مكة المكرمة"
        : "Transforming Real Estate in Makkah",
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Fetch header data from the startup endpoint (global across all pages)
  const { header } = await getStartupData(locale);
  const headersList = await headers();
  const host = headersList.get("host") || "";

  return (
    <div dir={dir} lang={locale}>
      <Header header={header} locale={locale} host={host} />
      {children}
    </div>
  );
}
