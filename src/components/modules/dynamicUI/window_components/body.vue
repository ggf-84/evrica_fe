<template>
  <div class="body" v-if="schema" >
    <dynamicLayout :schema="schema.root" :id="id"/>
  </div>
</template>

<script>
import Vue from 'vue'
import dynamicLayout from '../window_components/layout.vue'
import Components from '../components'

Vue.component('dynamicLayout', dynamicLayout)
export default {
  name: 'dynamicBody',
  computed: {
    returnSchema: function () {
      if (this.schema != null) {
        return this.schema
      }

      return {}
    },
    returnId: function () {
      if (this.id != null) {
        return this.id
      }
    }
  },
  data () {
    return {}
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
  components: Components
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body {
  text-align: initial;
}
</style>
