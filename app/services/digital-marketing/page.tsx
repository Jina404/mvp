import type { Metadata } from "next";

const SITE_URL = "https://skilllinknexus.com";

export const metadata: Metadata = {
  title: "Digital Marketing Services",
  description:
    "SEO, social media content, and paid ad campaigns managed by vetted specialists. SkillLink Nexus delivers digital marketing projects with milestone tracking.",
  keywords: ["digital marketing", "SEO", "social media marketing", "paid ads", "content marketing", "PPC", "SkillLink Nexus"],
  alternates: { canonical: `${SITE_URL}/services/digital-marketing` },
  openGraph: {
    title: "Digital Marketing Services | SkillLink Nexus",
    description: "SEO, social media, and paid campaigns by vetted marketing specialists.",
    url: `${SITE_URL}/services/digital-marketing`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SkillLink Nexus Digital Marketing" }],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Digital Marketing",
  description: "SEO optimization, social media content strategy, and paid advertising campaigns by vetted marketing specialists.",
  provider: { "@type": "Organization", name: "SkillLink Nexus Ltd", url: SITE_URL },
  serviceType: "Digital Marketing",
  areaServed: "Worldwide",
  url: `${SITE_URL}/services/digital-marketing`,
};

export default function DigitalMarketingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <div className="min-h-screen bg-white dark:bg-[#181A20]">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">Digital Marketing Services</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Drive growth with data-driven SEO, content strategy, and paid campaigns — all executed by vetted marketing specialists and tracked through milestones.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">What We Deliver</h2>
          <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Technical SEO audits and on-page optimization</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Social media strategy and content creation</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Google Ads and Meta Ads campaign management</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Email marketing and automation</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Analytics setup and reporting dashboards</li>
          </ul>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">Explore More Services</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/services/web-development" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Web Development</a>
            <a href="/services/mobile-apps" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Mobile Apps</a>
            <a href="/services/ui-ux-design" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">UI/UX Design</a>
            <a href="/services/branding" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Branding</a>
            <a href="/services/data-analytics" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Data Analytics</a>
          </div>

          <div className="mt-12">
            <a href="/request" className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-800">
              Request Digital Marketing <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
