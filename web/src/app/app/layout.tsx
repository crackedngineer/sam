import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apptizr",
  description: "Viewing application.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
