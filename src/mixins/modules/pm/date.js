import moment from 'moment'
var locale = window.navigator.userLanguage || window.navigator.language

export default {
  methods: {
    showDueDate: function () {
      console.log('show date')
    },
    formatDate: function (date) {
      return moment(date)
        .locale(locale)
        .format('DD MMMM YYYY, HH:mm:ss ')
    },
    showUpdateDate: function () {
      this.$refs.dueDate.click()
    },
    setDueDate: function () {
      var date = this.currentTask.due_date

      let data = {
        event: 'setDueDate',
        data: {
          date: date,
          task: this.currentTask.id
        }
      }
      console.log(data)

      this.$socket.json.send(data)
    }
  }
}
