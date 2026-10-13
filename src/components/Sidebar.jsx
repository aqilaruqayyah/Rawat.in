const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "⌂" },
  { id: "items", label: "Data Barang", icon: "▣" },
  { id: "schedule", label: "Jadwal Perawatan", icon: "◷" },
  { id: "history", label: "Riwayat Perawatan", icon: "↺" },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">R</div>
        <div><strong>Rawat.in</strong><span>Rawat barang, lebih mudah.</span></div>
      </div>
      <p className="nav-caption">MENU UTAMA</p>
      <nav>
        {navItems.map((item) => (
          <button
            className={`nav-link ${activeTab === item.id ? "active" : ""}`}
            key={item.id}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-note">
        <span className="note-icon">✦</span>
        <strong>Tips Rawat.in</strong>
        <p>Catat jadwal servis agar barang kesayangan tetap terawat.</p>
      </div>
    </aside>
  );
}
