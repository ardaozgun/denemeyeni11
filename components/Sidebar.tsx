"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Video, Calculator, BarChart3, GraduationCap } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/videolar", label: "Videolar", icon: Video },
  { href: "/hesapla", label: "Hesapla", icon: Calculator },
  { href: "/analiz", label: "Analiz", icon: BarChart3 },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-40"
      style={{ background: "rgba(10,10,10,0.95)", borderRight: "1px solid rgba(124,58,237,0.15)", backdropFilter: "blur(12px)" }}>
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">KPSS 2026</p>
          <p className="text-[10px] text-violet-400 uppercase tracking-widest">Ortaöğretim</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const a = path === href;
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${a ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"}`}>
              <Icon size={18} className={a ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"} />
              {label}
              {a && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-white/5">
        <div className="rounded-xl p-3 text-xs text-gray-500" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)" }}>
          <p className="font-medium text-violet-400 mb-1">Benim Hocam</p>
          <p>2026 Ortaöğretim Serisi</p>
        </div>
      </div>
    </aside>
  );
}
