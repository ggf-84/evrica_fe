<template>
<div>
  <el-checkbox-group v-model="checkedPermissions" @change="changePermissions()">
    <div v-for="(dataPermission, indx) in getSharingPermissions.data" :key="indx" class="permission-content">
      <el-checkbox :label="dataPermission.id" :key="indx" class="permission-chbx-container"
        :checked="(hasPermission(dataPermission)) ? true : false"
        >
        {{dataPermission.i18n.title}}
      </el-checkbox>
    </div>
  </el-checkbox-group>
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
      dataShare: [],
      dataPermissions: [],
      checkedPermissions: []
    }
  },
  mixins: [
    dataMixin
  ],
  computed: {
    returnShare: {
      get () {
        this.dataShare = this.share
        return this.dataShare
      },
      set (val) {
        this.dataShare = val
        this.$emit('set', this.dataShare)
      }
    },
    returnPermissions: {
      get () {
        this.dataPermissions = this.permissions
        return this.dataPermissions
      },
      set (val) {
        this.dataPermissions = val
        this.$emit('set', this.dataPermissions)
      }
    },
    ...mapGetters(['getToken', 'getUser', 'getSharingPermissions'])
  },
  props: {
    share: {
      type: Object,
      default: () => {
        return {}
      }
    },
    permissions: {
      type: Array,
      default: () => {
        return []
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
    changePermissions: function () {
      this.$emit('changePermissions', {group: this.returnShare, permissions: this.checkedPermissions})
    },
    hasPermission: function (permission) {
      var status = false
      this.returnPermissions.map((e, i) => {
        if (parseInt(e.id) === parseInt(permission.id)) {
          status = true
        }
      })
      return status
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
