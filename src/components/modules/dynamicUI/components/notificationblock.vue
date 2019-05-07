<template>
  <div>
    <span class="notifications-icon" :class="(schema.class?schema.class:'') + (isActive?'notifications-active':'')" 
       @click="toggleBlock()">
      <img v-if="schema['top-icon']" v-bind:src="require( '@/'+schema['top-icon'])" class="top-icon">
      <img v-if="schema['left-icon']" v-bind:src="require( '@/'+schema['left-icon'])" class="left-icon">

      <span v-if="schema.badge && badge" class="badge" >{{badge}}</span>

      <img v-if="schema['right-icon']" v-bind:src="require( '@/'+schema['right-icon'])" class="right-icon">
      <img v-if="schema['bottom-icon']" v-bind:src="require( '@/'+schema['bottom-icon'])" class="bottom-icon">
    </span>
    <section class="notifications-block" v-if="notificationloaded && isActive">
      <div class="notifications" v-if="notificationloaded && isActive">
        <article v-if="notifications.length === 0">
          Notification list is empty...
        </article> 
        <article  v-if="notifications" class="notification" v-for="(notification, index) in notifications" :key="index">
          <div class="notification-body">
            <div class="text">
              <p>
              {{notification.notification_message}}
              </p>
            </div>
            <p class="attribution">by 
              <router-link v-if="notification.by_id" :to="'/page/edituser/' + notification.by_id" target="_blank">
               {{notification.by_firstname}} {{notification.by_lastname}}
              </router-link>
              <span>{{notification.created_at}}</span>
            </p>
          </div>
        </article>
        <div v-if="notifications.length > 0 && isLoadmore">
          <div v-if="loadmore" class="load-more">...</div> 
          <div v-else @click="loadMore()" class="load-more">{!!more!!}</div> 
        </div>
      </div>
    </section>
    
  </div>
</template>
 
<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'

export default {
  name: 'dynamicnotificationblock',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {
      notifications: [],
      badge: 0,
      limit: 20,
      page: 1,
      loadmore: false,
      isLoadmore: true,
      toggle: false,
      notificationloaded: false,
      isActive: false,
      events: {
        newNotification: (data, self) => {
          this.$http.get('notification/' + data.data['id']).then(function (response) {
            var resp = {}

            if (response.data.data['by_id']) {
              resp = {
                by_firstname: response.data.data['by_firstname'],
                by_lastname: response.data.data['by_lastname'],
                by_id: response.data.data['by_id'],
                notification_message: response.data.data['notification_message'],
                created_at: response.data.data['created_at']
              }
            }

            self.notifications.unshift(resp)
            self.badge += 1
          })
        }
      }
    }
  },
  mixins: [
    helper
  ],
  props: {
    prop: {
      type: Object,
      default: () => {
        return {}
      }
    },
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {},
  sockets: {
    disconnect: function () {},
    message: function (msg) {
      // console.log('msgg: ', msg)
      // call function on message
      if (this.events && this.events[msg.event]) {
        this.events[msg.event](msg, this)
      }
    }
  },
  methods: {
    init () {
      if (this.schema.type === 'notificationblock') {
        this.$http.get(this.schema.badge).then(function (response) {
          this.badge = response.data.data
        })
      }
    },
    loadMore () {
      this.loadmore = true
      var self = this
      this.$http.get('user/notifications/limit/' + this.limit + '/page/' + this.page).then(function (response) {
        Object.values(response.data.data).forEach(function (element) {
          self.notifications.push(element)
        })

        self.loadmore = false
        self.page += 1

        if ((response.data.data).length === 0) {
          self.isLoadmore = false
        }
      })
    },
    parseVars (value, prop) {
      let template = value
      let rawVariables = this.matchVariables(template)

      if (!rawVariables) return template
      // each variable
      rawVariables.forEach(element => {
        let keys = element.split('.')
        let val = prop[keys[(keys.length - 1)]] ? prop[keys[(keys.length - 1)]] : (prop.i18n && prop.i18n[keys[(keys.length - 1)]] ? prop.i18n[keys[(keys.length - 1)]] : '')
        // remplace each variable
        template = template.replace(element, val)
      })

      return template
    },
    toggleBlock () {
      this.badge = 0
      this.isActive = !this.isActive

      if (!this.toggle) {
        this.$http.get('user/notifications/limit/' + this.limit + '/page/' + this.page).then(function (response) {
          console.log('notif:', response.data.data)
          // this.notifications = this.setNotificationData(response.data.data)
          this.notifications = response.data.data
          this.notificationloaded = true
          this.page += 1
          this.toggle = true
        })
      }

      this.$http.post('user/change-notification-status')
    }
  },
  created () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.notifications{
  position: absolute;
  width: 350px;
  right:0;
  border: 2px solid #e8e8e8;
  background: #fff;
  box-shadow: 0px 0px 17px 0px #2f2f2f5c;
  margin-top: 7px;
  padding: 0 7px;
  max-height: 450px;
  overflow: auto;
}
.notifications-icon {
  cursor: pointer;
  display: initial;
    vertical-align: -webkit-baseline-middle;
}

p {
    margin: 0 0 1em;
    font-size: 11px;
    letter-spacing: 0.2px;
    line-height: 15px;
}

.notification {
    overflow: hidden;
    padding: 0 0 5px 22px;
    border-bottom: 1px solid #4c78bb9e;
    *zoom: 1;
}

.notification-icon {
    float: left;
    margin: 10px 27px 0 6px;
    border-radius: 5px;
    overflow: hidden;
}

.notification-icon img {
    display: block;
}

.notifications-active {
  /* opacity: 0.7; */
}

.notification-body {
    overflow: hidden;
}

.notification .text {
    padding: 7px;
    margin-top: 3px;
    border: 1px solid #dedede;
    border-radius: 5px;
    background: #fff;
}

.notification .text p:last-child {
    margin: 0;
}

.notification .attribution {
    margin: 0.5em 0 0;
    font-size: 10px;
    color: #666;
}

.notification .attribution span{
    right: 5px;
    position: absolute;
}

/* Decoration */
.notification {
    position: relative;
}

.notifications-block:before,
.notifications:before,
.notification:before,
.notification .text:before {
    content: "";
    position: absolute;
    top: 0;
    left: 6px;
}

.notification:before {
    width: 7px;
    height: 7px;
    border: 3px solid #fff;
    border-radius: 100px;
    margin: 11px 0 0 -6px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.61), inset 0 1px 1px rgba(0,0,0,0.1);
    background: #ccc;
}

.notification:hover:before {
    background: #4c79bb;
}

.notification .text:before {
    top: 14px;
    left: 18px;
    width: 7px;
    height: 7px;
    border-width: 0 0 1px 1px;
    border-style: solid;
    border-color: #dedede;
    background: #fff;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
}

.notifications-block:before {
    top: 67px!important;
    left: 28px!important;
    width: 7px;
    height: 7px;
    border-width: 1px 0 0 1px;
    border-style: solid;
    border-color: #e5e5e5;
    background: #fff;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
}

/* ---- badge -------------*/
.top-icon, .bottom-icon{
  display: table;
  margin: 0 auto;
}
.badge{
    padding: 1px 3px;
    border: 1px solid #ce4141;
    background: #ce4141;
    color: #fff;
    border-radius: 50%;
    font-size: 11px;
    position: absolute;
    top: 10px;
    left: 2px;
}

.load-more {
  background-color: #e8e8e8;
  text-align: center;
  margin: 2px -7px 0px -7px;
  padding: 2px;
  cursor: pointer;
  font-size: 14px;
  color: #797979;
}
</style>
