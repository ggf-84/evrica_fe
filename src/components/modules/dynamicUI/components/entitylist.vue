<template>
<div class="entity-list">
  <div class="entity-item" v-for="(item,k) in data" v-bind:key="k">
    <ul>
      <li :class="cell.class?cell.class:'item'" v-for="(cell,index) in schema.cells" v-bind:key="index">

        <router-link v-if="cell.action" :to=" parseUrl('/page/'+parseVars(cell.action.link, k))" push>{{parseVars(cell,k)}}</router-link>

        <span v-if="!cell.action">
          {{parseVars(cell,k)}}
        </span>
      </li>
    </ul>

  </div>
</div>

</template>
<script>
import helper from '../components/utils/HelperDynamicUI'
import { mapGetters } from 'vuex'

export default {
  name: 'entitylist',
  mixins: [helper],
  computed: {
    returnSchema: function () {
      if (this.schema != null) {
        return this.schema
      }

      return {}
    },
    ...mapGetters(['getMetaData', 'getDynamicUIData'])
  },
  data () {
    return {
      data: [],
      metaData: [],
      entity: null,
      urls: []
    }
  },
  props: {
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {},
  methods: {
    init () {
      // check if is set entity & data-source
      if (this.returnSchema['entity'] && this.returnSchema['data-source']) {
        // set current entity
        this.entity = this.returnSchema['entity']
        // generate param object
        let params = {
          path: this.returnSchema['data-source'][this.entity],
          entity: this.entity
        }
        var self = this

        // load metadata for current entity
        this.$store.dispatch('getWindowMetaData', self.entity).then(function () {
          // load entity records
          self.$http.get(params.path).then(response => {
            self.data = response.data.data
          })
        })
      }
    },
    // get variables from template
    parseVars (data, index) {
      let template = ''
      // if current cell item have value and we don`t need to get description from metadata
      if (data.value) {
        template = data.value
        let rawVariables = this.matchVariables(template)
        // each variable
        rawVariables.forEach(element => {
          let value = this.fetchFromObject(
            this.data[index],
            element.replace('$', '')
          )
          // remplace each variable
          template = template.replace(element, value)
        })

        return template
        // or we need to analyze metadata description of field
      } else {
        template = data
        let metadata = {}
        // get metadata for entity
        if (this.getMetaData[this.entity]) {
          // get metadata for current entity
          metadata = this.getMetaData[this.entity]
          // get value for current label by metadata
          template = this.fetchValueByMetaData(
            this.data[index],
            template,
            metadata
          )
        }
        return template
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  text-decoration: none;
}
</style>
