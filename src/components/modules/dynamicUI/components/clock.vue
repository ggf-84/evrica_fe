<template>
  <!-- <section >
    <p class="" v-text="currentTime"></p>
  </section> -->
  <div class="timeman-container planner-container am-pm-mode" >
    <div class="timeman-wrap planner-wrap" @click="schema.tooltip ? showTooltip() : ''">
        <span id="timeman-block" class="timeman-block"  >
            <span class="bx-time">
                <span class="time-hours" v-text="hour"></span>
                <span class="time-semicolon">:</span>
                <span class="time-minutes" v-text="minutes"></span>
                <span class="time-am-pm" v-text="timetype"></span>
            </span>
        </span>
    </div>
    <dynamictooltip v-if="showtooltip && schema.tooltip" :schema="schema.tooltip.root" :id="id"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'
import moment from 'moment'
import dynamictooltip from '../components/tooltip'

export default {
  name: 'dynamicclock',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {
      showtooltip: false,
      hour: null,
      minutes: null,
      timetype: null
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
  components: { dynamictooltip },
  methods: {
    showTooltip () {
      this.showtooltip = !this.showtooltip
    },
    updateCurrentTime: function updateCurrentTime () {
      this.hour = moment().format('h')
      this.minutes = moment().format('mm')
      this.timetype = (moment().format('LT')).slice(-2)
    }
  },
  created: function created () {
    var self = this

    this.hour = moment().format('h')
    this.minutes = moment().format('mm')
    this.timetype = (moment().format('LT')).slice(-2)
    setInterval(function () {
      return self.updateCurrentTime()
    }, 1 * 1000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body, html {
  width: 100%;
  height: 100%;
}

section.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 140px;
  background: transparent;
}

h3.is-3, p.time {
  color: white;
}

h3.is-3:not(:last-child) {
  margin: 0;
  padding: 0;
}

.time {
  font-size: 7em;
}

.shadow {
  text-shadow: 0 0 15px rgba(100, 100, 100, .35);
}

.header-whatch{
  font-size: 38px!important;
  font-family: inherit;
  line-height: 0;
  color:#fff!important;
  position:initial!important;
}
</style>

