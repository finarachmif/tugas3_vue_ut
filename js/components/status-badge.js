Vue.component("status-badge", {
  props: { 
    qty: { 
      type: Number, 
      required: true 
    }, 
    safety: { 
      type: Number, 
      required: true 
    }, 
    note: { 
      type: String, 
      default: "" 
    }
  },
  computed: {
    statusInfo() {
      if (Number(this.qty) === 0) 
        return { 
          label: "Kosong", 
          icon: "●", 
          className: "status-empty" 
        };
      if (Number(this.qty) < Number(this.safety)) 
        return { 
          label: "Menipis", 
          icon: "▲", 
          className: "status-low" 
        };
      return { 
        label: "Aman", 
        icon: "●", 
        className: "status-safe" 
      };
    }
  },
  template: `
    <span class="status" :class="statusInfo.className" :title="note">
      {{ statusInfo.icon }} {{ statusInfo.label }}
    </span>
  `
});
