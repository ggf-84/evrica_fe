<template>
 <div>
    <dynamicmodalwindow v-if="showModal" :schema="schema.root" :id="id"></dynamicmodalwindow>
    <button id="show-modal" @click="openmodal" :class="schema.class ? schema.class : ''" class="modal-button">
      <img v-if="schema['top-icon']" v-bind:src="icon" class="top-icon">
      <img v-if="schema['left-icon']" v-bind:src="icon" class="left-icon">
      <span v-if="schema.value" :class="schema.class?schema.class:''">{{parseVars(schema.value, false)}}</span> 
      <img v-if="schema['right-icon']" v-bind:src="icon" class="right-icon">
      <img v-if="schema['bottom-icon']" v-bind:src="icon" class="bottom-icon">
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'
import dynamicmodalwindow from '../components/modalwindow'
import image from '@/assets/img/sandwich.png'

export default {
  name: 'dynamicmodal',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {
      icon: image,
      showModal: false
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
    id: {
      type: String,
      default: '0'
    }
  },
  components: {dynamicmodalwindow},
  methods: {
    openmodal: function () {
      this.showModal = !this.showModal
    },
    close: function () {
      this.$emit('close')
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
button .modal{
    background-color: #efefef!important;
    padding: 2px 6px!important;
}
button .modal:hover{
    background-color:#e9e9e9!important;
    padding: 2px 6px!important;
}
.modal-button{
    border: none;
    vertical-align: middle;
    background: transparent;
}
</style>
