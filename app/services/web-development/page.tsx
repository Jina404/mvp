import type { Metadata } from "next";

const SITE_URL = "https://skilllinknexus.com";

export const metadata: Metadata = {
  title: "Web Development Services",
  description:
    "Custom websites, portals, dashboards, and web apps built by vetted specialists. SkillLink Nexus manages delivery end-to-end with milestone tracking and escrow payments.",
  keywords: [
    "web development",
    "custom websites",
    "web apps",
    "dashboard development",
    "portal development",
    "SkillLink Nexus",
  ],
  alternates: {
    canonical: `${SITE_URL}/services/web-development`,
  },
  openGraph: {
    title: "Web Development Services | SkillLink Nexus",
    description:
      "Custom websites, portals, dashboards, and web apps built by vetted specialists with milestone escrow payments.",
    url: `${SITE_URL}/services/web-development`,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SkillLink Nexus Web Development Services",
      },
    ],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Web Development",
  description:
    "Custom websites, portals, dashboards, and web applications built by vetted specialists with milestone-based delivery and escrow payment protection.",
  provider: {
    "@type": "Organization",
    name: "SkillLink Nexus Ltd",
    url: SITE_URL,
  },
  serviceType: "Web Development",
  areaServed: "Worldwide",
  url: `${SITE_URL}/services/web-development`,
};

export default function WebDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-[#181A20]">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Web Development Services
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            From marketing websites to complex web applications — our vetted specialists
            build exactly what you need with milestone-based delivery and escrow payment
            protection.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            What We Deliver
          </h2>
          <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-purple-600">✓</span> Custom business websites and landing pages
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600">✓</span> E-commerce platforms and online stores
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600">✓</span> Admin dashboards and internal portals
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600">✓</span> SaaS web applications
            </li>
            <li className="flex gap-2">
              <span className="text-purple-600">✓</span> API integrations and backend systems
            </li>
          </ul>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Our Tech Stack
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            React, Next.js, TypeScript, Node.js, Python, PostgreSQL, Tailwind CSS, and more.
            We match the right technology to your project requirements.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Explore More Services
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="/services/mobile-apps" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Mobile Apps</a>
            <a href="/services/ui-ux-design" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">UI/UX Design</a>
            <a href="/services/branding" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Branding</a>
            <a href="/services/digital-marketing" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Digital Marketing</a>
            <a href="/services/data-analytics" className="text-sm font-medium text-purple-700 underline hover:text-purple-900 dark:text-purple-300">Data Analytics</a>
          </div>

          <div className="mt-12">
            <a
              href="/request"
              className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-800"
            >
              Request Web Development
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
