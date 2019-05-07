<template>
<div>

  <multiselect v-if="loaded" :multiple="options.metadata.relation.select === 'multiple'" v-model="model" :options="items" trackBy="id" label="label" open-direction="bottom" :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="true" :close-on-select="true" :options-limit="300"  :show-no-results="false" :hide-selected="true" @search-change="asyncFind">
  </multiselect>

  <div class="select-table" v-if="options.metadata.relation.select ==='multiple'">
  <div class="list-items" :key="valueIndex" v-for="(item,valueIndex) in selectedItems">
      <div class="item-field" :key="key" v-for="(field, key) in options.metadata.relation.fields">
        <b>{{field.label}}</b>
        <!-- Generate dynamic component for form -->
       <component  :is="'dynamic'+getType(field.type)" v-model="value" :options="getOptions(field,key,valueIndex)"/>
      </div>
  </div>
  </div>

</div>
</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'
import Vue from 'vue'
import Multiselect from 'vue-multiselect'

/** Load components */
import dynamiclabel from '../components/label'
import dynamicinput from '../components/input'
import dynamicselect from '../components/select'
import dynamicradio from '../components/radio'
import dynamictextarea from '../components/textarea'
import dynamicbutton from '../components/button'

// register globally
Vue.component('multiselect', Multiselect)

export default {
  name: 'dynamictable',
  computed: {
    model: {
      get () {
        let value = this.selectedItems
        return !value ? [] : value
      },
      set (val) {
        this.setValueToObject(
          this.value,
          this.returnOptions['key'].replace('.id', ''),
          val
        )

        if (val.length > 0) {
          // need for rerender template
          this.selectedItems = val
        }

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
      isLoading: false,
      items: [],
      loaded: false,
      selectedItems: [],
      fields: {
        input: 'input',
        decimal: 'input',
        i18n: 'input',
        string: 'input',
        boolean: 'radio',
        text: 'textarea',
        label_i18n: 'label',
        label: 'label'
      }
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
  components: {
    dynamicbutton,
    dynamiclabel,
    dynamicinput,
    dynamicselect,
    dynamicradio,
    dynamictextarea
  },
  methods: {
    limitText (count) {
      return `and ${count} other items`
    },
    // search items in server
    asyncFind (query) {
      if (!query.length || query.length < 2) return null
      // generate search path
      let path = this.generateSearchPath(
        query,
        this.returnOptions.metadata.relation
      )

      this.isLoading = true
      // load items on type
      this.$http.get(path).then(response => {
        // set vonerted response to select
        this.items = this.convertItems(response.data.data)
        // hide loading spin
        this.isLoading = false
      })
    },
    // clear select items
    clearAll () {
      this.items = []
    },
    // parse variables
    parseVars (item, prop) {
      // parse values from given object
      return this.fetchValueByMetaData(
        item,
        prop,
        this.returnOptions.entityMetadata
      )
    },
    // generate search path for component by metadata
    generateSearchPath (item, relationMetadata) {
      // get initial path
      let path = relationMetadata.path
      // get shortview value from metadata
      let shortView = relationMetadata.short_view
      // get variables by $ sign
      let match = this.matchVariables(shortView)

      // check if we found values in shortview else return raw path
      if (match.length === 0) return path

      // remove starting slashes
      path = path.replace(/^\/|\/$/g, '')

      // set initial shit markup
      path += `?_filters[]=`
      // set every founded values from shortview to search path
      // example: products?_filters[]={var}-lk=*car*-!or!-{var}-lk=*car*
      match.forEach(element => {
        // add or sign if we have another like
        if (path.indexOf('-lk') > -1) {
          path += `-!or!-`
        }
        // remove dollar sign
        path += element.replace('$', '') + `-lk=*` + item + `*`
      })

      return path
    },
    // convert items for select
    convertItems (obj) {
      var self = this
      // check if given object/array is not empty
      if (obj.length === 0) return []

      // if we have just 1 element && is not array
      if (!(obj instanceof Array)) {
        // set initial object
        let item = obj
        // parse label by shortview from metadata
        item.label = self.parseVars(
          item,
          this.returnOptions.metadata.relation.short_view
        )
        // return item if is object
        return item
      }
      // map array element to set label for select
      return obj.map(function (element) {
        let item = element
        item.label = self.parseVars(
            element,
            self.returnOptions.metadata.relation.short_view
          )
        return item
      })
    },
    // get type of fields for components of table select
    getType (type) {
      // check type
      if (!type) return 'input'
      // if type exists, return type of field
      if (this.fields[type]) return this.fields[type]
      // if type not exists, return default type of field
      return 'input'
    },
    // get options for components
    getOptions (field, index, valueIndex) {
      let relation = {}
      // set relation if exists
      if (field.type === 'relation') {
        // get relation for current component if is relation
        if (this.returnOptions.entityMetadata.relations[index]) {
          relation = this.returnOptions.entityMetadata.relations[index]
        }
      }
      // generate result
      let result = {
        metadata: {
          field: field,
          relation: relation
        },
        entityMetadata: this.returnOptions.entityMetadata,
        type: field.type,
        key: this.returnOptions.key.replace('.id', '') + '.' + valueIndex + '.' + index
      }

      return result
    }
  },
  created () {
    if (this.value.id) {
      // get selected items for select
      this.selectedItems = this.fetchFromObject(
        this.value,
        this.returnOptions.key.replace('.id', '')
      )
      // convert selected items
      let converted = this.convertItems(this.selectedItems)
      // set converted selected items to items of select
      this.items = converted instanceof Array ? converted : [converted]
      // set converted items to value
      this.setValueToObject(
        this.value,
        this.returnOptions.key.replace('.id', ''),
        converted
      )
    }
    // set state for select
    this.loaded = true
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-items {
  width: 100%;
  display: block;
  min-height: 40px;
  margin-bottom: 10px;
}
.select-table {
  margin-top: 20px;
  display: table;
}
.item-field {
  float: left;
  margin-left: 10px;
  width: 120px;
}

.item-field div {
  width: 100%;
  display: block;
}

.item-field input {
  width: 100%;
}

.item-field b {
  width: 100%;
  display: block;
}
</style>
