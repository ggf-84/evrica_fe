<template>
<div>
  <el-form :model="validateForm" ref="validateForm" label-width="100px">

    <el-form-item label="Link title" prop="title" :rules="[
            { required: true, message: 'title is required'}
          ]">
      <!-- input title -->
      <el-input class="input-public" placeholder="Title" v-model="validateForm.title" clearable>
      </el-input>
      <!-- end input title -->
    </el-form-item>


    <el-form-item label="Description" prop="description">

      <!-- input description -->
      <el-input class="input-public" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Link description" v-model="validateForm.description">
      </el-input>
      <!-- end input description -->

    </el-form-item>


    <el-form-item label="Password" prop="password">
      <!-- input password -->
      <el-input class="input-public" placeholder="Link password" v-model="validateForm.password">
      </el-input>
      <!-- end input password -->
    </el-form-item>

    <el-form-item label="Email to" prop="email"
      :rules="[
      { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
      ]"
      >
      <!-- input email -->
      <el-input class="input-public" placeholder="Send link via email" v-model="validateForm.email">
      </el-input>
      <!-- end input email -->
    </el-form-item>


    <el-form-item label="Expiration" prop="expiration">
      <el-date-picker
      v-model="validateForm.expiration"
      type="datetime"
      placeholder="Select date and time">
    </el-date-picker>
      <!-- end input expiration date -->
    </el-form-item>


    <el-form-item>
      <!-- create link  -->
      <el-button type="primary" size="small" @click="submitFormPublicLink('validateForm')">Create Link</el-button>
      <!-- end create link -->
    </el-form-item>

  </el-form>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'
import notifiction from '../../../mixins/modules/notifications/notification'

export default {
  data () {
    return {
      dataItem: [],
      validateForm: {
        email: '',
        title: '',
        description: '',
        password: '',
        expiration: ''
      }
    }
  },
  mixins: [
    dataMixin
  ],
  watch: {
    getCurrentItem: function (val) {
      this.validateForm.title = val.title + ' link'
    }
  },
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
    ...mapGetters(['getToken', 'getUser', 'getCurrentItem'])
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
  created () {
    // set input title
    this.validateForm.title = this.getCurrentItem.title + ' link'
  },
  methods: {
    submitFormPublicLink (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.validateEmail(this.validateForm.email) && this.validateForm.email !== '') {
            notifiction.error('System !', 'Validation error')
          } else {
            this.$emit('sharePublicLink', {data: this.validateForm, type: 'public'})
          }
        } else {
          notifiction.error('System !', 'Validation error')
          return false
        }
      })
    },
    validateEmail (email) {
      var re = /\S+@\S+\.\S+/
      return re.test(email)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
