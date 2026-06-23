"use client";
import { useEffect, useState } from "react";
import { Video, Trophy, BookOpen, TrendingUp, Target, Calendar } from "lucide-react";
import { getVideoProgress, getDenemeKayitlari } from "@/lib/storage";

const DERSLER = [
  { key: "turkce", label: "Türkçe", toplam: 46 },
  { key: "matematik", label: "Matematik", toplam: 81 },
  { key: "tarih", label: "Tarih", toplam: 60 },
  { key: "cografya", label: "Coğrafya", toplam: 34 },
  { key: "vatandaslik", label: "Vatandaşlık", toplam: 48 },
];
const TOPLAM = 269;

function StatCard({ title, value, subtitle, icon: Icon, color = "violet", progress }: {
  title: string; value: string | number; subtitle?: string;
  icon: React.ElementType; color?: string; progress?: number;
}) {
  const colors: Record<string, { border: string; bg: string; icon: string; bar: string }> = {
    violet: { border: "border-violet-500/20", bg: "bg-violet-500/10", icon: "text-violet-400", bar: "bg-violet-500" },
    orange: { border: "border-orange-500/20", bg: "bg-orange-500/10", icon: "text-orange-400", bar: "bg-orange-500" },
    blue: { border: "border-blue-500/20", bg: "bg-blue-500/10", icon: "text-blue-400", bar: "bg-blue-500" },
    green: { border: "border-emerald-500/20", bg: "bg-emerald-500/10", icon: "text-emerald-400", bar: "bg-emerald-500" },
  };
  const c = colors[color];
  return (
    <div className={`rounded-2xl p-5 border ${c.border}`} style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
        <Icon size={20} className={c.icon} />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-300">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% tamamlandı</p>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [izlenen, setIzlenen] = useState(0);
  const [sonPuan, setSonPuan] = useState<number | null>(null);
  const [denemeCount, setDenemeCount] = useState(0);
  const [ilerleme, setIlerleme] = useState<{ label: string; yuzde: number }[]>([]);

  useEffect(() => {
    const p = getVideoProgress();
    let top = 0;
    const iler = DERSLER.map(d => {
      const c = (p[d.key] || []).filter(Boolean).length;
      top += c;
      return { label: d.label, yuzde: (c / d.toplam) * 100 };
    });
    setIzlenen(top);
    setIlerleme(iler);
    const den = getDenemeKayitlari();
    setDenemeCount(den.length);
    if (den.length > 0) setSonPuan(den[den.length - 1].puan);
  }, []);

  const yuzde = (izlenen / TOPLAM) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">KPSS 2026 Ortaöğretim — Genel Durumun</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="İzlenen Video" value={izlenen} subtitle={`Toplam ${TOPLAM} videodan`} icon={Video} color="violet" progress={yuzde} />
        <StatCard title="Son Deneme Puanı" value={sonPuan?.toFixed(2) ?? "—"} subtitle="KPSS P94" icon={Trophy} color="orange" />
        <StatCard title="Kayıtlı Deneme" value={denemeCount} subtitle="Toplam deneme sayısı" icon={BookOpen} color="blue" />
        <StatCard title="Video İlerleme" value={`%${yuzde.toFixed(1)}`} subtitle="Tüm dersler" icon={TrendingUp} color="green" progress={yuzde} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-2 mb-5"><Target size={18} className="text-violet-400" /><h2 className="font-semibold text-white">Ders Bazlı İlerleme</h2></div>
          <div className="space-y-4">
            {ilerleme.map(d => (
              <div key={d.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300">{d.label}</span>
                  <span className="text-violet-400 font-medium">%{d.yuzde.toFixed(0)}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400" style={{ width: `${d.yuzde}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-6 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-2 mb-5"><Calendar size={18} className="text-violet-400" /><h2 className="font-semibold text-white">Hızlı Bilgiler</h2></div>
          <div className="space-y-3">
            {[
              ["Sınav Türü", "KPSS Ortaöğretim"],
              ["Puan Türü", "P94"],
              ["Toplam Soru", "100 Soru"],
              ["Süre", "120 Dakika"],
              ["Net Kuralı", "4 Yanlış → 1 Doğru"],
              ["Puan Formülü", "50 + (Net × 0.65)"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-gray-500 text-sm">{l}</span>
                <span className="text-gray-200 text-sm font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
