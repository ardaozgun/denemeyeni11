export type DenemeKayit = {
  id: string; ad: string; tarih: string; puan: number; toplamNet: number;
  dersler: {
    turkce: { dogru: number; yanlis: number; net: number };
    matematik: { dogru: number; yanlis: number; net: number };
    tarih: { dogru: number; yanlis: number; net: number };
    cografya: { dogru: number; yanlis: number; net: number };
    vatandaslik: { dogru: number; yanlis: number; net: number };
  };
};

export function getVideoProgress(): Record<string, boolean[]> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem("kpss_vp") || "{}"); } catch { return {}; }
}
export function setVideoProgress(d: Record<string, boolean[]>) {
  if (typeof window !== "undefined") localStorage.setItem("kpss_vp", JSON.stringify(d));
}
export function getDenemeKayitlari(): DenemeKayit[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("kpss_den") || "[]"); } catch { return []; }
}
export function saveDenemeKayit(k: DenemeKayit) {
  const m = getDenemeKayitlari(); m.push(k);
  localStorage.setItem("kpss_den", JSON.stringify(m));
}
export function deleteDenemeKayit(id: string) {
  localStorage.setItem("kpss_den", JSON.stringify(getDenemeKayitlari().filter(k => k.id !== id)));
}
