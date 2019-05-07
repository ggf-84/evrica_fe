<template>
<div>
   Edit File
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data () {
    return {
      hashElement: ''
    }
  },
  components: {
  },
  methods: {
  },
  mounted () {
    this.hashElement = this.$route.params.hash
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
