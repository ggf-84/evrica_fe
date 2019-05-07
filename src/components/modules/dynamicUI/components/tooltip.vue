<template>
  <div>
    <div class="tooltip" :style="{width:(schema.width ? schema.width : '')}">
      <span v-text="schema.value" @click="showTooltip()" :class="schema.class ? schema.class : ''"></span>
          <span v-if="showtooltip" class="tooltiptext"  :class="(schema.align && schema.align == 'up') ? 't-up' : 't-down'"
          :style="{'background-color':(schema.bgcolor ? schema.bgcolor : '#fff'), color:(schema.fcolor ? schema.fcolor : '#000') }" >
            <dynamicLayout :schema="schema.root" :id="id"/>
          </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dynamicLayout from '../window_components/layout'

export default {
  name: 'dynamictooltip',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
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
    id: {
      type: String,
      default: '0'
    }
  },
  components: dynamicLayout,
  methods: {
    showTooltip: function () {
      this.showtooltip = !this.showtooltip
    },
    closemodal: function () {
      this.showtooltip = false
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    padding: 2px;
    position: absolute;
    z-index: 99999;
    left: 50%;
    margin-left: -60px;
}

.tooltip .t-down {
   top: 100%;
}
.tooltip .t-up {
   bottom: 100%;
}
.tooltip .link{
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}
.tooltip .link:hover{
  text-decoration: none;
}
</style>
