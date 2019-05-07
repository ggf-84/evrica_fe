<template>
<div>
  <div class="hello">
    <language/>
    <h2>Settings</h2>
    <settings></settings>
  </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import settings from '../modules/settings/settings'
import language from '../modules/settings/language'

export default {
  computed: mapGetters(['allSettings']),
  name: 'Settings',
  data () {
    return {}
  },
  components: {
    settings,
    language
  },
  methods: {}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
