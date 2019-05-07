<template>
 <div class="search">
    <input type="text" :placeholder="schema.placeholder ? schema.placeholder : ''" :class="schema.class ? schema.class : ''" 
    v-model="key"/>
    <router-link v-if="key && filter" :to="{ path: '/search/' + key + '/' + filter }" ><button class="search-button"> </button></router-link>
    <button v-else plain @click="emptyKey" class="search-button" 
    :style="{ 'background-image': 'url(' + require('@/assets/img/search.png') + ')' }"></button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'

export default {
  name: 'dynamicsearch',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {
      key: '',
      filter: ''
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
    }
  },
  components: {},
  methods: {
    emptyKey () {
      this.$notify.error({
        title: 'Empty field',
        message: 'Please fill the field and try again! Write minimum 3 characters',
        position: 'bottom-right'
      })
    },
    base64_encode (stringToEncode) {
      var encodeUTF8string = function (str) {
        return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes (match, p1) {
            return String.fromCharCode('0x' + p1)
          })
      }

      var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      var o1
      var o2
      var o3
      var h1
      var h2
      var h3
      var h4
      var bits
      var i = 0
      var ac = 0
      var enc = ''
      var tmpArr = []

      if (!stringToEncode) {
        return stringToEncode
      }

      stringToEncode = encodeUTF8string(stringToEncode)

      do {
        // pack three octets into four hexets
        o1 = stringToEncode.charCodeAt(i++)
        o2 = stringToEncode.charCodeAt(i++)
        o3 = stringToEncode.charCodeAt(i++)

        bits = o1 << 16 | o2 << 8 | o3

        h1 = bits >> 18 & 0x3f
        h2 = bits >> 12 & 0x3f
        h3 = bits >> 6 & 0x3f
        h4 = bits & 0x3f

        // use hexets to index into b64, and append result to encoded string
        tmpArr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
      } while (i < stringToEncode.length)

      enc = tmpArr.join('')

      var r = stringToEncode.length % 3

      return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
    }
  },
  created: function () {
    this.filter = this.base64_encode(this.schema.searchBy)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search input {
  height: 25px;
}

.search {
  width: 600px;
}
.search input {
  outline: none;
  background-color: #68707a;
  height: 33px!important;
  width: 87%;
  border: none;
  padding: 0 42px 0 10px;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  color: #fff;
}
.search-button {
  height: 30px;
  width: 30px;
  border: none;
  padding: 10px;
  margin-left: -43px;
}
.el-notification{
  top: 100px!important;
  z-index: 99999999999!important;
}
::placeholder {
    color: #cfcfcf;
    opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
   color: #cfcfcf;
}

::-ms-input-placeholder { /* Microsoft Edge */
   color: #cfcfcf;
}
</style>
