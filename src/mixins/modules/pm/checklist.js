export default {
  methods: {
    addChecklist: function () {
      let request = {
        event: 'addChecklist',
        data: {
          task: this.currentTask.id,
          title: this.newChecklist.title
        }
      }
      this.newChecklist = {}
      this.$socket.json.send(request)
    }
  }
}
