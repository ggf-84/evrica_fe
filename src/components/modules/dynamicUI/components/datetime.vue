<template>
<div>
<!-- <datetime :type="getType()" :format="{ year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' }" v-model="model"></datetime>
 -->
 <el-date-picker
      v-model="model"
      :type="type"
      placeholder="Select date and time"
      :value-format="valueformat">
    </el-date-picker>
 </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'
// import datepicker
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

// set language
locale.use(lang)

export default {
  name: 'dynamicdatetime',
  computed: {
    model: {
      get () {
        let value = this.fetchFromObject(this.value, this.options.key)
        return !value ? '' : value
      },
      set (val) {
        this.setValueToObject(this.value, this.options['key'], val)

        this.$emit('input', this.value)
      }
    },
    returnOptions: function () {
      if (this.options != null) {
        return this.options
      }
      return ''
    },
    ...mapGetters(['getSchema', 'getMetaDataErrors'])
  },
  data () {
    return {
      valueformat: 'yyyy-MM-dd HH:mm:ss',
      type: 'datetime'
    }
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
  components: {
  },
  methods: {
    getType: function () {
      let type = this.returnOptions.metadata.field.type
      if (type === 'date' || type === 'datetime') {
        this.type = type
      } else {
        this.valueformat = 'timestamp'
      }
    },
    updateValue: function (value) {
      this.setValueToObject(this.value, this.returnOptions['key'], value)
      this.$emit('input', this.value)
    }
  },
  construct: function () {
   // this.getType()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  input {
    width:100%;
  }
</style>
