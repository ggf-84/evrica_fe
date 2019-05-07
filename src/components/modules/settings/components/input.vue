 <script>
export default {
  props: {
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    value: { type: String, default: '' }
  },
  template: `<div class="form-group">
      <label>{{label}} </label>
        <div>
          <input
          v-bind:value="value"
          v-on:input="updateValue($event.target.value)"
          class="input" />
        </div>
        </div>`,
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  }
}
</script>
