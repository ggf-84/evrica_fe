<script>
export default {
  props: {
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    multiple: { type: Boolean, default: false },
    value: {
      type: [Array, Number, String],
      default: function () {
        return this.multiple ? [] : ''
      }
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      localValue: this.value
    }
  },
  template: `<div class="form-group"><label>{{label}}</label>
      <div>
          <select v-model="model" :multiple="multiple">
            <option disabled value=""></option>
            <option
            v-for="item in items"
            v-bind:value='item.id'>
            {{item.value}}
            </option>
          </select>
      </div>
      </div>`,
  computed: {
    model: {
      get () {
        return !this.value ? [] : this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
