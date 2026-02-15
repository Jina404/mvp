import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://skilllinknexus.com";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore all digital services offered by SkillLink Nexus — web development, mobile apps, UI/UX design, branding, digital marketing, and data analytics. Delivered end-to-end by vetted specialists.",
  keywords: [
    "digital services",
    "web development",
    "mobile apps",
    "UI/UX design",
    "branding",
    "digital marketing",
    "data analytics",
    "SkillLink Nexus",
  ],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: "All Services | SkillLink Nexus",
    description: "Web development, mobile apps, design, branding, marketing, and analytics — delivered end-to-end.",
    url: `${SITE_URL}/services`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "SkillLink Nexus Services" }],
  },
};

const services = [
  {
    title: "Web Development",
    slug: "web-development",
    description: "Websites, portals, dashboards, and web apps.",
  },
  {
    title: "Mobile Apps",
    slug: "mobile-apps",
    description: "Android, iOS, and cross-platform builds.",
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description: "Modern UI, prototypes, and user research.",
  },
  {
    title: "Branding & Identity",
    slug: "branding",
    description: "Logos, brand guides, and visual identity.",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description: "SEO, social content, and paid campaigns.",
  },
  {
    title: "Data & Analytics",
    slug: "data-analytics",
    description: "Dashboards, reporting, and business insights.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#181A20]">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
          Our Services
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Request any digital service — delivered end-to-end by a vetted specialist with
          milestone tracking and escrow payment protection.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-purple-300/60 hover:shadow-lg dark:border-white/10 dark:bg-[#1E2329]"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                {service.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {service.description}
              </p>
              <span className="mt-4 inline-block text-xs font-semibold text-purple-700 dark:text-purple-300">
                Learn more →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/request"
            className="inline-flex items-center gap-2 rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-purple-800"
          >
            Get Started <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
