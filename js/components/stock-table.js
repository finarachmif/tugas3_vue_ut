Vue.component("ba-stock-table", {
  props: {
    items: { type: Array, required: true },
    upbjjList: { type: Array, required: true },
    kategoriList: { type: Array, required: true }
  },
  data() {
    return {
      filterUpbjj: "",
      filterKategori: "",
      filterStok: "semua",
      sortBy: "judul",
      sortDirection: 1,
      keyword: "",
      form: this.emptyForm(),
      editingId: null,
      showForm: false
    };
  },
  computed: {
    kategoriTersedia() {
      if (!this.filterUpbjj) return this.kategoriList;
      return [...new Set(this.items.filter(x => x.upbjj === this.filterUpbjj).map(x => x.kategori))];
    },
    filteredItems() {
      let result = this.items.filter(item => {
        const cocokUpbjj = !this.filterUpbjj || item.upbjj === this.filterUpbjj;
        const cocokKategori = !this.filterKategori || item.kategori === this.filterKategori;
        const cocokKata = !this.keyword || (item.kode + " " + item.judul).toLowerCase().includes(this.keyword.toLowerCase());
        let cocokStok = true;
        if (this.filterStok === "menipis") cocokStok = item.qty > 0 && item.qty < item.safety;
        if (this.filterStok === "kosong") cocokStok = item.qty === 0;
        if (this.filterStok === "reorder") cocokStok = item.qty < item.safety;
        return cocokUpbjj && cocokKategori && cocokKata && cocokStok;
      });
      return result.slice().sort((a,b) => {
        const av = a[this.sortBy], bv = b[this.sortBy];
        const compare = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv), "id");
        return compare * this.sortDirection;
      });
    },
    totalJenis() { return this.items.length; },
    totalKosong() { return this.items.filter(x => x.qty === 0).length; },
    totalMenipis() { return this.items.filter(x => x.qty > 0 && x.qty < x.safety).length; }
  },
  watch: {
    filterUpbjj() {
      if (this.filterKategori && !this.kategoriTersedia.includes(this.filterKategori)) this.filterKategori = "";
    },
    items: {
      deep: true,
      handler() {
        if (this.editingId && !this.items.some(x => x.id === this.editingId)) this.cancelForm();
      }
    }
  },
  methods: {
    emptyForm() { return { kode: "", judul: "", kategori: "", upbjj: "", lokasiRak: "", harga: "", qty: "", safety: "", catatanHTML: "" }; },
    rupiah(value) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value) || 0); },
    resetFilter() { this.filterUpbjj = ""; this.filterKategori = ""; this.filterStok = "semua"; this.sortBy = "judul"; this.sortDirection = 1; this.keyword = ""; },
    changeSort(field) { if (this.sortBy === field) this.sortDirection *= -1; else { this.sortBy = field; this.sortDirection = 1; } },
    openAdd() { this.form = this.emptyForm(); this.editingId = null; this.showForm = true; },
    openEdit(item) { this.form = { ...item }; this.editingId = item.id; this.showForm = true; },
    cancelForm() { this.showForm = false; this.editingId = null; this.form = this.emptyForm(); },
    submitForm() {
      const f = this.form;
      if (!f.kode.trim() || !f.judul.trim() || !f.kategori || !f.upbjj || !f.lokasiRak.trim() ||
          f.harga === "" || f.qty === "" || f.safety === "" || Number(f.harga) <= 0 ||
          Number(f.qty) < 0 || Number(f.safety) < 0) {
        alert("Lengkapi seluruh data. Harga harus lebih dari 0, sedangkan stok dan safety stock tidak boleh negatif.");
        return;
      }
      const payload = { ...f, kode: f.kode.trim(), judul: f.judul.trim(), lokasiRak: f.lokasiRak.trim(),
        harga: Number(f.harga), qty: Number(f.qty), safety: Number(f.safety),
        catatanHTML: f.catatanHTML || "Tidak ada catatan." };
      if (this.editingId) this.$emit("update-stock", { ...payload, id: this.editingId });
      else this.$emit("add-stock", payload);
      this.cancelForm();
    },
    askDelete(item) {
      const accepted = window.confirm("Yakin ingin menghapus bahan ajar " + item.judul + "?");
      if (accepted) this.$emit("delete-stock", item.id);
    }
  },
  template: `
    <div>
      <div class="stats">
        <div class="stat-card"><span>Total jenis bahan ajar</span><strong>{{ totalJenis }}</strong></div>
        <div class="stat-card"><span>Stok menipis</span><strong>{{ totalMenipis }}</strong></div>
        <div class="stat-card"><span>Stok kosong</span><strong>{{ totalKosong }}</strong></div>
      </div>
      <section class="panel">
        <div class="panel-head">
          <div><h2>Daftar Stok Bahan Ajar</h2><p class="panel-subtitle">Data dummy dari file JSON. Arahkan kursor ke status untuk melihat catatan.</p></div>
          <button class="btn btn-primary" @click="openAdd">＋ Tambah Bahan Ajar</button>
        </div>
        <div class="toolbar">
          <div class="field"><label>Cari kode / nama</label><input v-model.trim="keyword" placeholder="Cari bahan ajar..."></div>
          <div class="field"><label>UT-Daerah</label><select v-model="filterUpbjj"><option value="">Semua UT-Daerah</option><option v-for="u in upbjjList" :key="u" :value="u">{{ u }}</option></select></div>
          <div class="field"><label>Kategori</label><select v-model="filterKategori" :disabled="!filterUpbjj"><option value="">Semua kategori</option><option v-for="k in kategoriTersedia" :key="k" :value="k">{{ k }}</option></select></div>
          <div class="field"><label>Kondisi stok</label><select v-model="filterStok"><option value="semua">Semua stok</option><option value="menipis">Menipis</option><option value="kosong">Kosong</option><option value="reorder">Perlu reorder (qty &lt; safety)</option></select></div>
          <button class="btn btn-light" @click="resetFilter">Reset filter</button>
        </div>
        <div class="toolbar">
          <div class="field"><label>Urutkan berdasarkan</label><select v-model="sortBy"><option value="judul">Judul</option><option value="qty">Jumlah stok</option><option value="harga">Harga</option></select></div>
          <button class="btn btn-outline" @click="sortDirection *= -1">{{ sortDirection === 1 ? "Naik ↑" : "Turun ↓" }}</button>
          <span class="muted">Menampilkan {{ filteredItems.length }} dari {{ items.length }} data</span>
        </div>

        <div v-if="showForm" class="detail-box">
          <h3>{{ editingId ? "Edit Data Bahan Ajar" : "Tambah Bahan Ajar Baru" }}</h3>
          <form class="form-grid" @submit.prevent="submitForm">
            <div class="field"><label>Kode mata kuliah *</label><input v-model.trim="form.kode" required placeholder="Contoh: MSIM4301"></div>
            <div class="field"><label>Nama mata kuliah *</label><input v-model.trim="form.judul" required></div>
            <div class="field"><label>Kategori *</label><select v-model="form.kategori" required><option value="">Pilih kategori</option><option v-for="k in kategoriList" :key="k">{{ k }}</option></select></div>
            <div class="field"><label>UT-Daerah *</label><select v-model="form.upbjj" required><option value="">Pilih UT-Daerah</option><option v-for="u in upbjjList" :key="u">{{ u }}</option></select></div>
            <div class="field"><label>Lokasi rak *</label><input v-model.trim="form.lokasiRak" required placeholder="A-01-01"></div>
            <div class="field"><label>Harga (Rp) *</label><input v-model.number="form.harga" type="number" min="1" required></div>
            <div class="field"><label>Jumlah stok *</label><input v-model.number="form.qty" type="number" min="0" required></div>
            <div class="field"><label>Safety stock *</label><input v-model.number="form.safety" type="number" min="0" required></div>
            <div class="field full"><label>Catatan status</label><input v-model.trim="form.catatanHTML" placeholder="Catatan untuk tooltip status"></div>
            <div class="full actions"><button type="submit" class="btn btn-primary">{{ editingId ? "Simpan Perubahan" : "Simpan Data" }}</button><button type="button" class="btn btn-outline" @click="cancelForm">Batal</button></div>
          </form>
          <small class="muted">Tekan Enter pada salah satu input untuk menyimpan formulir.</small>
        </div>

        <div class="table-wrap">
          <table>
            <thead><tr><th>No.</th><th>Kode / Nama Mata Kuliah</th><th>Kategori</th><th>UT-Daerah</th><th>Lokasi Rak</th><th>Harga</th><th>Jumlah Stok</th><th>Safety Stock</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              <tr v-for="(item,index) in filteredItems" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td><span class="cell-title">{{ item.kode }}</span><span class="cell-sub">{{ item.judul }}</span></td>
                <td>{{ item.kategori }}</td><td>{{ item.upbjj }}</td><td>{{ item.lokasiRak }}</td>
                <td>{{ rupiah(item.harga) }}</td><td>{{ item.qty }} buah</td><td>{{ item.safety }} buah</td>
                <td><status-badge :qty="item.qty" :safety="item.safety" :note="item.catatanHTML"></status-badge></td>
                <td><div class="actions"><button class="btn btn-light btn-small" @click="openEdit(item)">Edit</button><button class="btn btn-danger btn-small" @click="askDelete(item)">Hapus</button></div></td>
              </tr>
              <tr v-if="filteredItems.length === 0"><td colspan="10" class="empty-state">Data tidak ditemukan. Ubah atau reset filter.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `
});
