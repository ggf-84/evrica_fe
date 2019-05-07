import {
  mapGetters
} from 'vuex'
// import notifiction from '../notifications/notification'

export default {
  computed: {
    ...mapGetters(['getCurrentShareItem'])
  },
  methods: {
    checkShareActionPermission: function (code) {
      var permissionCode = 'de_can_' + code
      if (typeof this.getCurrentShareItem !== 'undefined') {
        let sharePermissions = this.getCurrentShareItem.share.permission
        let getPermissionByCode = sharePermissions.find(item => item.code === permissionCode)
        // check if found permission
        if (typeof getPermissionByCode !== 'undefined') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    hasPermission: function (code) {
      let check = this.checkShareActionPermission(code)
      // if share don't have permission
      if (!check) {
        // notification to display
        // setTimeout(function () {
        //   notifiction.error('System !', "You don't have permission to " + code)
        // }, 100)
      }
      // return
      return check
    }
  }
}
