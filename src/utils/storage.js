export const STORAGE_KEY = "rawat-in-data";

export const initialData = {
  items: [
    { id: 1, name: "Laptop ASUS", category: "Elektronik", brand: "ASUS", nextService: "2026-10-25" },
    { id: 2, name: "Sepeda", category: "Kendaraan", brand: "Polygon", nextService: "2026-10-10" },
  ],
  history: [
    { id: 1, itemId: 1, date: "2026-09-15", description: "Membersihkan kipas dan keyboard", cost: "75000", nextService: "" },
  ],
};

export function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  } catch {
    return initialData;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
