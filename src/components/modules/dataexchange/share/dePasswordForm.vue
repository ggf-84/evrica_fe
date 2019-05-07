<template>
<div>
  <el-form :model="validateForm" ref="validateForm" label-width="100px" class="demo-ruleForm">
    <el-form-item
      label="password"
      prop="password"
      :rules="[
        { required: true, message: 'password is required'}
      ]"
    >
      <el-input type="password" v-model.number="validateForm.password" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('validateForm')">Submit</el-button>
      <el-button @click="resetForm('validateForm')">Reset</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../../mixins/modules/dataexchange/dataModifier.js'

export default {
  data () {
    return {
      validateForm: {
        password: ''
      }
    }
  },
  mixins: [
    dataMixin
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
    ...mapGetters(['getToken', 'getUser'])
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {},
  mounted () {},
  created () {},
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submitForm', this.validateForm)
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
