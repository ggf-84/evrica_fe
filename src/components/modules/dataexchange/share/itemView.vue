<template>
<div>
  <div v-if="typeof returnItem.share !== 'undefined'">
      <shareViewer :item="returnItem" :shareToken="returnItem.share.token"></shareViewer>
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../../mixins/modules/dataexchange/dataModifier.js'
import itemViewer from '../item'
import shareViewer from './shareViewer'

export default {
  data () {
    return {
      dataItem: {}
    }
  },
  mixins: [
    dataMixin
  ],
  computed: {
    returnItem: {
      get () {
        this.dataItem = this.item
        return this.dataItem
      },
      set (val) {
        this.dataItem = val
        this.$emit('set', this.dataItem)
      }
    },
    ...mapGetters(['getToken', 'getUser'])
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    itemViewer,
    shareViewer
  },
  mounted () {
  },
  created () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.presenter {
  margin: 0 auto;
}
</style>
