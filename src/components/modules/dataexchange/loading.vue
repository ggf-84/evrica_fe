<template>
<div class="loader-container">
  <transition name="fade">
    <div v-if="returnLoading">
     <div class="loader" id="loader-1"></div>
   </div>
  </transition>
</div>
</template>

<script>
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'

export default {
  data () {
    return {
      dataLoading: false
    }
  },
  mixins: [
    dataMixin
  ],
  computed: {
    returnLoading: {
      get () {
        this.dataLoading = this.loading
        return this.dataLoading
      }
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  components: {
  },
  mounted () {
  },
  created () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.loader-container{
  display: block;
  width: 35px;
  height: 35px;
}

.loader{
  width: 35px;
  height: 35px;
  border-radius: 100%;
  position: relative;
  margin: 0 auto;
}


#loader-1:before, #loader-1:after{
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: 10px solid transparent;
  border-top-color: #3498db;
}

#loader-1:before{
  z-index: 100;
  animation: spin 1s infinite;
}

#loader-1:after{
  border: 10px solid #ccc;
}

@keyframes spin{
  0%{
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100%{
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

</style>
