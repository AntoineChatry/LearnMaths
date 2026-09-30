const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

// « dans 10 minutes », « demain », « dans 3 jours »…
export function formatRelative(date: Date, now = new Date()): string {
  const minutes = Math.round((date.getTime() - now.getTime()) / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(Math.round(hours / 24), "day");
}
