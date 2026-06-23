"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, CheckSquare, Square } from "lucide-react";
import { getVideoProgress, setVideoProgress } from "@/lib/storage";

const DERSLER = [
  { key: "turkce", label: "Türkçe", emoji: "📖", toplam: 46, bar: "bg-violet-500", badge: "bg-violet-500/15 text-violet-400", check: "text-violet-400", border: "border-violet-500/20" },
  { key: "matematik", label: "Matematik", emoji: "🔢", toplam: 81, bar: "bg-blue-500", badge: "bg-blue-500/15 text-blue-400", check: "text-blue-400", border: "border-blue-500/20" },
  { key: "tarih", label: "Tarih", emoji: "🏛️", toplam: 60, bar: "bg-orange-500", badge: "bg-orange-500/15 text-orange-400", check: "text-orange-400", border: "border-orange-500/20" },
  { key: "cografya", label: "Coğrafya", emoji: "🗺️", toplam: 34, bar: "bg-emerald-500", badge: "bg-emerald-500/15 text-emerald-400", check: "text-emerald-400", border: "border-emerald-500/20" },
  { key: "vatandaslik", label: "Vatandaşlık", emoji: "⚖️", toplam: 48, bar: "bg-pink-500", badge: "bg-pink-500/15 text-pink-400", check: "text-pink-400", border: "border-pink-500/20" },
];

export default function VideolarPage() {
  const [progress, setProgress] = useState<Record<string, boolean[]>>({});
  const [acik, setAcik] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setProgress(getVideoProgress()); setMounted(true); }, []);

  const toggle = (key: string, i: number) => {
    const u = { ...progress, [key]: [...(progress[key] || [])] };
    while (u[key].length <= i) u[key].push(false);
    u[key][i] = !u[key][i];
    setProgress(u); setVideoProgress(u);
  };

  const toggleAll = (key: string, n: number, v: boolean) => {
    const u = { ...progress, [key]: Array(n).fill(v) };
    setProgress(u); setVideoProgress(u);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white mb-1">Video Takip</h1><p className="text-sm text-gray-500">Benim Hocam 2026 Ortaöğretim Serisi</p></div>
      <div className="space-y-3">
        {DERSLER.map(d => {
          const ch = progress[d.key] || [];
          const iz = ch.filter(Boolean).length;
          const yuzde = (iz / d.toplam) * 100;
          const open = acik === d.key;
          return (
            <div key={d.key} className={`rounded-2xl border ${d.border} overflow-hidden`} style={{ background: "rgba(255,255,255,0.02)" }}>
              <button onClick={() => setAcik(open ? null : d.key)} className="w-full flex items-center gap-4 p-5 hover:bg-white/5">
                <span className="text-2xl">{d.emoji}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-white">{d.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.badge}`}>{iz}/{d.toplam}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className={`h-full rounded-full ${d.bar}`} style={{ width: `${yuzde}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">%{yuzde.toFixed(0)} tamamlandı</p>
                </div>
                {open ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
              </button>
              {open && (
                <div className="border-t border-white/5 px-5 pb-5 pt-4">
                  <div className="flex gap-3 mb-4">
                    <button onClick={() => toggleAll(d.key, d.toplam, true)} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10">Tümünü İşaretle</button>
                    <button onClick={() => toggleAll(d.key, d.toplam, false)} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10">Temizle</button>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {Array.from({ length: d.toplam }, (_, i) => {
                      const ok = ch[i] === true;
                      return (
                        <button key={i} onClick={() => toggle(d.key, i)} className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${ok ? `${d.border} bg-white/5` : "border-white/5 hover:border-white/20"}`}>
                          {ok ? <CheckSquare size={16} className={d.check} /> : <Square size={16} className="text-gray-600" />}
                          <span className={`text-[10px] font-medium ${ok ? "text-gray-200" : "text-gray-500"}`}>{i + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
