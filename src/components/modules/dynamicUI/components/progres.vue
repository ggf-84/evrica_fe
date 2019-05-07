<template>
  <div role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" class="el-progress el-progress--line">
    <div class="el-progress-bar">
      <div class="el-progress-bar__outer" style="height: 6px;">
        <div class="el-progress-bar__inner" style="width: 40%;"><!----></div>
      </div>
    </div>
    <div class="el-progress__text" style="font-size: 14.4px;">40%</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import helper from '../components/utils/HelperDynamicUI'

export default {
  name: 'dynamicprogres',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {
      showModal: false
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
    },
    id: {
      type: String,
      default: '0'
    }
  },
  components: {},
  methods: {}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-progress {
    position: relative;
    line-height: 1;
    width: 400px
}
.el-progress-bar {
    padding-right: 50px;
    width: 100%;
    margin-right: -55px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.el-progress-bar__outer {
    height: 6px;
    border-radius: 100px;
    background-color: #ebeef5;
    overflow: hidden;
    position: relative;
    vertical-align: middle;
}
.el-progress-bar__inner {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: #409EFF;
    text-align: right;
    border-radius: 100px;
    line-height: 1;
}
.el-progress__text {
    font-size: 14px;
    color: #606266;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    line-height: 1;
}
</style>
