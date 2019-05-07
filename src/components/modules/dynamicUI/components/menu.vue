<template>
  <ul :class="(schema.type && schema.type == 'menu' && schema.class) ? schema.class : ''">

    <li v-for="(item,index) in schema.items" v-bind:key="index">

      <a v-if="!item.action" :class="item.class ? item.class : ''">
        <img v-if="item['top-icon']" v-bind:src="item['top-icon']" class="top-icon">
        <img v-if="item['left-icon']" v-bind:src="item['left-icon']" class="left-icon">
        <span>{{item.title}}</span>  
        <dynamicbadge v-if="item.badge" :schema="item.badge"/>
        <dynamiclogin v-if="item.login"/>
        <dynamicmodal v-if="item.modal" :schema="item.modal"/>
        <img v-if="item['right-icon']" v-bind:src="item['right-icon']" class="right-icon">
        <img v-if="item['bottom-icon']" v-bind:src="item['bottom-icon']" class="bottom-icon">
      </a>

      <router-link v-if="isSubMenu(item) " :to="item.action.link" :class="item.class ? item.class : ''">
        <img v-if="item['top-icon']" v-bind:src="item['top-icon']" class="top-icon">
        <img v-if="item['left-icon']" v-bind:src="item['left-icon']" class="left-icon">
        <span>{{item.title}}</span> 
        <dynamicbadge v-if="item.badge" :schema="item.badge"/>
        <dynamiclogin v-if="item.login"/>
        <dynamicmodal v-if="item.modal" :schema="item.modal"/>
        
        <img v-if="item['right-icon']" v-bind:src="item['right-icon']" class="right-icon">
        <img v-if="item['bottom-icon']" v-bind:src="item['bottom-icon']" class="bottom-icon">
      </router-link>

      <dynamicmenu :schema="item"/>

    </li>

  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import dynamicmenu from '../components/menu'
import dynamicbadge from '../components/badge'
import dynamiclogin from '../components/login'
import dynamicmodal from '../components/modal'

export default {
  name: 'dynamicmenu',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {}
  },
  props: {
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {dynamicmenu, dynamicbadge, dynamiclogin, dynamicmodal},
  methods: {
    isSubMenu: (item) => {
      if (item.action && item.action.type === 'nav' && item.action.linktype) {
        return true
      }
      return false
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inline-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  /* background: #39383b; */
}

.inline-menu li {
  display: block;
  position: relative;
  float: left;
  /* background: #4d4c50; */
  /* min-width: 120px; */
  padding: 5px;
  cursor: pointer;
}



/* This hides the dropdowns */

.inline-menu li ul {
  display: none;
  padding-left: 0;
  background: #eef2f4;
  z-index: 2!important;
}

.inline-menu ul li a {
  display: block;
  padding: 1em;
  text-decoration: none;
  white-space: nowrap;
  color: #4b759c;
}

.inline-menu ul li a:hover {
  background: #e6eaed;
}

/* Display the dropdown */

.inline-menu li:hover > ul {
  display: block;
  position: absolute;
}

.inline-menu li:hover li {
  float: none;
}

.inline-menu .main-navigation li ul li {
  border-top: 0;
}

/* Displays second level dropdowns to the right of the first level dropdown */

.inline-menu ul ul ul {
  left: 100%;
  top: 0;
}

/* Simple clearfix */

.inline-menu ul:before,
.inline-menu ul:after {
  content: " "; /* 1 */
  display: table; /* 2 */
}

.inline-menu ul:after {
  clear: both;
}

.top-icon, .bottom-icon{
  display: table;
  margin: 0 auto;
}
/* ========================================= */

.vertical-menu {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.vertical-menu li {
  display: block;
  position: relative;
  background: #eef2f4;
  padding: 5px;
}

/* This hides the dropdowns */
.vertical-menu li ul li ul,
.vertical-menu li ul {
  display: block;
  padding-left: 0;
  z-index: 2!important;
}

.vertical-menu li ul li ul {
  display: none;
}

.vertical-menu ul li a {
  display: block;
  padding: 1em;
  text-decoration: none;
  white-space: nowrap;
  color: #535c69;
}

.vertical-menu ul li ul li a:hover {
  background: #9f9fa0;
}

/* Display the dropdown */

.vertical-menu li ul li:hover > ul {
  display: block;
  position: absolute;
}

.vertical-menu li:hover li {
  float: none;
}

.vertical-menu li:hover{
  color: #e6eaed !important;
}

.vertical-menu .main-navigation li ul li {
  border-top: 0;
}

/* Displays second level dropdowns to the right of the first level dropdown */

.vertical-menu ul ul ul {
  left: 100%;
  top: 0;
}

/* Simple clearfix */

.vertical-menu ul:before,
.vertical-menu ul:after {
  content: " "; /* 1 */
  display: table; /* 2 */
}

.vertical-menu ul:after {
  clear: both;
}

/*==================*/

.inline-menu .button {
    border: 1px solid #bdbdbd;
    padding: 2px 7px;
    background: #6280af;
    text-decoration: none;
    color: #fff;
    cursor: pointer;
    border-radius: 3px;
}
.inline-menu .button:hover {
  opacity: 0.7;
}
</style>
