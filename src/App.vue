<template>
  <div id="app">
    <!-- unloged -->
    <dynamicBody v-if="authorized" />
    <body class="home" v-else>
      <div class="wrap ">
        <div class="header m0a ">
            <div class="b_6">
                <a href="/" class="b24networlk_logo" style="background-image: url('../src/assets/img/b24network_darklogo_ru.png');"></a>
            </div>
            <div class="b_6 clb container_profile">
                <div class="b_2 block_Language popup_container" id="b24net_lang_block" >
                    <div class="active" @click="showlang()">
                      <span class="selected_lng icon lng_ru">
                        <span class="arrow"></span>
                      </span>
                    </div>
                     <!-- select-lang  -->
                    <div v-if="showLang" id="menu-popup-lang-popup" class="popup-window popup-window-no-paddings lng_container" 
                    style="z-index:1000;position:absolute;display:block;top:50px;left:-15px;">
                      <div id="popup-window-content-menu-popup-lang-popup" class="popup-window-content">
                          <div class="menu-popup" style="display: block;">
                              <div class="menu-popup-items">
                                  <span class="menu-popup-item icon lng_ru">
                                      <span class="menu-popup-item-icon"></span>
                                      <span class="menu-popup-item-text">Русский</span>
                                  </span>
                                  <span class="menu-popup-item icon lng_en">
                                      <span class="menu-popup-item-icon"></span>
                                      <span class="menu-popup-item-text">English</span>
                                  </span>
                                  <span class="menu-popup-item icon lng_de">
                                      <span class="menu-popup-item-icon"></span>
                                      <span class="menu-popup-item-text">Deutsch</span>
                                  </span>
                              </div>
                          </div>
                      </div>
                      <div class="popup-window-angly popup-window-angly-top" style="left: 45px; margin-left: 0px;"></div>
                    </div>

                </div>
            </div>
        </div>
        <div class="ovh">

            <div class="m0a workarea reg">
                <div class="login_block_page">
                    <div class="b_6 tal reg_link clb active">Авторизация</div>

                    <div style="clear: both;"></div>
                    <hr class="b_line_gray">

                    <div class="b_12">
                      <div class="good_message">
                        <span id="b24net_auth_error"> 
                          Чтобы войти на <span class="imp">domen.evrica.com</span>, пожалуйста, авторизуйтесь с вашим E-mail и паролем.				
                        </span>
                      </div>
                    </div>

                    <div class="form_group inline b_9 fln m0a">
                        <div style="clear: both;"></div>
                    </div>

                    <div style="clear: both;"></div>

                    <auth/>

                </div>
            </div>

            <div class="footer container home tac"></div>
        </div> 
      </div>
    </body>
   
  </div>
</template>
<script>

import language from '../src/components/modules/settings/language.vue'
import Auth from '../src/components/pages/Auth.vue'
import dynamicBody from '../src/components/pages/Body.vue'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      showLang: false
    }
  },
  computed: mapGetters(['authorized']),
  components: {
    language,
    Auth,
    dynamicBody
  },
  methods: {
    showlang () {
      this.showLang = !this.showLang
    }
  }

}
</script>
<style>
 .upload-pm-container .el-upload-dragger{
  width: 100%;
}
</style>
<style scoped="scss" src="@/assets/style/main.css"></style>
