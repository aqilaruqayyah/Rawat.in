import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DataBarang from "./pages/DataBarang";
import JadwalPerawatan from "./pages/JadwalPerawatan";
import RiwayatPerawatan from "./pages/RiwayatPerawatan";
import { loadData, saveData, initialData } from "./utils/storage";

export default function App() {
  const [data, setData] = useState(loadData);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => saveData(data), [data]);

  function updateItems(items) {
    setData((current) => ({ ...current, items }));
  }

  function addHistory(entry) {
    setData((current) => {
      const items = current.items.map((item) =>
        item.id === Number(entry.itemId) && entry.nextService
          ? { ...item, nextService: entry.nextService }
          : item
      );
      return { ...current, items, history: [entry, ...current.history] };
    });
  }

  function resetDemoData() {
    if (window.confirm("Kembalikan data contoh? Perubahan data saat ini akan hilang.")) {
      setData(initialData);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">PERSONAL CARE TRACKER</p>
            <h1>{{
              dashboard: "Dashboard",
              items: "Data Barang",
              schedule: "Jadwal Perawatan",
              history: "Riwayat Perawatan",
            }[activeTab]}</h1>
          </div>
          <div className="profile"><div className="avatar">R</div><span>Pengguna</span></div>
        </header>

        {activeTab === "dashboard" && <Dashboard data={data} setActiveTab={setActiveTab} />}
        {activeTab === "items" && <DataBarang items={data.items} updateItems={updateItems} />}
        {activeTab === "schedule" && <JadwalPerawatan items={data.items} setActiveTab={setActiveTab} updateItems={updateItems} />}
        {activeTab === "history" && <RiwayatPerawatan items={data.items} history={data.history} addHistory={addHistory} />}
        <footer className="main-footer">
          Rawat.in · Catat, rawat, dan pantau barangmu.
          <button className="reset-button" onClick={resetDemoData}>Reset data contoh</button>
        </footer>
      </main>
    </div>
  );
}
