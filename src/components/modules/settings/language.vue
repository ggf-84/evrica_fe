<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(['allSettings', 'getAvailableLanguages', 'authorized', 'getLanguage']),
  methods: {
    test () {
      // console.log(this.language)
    },
    setLanguage () {
      this.$store.dispatch('setCurrentLanguage', {language: this.language.id})
    }
  },
  data () {
    return {
      language: {id: 0}
    }
  },

  template: `<div class="language_config" v-if="language">
              <select v-model="language.id" v-on:change="setLanguage()">
                <option
                  v-for="item in getAvailableLanguages"
                  v-bind:value='item.id'>{{item.title}}
                </option>
              </select>
            </div>`,
  created () {
    // console.log(this.allSettings)
    if (this.authorized) {
      if (!this.getLanguage) {
        var self = this
        // Get list of languages for language switch
        this.$store.dispatch('getLanguagesList').then(() => {
          self.$store.dispatch('getCurrentLanguage').then(() => {
            self.language = self.getLanguage
          })
        })
      } else {
        this.language = this.getLanguage
      }
    }
  }
}
</script>
