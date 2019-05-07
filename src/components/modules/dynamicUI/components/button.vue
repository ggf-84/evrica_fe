<template>
  <span>
    <button type="button" v-on:click="makeAction()" :class="schema.class ? schema.class : ''">
      <img v-if="schema['top-icon']" v-bind:src="require( '@/'+schema['top-icon'])" class="top-icon">
      <img v-if="schema['left-icon']" v-bind:src="require( '@/'+schema['left-icon'])" class="left-icon">
      {{schema.value}}
      <img v-if="schema['right-icon']" v-bind:src="require( '@/'+schema['right-icon'])" class="right-icon">
      <img v-if="schema['bottom-icon']" v-bind:src="require( '@/'+schema['bottom-icon'])" class="bottom-icon">
    </button>
    <dynamictooltip v-if="showtooltip && schema.tooltip" :schema="schema.tooltip.root" :id="id"/>
  </span>
</template>

<script>
import helper from '../components/utils/HelperDynamicUI'
import dynamictooltip from '../components/tooltip'

export default {
  name: 'dynamicbutton',
  mixins: [helper],
  computed: {
    getSchema: function () {
      if (this.schema != null) {
        return this.schema
      }
      return {}
    },
    getValue: function () {
      if (this.value != null) {
        return this.value
      }
      return {}
    }
  },
  data () {
    return {
      showtooltip: false
    }
  },
  props: {
    schema: {
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
  components: { dynamictooltip },
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
    showTooltip () {
      this.showtooltip = !this.showtooltip
    },
    badgeEvent (event) {
      let data = {
        event: 'badgeEvent',
        eventType: event,
        data: { message: 'test Event' }
      }

      // send loadBoardLists to ws
      this.$socket.json.send(data)
    },
    makeAction: function () {
      var schema = this.getSchema
      if (schema.action) {
        if (schema.action.type) {
          // switch type of button actions
          switch (schema.action.type) {
            case 'submit':
              this.actionSubmit()
              break
            case 'request':
              this.actionRequest()
              break
            case 'nav':

              if (schema.action.target && schema.action.target === 'current') {
                this.$router.push({ path: '/' + schema.action.link })
              } else if (schema.action.target && schema.action.target === 'back') {
                this.actionBack()
              } else if (schema.action.target && schema.action.target === 'modal') {
                this.actionModal()
              } else {
                this.actionNew()
              }

              break
          }
        }
      }

      if (schema.event) {
        this.badgeEvent(schema.event)
      }
    },
    actionModal: function () {
      console.log('Action modal!')
    },
    parseUrlParams: function (obj, prop) {
      let matches = this.matchVariables(prop)
      let url = prop
      if (matches) {
        matches.forEach(element => {
          let value = this.fetchFromObject(obj, element.replace('$', ''))
          if (value) {
            url = url.replace(element, value)
          }
        })
      }
      return url
    },
    actionSubmit: function () {
      let schema = this.getSchema

      if (!schema.action.url) {
        console.log('Action url not set for submit!')
        return null
      }
      var self = this
      // Convert & filter data before send

      this.convertDataBeforeSend(this.getValue)
      // Send submit acction
      this.$http[schema.action.method.toLowerCase()](
        this.parseUrlParams(this.getValue, schema.action.url),
        this.getValue
      ).then(
        response => {
          self.afterEvent(schema.action.onsuccess, response)
        },
        error => {
          alert(error.data.message)
        }
      )
    },
    actionRequest: function () {
      let schema = this.getSchema

      if (!schema.action.url) {
        console.log('Action url not set for submit!')
        return null
      }
      // convert path for action
      let path = this.parseUrlParams(this.getValue, schema.action.url)
      var self = this
      // make request with generated path and default
      this.$http[schema.action.method.toLowerCase()](path).then(response => {
        self.afterEvent(schema.action.onsuccess, response)
      })
    },
    ReplaceParameterFromUrl (url, parameter, value) {
      return url
        .replace(new RegExp('[?&]' + parameter + '=[^&#]*(#.*)?$'), '/' + value)
        .replace(new RegExp('([?&])' + parameter + '=[^&]*&'), '/' + value)
    },
    // execute after event
    afterEvent: function (action, response) {
      if (action.type === 'nav') {
        if (action.linktype === 'window') {
          if (!action.link) return null
          let path = action.link
          // check if success url contain result values
          if (
            action.link.indexOf('result') > -1 &&
            action.link.indexOf('?') > -1
          ) {
            path = this.ReplaceParameterFromUrl(
              action.link,
              'id',
              this.fetchFromObject(response.data.data, 'id')
            )
          }

          // redirect to link
          this.$router.push({ path: '/page/' + path })
        }
      } else {
        console.log('another')
      }
    },
    parseResponseParams (url, response) {
      console.log()
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

</style>
