<!-- <template>
<div class="auth">
  <form v-on:submit.prevent="onSubmit">
  <input type="text" placeholder="email" v-model="auth.email" required>
  <input type="password" placeholder="password" v-model="auth.password" required>
  <button type="submit">Login</button>
  </form>
</div>
</template> -->

<template>
  <div class="auth">
    <form  class="form" v-on:submit.prevent="onSubmit">
        <div class="form_group big b_9 fln mia">
            <input class="form_control w100p ffg clb" type="text" v-model="auth.email" required placeholder="E-mail">
        </div>
        <div class="form_group big b_9 fln mia">
            <input class="form_control w100p ffg clb" type="password" v-model="auth.password" required placeholder="Пароль">
        </div>

        <div class="form_group medium inline b_9 fln mia">
            <div class="checkreg b_12 ">
                <input type="checkbox" value="Y" checked="checked">
                <label class="custon_style"></label>
                <label>Запомнить меня на этом компьютере</label>
            </div>
            <div style="clear: both;"></div>
        </div>


        <div class="form_group inline tal b_9 fln mia">
            <div class="form_group inline b_12" style="margin-bottom: 0;">
                <input type="submit" class="bx-btn fll big bdr50 blue cm-padding" value="ВОЙТИ">
                <div class="reg_link fll posr" style="bottom: -1px;margin-left: 20px;"><a href="#">Забыли пароль?</a></div>
            </div>
        </div>

        <div style="clear: both;"></div>
    </form>
  </div> 
</template>



<script>
import { mapGetters } from 'vuex'
import authMixin from '../../../mixins/modules/auth'

export default {
  computed: mapGetters(['getToken', 'authorized', 'is_error', 'auth_error']),
  data: function () {
    return {
      auth: {
        email: 'test@mail.com',
        password: 'test'
      }
    }
  },
  mixins: [authMixin],
  methods: {
    onSubmit: function () {
      var self = this
      this.$store.dispatch('auth', {
        email: this.auth.email,
        password: this.auth.password
      })
      .then(response => {
        if (!self.is_error) {
          self.$store.dispatch('afterSuccessAuth').then(() => {
            self.$router.push({ name: 'Main' })
          })
        }
      })
    }
  },
  created: function () {
    this.authTest()
  }
}
</script>
