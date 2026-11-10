Vue.component("order-form", {
  props: { 
    upbjjList: { 
      type: Array, required: true 
    }, 
    paketList: { 
      type: Array, required: true 
    } 
  },
  data() {
    return { 
      form: { 
        nim:"", 
        nama:"", 
        ekspedisi:"", 
        paket:"", 
        tanggalKirim:new Date().toISOString().slice(0,10) 
      }, 
      error:"" 
    };
  },
  computed: {
    paketDipilih() { 
      return this.paketList.find(p => p.kode === this.form.paket) || null; 
    },
    daftarEkspedisi() { 
      return ["JNE Regular (3-5 Hari)","JNE Express (1-2 Hari)"]; 
    }
  },
  watch: {
    "form.paket"(newValue) { 
      if (newValue && !this.paketList.some(p => p.kode === newValue)) 
        this.form.paket = ""; 
    },
    "form.ekspedisi"(newValue) { 
      if (newValue && !this.daftarEkspedisi.includes(newValue)) 
        this.form.ekspedisi = ""; 
    }
  },
  methods: {
    rupiah(value) { 
      return new Intl.NumberFormat("id-ID", { 
        style:"currency", 
        currency:"IDR", 
        maximumFractionDigits:0 }).format(value); 
    },
    formatDate(value) { 
      return new Date
        (value + "T00:00:00").toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" }); 
    },
    submit() {
      this.error = "";
      if (!this.form.nim.trim() || !this.form.nama.trim() || !this.form.ekspedisi || !this.paketDipilih || !this.form.tanggalKirim) {
        this.error = "Semua kolom wajib diisi."; return;
      }
      if (!/^[0-9]{8,15}$/.test(this.form.nim.trim())) { 
        this.error = "NIM harus terdiri dari 8 sampai 15 angka."; 
        return; 
      }
      this.$emit("save-order", { 
        ...this.form, 
        nim:this.form.nim.trim(), 
        nama:this.form.nama.trim(), 
        paketData:this.paketDipilih 
      });
      this.form = { 
        nim:"", 
        nama:"", 
        ekspedisi:"", 
        paket:"", 
        tanggalKirim:new Date().toISOString().slice(0,10) 
      };
    }
  },
  template: `
    <section class="panel">
      <div class="panel-head">
        <div><h2>Tambah Delivery Order</h2>
          <p class="panel-subtitle">Nomor DO dibuat otomatis berdasarkan tahun dan nomor urut.</p>
        </div>
      </div>
    <form @submit.prevent="submit">
      <div class="form-grid">
        <div class="field"><label>NIM *</label>
        <input v-model.trim="form.nim" required inputmode="numeric" placeholder="Masukkan NIM"></div>
          <div class="field"><label>Nama mahasiswa *</label>
            <input v-model.trim="form.nama" required placeholder="Nama lengkap"></div>
          <div class="field"><label>Ekspedisi *</label>
            <select v-model="form.ekspedisi" required><option value="">Pilih ekspedisi</option><option v-for="e in daftarEkspedisi" :key="e" :value="e">{{ e }}</option></select></div>
          <div class="field"><label>Paket bahan ajar *</label>
            <select v-model="form.paket" required>
            <option value="">Pilih paket</option>
            <option v-for="p in paketList" :key="p.kode" :value="p.kode">{{ p.kode }} - {{ p.nama }}</option>
            </select>
          </div>
          <div class="field"><label>Tanggal kirim *</label>
          <input v-model="form.tanggalKirim" type="date" required></div>
        </div>
        <div v-if="paketDipilih" class="detail-box">
          <h3>Detail isi paket: {{ paketDipilih.nama }}</h3>
          <ul><li v-for="(isi,index) in paketDipilih.isi" :key="index">{{ isi }}</li></ul>
          <p><strong>Total harga: {{ rupiah(paketDipilih.harga) }}</strong></p>
        </div>
        <p v-if="error" class="status status-empty" role="alert">{{ error }}</p>
        <div class="actions" style="margin-top:16px">
        <button class="btn btn-primary" type="submit">Simpan Delivery Order</button></div>
      </form>
    </section>
  `
});
