<template>
<div class="settings">
  <div>
    <form v-on:submit.prevent="updateSettings">
    <!-- with groups -->
    <div v-for="(item, index) in groups" :key="index">
      <h3>{{index}}</h3>
      <div v-for="(field, key) in item" :key="key">
        <einput v-if="fields[field].type == 'text'" :label="fields[field].label" v-model="formData[field]"/>
        <eselect v-if="fields[field].type == 'enum'" :label="fields[field].label" :multiple="(fields[field].multiple)?fields[field].multiple:false" :items="enums[field]" v-model="formData[field]"></eselect>
        <eradio v-if="fields[field].type == 'boolean'" :label="fields[field].label" v-model="formData[field]" :items="enums[field]"></eradio>
      </div>
    </div>
    <button  type="submit">Update</button>
    </form>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'

import einput from '../settings/components/input'
import eselect from '../settings/components/select'
import eradio from '../settings/components/radio'

export default {
  computed: mapGetters(['metadataSettings', 'allSettings']),
  data: function () {
    return {
      schema: null,
      groups: [],
      fields: [],
      enums: [],
      formData: {}
    }
  },
  components: {
    einput,
    eselect,
    eradio
  },
  methods: {
    parseMetaData: function () {
      // parse data to vars
      this.groups = this.schema.groups
      this.fields = this.schema.fields
      this.enums = this.schema.enum
    },
    getSettings: function () {
      this.formData = this.allSettings
    },
    updateSettings: function () {
      var self = this
      this.$store.dispatch('updateSettings', this.formData).then(function (response) {
        self.parseMetaData()
        self.getSettings()
      })
    }
  },

  created: function () {
    var self = this
    this.$store.dispatch('getSettingsMetaData').then(function () {
      self.schema = self.metadataSettings.settings
      self.parseMetaData()
      self.getSettings()
    })
  }
}
</script>
