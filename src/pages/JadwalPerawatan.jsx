import { formatDate, getStatus } from "../utils/helpers";
import { EmptyState, StatusPill, StatCard } from "./Dashboard";

export default function JadwalPerawatan({ items, setActiveTab, updateItems }) {
  const scheduled = items.filter((item) => item.nextService).sort((a, b) => a.nextService.localeCompare(b.nextService));
  const overdue = items.filter((item) => getStatus(item.nextService) === "Terlambat").length;
  const upcoming = items.filter((item) => ["Akan datang", "Hari ini"].includes(getStatus(item.nextService))).length;

  return (
    <section className="page">
      <div className="page-intro"><h2>Jadwal Perawatan</h2><p>Pantau jadwal servis mendatang dan barang yang perlu segera diperhatikan.</p></div>
      <div className="stats-grid compact">
        <StatCard label="Akan datang / hari ini" value={upcoming} icon="◷" tone="green" />
        <StatCard label="Terlambat" value={overdue} icon="!" tone="peach" />
      </div>
      <div className="content-card">
        <div className="section-heading"><div><h3>Semua jadwal</h3><p>Jadwal diurutkan berdasarkan tanggal.</p></div><button className="button button-primary" onClick={() => setActiveTab("items")}>+ Atur jadwal</button></div>
        {scheduled.length === 0 ? <EmptyState text="Belum ada jadwal. Tambahkan jadwal dari menu Data Barang." /> : (
          <div className="schedule-list">{scheduled.map((item) => (
            <div className="schedule-row" key={item.id}>
              <div className="date-tile"><span>{new Date(`${item.nextService}T00:00:00`).toLocaleDateString("id-ID", { day: "2-digit" })}</span><small>{new Date(`${item.nextService}T00:00:00`).toLocaleDateString("id-ID", { month: "short" })}</small></div>
              <div className="schedule-info"><strong>{item.name}</strong><span>{item.category}{item.brand ? ` · ${item.brand}` : ""}</span><small>Jadwal: {formatDate(item.nextService)}</small></div>
              <StatusPill status={getStatus(item.nextService)} />
            </div>
          ))}</div>
        )}
      </div>
    </section>
  );
}
