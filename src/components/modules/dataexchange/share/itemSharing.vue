<template>
<div>
  <div>
    <el-tabs v-model="activeName"  @tab-click="handleClick">
      <el-tab-pane label="User and departments" name="first">

        <!-- permissions listing -->

        <div class="text-permission"><b>Permission:</b> <div class="showPermissions" @click="editOptions">Show permissions</div> </div>
        <div class="permissions-content">
          <transition name="fade">
            <el-checkbox-group v-model="checkedPermissions" v-if="showEditOptions">
              <div v-for="(dataPermission, indx) in dataPermissions.data" :key="indx" class="permission-content">
                <el-checkbox :label="dataPermission.id" class="permission-chbx-container">
                  {{dataPermission.i18n.title}}
                </el-checkbox>
              </div>
            </el-checkbox-group>
        </transition>
        </div>

        <!-- end permissions listing -->

        <div>
          <el-select
          v-model="selectedUserDepartment"
          filterable
          remote
          reserve-keyword
          @change="changeSelectedUserDepartment()"
          class="input-searched"
          placeholder="Search user or department"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="(itemUserDepartment, indx) in userDepartments"
            :key="itemUserDepartment.id"
            :label="(typeof itemUserDepartment.i18n !== 'undefined') ? itemUserDepartment.i18n.title : itemUserDepartment.firstname + ' ' + itemUserDepartment.lastname"
            :value="indx">
            <!-- its department , users don't have i18n -->
            <span v-if="typeof itemUserDepartment.i18n !== 'undefined'">{{itemUserDepartment.i18n.title}} (department)</span>
            <!-- its user , show firstname and lastname -->
            <span v-else>{{itemUserDepartment.firstname + ' ' + itemUserDepartment.lastname}} (user)</span>
          </el-option>
        </el-select>
        </div>
        <div>
          <br>
          <el-button type="primary" @click="shareWithPermissions()">Share</el-button>
        </div>

        <hr>

        <div>
          <shares type="user" key="first" :shares="returnShares" @changePermissions="onChangePermissions($event)" @loadShares="onLoadShares($event)" @removeShare="onRemoveShare($event)"></shares>
        </div>

      </el-tab-pane>
      <el-tab-pane label="Public links" name="second">
        <el-button type="primary" @click="dialogVisible = true">Create public link</el-button>
        <hr>

        <div>
          <shares type="public" key="second" :shares="returnShares" @changePermissions="onChangePermissions($event)" @loadShares="onLoadShares($event)" @removeShare="onRemoveShare($event)"></shares>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <el-dialog
    title="Create link"
    :visible.sync="dialogVisible"
    width="50%">
    <div>
      <!-- permissions listing -->

      <div class="text-permission"><b>Permission:</b> <div class="showPermissions" @click="editOptions">Show permissions</div> </div>
      <div class="permissions-content">
        <transition name="fade">
          <el-checkbox-group v-model="checkedPermissions" v-if="showEditOptions">
            <div v-for="(dataPermission, indx) in dataPermissions.data" :key="indx" class="permission-content">
              <el-checkbox :label="dataPermission.id" class="permission-chbx-container">
                {{dataPermission.i18n.title}}
              </el-checkbox>
            </div>
          </el-checkbox-group>
      </transition>
      </div>

      <!-- end permissions listing -->

      <!-- share public form  -->
        <sharePublic key="first" :item="returnItem" @sharePublicLink="onSharePublicLink($event)"></sharePublic>
      <!-- end share public form  -->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">Close</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../../mixins/modules/dataexchange/dataModifier.js'
import {
  EventBus
} from '../../../../mixins/modules/dataexchange/eventBus.js'
import backendMixin from '../../../../mixins/modules/dataexchange/backend.js'
import loader from '../loading.vue'
import notifiction from '../../../../mixins/modules/notifications/notification'
import shares from '../../../modules/dataexchange/listShares.vue'
import sharePublic from '../../../modules/dataexchange/sharePublic.vue'

export default {
  data () {
    return {
      dataShares: [],
      dataItem: [],
      dataPermissions: [],
      checkedShare: true,
      dataIsLoading: false,
      activeName: 'first',
      checkedPermissions: [],
      showEditOptions: true,
      userDepartmentsInput: '',
      userDepartments: [],
      selectedUserDepartment: '',
      loading: false,
      sharesBottom: false,
      dialogVisible: false,
      backendJSEvents: {
        getPermissions: function (data, self) {
          self.dataPermissions = data.data
          self.$store.dispatch('setSharingPermissions', self.dataPermissions)
        },
        getUserDepartments: function (data, self) {
          self.userDepartments = data
        }
      }
    }
  },
  mixins: [
    dataMixin,
    backendMixin
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
    returnShares: {
      get () {
        this.dataShares = this.shares
        return this.dataShares
      },
      set (val) {
        this.dataShares = val
        this.$emit('set', this.dataShares)
      }
    },
    ...mapGetters(['getToken', 'getUser', 'getSharingPermissions', 'getCurrentItem'])
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    shares: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    loader,
    shares,
    sharePublic
  },
  mounted () {
    EventBus.$on('GetBackendJs', data => {
      return this.GetBackendJs(data)
    })
    EventBus.$on('PostBackendJs', data => {
      return this.PostBackendJs(data)
    })
    EventBus.$on('DeleteBackendJs', data => {
      return this.DeleteBackendJs(data)
    })
    EventBus.$on('changeShareActiveItem', data => {
      this.activeName = data.title
    })
  },
  created () {
    // get permissions to set
    this.sendGet('de/permissions')
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        var self = this
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.$http.get('de/user/departments' + '?queryString=' + query).then(response => {
            this.loading = false
            self.userDepartments = response.body.data
          })
        }, 200)
      } else {
        this.userDepartments = []
      }
    },
    changeSelectedUserDepartment: function () {
    },
    GetBackendJs: function (data) {
      // get requested api path
      var globalPath = data.path
      if (globalPath === 'de/permissions') {
        // get data exchange permissions
        this.backendJSEvents['getPermissions'](data, this)
      } else if (globalPath === 'de/user/departments') {
        // search users and departments
        this.backendJSEvents['getUserDepartments'](data, this)
      }
    },
    PostBackendJs: function (data) {
    },
    DeleteBackendJs: function (data) {
    },
    editOptions: function () {
      if (this.showEditOptions) {
        this.showEditOptions = false
      } else {
        this.showEditOptions = true
      }
    },
    shareWithPermissions: function () {
      // get by index
      var dataSelected = this.userDepartments[this.selectedUserDepartment]
      if (typeof dataSelected !== 'undefined') {
        this.userDepartments = []
        // validate
        if (this.selectedUserDepartment === '' && typeof dataSelected.id !== 'undefined') {
          notifiction.error('System !', "Can't share with unknown user or department")
        } else if (parseInt(this.checkedPermissions.length) === 0) {
          notifiction.error('System !', 'Select 1 or more permissions')
        } else {
          EventBus.$emit('showLoadingGetShares', true)
          var type = 'user'
          if (typeof dataSelected !== 'undefined' && typeof dataSelected.id !== 'undefined') {
            // share item after full data validation
            this.shareItem(dataSelected, type)
          } else {
            notifiction.error('System !', "Can't share with unknown user or department")
          }
        }
      } else {
        notifiction.error('System !', "Can't share empty data")
      }
    },
    onSharePublicLink: function (data) {
      if (parseInt(this.checkedPermissions.length) === 0) {
        notifiction.error('System !', 'Select 1 or more permissions')
      } else {
        EventBus.$emit('showLoadingGetShares', true)
        var permissions = this.checkedPermissions
        // request params
        let params = '/' + this.returnItem.hash
        var dataJson
        if (data.data.email !== '') {
          dataJson = {
            permissions: permissions,
            fields: data.data,
            email: data.data.email
          }
        } else {
          dataJson = {
            permissions: permissions,
            fields: data.data
          }
        }
        // send post share with permissions
        this.sendPost('de/share', params, dataJson)
        this.selectedUserDepartment = ''
        this.checkedPermissions = []
      }
    },
    shareItem: function (dataSelected, type) {
      var typeIdentifier = dataSelected.id
      var permissions = this.checkedPermissions
      // check if type is department
      if (typeof dataSelected.i18n !== 'undefined') {
        type = 'department'
      }
      // request params
      let params = '/' + this.returnItem.hash + '/' + type
      let dataJson = {
        permissions: permissions,
        entity: typeIdentifier
      }
      // send post share with permissions
      this.sendPost('de/share', params, dataJson)
      this.selectedUserDepartment = ''
      this.checkedPermissions = []
    },
    onChangePermissions: function (data) {
      EventBus.$emit('showLoadingGetShares', true)
      let makeParams = '/' + data.group.id
      let jsonData = {permissions: data.permissions}
      this.sendPut('de/permissions', makeParams, jsonData)
    },
    handleClick (tab, event) {
      if (tab.name === 'second') {
        this.loadSharesType({type: 'public', page: 1, item: this.returnItem})
      } else {
        this.loadSharesType({type: 'user', page: 1, item: this.returnItem})
      }
      EventBus.$emit('setSharesPage', {page: 1})
    },
    loadSharesType: function (data) {
      this.$emit('loadShares', data)
    },
    onLoadShares: function (data) {
      this.$emit('loadShares', data)
    },
    onRemoveShare: function (data) {
      let makeParams = '/' + data.id
      this.sendDelete('de/share', makeParams)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.text-permission{
  margin-bottom: 1em;
}

.can-share-box{
  margin-bottom: 1em;
}

.permission-chbx-container{
  margin-bottom: 1em;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}


.permission-content{
  display: inline-block;
  margin-left: 1em;
}

.permission-chbx-container{
  margin-left: 1em;
}

.showPermissions{
  display: inline-block;
  font-size: 0.8em;
  background-color: #747474;
  padding: 0.5em;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
}

.input-searched{
  width: 100%;
}

.input-public {
  width: 100%;
}
</style>
