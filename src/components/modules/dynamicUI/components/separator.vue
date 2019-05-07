<template>
  <hr :align="schema.align ? schema.align : ''" :width="schema.width ? schema.width : '100%'" :style="{height:schema.height,'background-color':schema.color}" />
</template>
 
<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'

export default {
  name: 'dynamicseparator',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {}
  },
  mixins: [
    helper
  ],
  props: {
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr {
    margin: 10px 0;
    position: relative;
    display: inline-block;
}
</style>
