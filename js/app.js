(async function initSITTA() {
  try {
    const initialData = await SITTAApi.getInitialData();
    new Vue({
      el: "#app",
      data: {
        tab: "stok",
        stocks: initialData.stocks,
        upbjjList: initialData.upbjjList,
        kategoriList: initialData.kategoriList,
        paketList: initialData.paketList,
        orders: initialData.orders,
        modal: { 
          show:false, 
          title:"", 
          message:"", 
          confirmText:"Ya, lanjutkan", 
          action:null 
        },
        toast: "",
        toastTimer: null
      },
      computed: {
        sapaan() {
          const jam = new Date().getHours();
          if (jam >= 5 && jam < 11) return "Selamat Pagi";
          if (jam >= 11 && jam < 15) return "Selamat Siang";
          if (jam >= 15 && jam < 18) return "Selamat Sore";
          return "Selamat Malam";
        },
        tanggalHariIni() {
          return new Date().toLocaleDateString("id-ID", { 
            weekday:"long", 
            day:"numeric", 
            month:"long", 
            year:"numeric" 
          });
        },
        tahun() { return 
          new Date().getFullYear(); 
        }
      },
      methods: {
        notify(message) {
          this.toast = message;
          if (this.toastTimer) clearTimeout(this.toastTimer);
          this.toastTimer = setTimeout(() => { this.toast = ""; }, 2600);
        },
        addStock(item) {
          const nextId = this.stocks.length ? Math.max(...this.stocks.map(x => x.id)) + 1 : 1;
          this.stocks.push({ ...item, id:nextId });
          this.notify("Data bahan ajar berhasil ditambahkan.");
        },
        updateStock(item) {
          const index = this.stocks.findIndex(x => x.id === item.id);
          if (index !== -1) this.$set(this.stocks, index, item);
          this.notify("Data bahan ajar berhasil diperbarui.");
        },
        deleteStock(id) {
          this.stocks = this.stocks.filter(x => x.id !== id);
          this.notify("Data bahan ajar berhasil dihapus.");
        },
        saveOrder(formData) {
          const year = new Date().getFullYear();
          const sequence = this.orders.filter(o => o.nomor.startsWith("DO" + year + "-")).length + 1;
          const nomor = "DO" + year + "-" + String(sequence).padStart(3, "0");
          const paket = formData.paketData;
          this.orders.unshift({
            nomor, nim:formData.nim, nama:formData.nama, ekspedisi:formData.ekspedisi,
            paket:paket.kode, paketNama:paket.nama, tanggalKirim:formData.tanggalKirim,
            total:paket.harga, riwayat:[{ waktu:new Date().toISOString(), keterangan:"Delivery order dibuat dan pesanan diterima" }]
          });
          this.tab = "tracking";
          this.notify("Delivery order " + nomor + " berhasil dibuat.");
        },
        addProgress(payload) {
          const order = this.orders.find(o => o.nomor === payload.nomor);
          if (!order) return;
          order.riwayat.push({ waktu:new Date().toISOString(), keterangan:payload.keterangan });
          this.notify("Progress pengiriman berhasil ditambahkan.");
        },
        confirmModal() {
          if (typeof this.modal.action === "function") this.modal.action();
          this.modal.show = false;
        }
      }
    });
  } catch (error) {
    document.getElementById("app").innerHTML =
      '<main style="font-family:Arial;padding:32px;color:#9b2525"><h2>Data SITTA gagal dimuat</h2><p>' +
      error.message + '</p><p>Pastikan website dijalankan melalui server web (bukan membuka index.html langsung) dan file data/dataBahanAjar.json tersedia.</p></main>';
    console.error(error);
  }
})();
