import { createDeliveryClient } from '@kontent-ai/delivery-sdk';

export const deliveryClient = createDeliveryClient({
  environmentId: '929a140e-22dc-0004-d6ee-aaa4bd6bf3a9',
  previewApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZmQ0ZGUyZTMzNTI0ZjRkYjE0OGMzOGMzNmNkMmQyYyIsImlhdCI6MTc3MTU3MDE3MywibmJmIjoxNzcxNTcwMTczLCJleHAiOjE4MDM0NTE2ODAsInZlciI6IjIuMC4wIiwic2NvcGVfaWQiOiIwMDk5OTgyMDFlYWM0NGJkODFhMjllN2FkZWRhZDkxYSIsInByb2plY3RfY29udGFpbmVyX2lkIjoiY2E4ZDVhYTU4Yzc3MDBiZTZiMzg5OWIxNmY1NzlmNWQiLCJhdWQiOiJkZWxpdmVyLmtvbnRlbnQuYWkifQ.LbUZkLyeoakSPKSHCdIWfkkltP9SWci4HLaFUI48dkg',
  defaultQueryConfig: {
    usePreviewMode: true,
  },
});

// ─── Types ───────────────────────────────────────────────────────

export interface PageData {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

export interface HeaderData {
  logoUrl: string;
  logoText: string;
  navLinks: NavLink[];
}

export interface NavLink {
  label: string;
  /** Navigation type codename from CMS: same_page_scroll | external_url | internal_page */
  linkType: 'same_page_scroll' | 'external_url' | 'internal_page';
  /** URL for external navigation */
  externalUrl: string;
  /** CMS codename of internal page (e.g. "contact_us") */
  internalPageSlug: string;
  /** CMS-assigned section ID for scroll targeting (e.g. "01", "02") */
  sectionId: string;
}

export interface PageSection {
  type: string;
  codename: string;
  name: string;
  /** Clean, human-readable id used for anchor navigation (e.g. "hero", "about") */
  sectionId: string;
  elements: Record<string, any>;
}

// ─── Data Fetching ───────────────────────────────────────────────

/**
 * Recursively extract elements from a linked item, including
 * nested linked items (e.g. statistics_grid → statistic_data items)
 */
function extractElements(rawElements: any): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, element] of Object.entries(rawElements ?? {})) {
    const el = element as any;

    // For modular_content / linked items elements, include the resolved linkedItems
    if (el?.type === 'modular_content' || el?.linkedItems) {
      result[key] = {
        ...el,
        linkedItems: (el.linkedItems ?? []).map((linked: any) => ({
          type: linked.system?.type,
          codename: linked.system?.codename,
          name: linked.system?.name,
          elements: extractElements(linked.elements),
        })),
      };
    } else {
      result[key] = el;
    }
  }

  return result;
}

// ─── Startup / Header Data ──────────────────────────────────────

/**
 * Fetch header data from the `startup` endpoint.
 * The startup item contains a header section with logo, logo text,
 * and nav links used across all pages.
 */
export async function getStartupData(locale: string): Promise<{
  header: HeaderData | null;
}> {
  try {
    const response = await deliveryClient
      .item('startup')
      .languageParameter(locale)
      .depthParameter(3)
      .toPromise();

    const item = response?.data?.item;
    if (!item) return { header: null };

    // Extract linked sections from startup (element key is "sections")
    const sectionsElement = item.elements?.sections;
    const linkedItems = (sectionsElement as any)?.linkedItems ?? [];

    const allSections: PageSection[] = linkedItems.map((linked: any) => ({
      type: linked.system.type,
      codename: linked.system.codename,
      name: linked.system.name,
      sectionId: (linked.system.type ?? '').replace(/_section$/, ''),
      elements: extractElements(linked.elements),
    }));

    // Find the header section
    const headerSection = allSections.find((s) => s.type === 'header');

    let header: HeaderData | null = null;
    if (headerSection) {
      const logoUrl = headerSection.elements?.logo?.value?.[0]?.url ?? '';
      const logoText = headerSection.elements?.logo_text?.value ?? '';

      const navLinksRaw = headerSection.elements?.navbar_links?.linkedItems ?? [];
      const navLinks: NavLink[] = navLinksRaw.map((link: any) => {
        const label = (link.elements?.label?.value ?? '').trim();
        const linkTypeRaw = link.elements?.link_type?.value?.[0]?.codename ?? 'same_page_scroll';
        const externalUrl = (link.elements?.external_url?.value ?? '').trim();
        const internalPageSlug = link.elements?.internal_page?.linkedItems?.[0]?.system?.codename ?? '';
        const sectionId = (link.elements?.section_id?.value ?? '').trim();

        return {
          label,
          linkType: linkTypeRaw as NavLink['linkType'],
          externalUrl,
          internalPageSlug,
          // Use lowercase label as scroll target — matches section type identity
          // e.g. "Hero" → "hero" which matches hero_section's sectionId
          sectionId: label.toLowerCase().replace(/\s+/g, '-'),
        };
      });

      header = { logoUrl, logoText, navLinks };
    }

    return { header };
  } catch (error) {
    console.error('Failed to fetch startup data:', error);
    return { header: null };
  }
}

// ─── Generic Page Sections ──────────────────────────────────────

/**
 * Fetch any page by its CMS codename (e.g. "home", "contact_us")
 * and return the page-level metadata + ordered body sections.
 */
export async function getPageSections(
  codename: string,
  locale: string
): Promise<{
  pageData: PageData | null;
  sections: PageSection[];
}> {
  try {
    const response = await deliveryClient
      .item(codename)
      .languageParameter(locale)
      .depthParameter(3)
      .toPromise();

    const item = response?.data?.item;
    if (!item) return { pageData: null, sections: [] };

    // Extract page-level data
    const pageData: PageData = {
      title: (item.elements?.title as any)?.value ?? '',
      description: (item.elements?.description as any)?.value ?? '',
      metaTitle: (item.elements?.meta_title as any)?.value ?? '',
      metaDescription: (item.elements?.meta_description as any)?.value ?? '',
    };

    // Extract linked page sections (ordered as set in CMS)
    const pageSections = item.elements?.page_sections;
    const linkedItems = (pageSections as any)?.linkedItems ?? [];

    const allSections: PageSection[] = linkedItems.map((linked: any, index: number) => ({
      type: linked.system.type,
      codename: linked.system.codename,
      name: linked.system.name,
      sectionId: '', // assigned below after filtering
      elements: extractElements(linked.elements),
    }));

    // Filter out header sections — header is handled globally via startup
    const bodySections = allSections.filter((s) => s.type !== 'header');

    // Assign identity-based sectionId from type: "hero_section" → "hero", "about_section" → "about"
    // This ensures scroll targeting works regardless of CMS render order
    bodySections.forEach((section) => {
      section.sectionId = (section.type ?? '').replace(/_section$/, '');
    });

    return { pageData, sections: bodySections };
  } catch (error) {
    console.error(`Failed to fetch page "${codename}":`, error);
    return { pageData: null, sections: [] };
  }
}