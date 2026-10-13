import { useState } from "react";
import { formatDate, getStatus } from "../utils/helpers";
import { EmptyState, StatusPill } from "./Dashboard";

const blankForm = { name: "", category: "Elektronik", brand: "", nextService: "" };

export default function DataBarang({ items, updateItems }) {
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      updateItems(items.map((item) => item.id === editingId ? { ...item, ...form, name: form.name.trim() } : item));
      setEditingId(null);
    } else {
      updateItems([...items, { ...form, id: Date.now(), name: form.name.trim() }]);
    }
    setForm(blankForm);
  }

  function edit(item) {
    setForm({ name: item.name, category: item.category, brand: item.brand || "", nextService: item.nextService || "" });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function remove(id) {
    if (!window.confirm("Hapus barang ini beserta riwayat perawatannya?")) return;
    updateItems(items.filter((item) => item.id !== id));
    // Catatan riwayat terkait dapat dibiarkan untuk versi sederhana ini.
    if (editingId === id) { setEditingId(null); setForm(blankForm); }
  }

  return (
    <section className="page">
      <div className="page-intro"><h2>Data Barang</h2><p>Daftarkan barang pribadi yang ingin kamu rawat.</p></div>
      <div className="content-card form-card">
        <div className="section-heading"><div><h3>{editingId ? "Edit barang" : "Tambah barang baru"}</h3><p>Isi informasi dasar barangmu.</p></div></div>
        <form className="form-grid" onSubmit={submit}>
          <label>Nama barang<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Laptop ASUS" /></label>
          <label>Kategori<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Elektronik</option><option>Kendaraan</option><option>Peralatan rumah</option><option>Lainnya</option></select></label>
          <label>Merek<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Contoh: ASUS" /></label>
          <label>Jadwal perawatan berikutnya<input type="date" value={form.nextService} onChange={(e) => setForm({ ...form, nextService: e.target.value })} /></label>
          <div className="form-actions"><button className="button button-primary" type="submit">{editingId ? "Simpan perubahan" : "+ Simpan barang"}</button>
            {editingId && <button className="button button-muted" type="button" onClick={() => { setEditingId(null); setForm(blankForm); }}>Batal</button>}
          </div>
        </form>
      </div>
      <div className="content-card">
        <div className="section-heading"><div><h3>Barang yang tercatat</h3><p>{items.length} barang terdaftar</p></div></div>
        {items.length === 0 ? <EmptyState text="Belum ada data barang." /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Nama barang</th><th>Kategori</th><th>Merek</th><th>Jadwal berikutnya</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>{items.map((item) => <tr key={item.id}>
              <td><strong>{item.name}</strong></td><td>{item.category}</td><td>{item.brand || "-"}</td><td>{formatDate(item.nextService)}</td><td><StatusPill status={getStatus(item.nextService)} /></td>
              <td><div className="action-group"><button className="small-button" onClick={() => edit(item)}>Edit</button><button className="small-button danger" onClick={() => remove(item.id)}>Hapus</button></div></td>
            </tr>)}</tbody>
          </table></div>
        )}
      </div>
    </section>
  );
}
