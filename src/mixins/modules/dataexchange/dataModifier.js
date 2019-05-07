import momentTz from 'moment-timezone'
import moment from 'moment'

export default {
  methods: {
    moment: function (date) {
      return moment(date)
    },
    momentTz: function () {
      return momentTz
    },
    localeTime: function (timestamp) {
      let offset, localText, momentTime, createdDate, utcTime
      offset = this.moment().utcOffset()
      utcTime = timestamp
      localText = moment.utc(utcTime).utcOffset(offset).format()
      momentTime = momentTz.tz(localText, this.timezone).format()
      createdDate = this.moment(momentTime).fromNow()
      return createdDate
    },
    humanFileSize: function (bytes, si) {
      var thresh = si ? 1000 : 1024
      if (Math.abs(bytes) < thresh) {
        return bytes + ' B'
      }
      var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
      var u = -1
      do {
        bytes /= thresh
        ++u
      } while (Math.abs(bytes) >= thresh && u < units.length - 1)
      return bytes.toFixed(1) + ' ' + units[u]
    }
  }
}
