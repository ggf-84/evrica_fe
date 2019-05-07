<template>
<div class="entity-form" 
  :class="((schema.layout && ['VerticalList','HorizontalList'].includes(schema.layout.type)) ? schema.layout.type : '') + ' ' +
  (schema.class ? schema.class : '') + ' ' + (schema.align ? 'position-' + schema.align : '')" 
  :style="{width:schema.width,height:schema.height}" v-if="loaded">

    <div class="child"  v-for="(children, index) in schema.children" v-bind:key="index">
      <!-- simple label -->
       <component  :is="'dynamiclabel'" v-if="children.type == 'label' && children.class !== 'button'" :prop="data" :schema="children"/>
       <!-- another fields -->
       <component v-if="children.type == 'input'" v-model="data" :is="'dynamic'+generateType(children)" :options="getFieldOptions(children)" :schema="children"/>
       <!-- actions -->
       <component v-if="children.type == 'label' && children.class=='button'" :is="'dynamicbutton'" :schema="children" v-model="data" />
    </div>
</div>

</template>
<script>
import helper from '../components/utils/HelperDynamicUI'
import { mapGetters } from 'vuex'

import dynamiclabel from '../components/label'
import dynamicinput from '../components/input'
import dynamicselect from '../components/select'
import dynamicradio from '../components/radio'
import dynamictextarea from '../components/textarea'
import dynamicbutton from '../components/button'
import dynamictable from '../components/table'
import dynamicdatetime from '../components/datetime'

export default {
  name: 'dynamicform',
  mixins: [helper],
  computed: {
    returnSchema: function () {
      if (this.schema != null) {
        return this.schema
      }

      return {}
    },
    getId: function () {
      if (this.selected != null) {
        return this.selected
      }

      return 0
    },
    ...mapGetters(['getMetaData', 'getDynamicUIData'])
  },
  data () {
    return {
      loaded: false,
      data: {},
      metaData: [],
      entities: {},
      // components types
      fields: {
        input: 'input',
        decimal: 'input',
        i18n: 'input',
        string: 'input',
        boolean: 'radio',
        text: 'textarea',
        datetime: 'datetime'
      }
    }
  },
  props: {
    value: { type: String, default: '' },
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selected: {
      type: String,
      default: '0'
    }
  },
  components: {
    dynamiclabel,
    dynamicinput,
    dynamicselect,
    dynamicradio,
    dynamictextarea,
    dynamicbutton,
    dynamictable,
    dynamicdatetime
  },
  methods: {
    updateValue (val) {
      this.data['i18n']['title'] = val
    },
    changeDataSource (path) {
      // set id of entity as parameter
      let parameter = '$id'
      return path.replace(parameter, this.getId)
    },
    preload () {
      var self = this
      // if is insert form generate new object
      if (!this.returnSchema['data-source']) {
        this.initObject()
        return null
      }
      for (var element in this.returnSchema['data-source']) {
        // add entity name in list
        self.entities['main'] = element
        // get metadata for every entity
        this.$store.dispatch('getWindowMetaData', element).then(() => {
          // get entity records for every datasource
          self.$http
            .get(
              self.changeDataSource(
                this.returnSchema['data-source'][element]
              )
            )
            .then(response => {
              if (response.data.data[0]) {
                // store received data as main entity with key: "main"
                self.data = response.data.data[0]
                self.loaded = true
              }
            })
        })
      }
    },

    // generate data object for insert form
    initObject () {
      let schema = this.returnSchema
      let items = schema.children
      var entity = ''
      var self = this

      // every children element
      Object.keys(schema.children).map(key => {
        let component = items[key]
        if (component.type === 'input') {
          // get entity
          let mainEntity = component.field.substring(
            0,
            component.field.indexOf('.')
          )

          if (!entity) {
            entity = mainEntity
          }
        }
      })

      this.$store.dispatch('getWindowMetaData', entity).then(() => {
        // get every compomemt
        Object.values(schema.children).map(component => {
          if (component.type === 'input') {
            // generate default values for data
            self.generateEmptyObject(
              this.data,
              component.field,
              self.getMetaData[entity]
            )
            self.loaded = true
          }
        })
      })
    },
    // generate type of component
    generateType (children) {
      // is some values is not set return default value
      if (!children.field) return 'input'

      let entity = children.field.substring(0, children.field.indexOf('.'))
      // get var
      let prop = children.field
      prop = prop.substring(prop.indexOf('.') + 1)

      // get field description
      let field = this.fetchFromObject(
        this.getMetaData[entity]['fields'],
        prop
      )

      if (!field) return 'input'

      if (field.type === 'relation') {
        let relation = this.fetchFromObject(
          this.getMetaData[entity].relations,
          prop
        )
        return relation.type
      }

      // for different types of input return assigned component types
      return this.fields[field.type]
    },
    // generate all needed parameters for form component
    getFieldOptions (children) {
      var entity = children.field.substring(0, children.field.indexOf('.'))
      // get var
      var prop = children.field
      prop = prop.substring(prop.indexOf('.') + 1)

      var metaData = this.getMetaData[entity]

      let key = ''
      // generate key for field
      if (children.value) {
        key = children.value
      } else {
        key = children.field
      }

      let result = {
        metadata: {
          field: this.fetchFromObject(metaData.fields, prop),
          relation: this.fetchFromObject(metaData.relations, prop)
        },
        entityMetadata: metaData,
        type: this.fetchFromObject(metaData.fields, prop).type,
        key: this.searchProperty(this.data, key.replace('$', ''))
      }

      // set relation key (on insert)

      /**  if (
        result.metadata.field.type === 'relation' &&
        result.key.indexOf('id') === -1
      ) {
        result.key = result.key + '.id'
      }**/

      // set i18n key
      if (
        result.metadata.field.type === 'i18n' &&
        result.key.indexOf('i18n') === -1
      ) {
        result.key = 'i18n.' + result.key
      }

      // check if relation is not empty
      if (result.metadata.field.type === 'relation' && result.metadata.field.select === 'single' && !this.fetchFromObject(this.data, result.key)) {
        // eplode by dot
        let relationKey = result.key.substring(0, result.key.indexOf('.'))
        // set default value to empty object
        this.data[relationKey] = {}
      } else if (result.metadata.field.type === 'relation' && result.metadata.field.select === 'multiple' && !this.fetchFromObject(this.data, result.key)) {
         // eplode by dot
        let relationKey = result.key.substring(0, result.key.indexOf('.'))
        // set default value to empty
        this.data[relationKey] = []
      }

      return result
    }
  },
  created () {
    this.preload()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: none;
}
</style>
