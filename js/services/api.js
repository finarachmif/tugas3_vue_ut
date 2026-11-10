// Service sederhana untuk mengambil dummy data JSON.
window.SITTAApi = {
  async getInitialData() {
    const response = await fetch("data/dataBahanAjar.json");
    if (!response.ok) throw new Error("File data/dataBahanAjar.json tidak dapat dibaca.");
    return response.json();
  }
};
