"use client";
import { useState } from "react";
import { Calculator, Save, CheckCircle, AlertCircle } from "lucide-react";
import { saveDenemeKayit, DenemeKayit } from "@/lib/storage";

type K = "turkce" | "matematik" | "tarih" | "cografya" | "vatandaslik";
const DERSLER: { key: K; label: string; soru: number }[] = [
  { key: "turkce", label: "Türkçe", soru: 30 },
  { key: "matematik", label: "Matematik", soru: 30 },
  { key: "tarih", label: "Tarih", soru: 15 },
  { key: "cografya", label: "Coğrafya", soru: 10 },
  { key: "vatandaslik", label: "Vatandaşlık", soru: 15 },
];
const init = () => Object.fromEntries(DERSLER.map(d => [d.key, { d: "", y: "" }])) as Record<K, { d: string; y: string }>;

export default function HesaplaPage() {
  const [v, setV] = useState(init());
  const [ad, setAd] = useState("");
  const [msg, setMsg] = useState<"ok" | "err" | null>(null);

  const set = (k: K, f: "d" | "y", val: string) =>
    setV(p => ({ ...p, [k]: { ...p[k], [f]: val.replace(/\D/g, "") } }));

  const rows = DERSLER.map(d => {
    const dogru = +v[d.key].d || 0, yanlis = +v[d.key].y || 0;
    return { ...d, dogru, yanlis, bos: Math.max(0, d.soru - dogru - yanlis), net: dogru - yanlis / 4 };
  });
  const topNet = rows.reduce((a, r) => a + r.net, 0);
  const puan = 50 + topNet * 0.65;

  const kaydet = () => {
    if (!ad.trim()) { setMsg("err"); setTimeout(() => setMsg(null), 3000); return; }
    const kayit: DenemeKayit = {
      id: Date.now().toString(), ad: ad.trim(),
      tarih: new Date().toLocaleDateString("tr-TR"),
      puan: +puan.toFixed(2), toplamNet: +topNet.toFixed(2),
      dersler: Object.fromEntries(rows.map(r => [r.key, { dogru: r.dogru, yanlis: r.yanlis, net: r.net }])) as DenemeKayit["dersler"],
    };
    saveDenemeKayit(kayit);
    setMsg("ok"); setTimeout(() => setMsg(null), 3000);
    setAd(""); setV(init());
  };

  const pc = puan >= 80 ? "text-emerald-400" : puan >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white mb-1">Net & Puan Hesapla</h1><p className="text-sm text-gray-500">KPSS Ortaöğretim P94 — 4 yanlış 1 doğruyu götürür</p></div>
      <div className="rounded-2xl p-6 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center gap-2 mb-4"><Calculator size={18} className="text-violet-400" /><h2 className="font-semibold text-white">Cevap Girişi</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-xs text-gray-500 border-b border-white/5">
              <th className="text-left py-2">Ders</th><th className="text-center py-2">Soru</th>
              <th className="text-center py-2">Doğru</th><th className="text-center py-2">Yanlış</th>
              <th className="text-center py-2">Boş</th><th className="text-right py-2">Net</th>
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {rows.map(r => (
                <tr key={r.key}>
                  <td className="py-3 text-sm font-medium text-gray-200">{r.label}</td>
                  <td className="py-3 text-center text-sm text-gray-500">{r.soru}</td>
                  <td className="py-3 px-2"><input type="number" min={0} max={r.soru} value={v[r.key].d} onChange={e => set(r.key, "d", e.target.value)} placeholder="0" className="w-full text-center bg-white/5 border border-violet-500/30 rounded-lg py-1.5 text-sm text-white outline-none" /></td>
                  <td className="py-3 px-2"><input type="number" min={0} max={r.soru} value={v[r.key].y} onChange={e => set(r.key, "y", e.target.value)} placeholder="0" className="w-full text-center bg-white/5 border border-red-500/30 rounded-lg py-1.5 text-sm text-white outline-none" /></td>
                  <td className="py-3 text-center text-sm text-gray-500">{r.bos}</td>
                  <td className="py-3 text-right text-sm font-semibold"><span className={r.net >= 0 ? "text-emerald-400" : "text-red-400"}>{r.net.toFixed(2)}</span></td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="border-t border-violet-500/20">
              <td colSpan={4} className="py-3 text-sm text-gray-400">Toplam Net</td>
              <td /><td className="py-3 text-right font-bold text-violet-300">{topNet.toFixed(2)}</td>
            </tr></tfoot>
          </table>
        </div>
      </div>
      <div className="rounded-2xl p-6 border border-violet-500/30" style={{ background: "rgba(124,58,237,0.05)" }}>
        <p className="text-sm text-gray-400 mb-2">Tahmini KPSS P94 Puanınız</p>
        <p className={`text-5xl font-black mb-1 ${pc}`}>{puan.toFixed(2)}</p>
        <p className="text-xs text-gray-500">Formül: 50 + ({topNet.toFixed(2)} × 0.65)</p>
      </div>
      <div className="rounded-2xl p-6 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center gap-2 mb-4"><Save size={18} className="text-violet-400" /><h2 className="font-semibold text-white">Denemeyi Kaydet</h2></div>
        <div className="flex gap-3">
          <input type="text" placeholder="Sınav adı (örn: TG-1)" value={ad} onChange={e => setAd(e.target.value)} onKeyDown={e => e.key === "Enter" && kaydet()} className="flex-1 bg-white/5 border border-white/10 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-600" />
          <button onClick={kaydet} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors">Kaydet</button>
        </div>
        {msg === "ok" && <div className="flex items-center gap-2 text-emerald-400 text-sm mt-3"><CheckCircle size={16} /> Kaydedildi!</div>}
        {msg === "err" && <div className="flex items-center gap-2 text-red-400 text-sm mt-3"><AlertCircle size={16} /> Sınav adı girin.</div>}
      </div>
    </div>
  );
}
