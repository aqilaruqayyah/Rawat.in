export function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function getStatus(dateString) {
  if (!dateString) return "Belum dijadwalkan";
  const target = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (target < today) return "Terlambat";
  if (target.getTime() === today.getTime()) return "Hari ini";
  return "Akan datang";
}
