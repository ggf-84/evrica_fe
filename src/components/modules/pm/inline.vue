<template>
<div class="inline-container">

  <div class="inline-label" v-if="!edit" @click="toogle(this,computedValue)" >
    {{computedValue}}
  </div>

 <input type="text" class="inline-input"  ref="input"  v-model="computedValue"   v-if="edit"  @blur="save()">

</div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'inline',
  data () {
    return {
      item: null,
      edit: false
    }
  },
  computed: {
    computedValue: {
      get () {
        this.item = this.value
        return this.item
      },
      set (val) {
        this.item = val
        this.$emit('input', val)
      }
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    toogle (el, value) {
      this.edit = !this.edit
      var self = this
      Vue.nextTick(function () {
        self.$refs.input.focus()
      })
    },
    save () {
      // check if input si not empty
      if (this.computedValue.trim() !== '') {
        this.edit = false
        this.$emit('change')
      }
    }
  }
}
</script>
<style scoped>
.inline-container {
  text-align: left;
  font-weight: bold;
  text-align: left;
  padding-left: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  display: inline-block;

}
</style>

