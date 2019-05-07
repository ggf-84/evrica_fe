<template>
  <multiselect v-if="loaded" v-model="model" :options="items" trackBy="id" label="label"></multiselect>
</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'
import Vue from 'vue'
import Multiselect from 'vue-multiselect'
// register globally
Vue.component('multiselect', Multiselect)

export default {
  name: 'dynamicselect',
  computed: {
    model: {
      get () {
        let value = this.selectedItem

        if (
          value &&
          this.options.metadata.relation.select === 'single' &&
          value.id &&
          !value.label
        ) {
          value.label = this.parseVars(
            value,
            this.options.metadata.relation.short_view
          )
        }

        return !value ? {} : value
      },
      set (val) {
        // remove selected variables like state_id
        if (this.fetchFromObject(this.value, this.options.key.replace('.id', '') + '_id')) {
          this.setValueToObject(this.value, this.options['key'].replace('.id', '') + '_id', '')
        }

        // change value for model
        this.setValueToObject(
          this.value,
          this.returnOptions['key'].replace('.id', ''),
          val
        )

        this.$emit('input', this.value)
      }
    },
    returnOptions: function () {
      if (this.options != null) {
        return this.options
      }
      return {}
    },
    ...mapGetters(['getSchema', 'getMetaDataErrors'])
  },
  data () {
    return {
      items: [],
      loaded: false,
      selectedItem: {}
    }
  },
  mixins: [helper],
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {},
  methods: {
    convertItems (obj) {
      var self = this

      return obj.map(function (element) {
        return {
          id: element.id,
          label: self.parseVars(
            element,
            self.returnOptions.metadata.relation.short_view
          )
        }
      })
    },
    parseVars (item, prop) {
      return this.fetchValueByMetaData(
        item,
        prop,
        this.returnOptions.entityMetadata
      )
    },
    preloadData () {
      // check one more time if current component is relation
      if (this.returnOptions.metadata.relation.type) {
        let metadata = this.returnOptions.metadata

        if (metadata.relation.path) {
          // remove first slash and last slash
          let path = metadata.relation.path.replace(/^\/|\/$/g, '')

          var self = this
          this.$http.get(path).then(response => {
            // convert item list to select format
            let result = self.convertItems(response.data.data)

            self.items = result
            // set state for component
            self.loaded = true
            // set selected item on init
            self.selectedItem = this.fetchFromObject(
              this.value,
              this.returnOptions.key.replace('.id', '')
            )
          })
        }
      }
    }
  },
  created: function () {
    this.preloadData()
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
