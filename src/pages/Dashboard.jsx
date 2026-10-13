import { formatDate, getStatus } from "../utils/helpers";

export default function Dashboard({ data, setActiveTab }) {
  const overdue = data.items.filter((item) => getStatus(item.nextService) === "Terlambat").length;
  const upcoming = data.items.filter((item) => ["Akan datang", "Hari ini"].includes(getStatus(item.nextService))).length;

  return (
    <section className="page">
      <div className="welcome-panel">
        <div>
          <p className="eyebrow light">SELAMAT DATANG DI RAWAT.IN</p>
          <h2>Barang terawat, aktivitas lebih nyaman.</h2>
          <p>Kelola barang, pantau jadwal servis, dan simpan riwayat perawatannya dalam satu tempat.</p>
          <button className="button button-white" onClick={() => setActiveTab("items")}>+ Tambah barang</button>
        </div>
        <div className="welcome-art" aria-hidden="true">✦</div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total barang" value={data.items.length} icon="▣" tone="blue" />
        <StatCard label="Jadwal mendatang" value={upcoming} icon="◷" tone="green" />
        <StatCard label="Terlambat" value={overdue} icon="!" tone="peach" />
      </div>

      <div className="content-card">
        <div className="section-heading">
          <div><h3>Jadwal perawatan</h3><p>Ringkasan jadwal barang yang tercatat.</p></div>
          <button className="text-button" onClick={() => setActiveTab("schedule")}>Lihat semua →</button>
        </div>
        {data.items.length === 0 ? <EmptyState text="Belum ada barang. Tambahkan barang pertamamu, yuk!" /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Nama barang</th><th>Kategori</th><th>Jadwal berikutnya</th><th>Status</th></tr></thead>
            <tbody>{data.items.slice(0, 5).map((item) => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong><span className="cell-sub">{item.brand || "Merek belum diisi"}</span></td>
                <td>{item.category}</td><td>{formatDate(item.nextService)}</td>
                <td><StatusPill status={getStatus(item.nextService)} /></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </section>
  );
}

export function StatCard({ label, value, icon, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><p>{label}</p><strong>{value}</strong></div></div>;
}

export function StatusPill({ status }) {
  const className = status === "Terlambat" ? "overdue" : status === "Hari ini" ? "today" : status === "Akan datang" ? "upcoming" : "neutral";
  return <span className={`status-pill ${className}`}>{status}</span>;
}

export function EmptyState({ text }) {
  return <div className="empty-state"><div>▣</div><p>{text}</p></div>;
}
