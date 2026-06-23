import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "KPSS 2026 Ortaöğretim Premium Takip",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-[#050505] text-gray-200 min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-64 pb-20 md:pb-0">
            <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
