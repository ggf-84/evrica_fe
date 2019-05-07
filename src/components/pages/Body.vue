<template>
  <div v-if="load" class="template-bitrix24 bitrix24-default-theme" >
    <div id="header" :style="{'height':mainSchema.header.height}">
      <dynamicLayout v-if="mainSchema.header" :schema="mainSchema.header"/>
    </div>
    <section :style="{'margin-top':mainSchema.header.height}">
      <div class="menu-items-block" id="bx-left-menu">
        <dynamicLayout v-if="mainSchema.leftblock" :schema="mainSchema.leftblock"/>
      </div>
      <div v-if="mainSchema.dynamiccontent" class="windows-content-block">
        <router-view v-if="$route.fullPath != '/auth'" :key="$route.fullPath"/>
      </div>
      <div class="bx-im-bar" id="bx-im-bar" >
        <dynamicLayout v-if="mainSchema.rightblock" :schema="mainSchema.rightblock"/>
      </div>
    </section>
    <div id="footer">
      <dynamicLayout v-if="mainSchema.footer" :schema="mainSchema.footer"/>
    </div>
  </div>
</template> 

<script>
import api from '../../store/utils/api'
import language from '../modules/settings/language'
import dynamicLayout from '../modules/dynamicUI/window_components/layout'

export default {
  name: 'dynamicBody',
  data () {
    return {
      load: false,
      mainSchema: false,
      content: null,
      userMenu: false,
      planerrMain: false,
      setAddress: false
    }
  },
  props: {
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    },
    entity: { type: String, default: '' },
    id: { type: String, default: '0' }
  },
  components: {
    language,
    dynamicLayout
  },
  methods: {
    testRequest: function () {
      api.get('auth/user').then(response => {
        this.content = response.user
      })
    },
    setUserData: function () {
      this.$store.dispatch('setCurrentUser', {})
      .then(response => {})
      this.setEmojis()
    },
    setEmojis: function () {
      this.$store.dispatch('setCurrentEmoji', {})
      .then(response => {})
    },
    show (val) {
      switch (val) {
        case 'popup-user-menu':
          this.userMenu = !this.userMenu
          break
        case 'planner_main':
          this.planerrMain = !this.planerrMain
          break
        case 'evrica_set_address':
          this.setAddress = !this.setAddress
          break
      }
    },
    logout () {
      localStorage.removeItem('vuex')
      this.$router.go('/')
    }
  },
  created: function () {
    api.get('window/evrica/' + window.innerWidth).then(response => {
      this.mainSchema = JSON.parse(response.metadata).evrica
      this.load = true

      var prevScrollpos = window.pageYOffset
      window.onscroll = function () {
        var currentScrollPos = window.pageYOffset
        // console.log('d',bx,hd)
        if (prevScrollpos > currentScrollPos) {
          document.getElementById('bx-im-bar').style.top = '63px'
          document.getElementById('header').style.top = '0'
        } else {
          document.getElementById('bx-im-bar').style.top = '0'
          document.getElementById('header').style.top = '-63px'
        }

        prevScrollpos = currentScrollPos
      }
    })
    if (this.$router.currentRoute.fullPath === '/auth') {
      window.location.href = '/'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.menu-items-block, .windows-content-block, .bx-im-bar {
  display: table-cell;
  vertical-align: top;
}
#bx-im-bar{
  top: 63px; 
  right: 0px;
  transition: top 0.5s;
}

#header{
  position: fixed;
  top: 0;
  width: 100%;
  display:block;
  transition: top 0.3s;
  z-index: 999999
}

.windows-content-block{
  padding: 10px 64px ;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow-y: auto;
}
.menu-items-block{
  width: 208px
}
.feed-up-btn-wrap{
  display: inline-block;
  position: relative
}
.logo-button{
  border: none;
  background: transparent;
  outline: none;
}
.top-icon, .bottom-icon{
  display: table;
  margin: 0 auto;
}
.position-left{
  float: left;
}
.position-right{
  float: right;
}
.position-center{
  margin: 0 auto;
}
.both{
  clear: both;
}
</style>

