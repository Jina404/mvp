import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Idea Chatbot",
  robots: {
    index: false,
    follow: false,
  },
};

export default function IdeaChatbotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
