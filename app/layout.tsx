
import "./globals.css";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "SkillLink Nexus | Managed Delivery OS",
  description: "Managed delivery OS for SMEs and vetted freelancers"
};

export default function RootLayout({
  children
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
