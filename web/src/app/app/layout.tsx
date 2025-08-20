import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App View",
  description: "Viewing a Streamlit application.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
