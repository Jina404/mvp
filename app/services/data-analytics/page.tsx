import type { Metadata } from "next";

const SITE_URL = "https://skilllinknexus.com";

export const metadata: Metadata = {
  title: "Data & Analytics Services",
  description:
    "Business intelligence dashboards, reporting, and data analytics by vetted specialists. SkillLink Nexus manages analytics projects with milestone tracking and escrow payments.",
  keywords: ["data analytics", "business intelligence", "reporting dashboards", "data visualization", "BI", "SkillLink Nexus"],
  alternates: { canonical: `${SITE_URL}/services/data-analytics` },
  openGraph: {
    title: "Data & Analytics Services | SkillLink Nexus",
    description: "BI dashboards, reporting, and data analytics by vetted specialists.",
    url: `${SITE_URL}/services/data-analytics`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SkillLink Nexus Data Analytics" }],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Data & Analytics",
  description: "Business intelligence dashboards, automated reporting, and actionable analytics by vetted data specialists.",
  provider: { "@type": "Organization", name: "SkillLink Nexus Ltd", url: SITE_URL },
  serviceType: "Data Analytics",
  areaServed: "Worldwide",
  url: `${SITE_URL}/services/data-analytics`,
};

export default function DataAnalyticsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <div className="min-h-screen bg-white dark:bg-[#181A20]">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">Data & Analytics Services</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Turn raw data into actionable insights with custom BI dashboards, automated reporting, and analytics solutions — delivered by vetted data specialists.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">What We Deliver</h2>
          <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Business intelligence dashboards (Power BI, Tableau, Metabase)</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Automated reporting pipelines</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Data warehouse design and ETL</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> KPI tracking and executive summaries</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Custom analytics integrations</li>
          </ul>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">Explore More Services</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/services/web-development" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Web Development</a>
            <a href="/services/mobile-apps" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Mobile Apps</a>
            <a href="/services/ui-ux-design" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">UI/UX Design</a>
            <a href="/services/branding" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Branding</a>
            <a href="/services/digital-marketing" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Digital Marketing</a>
          </div>

          <div className="mt-12">
            <a href="/request" className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-800">
              Request Data Analytics <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
