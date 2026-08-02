import { useState, useEffect } from "react";

/**
 * Her saniye güncellenen canlı tarih/saat hook'u.
 */
export function useClock(): Date {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
}

/**
 * Tarihi Türkçe formatta biçimlendirir.
 * Örn: "26 Temmuz 2026 Pazar"
 */
export function formatDateTR(date: Date): string {
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];
  const days = [
    "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${days[date.getDay()]}`;
}

/**
 * Saati HH:MM:SS formatında biçimlendirir.
 * Örn: "14:35:27"
 */
export function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
