<template>
  <ul>

    <li v-for="(item,index) in schema.items" v-bind:key="index">
      <a v-if="!item.action">{{item.title}}</a>
      <router-link v-if="isSubMenu(item) " :to="item.action.link">{{item.title}}</router-link>
      <dynamicMenu :schema="item"/>
    </li>



  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import dynamicMenu from '../window_components/menu.vue'

export default {
  name: 'dynamicMenu',
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
  components: {
    dynamicMenu
  },
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
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #1bc2a2;
  z-index: 999;
}

ul li {
  display: block;
  position: relative;
  float: left;
  background: #1bc2a2;
  min-width: 120px;
  padding: 5px;
  cursor: pointer;
}



/* This hides the dropdowns */

li ul {
  display: none;
}

ul li a {
  display: block;
  padding: 1em;
  text-decoration: none;
  white-space: nowrap;
  color: #fff;
}

ul li a:hover {
  background: #2c3e50;
}

/* Display the dropdown */

li:hover > ul {
  display: block;
  position: absolute;
}

li:hover li {
  float: none;
}

li:hover a {
  background: #1bc2a2;
}

li:hover li a:hover {
  background: #2c3e50;
}

.main-navigation li ul li {
  border-top: 0;
}

/* Displays second level dropdowns to the right of the first level dropdown */

ul ul ul {
  left: 100%;
  top: 0;
}

/* Simple clearfix */

ul:before,
ul:after {
  content: " "; /* 1 */
  display: table; /* 2 */
}

ul:after {
  clear: both;
}
</style>
