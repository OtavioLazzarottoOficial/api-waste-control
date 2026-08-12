export function parseLocalDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString();
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateWithWeekday(isoDate: string): string {
  const date = new Date(isoDate);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
  const weekday = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    timeZone: "UTC",
  });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${formattedDate} ${capitalizedWeekday}`;
}

// Converte ISO para formato do input type="date" (YYYY-MM-DD)
export function toInputDate(isoDate: string): string {
  if (!isoDate) return "";
  return new Date(isoDate).toISOString().split("T")[0];
}

// Formata data com hora no padrão pt-BR (ex: 26/04/2026, 14:44:37)
export function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}