import type { Metadata } from "next";

const SITE_URL = "https://skilllinknexus.com";

export const metadata: Metadata = {
  title: "Branding & Identity Services",
  description:
    "Professional logos, brand guides, and visual identity crafted by vetted specialists. SkillLink Nexus delivers branding projects with milestone tracking and escrow protection.",
  keywords: ["branding", "logo design", "brand identity", "visual identity", "brand guide", "SkillLink Nexus"],
  alternates: { canonical: `${SITE_URL}/services/branding` },
  openGraph: {
    title: "Branding & Identity Services | SkillLink Nexus",
    description: "Professional logos, brand guides, and visual identity by vetted specialists.",
    url: `${SITE_URL}/services/branding`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SkillLink Nexus Branding Services" }],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Branding & Identity",
  description: "Professional logo design, brand guidelines, and visual identity systems by vetted creative specialists.",
  provider: { "@type": "Organization", name: "SkillLink Nexus Ltd", url: SITE_URL },
  serviceType: "Branding & Identity",
  areaServed: "Worldwide",
  url: `${SITE_URL}/services/branding`,
};

export default function BrandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <div className="min-h-screen bg-white dark:bg-[#181A20]">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">Branding & Identity Services</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Build a memorable brand with professional logo design, cohesive brand guidelines, and visual identity systems — all managed end-to-end.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">What We Deliver</h2>
          <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Logo design and variations</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Brand guidelines and style books</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Color palettes and typography systems</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Business cards, letterheads, and stationery</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Social media brand kits</li>
          </ul>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">Explore More Services</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/services/web-development" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Web Development</a>
            <a href="/services/mobile-apps" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Mobile Apps</a>
            <a href="/services/ui-ux-design" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">UI/UX Design</a>
            <a href="/services/digital-marketing" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Digital Marketing</a>
            <a href="/services/data-analytics" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Data Analytics</a>
          </div>

          <div className="mt-12">
            <a href="/request" className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-800">
              Request Branding Services <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
