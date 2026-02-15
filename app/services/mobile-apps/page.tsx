import type { Metadata } from "next";

const SITE_URL = "https://skilllinknexus.com";

export const metadata: Metadata = {
  title: "Mobile App Development Services",
  description:
    "Android, iOS, and cross-platform mobile apps built by vetted specialists. SkillLink Nexus manages delivery with milestone tracking and escrow payments.",
  keywords: [
    "mobile app development",
    "Android apps",
    "iOS apps",
    "cross-platform apps",
    "React Native",
    "Flutter",
    "SkillLink Nexus",
  ],
  alternates: {
    canonical: `${SITE_URL}/services/mobile-apps`,
  },
  openGraph: {
    title: "Mobile App Development | SkillLink Nexus",
    description:
      "Android, iOS, and cross-platform mobile apps by vetted specialists with milestone escrow payments.",
    url: `${SITE_URL}/services/mobile-apps`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SkillLink Nexus Mobile App Development" }],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mobile App Development",
  description:
    "Android, iOS, and cross-platform mobile applications built by vetted specialists with milestone-based delivery.",
  provider: { "@type": "Organization", name: "SkillLink Nexus Ltd", url: SITE_URL },
  serviceType: "Mobile App Development",
  areaServed: "Worldwide",
  url: `${SITE_URL}/services/mobile-apps`,
};

export default function MobileAppsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <div className="min-h-screen bg-white dark:bg-[#181A20]">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Mobile App Development Services
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Native and cross-platform mobile applications — from concept to App Store.
            Our vetted specialists deliver production-ready apps with milestone tracking.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">What We Deliver</h2>
          <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Native iOS apps (Swift, SwiftUI)</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Native Android apps (Kotlin, Java)</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Cross-platform apps (React Native, Flutter)</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> App Store/Play Store publishing</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Push notifications and backend integrations</li>
          </ul>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">Explore More Services</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/services/web-development" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Web Development</a>
            <a href="/services/ui-ux-design" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">UI/UX Design</a>
            <a href="/services/branding" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Branding</a>
            <a href="/services/digital-marketing" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Digital Marketing</a>
            <a href="/services/data-analytics" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Data Analytics</a>
          </div>

          <div className="mt-12">
            <a href="/request" className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-800">
              Request Mobile App Development <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
