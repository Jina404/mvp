import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assigned Specialist",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AssignedSpecialistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
