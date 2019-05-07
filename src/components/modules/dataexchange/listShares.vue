<template>
<div class="shares-container">

  <!-- loader -->
  <loader :loading="dataIsLoading" class="loader-shares"></loader>
  <!-- end loader -->

  <!-- shares list  -->
  <div class="sharesDE-section">
    <div class="title-section">
      <b>Shares:</b>
    </div>
    <div v-if="parseInt(returnShares.length) === 0">No shares available</div>
    <div v-else>
        <div class="sharesDE-containerDE" ref="sharesContainer">
          <div v-for="(dataShare, indx) in returnShares" :key="indx">
              <hr>
              <div v-if="dataShare.user !== null">
                <span>Shared with user: </span>
                <span><b>{{dataShare.user.firstname}} {{dataShare.user.lastname}} {{dataShare.user.email}}</b></span>
                <span>* {{localeTime(dataShare.created_at)}}</span>
              </div>
              <div v-else-if="dataShare.department!== null">
                <span>Shared with department: </span>
                <span><b>{{dataShare.department.i18n.title}}</b></span>
                <span>* {{localeTime(dataShare.created_at)}}</span>
              </div>
              <div v-else-if="dataShare.department === null && dataShare.user === null">
                <span>Shared public link <b>({{dataShare.title}})</b></span>
                <span v-if="dataShare.description !== null"><hr>Description: {{dataShare.description}}<br><hr></span>
                <span><b>{{localeTime(dataShare.created_at)}}</b></span>
              </div>
              <div class="permissionShares">
                <span><b>Permissions given:</b></span>
                  <div class="list-permissions">
                    <checkedPermissions :key="dataShare.id" :share="dataShare" :permissions="dataShare.permission" @changePermissions="onChangePermissions($event)"></checkedPermissions>
                  </div>
              </div>
              <div>
                <div v-if="dataShare.user !== null">
                  <el-button type="danger" class="removeShare" @click="removeShare(dataShare, indx)">Remove sharing with {{dataShare.user.firstname}}</el-button>
                </div>
                <div v-else-if="dataShare.department!== null">
                  <el-button type="danger" class="removeShare" @click="removeShare(dataShare, indx)">Remove sharing with {{dataShare.department.i18n.title}}</el-button>
                </div>
                <div v-else-if="dataShare.department === null && dataShare.user === null">
                  <el-button type="danger" class="removeShare" @click="removeShare(dataShare, indx)">Remove share link</el-button>
                  <el-tooltip class="item" effect="dark" content="Go to link" placement="top-start">
                    <el-button type="primary" class="removeShare" @click="goToPublicLink(dataShare)">
                      <i class="el-icon-share"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="Copy to clipboard" placement="top-start">
                    <el-button type="primary" class="removeShare" @click="copyToClipboardLink(dataShare)">
                      <i class="el-icon-news"></i>
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
          </div>
        </div>
    </div>
  </div>
  <!-- end shares list -->
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'
import {
  EventBus
} from '../../../mixins/modules/dataexchange/eventBus.js'
import loader from '../../modules/dataexchange/loading.vue'
import checkedPermissions from '../../modules/dataexchange/checkPermissions.vue'

export default {
  data () {
    return {
      dataShares: [],
      dataType: '',
      dataIsLoading: false,
      lastScrollShares: false,
      pageHeightShares: 0,
      sharesBottom: false,
      currentSharesPage: 1,
      checked: []
    }
  },
  mixins: [
    dataMixin
  ],
  computed: {
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
    returnType: {
      get () {
        this.dataType = this.type
        return this.dataType
      },
      set (val) {
        this.dataType = val
        this.$emit('set', this.dataType)
      }
    },
    ...mapGetters(['getToken', 'getUser', 'getSharingPermissions', 'getCurrentItem'])
  },
  props: {
    shares: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  watch: {
    getCurrentItem: function (val) {
      this.currentSharesPage = 1
    }
  },
  components: {
    loader,
    checkedPermissions
  },
  updated () {
    var self = this
    // listen scroll rooms
    let windowShares = this.$refs.sharesContainer
    if (windowShares) {
      windowShares.addEventListener('scroll', () => {
        this.sharesBottom = this.bottomSharesVisible()
        if (this.sharesBottom) {
          this.currentSharesPage++
          this.$emit('loadShares', {page: this.currentSharesPage, item: this.getCurrentItem, type: this.returnType})
          this.$nextTick(function () {
            let containerDE = self.$refs.sharesContainer
            containerDE.scrollTo(0, self.pageHeightShares)
          })
        }
      })
    }
  },
  mounted () {
    EventBus.$on('showLoadingGetShares', data => {
      this.dataIsLoading = data
    })
    EventBus.$on('setSharesPage', data => {
      this.currentSharesPage = data.page
    })
  },
  created () {

  },
  methods: {
    goToPublicLink: function (data, open = true) {
      let origin = window.location.origin
      let delimiter = '/#/'
      let path = 'file/'
      let makeUrl = origin + delimiter + path + data.token
      // open tab with link
      if (open) {
        window.open(makeUrl, '_blank')
      }
      // return data
      return makeUrl
    },
    copyToClipboardLink: function (data) {
      let link = this.goToPublicLink(data, false)
      // copy to clipboard
      navigator.clipboard.writeText(link).then(function () {
        console.log('Copying to clipboard was successful!')
      }, function (err) {
        console.error('Could not copy text: ', err)
      })
    },
    handleCheckedPermissionsChange (value) {
      console.log(value)
    },
    removeShare: function (share, indx) {
      this.$emit('removeShare', share)
      this.$delete(this.dataShares, indx)
    },
    bottomSharesVisible () {
      let windowShares = this.$refs.sharesContainer
      let scrollY = windowShares.scrollTop
      let visible = windowShares.clientHeight
      let pageHeight = windowShares.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollShares && bottomOfPage) {
        this.lastScrollShares = true
        this.pageHeightShares = pageHeight
        return true
      } else if (this.lastScrollShares && bottomOfPage) {
        this.lastScrollShares = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollShares = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    },
    onChangePermissions: function (data) {
      this.$emit('changePermissions', data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loader-shares {
  margin-top: 1em;
  margin-bottom: 1em;
  width: 35px;
  height: 35px;
  margin: 0 auto;
}

.shares-container{
  margin-top: 2em;
}

.sharesDE-containerDE{
  max-height: 300px;
  overflow-x: auto;
  overflow-y: scroll;
}

.DEShare-dblock{
  display: block;
}

.permissionShares{
  margin-top: 0.5em;
}

.list-permissions {
  margin-top: 1em;
}

.removeShare{
  margin-top: 1em;
  font-size: 0.8em;
}

</style>
