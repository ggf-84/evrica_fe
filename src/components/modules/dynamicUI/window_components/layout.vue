<template>
  <div v-if="schema.layout && !schema['data-source'] && schema.children && !schema.children.submit" :class="schema.layout.type"
  :style="['HorizontalList'].includes(schema.layout.type) ? {width:schema.width,height:schema.height} : {}">

    <div class="element-block" v-if="['VerticalList','HorizontalList'].includes(schema.layout.type)" 
      v-for="(child, index) in schema.children" :key="index" 
      v-bind:class="(child.class ? child.class : '') + ' ' + (child.align ? 'position-' + child.align : '')" 
      :style="{width:child.width}">

      <dynamicLayout v-if="child.layout" :schema="child" :id="id"/>
      <component v-else :is="'dynamic'+child.type" :schema="child" :id="id"/>

      <div v-if="['left','right'].includes(child.align)" class="both"></div>
    </div>

    <div class="tabs-content" v-if="schema.layout.type == 'tabs'" v-bind:class="schema.class ? schema.class : ''" 
      :style="{width:schema.width,height:schema.height}" >

      <el-tabs type="card">
        <div v-for="(child, index) in schema.children" :key="index" >
          <el-tab-pane :label="index">
            <dynamicLayout v-if="child.layout" :schema="child" :id="id"/>
            <component v-else :is="'dynamic'+child.type" :schema="child"/>
          </el-tab-pane>
        </div>
      </el-tabs>

    </div>

    <div class="accordion-content" v-if="schema.layout.type == 'accordion'" v-bind:class="schema.class ? schema.class : ''" 
      :style="{width:schema.width,height:schema.height}">

      <el-collapse :accordion="schema.layout.multiexpand ? false : true">
        <el-collapse-item  v-for="(child, index) in schema.children" :key="index">
          <template slot="title">
            <dynamicLayout v-if="child.close" :schema="child.close" :id="id"/>
            <component v-else :is="'dynamic'+child.type" :schema="child"/>
          </template>
          <div>
            <dynamicLayout v-if="child.expand" :schema="child.expand" :id="id"/>
            <component v-else :is="'dynamic'+child.type" :schema="child"/>
          </div>
        </el-collapse-item>
      </el-collapse>

    </div>

  </div>
  <div v-else >
    <dynamicform v-if="schema['data-source'] || (schema.children && schema.children.submit)" :schema="schema" :selected="id"/>
  </div>
</template>

<script>
import Vue from 'vue'
import dynamicLayout from '../window_components/layout'
import Components from '../components'

Vue.component('dynamicLayout', dynamicLayout)
export default {
  name: 'dynamicLayout',
  computed: {
    returnSchema: function () {
      if (this.schema != null) {
        return this.schema
      }

      return {}
    },
    returnId: function () {
      if (this.id != null) {
        return this.id
      }
    }
  },
  data () {
    return {}
  },
  props: {
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    },
    id: {
      type: String,
      default: '0'
    }
  },
  components: Components
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.HorizontalList, .HorizontalList div.element-block{
  position: relative;
  vertical-align: initial;
  display: inline-table!important;
}
.VerticalList, .VerticalList div.element-block{
  position: relative;
}
.header-layout{
  background-color: #4b545f
}
.body-layout{
}
.body-layout>div{
  margin: 0 auto;
}

</style>

<style>
.accordion-content i{
 display: none!important;
}
.el-tabs__nav {
  z-index: 1;
}
.vposition-center{
    top: 50%;
    transform: translateY(-50%);
    z-index: 9999;
} 
.position-right{ 
  float: right;
  right: 0;
}
.position-center{
  margin: 0 auto;
}
.both{
  clear: both;
}
.element-block .inline-menu {
  vertical-align:top!important;
}
.logo-button{
    background-color: transparent;
    border: none;
    outline: none;
}
.header-whatch{
  font-size: 38px!important;
  font-family: inherit;
  line-height: 0;
  color:#fff!important;
  position:initial!important;
}
</style>
