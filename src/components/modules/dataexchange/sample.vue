<template>
  <div>
    sample
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'

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
</style>
