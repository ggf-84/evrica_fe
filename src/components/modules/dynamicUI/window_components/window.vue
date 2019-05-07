<template>
<div>

  <div class="page"  v-for="(window, index) in getSchema" v-bind:key="index">

    <header>
      <!--Page title-->
      <h4 v-if="window.title">{{window.title}}</h4>
      <!--Page menus-->
      <dynamicMenu v-for="(menu, index) in window.menus" v-bind:key="index" :schema="menu"/>
    </header>

    <main>
      <dynamicBody :schema="window.elements" :id="id"/>
    </main>

    <div class="schema">
          <pre>{{window}}</pre>
    </div>

  </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dynamicMenu from '../window_components/menu.vue'
import dynamicBody from '../window_components/body.vue'

export default {
  name: 'WindowUI',
  computed: mapGetters(['getSchema', 'getMetaDataErrors', 'getCurrentWindow']),
  data () {
    return {}
  },
  components: {
    dynamicMenu,
    dynamicBody
  },
  props: {
    entity: { type: String, default: '' },
    id: { type: String, default: '0' }
  },
  mounted: function () {},
  created: function () {
    if (this.getCurrentWindow !== this.entity) {
      this.$store.dispatch('setCurrentWindow', this.entity)
    }
  },
  methods: {},
  watch: {
    $route () {
      if (this.getCurrentWindow !== this.entity) {
        this.$store.dispatch('setCurrentWindow', this.entity)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.schema {
  height: 300px;
  overflow: scroll;
  text-align: left;
}
.errorsLog {
  height: 300px;
  overflow: scroll;
  text-align: left;
}
</style>
