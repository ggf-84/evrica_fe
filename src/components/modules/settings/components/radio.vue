<script>
export default {
  props: {
    label: { type: String, default: '' },
    type: { type: String, default: 'boolean' },
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: { type: [Number, String], default: 0 }
  },
  template: `<div class="form-group">
      <label>{{label}}</label>
        <div v-for="(item,key) in  items">
          <input
          :id="key"
          v-bind:value="item.id"
          v-model="model"
          class="input"
          type="radio"
          />
          <label :for="key">{{item.value}}</label>

        </div>
        </div>`,
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
