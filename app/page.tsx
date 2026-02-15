import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

const SITE_URL = "https://skilllinknexus.com";

export const metadata: Metadata = {
  title: "SkillLink Nexus | Managed Delivery OS for SMEs",
  description:
    "Stop hiring full-time for project-based work. SkillLink Nexus matches your project to vetted specialists, manages milestones, and handles escrow payments — so you focus on your business.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "SkillLink Nexus | Managed Delivery OS for SMEs",
    description:
      "Match with vetted specialists. Manage milestones. Pay via escrow. SkillLink Nexus handles delivery so you don't have to.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SkillLink Nexus — Managed Delivery OS",
      },
    ],
  },
};

/* ── JSON-LD Structured Data ────────────────────────────────────────────── */

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SkillLink Nexus Ltd",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Managed delivery platform that matches businesses with vetted specialists and manages milestone escrow payments.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: `${SITE_URL}/contact`,
  },
  sameAs: [
    "https://twitter.com/skilllinknexus",
    "https://linkedin.com/company/skilllinknexus",
    "https://facebook.com/skilllinknexus",
    "https://instagram.com/skilllinknexus",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SkillLink Nexus",
  url: SITE_URL,
  description:
    "Managed delivery OS for SMEs — vetted specialists, milestone tracking, and escrow payments.",
  publisher: {
    "@type": "Organization",
    name: "SkillLink Nexus Ltd",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/services?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is SkillLink Nexus?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SkillLink Nexus is a managed delivery platform that matches businesses with vetted specialists for project-based work. We handle scoping, matching, milestone tracking, and escrow payments so you can focus on your business.",
      },
    },
    {
      "@type": "Question",
      name: "How does the escrow payment system work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When you fund a project, your payment is held securely by SkillLink Nexus — not sent directly to the specialist. Funds are released per milestone only after you review and approve the deliverable.",
      },
    },
    {
      "@type": "Question",
      name: "What services can I request?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer web development, mobile apps, UI/UX design, branding & identity, digital marketing, data & analytics, AI chatbots & automation, and maintenance & support. Each service is delivered end-to-end by a vetted specialist.",
      },
    },
    {
      "@type": "Question",
      name: "How are specialists vetted?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every specialist on our platform goes through a thorough vetting process that includes portfolio review, technical assessment, and delivery-track-record evaluation. Only top performers are matched to client projects.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a typical project take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Timelines vary based on scope and complexity. Simple projects like landing pages can be delivered in 1–2 weeks, while complex web apps or mobile apps may take 4–12 weeks. You'll receive a clear timeline during the scoping phase.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePage />
    </>
  );
}
