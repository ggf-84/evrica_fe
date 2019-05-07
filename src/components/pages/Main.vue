<template>
<div>
  <div class="hello">
    <language/>
    <h1>Welcome to Dashboard</h1>
    <router-link :to="{ path: '/page/maincrm' }">Main Page</router-link>
    <router-link :to="{ path: '/chat' }">Chat</router-link>
    <router-link :to="{ path: '/pm' }">PM</router-link>
    <router-link :to="{ path: '/DataExchange' }">Data Exchange</router-link>
    <p>{{content}}</p>
    {{setUserData()}}
  </div>
  </div>
</template>

<script>
import api from '../../store/utils/api'
import language from '../modules/settings/language.vue'

export default {
  name: 'Main',
  data () {
    return {
      content: null
    }
  },
  components: {
    language
  },
  methods: {
    testRequest: function () {
      api.get('auth/user').then(response => {
        this.content = response.user
      })
    },
    setUserData: function () {
      this.$store.dispatch('setCurrentUser', {})
      .then(response => {})
      this.setEmojis()
    },
    setEmojis: function () {
      this.$store.dispatch('setCurrentEmoji', {})
      .then(response => {})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
