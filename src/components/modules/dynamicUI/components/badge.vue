<template>
  <div :class="schema.class?schema.class:''">
    <span v-if="isLoad" class="badge-label" :class="schema.class?schema.class:''" @click="hideCount(schema.event)">
      <img v-if="schema['top-icon']" v-bind:src="require( '@/'+schema['top-icon'])" class="top-icon">
      <img v-if="schema['left-icon']" v-bind:src="require( '@/'+schema['left-icon'])" class="left-icon">

      <span v-if="schema.value && schema.type" :class="schema.class?schema.class:''">
        {{parseVars(schema.value, false)}}
      </span>

      <span v-if="schema.badge && schema.event && badge[schema.event]" class="badge" >{{ badge[schema.event] }}</span>

      <img v-if="schema['right-icon']" v-bind:src="require( '@/'+schema['right-icon'])" class="right-icon">
      <img v-if="schema['bottom-icon']" v-bind:src="require( '@/'+schema['bottom-icon'])" class="bottom-icon">
    </span>
  </div>
</template>
 
<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'

export default {
  name: 'dynamicbadge',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {
      badge: {},
      isActive: false,
      events: {},
      isLoad: false
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
    }
  },
  components: {},
  sockets: {
    disconnect: function () {},
    message: function (msg) {
      // console.log('msgg: ', msg)
      // call function on message
      if (this.events && this.events[msg.event]) {
        this.events[msg.event](msg, this)
      }
    }
  },
  methods: {
    init () {
      if (this.schema.type === 'badge') {
        var self = this
        if (this.schema.event) {
          self.$http.get('events').then(function (response) {
            Object.values(response.data.data).forEach(el => {
              self.badge[el.event] = 0
              self.badge = Object.assign({}, self.badge)
            })

            self.$http.get(self.schema.badge).then(function (response) {
              self.badge[self.schema.event] = response.data.data
              self.events = self.setEvents(self.badge)
              self.isLoad = true
            })
          })
        }
      }
    },
    setEvents (arr) {
      var events = {}
      Object.keys(arr).forEach(event => {
        events[event] = (data, self) => {
          self.badge[event] += 1
        }

        events = Object.assign({}, events)
      })

      return events
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
    },
    hideCount (event) {
      this.badge[event] = 0
      this.isActive = !this.isActive
    }
  },
  created () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.badge-label {
  cursor: pointer;
  margin-left: 8px;
}

.top-icon, .bottom-icon{
  display: table;
  margin: 0 auto;
}
.badge{
    padding: 1px 3px;
    border: 1px solid #ce4141;
    background: #ce4141;
    color: #fff;
    border-radius: 50%;
    font-size: 11px;
    position: absolute;
    top: -10px;
    right: -6px;
    z-index: 99999;
}
.menu{
    position: absolute;
    top: 16px;
    left: 0
}
</style>
