<template>
<div>
  <div class="page">
    <windowUI v-if="getSchema" :schema="getSchema" :id="id" :entity="entity"/>
  </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import windowUI from '../modules/dynamicUI/window_components/window.vue'

export default {
  name: 'DynamicUI',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {
      content: 'Try dynamic UI'
    }
  },
  props: {
    entity: { type: String, default: '' },
    id: {type: String, default: '0'}
  },
  components: { windowUI },
  methods: {},
  created () {
    this.$store.dispatch('setCurrentWindow', this.entity)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
