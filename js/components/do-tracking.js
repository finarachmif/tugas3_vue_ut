Vue.component("do-tracking", {
  props: { orders: { type: Array, required: true } },
  data() { return { keyword: "", submittedKeyword: "", selectedOrder: null, progressText: "" }; },
  computed: {
    resultOrders() {
      if (!this.submittedKeyword) return this.orders;
      const q = this.submittedKeyword.toLowerCase();
      return this.orders.filter(o => o.nomor.toLowerCase().includes(q) || o.nim.toLowerCase().includes(q));
    }
  },
  watch: {
    submittedKeyword() { this.selectedOrder = null; },
    orders: { 
      deep: true, handler() { 
        if (this.selectedOrder) 
          this.selectedOrder = this.orders.find(o => o.nomor === this.selectedOrder.nomor) || null; 
      } 
    }
  },
  methods: {
    search() { 
      this.submittedKeyword = this.keyword.trim(); 
      this.selectedOrder = this.resultOrders[0] || null; 
    },
    clearSearch() { 
      this.keyword = ""; 
      this.submittedKeyword = ""; 
      this.selectedOrder = null; 
    },
    handleKey(event) { 
      if (event.key === "Enter") { 
        event.preventDefault(); 
        this.search(); 
      } 
      if (event.key === "Escape") 
        this.clearSearch(); 
    },
    formatDate(value) { 
      return new Date
        (value + "T00:00:00").toLocaleDateString("id-ID", { 
          day:"numeric", 
          month:"long", 
          year:"numeric" 
        }); 
    },
    formatDateTime(value) { 
      return new Date(value).toLocaleString("id-ID", { 
        dateStyle:"long", timeStyle:"short" 
      }); 
    },
    rupiah(value) { 
      return new Intl.NumberFormat("id-ID", { 
        style:"currency", 
        currency:"IDR", 
        maximumFractionDigits:0 }).format(value); 
    },
    addProgress() {
      if (!this.selectedOrder || !this.progressText.trim()) { 
        alert("Pilih delivery order dan isi keterangan progress."); 
        return; 
      }
      this.$emit("add-progress", { 
        nomor: this.selectedOrder.nomor, keterangan: this.progressText.trim() 
      });
      this.progressText = "";
    }
  },
  template: `
    <section class="panel">
      <div class="panel-head">
      <div><h2>Tracking Delivery Order</h2>
      <p class="panel-subtitle">Cari berdasarkan nomor DO. Tekan Enter untuk mencari dan Esc untuk menghapus pencarian.</p>
      </div>
    </div>
      <div class="toolbar">
        <div class="field">
        <label>Nomor DO / NIM</label>
        <input class="search-input" v-model="keyword" @keydown="handleKey" placeholder="Contoh: DO2026-001">
        </div>
        <button class="btn btn-primary" @click="search">Cari</button>
        <button class="btn btn-light" @click="clearSearch">Reset (Esc)</button>
      </div>
      <p class="muted">Ditemukan {{ resultOrders.length }} delivery order.</p>
      <div v-if="resultOrders.length">
        <article class="order-card" v-for="order in resultOrders" :key="order.nomor">
          <div class="panel-head">
            <div><h3>{{ order.nomor }}</h3>
            <div class="order-meta">
            <span>{{ order.nama }} (NIM {{ order.nim }})</span>
            <span>{{ order.ekspedisi }}</span>
            <span>{{ formatDate(order.tanggalKirim) }}</span>
          </div>
        </div>
            <button class="btn btn-light btn-small" @click="selectedOrder = selectedOrder && selectedOrder.nomor === order.nomor ? null : order">{{ selectedOrder && selectedOrder.nomor === order.nomor ? "Tutup detail" : "Lihat detail" }}</button>
          </div>
          <div v-if="selectedOrder && selectedOrder.nomor === order.nomor" class="detail-box">
            <p><strong>Paket:</strong> {{ order.paket }} - {{ order.paketNama }}</p>
            <p><strong>Total harga:</strong> {{ rupiah(order.total) }}</p>
            <h3>Riwayat perjalanan</h3>
            <div class="progress-list">
              <div class="progress-item" v-for="(r,i) in order.riwayat" :key="i"><strong>{{ r.keterangan }}</strong><small>{{ formatDateTime(r.waktu) }}</small></div>
            </div>
            <div class="toolbar">
              <div class="field"><label>Tambah keterangan progress</label><input v-model.trim="progressText" @keydown.enter.prevent="addProgress" placeholder="Contoh: Paket tiba di kantor UT-Daerah"></div>
              <button class="btn btn-primary" @click="addProgress">Tambah Progress</button>
            </div>
          </div>
        </article>
      </div>
      <div v-else class="empty-state">Tidak ada delivery order yang cocok dengan pencarian.</div>
    </section>
  `
});
