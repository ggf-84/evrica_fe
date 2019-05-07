<template>
<div>
<input type="text" v-if="options.key" v-bind:value="fetchFromObject(value,options.key)" 
  :disabled="schema.disabled" v-on:input="schema.disabled ? '' : updateValue($event.target.value)">
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'

export default {
  name: 'dynamicinput',
  computed: {
    returnOptions: function () {
      if (this.options != null) {
        return this.options
      }
      return {}
    },
    ...mapGetters(['getSchema', 'getMetaDataErrors'])
  },
  data () {
    return {}
  },
  mixins: [helper],
  props: {
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    },
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

  input {
    width:100%;
  }
</style>
