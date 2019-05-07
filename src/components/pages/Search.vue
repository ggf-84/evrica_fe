<template >
  <div v-if="loaded" class="search-page">
      <h3>{{ result.length }} results was found for <span class="key-search"> {{ key }}</span></h3>
      <ol>
        <li v-for="(search,index) in result" v-bind:key="index">
        <router-link :to="{ path: '/page/edit' + (search.table == 'users' ? 'user' : search.table) + '/' + search.id }"> 
        {{ search.searchKey }} 
        </router-link>
        <span class="table-search"> in  {{ search.table }} </span>
      </li>  
      </ol>
  </div>
  <div v-else>
    <h3>0 results was found for <span class="key-search"> {{ key }}</span></h3>
  </div>
</template>

<script>

export default {
  name: 'Search',
  data () {
    return {
      result: {},
      loaded: false,
      key: ''
    }
  },
  components: {},
  created: function () {
    this.key = this.$router.currentRoute.params.key
    this.$http.get('search/' + this.$router.currentRoute.params.key + '/' + this.$router.currentRoute.params.filter)
        .then(function (response) {
          this.result = response.data.data
          this.loaded = true
        })
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scss">
.search-page li{
    line-height: 1.7;
    font-size: 15px;
}
.search-page li .table-search{
    font-size: 14px;
    color: #cc3333;
    margin-left: 15px;
}
.search-page .key-search{
    color: #3894b7;
}
</style>
