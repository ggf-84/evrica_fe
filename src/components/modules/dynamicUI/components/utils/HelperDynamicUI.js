export default {
  methods: {
    // find value in object by string
    fetchFromObject: function (obj, prop) {
      // property not found
      if (typeof obj === 'undefined') return false

      // index of next property split
      var _index = prop.indexOf('.')

      // property split found; recursive call
      if (_index > -1) {
        if (!obj[prop.substring(0, _index)]) return ''
        // get object at property (before split), pass on remainder
        return this.fetchFromObject(
          obj[prop.substring(0, _index)],
          prop.substr(_index + 1)
        )
      }

      if (obj == null) return ''
      // no split; get property
      return obj[prop]
    },
    // search variables in template
    matchVariables: function (template) {
      // magic regex
      let regex = /\$([a-z0-9._]+)\b/g
      if (typeof template !== 'string') return ''
      return template.match(regex)
    },
    // fetch values by metadata
    fetchValueByMetaData: function (obj, prop, metadata) {
      if (metadata['fields'][prop]) {
        if (metadata['fields'][prop]['type'] === 'relation') {
          let result = ''
          // check if prop is in relation
          if (metadata['relations'][prop]) {
            if (metadata['relations'][prop]['short_view']) {
              // get variable
              let variable = metadata['relations'][prop]['short_view']
              let matches = this.matchVariables(variable)

              result = variable
              // iterate every variable in shortview of relation
              matches.forEach(element => {
                // try to get value from data
                let value = this.fetchFromObject(
                  obj,
                  prop + '.' + element.replace('$', '')
                )

                // check if value is found
                if (typeof value !== 'undefined') {
                  result = result.replace(element, value)
                } else {
                  // if value is not find, try to find in i18n
                  let value = this.fetchFromObject(
                    obj,
                    prop + '.i18n.' + element.replace('$', '')
                  )

                  // check if value is set
                  if (typeof value !== 'undefined') {
                    // if value is found in i18n return it
                    result = result.replace(element, value)
                  }
                }
              })

              return result
            }
          }
        } else {
          return this.fetchFromObject(obj, prop)
        }
      } else {
        // if simple variable
        let match = this.matchVariables(prop)
        // check if is set variables in string
        if (match.length) {
          match.forEach(element => {
            let value = this.fetchFromObject(obj, element.replace('$', ''))
            if (value) {
              prop = prop.replace(element, value)
            } else if (typeof value === 'undefined') {
              let item = 'i18n.' + element
              let value = this.fetchFromObject(obj, item.replace('$', ''))
              if (value) {
                prop = prop.replace(element, value)
                return prop
              }
            }
          })
        }
      }

      return prop
    },
    parseUrl: function (url) {
      let vars = this.URLToArray(url)
      let path = url
      let match = url.match(/\?([a-z0-9=]+)\b/g)
      if (!match) return ''
      match.forEach(element => {
        path = path.replace(element, '')
      })
      return (path + '/' + Object.values(vars).join('/'))
    },

    URLToArray: function (queryString) {
      var params = {}
      var queries
      var temp
      var i
      var l
      // Split into key/value pairs
      queries = queryString.split('&')
      // Convert the array of strings into an object
      for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=')
        params[temp[0]] = temp[1]
      }
      return params
    },
    searchProperty: function (obj, prop) {
      // check if prop have dot
      if (prop.indexOf('.') === -1) {
        // if prop is not empty return current value
        if (prop.length !== 0) {
          return prop
        }
        // return null if string is empty and dont have dot
        return null
      }
      let value = this.fetchFromObject(obj, prop)
      // check if value is not found, try to change parameter key and try
      if (value === '') {
        let newProp = prop.substring(prop.indexOf('.') + 1)
        // check if is relation and is empty
        if (newProp === 'id') {
          return prop
        }
        return this.searchProperty(obj, newProp)
      } else {
        // if is relation
        if (value && typeof value === 'object') {
          if (value.id) {
            return prop + '.id'
          }
        }
        // return property if value found
        return prop
      }
    },
    // find value in object by string
    setValueToObject: function (obj, prop, value) {
      // property not found
      if (typeof obj === 'undefined') return false

      // index of next property split
      var _index = prop.indexOf('.')

      // property split found; recursive call
      if (_index > -1) {
        if (!obj[prop.substring(0, _index)]) return ''
        // get object at property (before split), pass on remainder
        return this.setValueToObject(
          obj[prop.substring(0, _index)],
          prop.substr(_index + 1),
          value
        )
      }

      if (obj == null) return ''
      // set property
      obj[prop] = value

      return obj[prop]
    },
    // generate empty object by metadata (for insert action)
    generateEmptyObject (obj, prop, metadata) {
      // split prop
      let parts = prop.split('.')
      if (parts[1]) {
        let property = parts[1]
        // find field in metadata
        let field = metadata.fields[property]

        let defaultValues = {
          boolean: null,
          string: '',
          text: '',
          number: 0,
          decimal: 0,
          integer: 0
        }

        if (field.type) {
          if (field.type === 'i18n') {
            if (!obj[field.type]) {
              obj[field.type] = {}
            }
            obj[field.type][property] = ''
          } else if (field.type === 'relation') {
            if (metadata.relations[property]) {
              if (metadata.relations[property].select === 'single') {
                obj[property] = { id: 0 }
              } else {
                obj[property] = []
              }
            }
          } else {
            obj[property] = defaultValues[field.type]
          }
        }
      }
      return obj
    },
    // convert data before insert/update actions
    convertDataBeforeSend (obj) {
      // convert i18n from object to array of object
      if (obj.i18n) {
        if (typeof obj.i18n === 'object') {
          obj.i18n = [obj.i18n]
        }
      }

      return obj
    }

  }

}
