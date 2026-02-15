
import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const SITE_URL = "https://skilllinknexus.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SkillLink Nexus | Managed Delivery OS for SMEs",
    template: "%s | SkillLink Nexus",
  },
  description:
    "SkillLink Nexus matches businesses with vetted specialists and manages milestone escrow payments. Get web development, mobile apps, UI/UX design, branding, and more — delivered end-to-end.",
  keywords: [
    "managed delivery",
    "vetted specialists",
    "freelancer management",
    "escrow payments",
    "milestone tracking",
    "web development",
    "mobile apps",
    "UI/UX design",
    "branding",
    "digital marketing",
    "data analytics",
    "SME software",
    "project management",
    "SkillLink Nexus",
  ],
  authors: [{ name: "SkillLink Nexus Ltd", url: SITE_URL }],
  creator: "SkillLink Nexus Ltd",
  publisher: "SkillLink Nexus Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SkillLink Nexus",
    title: "SkillLink Nexus | Managed Delivery OS for SMEs",
    description:
      "Match with vetted specialists. Manage milestones. Pay via escrow. SkillLink Nexus handles delivery so you don't have to.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SkillLink Nexus — Managed Delivery OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillLink Nexus | Managed Delivery OS for SMEs",
    description:
      "Match with vetted specialists. Manage milestones. Pay via escrow. SkillLink Nexus handles delivery so you don't have to.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@skilllinknexus",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
