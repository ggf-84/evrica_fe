<template>
  <div class="hello">
    <auth></auth>
    <!-- {{auth_error}} -->
  </div>
</template>

<script>

import auth from '../modules/auth/auth.vue'
import {mapGetters} from 'vuex'

export default {
  computed: mapGetters(['getToken', 'authorized', 'is_error', 'auth_error']),
  name: 'Auth',
  data () {
    return {
    }
  },
  components: {
    auth
  },
  mounted: function () {
   // console.log(this.getToken)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
