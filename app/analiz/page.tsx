"use client";
import { useEffect, useState } from "react";
import { Trash2, TrendingUp, Award, BarChart3 } from "lucide-react";
import { getDenemeKayitlari, deleteDenemeKayit, DenemeKayit } from "@/lib/storage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function AnalizPage() {
  const [list, setList] = useState<DenemeKayit[]>([]);
  const [ok, setOk] = useState(false);

  useEffect(() => { setList(getDenemeKayitlari()); setOk(true); }, []);

  const sil = (id: string) => { deleteDenemeKayit(id); setList(getDenemeKayitlari()); };

  if (!ok) return null;

  const chartData = list.map(d => ({ name: d.ad, puan: d.puan }));
  const ort = list.length ? list.reduce((a, d) => a + d.puan, 0) / list.length : 0;
  const max = list.length ? Math.max(...list.map(d => d.puan)) : 0;
  const min = list.length ? Math.min(...list.map(d => d.puan)) : 0;
  const LABELS: Record<string, string> = { turkce: "Türkçe", matematik: "Mat.", tarih: "Tarih", cografya: "Coğ.", vatandaslik: "Vat." };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white mb-1">Analiz & Geçmiş</h1><p className="text-sm text-gray-500">Deneme sınavı performans takibi</p></div>
      {list.length === 0 ? (
        <div className="rounded-2xl p-12 border border-white/5 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
          <BarChart3 size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Henüz deneme kaydedilmedi</p>
          <p className="text-gray-600 text-sm mt-1">Hesapla sayfasından deneme sonuçlarını kaydedebilirsin.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[{ l: "En Yüksek", v: max.toFixed(2), c: "text-emerald-400" }, { l: "Ortalama", v: ort.toFixed(2), c: "text-violet-400" }, { l: "En Düşük", v: min.toFixed(2), c: "text-red-400" }].map(x => (
              <div key={x.l} className="rounded-xl p-4 border border-white/5 text-center" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className={`text-2xl font-bold ${x.c}`}>{x.v}</p>
                <p className="text-xs text-gray-500 mt-1">{x.l}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-6 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2 mb-6"><TrendingUp size={18} className="text-violet-400" /><h2 className="font-semibold text-white">Puan Grafiği</h2></div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip contentStyle={{ background: "rgba(15,10,30,0.95)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 12 }} labelStyle={{ color: "#9ca3af" }} itemStyle={{ color: "#a78bfa", fontWeight: "bold" }} />
                <ReferenceLine y={ort} stroke="rgba(124,58,237,0.4)" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="puan" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 5, stroke: "#a78bfa", strokeWidth: 2 }} activeDot={{ r: 7, fill: "#a78bfa" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold text-white flex items-center gap-2"><Award size={18} className="text-violet-400" />Deneme Listesi</h2>
            {[...list].reverse().map(d => (
              <div key={d.id} className="rounded-2xl p-5 border border-white/5 hover:border-violet-500/20 transition-colors" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div><h3 className="font-semibold text-white">{d.ad}</h3><p className="text-xs text-gray-500 mt-0.5">{d.tarih}</p></div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-2xl font-black ${d.puan >= 80 ? "text-emerald-400" : d.puan >= 60 ? "text-yellow-400" : "text-red-400"}`}>{d.puan.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">P94 Puanı</p>
                    </div>
                    <button onClick={() => sil(d.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 border border-transparent hover:border-red-500/20"><Trash2 size={15} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(d.dersler).map(([k, val]) => (
                    <div key={k} className="text-center rounded-lg p-2 bg-white/5 border border-white/5">
                      <p className="text-[10px] text-gray-500 mb-1">{LABELS[k]}</p>
                      <p className={`text-sm font-bold ${val.net >= 0 ? "text-gray-200" : "text-red-400"}`}>{val.net.toFixed(1)}</p>
                      <p className="text-[9px] text-gray-600">{val.dogru}D {val.yanlis}Y</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-xs text-gray-500">
                  <span>Net: <span className="text-gray-300 font-medium">{d.toplamNet.toFixed(2)}</span></span>
                  <span>50 + ({d.toplamNet.toFixed(2)} × 0.65)</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
