import type { MetadataRoute } from "next";

const SITE_URL = "https://skilllinknexus.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/how-it-works",
          "/pricing",
          "/services",
          "/services/web-development",
          "/services/mobile-apps",
          "/services/ui-ux-design",
          "/services/branding",
          "/services/digital-marketing",
          "/services/data-analytics",
          "/about",
          "/contact",
        ],
        disallow: [
          "/dashboard",
          "/admin",
          "/client",
          "/freelancer",
          "/api",
          "/login",
          "/assigned-specialist",
          "/invoices",
          "/payments",
          "/projects",
          "/request",
          "/idea-chatbot",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
