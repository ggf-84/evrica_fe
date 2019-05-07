<template>
  <transition name="modal">
    <div class="modal-mask" id="modal-mask" v-if="showModal">
        <div class="modal-container" id="modal-container" :style="{width:schema.width,height:schema.height}" 
             v-bind:class="schema.fade ? schema.fade : ''">
            <div @click="closemodal" class="close-modal">x</div>
            <div class="modal-body">
                <dynamicLayout :schema="schema" :id="id"/>
            </div>
        </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import dynamicLayout from '../window_components/layout'

export default {
  name: 'dynamicmodalwindow',
  computed: mapGetters(['getSchema', 'getMetaDataErrors']),
  data () {
    return {
      showModal: true
    }
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
  components: dynamicLayout,
  methods: {
    closemodal: function () {
      this.showModal = false
    }
  },
  created: function () {
    setTimeout(function () {
      var top = Math.ceil((window.innerHeight - document.getElementById('modal-container').offsetHeight) / 2)
      document.getElementById('modal-container').style['margin-top'] = top + 'px'
    }, 50)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
    box-sizing: border-box;
}

.modal-mask {
    position: fixed;
    z-index: 99999999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: .5s;
}

.modal-container {
    width: 300px;
    margin: 0 auto 0;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: .5s;
    font-family: Helvetica, Arial, sans-serif;
    overflow: auto;
}

.modal-body {
    margin: 20px 0;
}

/* .modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: translate(100%,0);
  transform: translate(100%,0);
} */
.modal-enter .left,
.modal-leave-active .left {
  -webkit-transform: translate(-100%,0);
  transform: translate(-100%,0);
}
.modal-enter .right,
.modal-leave-active .right {
  -webkit-transform: translate(100%,0);
  transform: translate(100%,0);
}
.modal-enter .up,
.modal-leave-active .up {
  -webkit-transform: translate(0,-100%);
  transform: translate(0,-100%);
}
.modal-enter .down,
.modal-leave-active .down {
  -webkit-transform: translate(0,100%);
  transform: translate(0,100%);
}

.close-modal{
    position: absolute;
    cursor: pointer;
}

#show-modal{
  border: none!important;
  background-color: transparent!important;
  padding: 0!important
}
</style>
