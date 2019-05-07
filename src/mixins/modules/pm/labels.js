export default {
  methods: {
    labelIsUsed: function (color) {
      let label = this.currentTask.labels.find(function (element) {
        return parseInt(element.color_id) === parseInt(color)
      })

      if (label) return true

      return false
    },
    getLabelTitleByColor: function (colorID) {
      let data = this.boardLabels.find(function (element) {
        return parseInt(element.color_id) === parseInt(colorID)
      })

      if (data) {
        return data.title
      }
    },
    loadLabels: function () {
      this.updateLabels = false
      let data = {
        event: 'loadTaskLabels',
        data: {
          task: this.currentTask
        }
      }

      this.$socket.json.send(data)
    },
    // add or remove label from task
    refreshLabel: function (color) {
      let label = this.boardLabels.find(function (element) {
        return parseInt(element.color_id) === parseInt(color)
      })

      let data = {
        event: 'refreshLabel',
        data: {
          task: this.currentTask.id,
          label: label ? label.id : 0,
          color: color
        }
      }
      this.$socket.json.send(data)
    },
    // display update form for label
    updateLabel: function (color) {
      if (color.id) {
        this.updateLabels = true
        this.selectedColor = color
        this.selectedLabel = {
          id: null,
          task: this.currentTask.id,
          title: '',
          color: color,
          board: this.getBoard
        }

        let label = this.boardLabels.find(function (element) {
          return parseInt(element.color_id) === parseInt(color.id)
        })

        // set current selected color or label for update
        if (label) {
          this.selectedLabel.id = label.id
          this.selectedLabel.title = label.title
          this.selectedLabel.color = label.color
        }
      }
    },
    // save new label
    saveLabel: function () {
      let data = {
        event: 'saveLabel',
        data: this.selectedLabel
      }

      this.$socket.json.send(data)
      this.updateLabels = false
      this.selectedColor = null
      this.loadLabels()
    }
  }
}
