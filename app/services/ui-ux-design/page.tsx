import type { Metadata } from "next";

const SITE_URL = "https://skilllinknexus.com";

export const metadata: Metadata = {
  title: "UI/UX Design Services",
  description:
    "Modern UI design, prototypes, and user research by vetted specialists. SkillLink Nexus manages the full design process with milestone-based delivery.",
  keywords: ["UI/UX design", "user interface", "user experience", "prototyping", "Figma", "design systems", "SkillLink Nexus"],
  alternates: { canonical: `${SITE_URL}/services/ui-ux-design` },
  openGraph: {
    title: "UI/UX Design Services | SkillLink Nexus",
    description: "Modern UI design, prototypes, and user research by vetted specialists.",
    url: `${SITE_URL}/services/ui-ux-design`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SkillLink Nexus UI/UX Design" }],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "UI/UX Design",
  description: "Modern user interface design, interactive prototypes, and user research delivered by vetted specialists.",
  provider: { "@type": "Organization", name: "SkillLink Nexus Ltd", url: SITE_URL },
  serviceType: "UI/UX Design",
  areaServed: "Worldwide",
  url: `${SITE_URL}/services/ui-ux-design`,
};

export default function UiUxDesignPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <div className="min-h-screen bg-white dark:bg-[#181A20]">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">UI/UX Design Services</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            From wireframes to pixel-perfect interfaces — our vetted designers craft intuitive experiences that delight users and drive engagement.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">What We Deliver</h2>
          <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Wireframes and low-fidelity prototypes</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> High-fidelity UI design (Figma, Sketch)</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Interactive prototypes and micro-animations</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> User research and usability testing</li>
            <li className="flex gap-2"><span className="text-purple-600">✓</span> Design systems and component libraries</li>
          </ul>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">Explore More Services</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/services/web-development" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Web Development</a>
            <a href="/services/mobile-apps" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Mobile Apps</a>
            <a href="/services/branding" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Branding</a>
            <a href="/services/digital-marketing" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Digital Marketing</a>
            <a href="/services/data-analytics" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Data Analytics</a>
          </div>

          <div className="mt-12">
            <a href="/request" className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-800">
              Request UI/UX Design <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
