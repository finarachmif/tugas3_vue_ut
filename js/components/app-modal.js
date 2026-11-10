Vue.component("app-modal", {
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: "Konfirmasi" },
    message: { type: String, default: "" },
    confirmText: { type: String, default: "Ya, lanjutkan" }
  },
  template: `
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')" role="presentation">
      <section class="modal" role="dialog" aria-modal="true" :aria-label="title">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="$emit('close')">Batal</button>
          <button class="btn btn-primary" @click="$emit('confirm')">{{ confirmText }}</button>
        </div>
      </section>
    </div>
  `
});
