<template>
<div>
<input type="radio" :id="options.key+'1'" v-if="options.key" :name="options.key" value="1" v-model="model" >
<label :for="options.key+'1'">True</label>
<input type="radio" :id="options.key+'2'" v-if="options.key" :name="options.key" value="0" v-model="model" >
<label :for="options.key+'2'">False</label>
</div>

</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'

export default {
  name: 'dynamicradio',
  computed: {
    returnOptions: function () {
      if (this.options != null) {
        return this.options
      }
      return 0
    },
    ...mapGetters(['getSchema', 'getMetaDataErrors']),
    model: {
      get () {
        let value = this.fetchFromObject(this.value, this.returnOptions['key'])
        return !value ? 0 : parseInt(value)
      },
      set (val) {
        this.setValueToObject(this.value, this.returnOptions['key'], parseInt(val))
        this.$emit('input', this.value)
      }
    }
  },
  data () {
    return {}
  },
  mixins: [helper],
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {},
  methods: {
    updateValue: function (value) {
      this.setValueToObject(this.value, this.returnOptions['key'], value)
      this.$emit('input', this.value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
