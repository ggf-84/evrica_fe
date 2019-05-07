<template>
   <span >
    <a v-if="authorized" v-on:click="logout()">Logout</a>
  </span>
</template>

<script>
import language from '../../settings/language.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'dynamiclogin',
  computed: mapGetters(['authorized']),
  components: {
    language
  },
  methods: {
    logout () {
      localStorage.removeItem('vuex')
      this.$router.go('/page/main')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
