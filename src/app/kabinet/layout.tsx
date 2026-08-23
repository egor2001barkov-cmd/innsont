import type { Metadata } from "next";
import { AppShell } from "@/components/kabinet/AppShell";
import "./kabinet.css";

export const metadata: Metadata = {
  title: "Личный кабинет",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
