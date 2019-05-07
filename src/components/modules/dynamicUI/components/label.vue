<template>
  <div>
    <span :class="schema.class?schema.class:''" @click="schema.tooltip ? showTooltip() : ''">
      <img v-if="schema['top-icon']" v-bind:src="require( '@/'+schema['top-icon'])" class="top-icon">
      <img v-if="schema['left-icon']" v-bind:src="require( '@/'+schema['left-icon'])" class="left-icon">

      <span v-if="schema.value && schema.type && prop" :class="schema.class?schema.class:''">{{parseVars(schema.value, prop)}}</span>

      <img v-if="schema['right-icon']" v-bind:src="require( '@/'+schema['right-icon'])" class="right-icon">
      <img v-if="schema['bottom-icon']" v-bind:src="require( '@/'+schema['bottom-icon'])" class="bottom-icon">
    </span>
   <dynamictooltip v-if="showtooltip && schema.tooltip" :schema="schema.tooltip.root" :id="id"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'
import dynamictooltip from '../components/tooltip'

export default {
  name: 'dynamiclabel',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {
      showtooltip: false
    }
  },
  mixins: [
    helper
  ],
  props: {
    prop: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
    },
    id: {
      type: String,
      default: '0'
    }
  },
  components: {dynamictooltip},
  methods: {
    showTooltip () {
      this.showtooltip = !this.showtooltip
    },
    parseVars (value, prop) {
      let template = value
      let rawVariables = this.matchVariables(template)

      if (!rawVariables) return template
      // each variable
      rawVariables.forEach(element => {
        let keys = element.split('.')
        let val = prop[keys[(keys.length - 1)]] ? prop[keys[(keys.length - 1)]] : (prop.i18n && prop.i18n[keys[(keys.length - 1)]] ? prop.i18n[keys[(keys.length - 1)]] : '')
        // remplace each variable
        template = template.replace(element, val)
      })

      return template
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-icon, .bottom-icon{
  display: table;
  margin: 0 auto;
}
.position-left{
  float: left;
}
.position-right{
  float: right;
}
.position-center{
  margin: 0 auto;
}
.both{
  clear: both;
}
</style>
