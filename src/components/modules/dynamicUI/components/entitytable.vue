<template>
<div style="overflow: auto;" class="info-table" v-if="isLoad">   
  <!-- Main search field -->
	<input type="text" v-model="search" v-on:keyup="filterBy('all-fields')" placeholder="{!!search!!}" v-if="mainSearch" /><br>	

  <!-- Clear filters button -->
	<button @click="filterBy('clear-filter')"  v-if="(searchByColumn || predefinedFilters) && !filterCleared">{!!Clear Filter!!}</button><br>
  
  <!-- List of predefined-filters -->
	<ul class="predefined-filters" v-if="predefinedFilters">
		<li v-for="(predefinedFilter,index) in predefinedFilters" :key="index">
			<button @click="filterBy('predefined-filter', predefinedFilter.filter)" class=" "
												v-bind:class="{ active: filterSelected[predefinedFilter.filter] }" >{{ predefinedFilter.i18n.title }}
			</button>
		</li>
	</ul>

  <!-- data table  -->
	<table>
    <!-- table header -->
		<thead>
			<tr>
				<th v-if="setting && setting.selected" class="selected-all">
					<input type="checkbox" @click="toggleAll" :checked="selected.length !== 0 ? true : false" />
				</th>
				<th v-for="(cell,indexcell) in cells" :key="indexcell"
         v-bind:style="[cell.width ? {'width':cell.width} : '', cell.align ? {'text-align':cell.align} : '']">
          <span @click="cell.sortable ? changeSort(cell.field) : ''">
						<img v-bind:src="cell.icon.source" v-if="cell.icon && cell.icon.align != 'right'">
						<div>
							<span v-if="cell.sortable && column === cell.field && sortSign !== ''" >
                <i class="sort-field">&nbsp;↑&nbsp;</i>
              </span>
							<span v-if="cell.sortable && column === cell.field && sortSign !== '-'">
                <i class="sort-field">&nbsp;↓&nbsp;</i>
              </span>
							<span>{{ cell.label }}</span>
						</div>
						<img v-bind:src="cell.icon.source" v-if="cell.icon && cell.icon.align == 'right'">
					</span>

          <!-- Search input for searchable fields -->
					<input type="text" v-if="cell.searchable && !cell.relation_path && ['bool','date'].includes(cell.class) === false" 
										v-model="searchByColumn[cell.field]" v-on:keyup="filterBy(cell.field)"/>

          <!-- Select for relation searchable fields -->
          <div class="relation-select-block">
            <multiselect v-if="cell.searchable && cell.relation_path" 
                class="relation-select"
                v-model="searchByColumn[cell.relationField]"
                v-bind:placeholder="'{!!Find ' + cell.field + '!!}'"
                select-label=""
                :id="cell.field"
                label="option_title"
                track-by="id"
                :options="selectOptions"
                :close-on-select="true"
                @search-change="asyncFind"
                @close="checkRelation(cell.relationField)">
            </multiselect>
            <div class="clear-relation-select" v-if="searchByColumn[cell.relationField] && searchByColumn[cell.relationField].id" 
              @click="clearSelectVal(cell.relationField)">✖
            </div>
          </div>

          <!-- Date picker -->
          <div style="text-align:left">
            <el-date-picker v-if="cell.searchable && ['date'].includes(cell.class)"
              v-model="date"
              type="daterange"
              start-placeholder="{!!start!!}"
              end-placeholder="{!!end!!}"
              :default-time="['12:00:00']"
              :value-format="valueformat"
              @change="filterBy(cell.field, false, true)">
            </el-date-picker>
          </div>

          <!-- Select for boolean fields -->
					<select v-if="cell.searchable && ['bool'].includes(cell.class)" class="select-boolean"
										v-model="searchByColumn[cell.field]" @change="filterBy(cell.field, false, true)">
						<option value="">{!!all!!}</option>
						<option value="1">{!!active!!}</option>
						<option value="0">{!!inactive!!}</option>
					</select>
				</th>
			</tr>
		</thead>

    <!-- table body -->
		<tr v-for="(item,k) in data" :key="k" v-if="dataLoad">
			<td @click="toggleItem(item)" v-if="setting && setting.selected" class="selected-all">
				<input type="checkbox" :checked="selected.indexOf(item) !== -1 ? true : false"/>
			</td>

			<td v-for="(cell,index) in cells" :key="index" v-if="cell.menus" 
									v-bind:style="[cell.width ? {'width':cell.width} : '', cell.align ? {'text-align':cell.align} : '']" >
				<span v-for="(values, key) in cell.menus" :key="key" class="data-table-action">
					<span v-for="(button,indexKey) in values" :key="indexKey">
						<div v-if="button.addTo === 'all'" > 
						  <a :class="button.class ? button.class : ''" v-if="button.action.url" @click="submit(button.action, item)" >{{ button.title }}</a>
						  <a :class="button.class ? button.class : ''" v-else @click="towindow(button.action.link, item)" >{{ button.title }}</a>
						</div>
						<div v-else >
							<span v-if="button.action.url">
								<a :class="button.class ? button.class : ''" @click="submit(button.action, item)" 
										v-if="item[button.addTo.field] === button.addTo.value"> {{ button.title }} </a>
							</span>
							<span v-else>
								<a :class="button.class ? button.class : ''" @click="towindow(button.action.link, item)" 
										v-if="item[button.addTo.field] === button.addTo.value"> {{ button.title }} </a>
							</span>
						</div>
					</span>
				</span>
			</td>
			<td v-else v-bind:style="[cell.width ? {'width':cell.width} : '', cell.align ? {'text-align':cell.align} : '']">
				<div v-if="cell.class === 'bool'" v-bind:class="'bool-' + item[cell.field]" ></div>
				<div v-else class="input-title" >
          <router-link class="data-table-link" v-if="cell.action && cell.action.url"
          :target="cell.action.target ? cell.action.target : ''" :to="'/page/'+towindow(cell.action.url, item)">
            {{parseVars(cell.field, k, cell.class)}}
          </router-link>
					<span v-else >{{parseVars(cell.field, k, cell.class)}}</span>
				</div>
			</td>
		</tr>
	</table>

  <!-- Actions to apply for selected items -->
	<span v-for="(values,key) in groupActions" v-if="groupActions && selected" :key="key" class="group-actions">
    <a v-for="(buttonAction,index) in values" :key="index"
      :class="buttonAction.class ? buttonAction.class : ''" 
      @click="submitSelected(buttonAction.action)">{{ buttonAction.title }}
    </a>
	</span>

  <!-- Per page select list -->
  <div v-if="pagination.perPageList.length > 1" class="per-page-list">
    <label for="">{!!Per page!!}</label>
		<select @change="setPerPage()" v-model="pagination.perPage">
      <option v-for="(showPerPage, perPageIndex) in pagination.perPageList" 
        :key="perPageIndex"
        :value="showPerPage">{{ showPerPage }}
			</option>
    </select>
	</div>
  <div v-if="pagination.perPageList.length" class="clear-both"></div>

  <!-- Pagination -->
	<div v-if="paginate && pages > 1">
    <paginate
      :page-count="pages"
      :page-range="5"
      :margin-pages="5"
      :click-handler="toPage"
      :prev-text="'{!!Prev!!}'"
      :next-text="'{!!Next!!}'"
      :container-class="'pagination'"
      :page-class="'page-item'">
    </paginate>
	</div> 
</div>

</template>
<script>
import Vue from 'vue'
import helper from '../components/utils/HelperDynamicUI'
import { mapGetters } from 'vuex'
import Paginate from 'vuejs-paginate'
import Multiselect from 'vue-multiselect'
import {DatePicker, TimeSelect, TimePicker} from 'element-ui'

var searchByCol = []

Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.component('paginate', Paginate)

export default {
  name: 'entitytable',
  mixins: [helper],
  data () {
    return {
      timer: null,
      isLoad: false,
      dataLoad: false,
      metaDataFields: [],
      metaDataRelations: [],
      entity: null,
      data: [],
      paginate: true,
      pagination: {
        page: 1,
        perPage: null,
        perPageList: [],
        sortBy: ''
      },
      searchByColumn: [],
      notSearchable: '',
      selectOptions: [],
      predefinedFilters: [],
      selected: [],
      setting: [],
      cells: [],
      totalItems: null,
      path: '/backend/api/',
      dataSource: '',
      sortSign: '',
      column: '',
      filterSelected: [],
      mainSearch: false,
      search: '',
      valueformat: 'yyyy-MM-dd',
      date: [],
      groupActions: {},
      filterStr: '&',
      filterCleared: true
    }
  },
  props: {
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    returnSchema: function () {
      if (this.schema) {
        if (this.schema.setting && this.schema.setting.perPage) {
          if (this.schema.setting.perPage[0]) {
            this.pagination.perPage = this.schema.setting.perPage[0]
            this.pagination.perPageList = this.schema.setting.perPage
          }
        }

        return this.schema
      }
      return {}
    },
    pages () {
      return (this.pagination.perPage && this.totalItems)
        ? Math.ceil(this.totalItems / this.pagination.perPage)
        : 0
    },
    ...mapGetters(['getMetaData', 'getDynamicUIData'])
  },
  components: {Multiselect},
  methods: {
    init () {
      // check if is set entity & data-source
      if (this.returnSchema['entity'] && this.returnSchema['data-source']) {
        // set current entity
        this.entity = this.returnSchema['entity']
        // generate param object
        var params = {
          path: this.returnSchema['data-source'][this.entity],
          entity: this.entity
        }
        var self = this
        // load metadata for current entity
        if (this.entity) {
          if (!this.getMetaData[this.entity]) {
            this.$store.dispatch('getWindowMetaData', self.entity).then(function () {
              self.setTable(params)
            })
          } else {
            this.setTable(params)
          }
        }

        this.dataLoad = false

        // load entity records
        this.$http.get(params.path).then(response => {
          this.data = response.data.data

          if (response.data.paginate) {
            this.totalItems = response.data.paginate.itemsCount
          }

          this.dataLoad = true
        })
      }
    },
    // get all data and set all function for entity table
    setTable (params) {
      // set Cells from metadata and json cells
      if (this.returnSchema['cells']) {
        if (this.getMetaData[this.entity]) {
          this.metaDataFields = this.getMetaData[this.entity]['fields']
          this.metaDataRelations = this.getMetaData[this.entity]['relations']
          // console.log('metaDataFields: ', this.metaDataFields)
        }

        this.cells = this.returnSchema['cells']
      }

      var list = []
      var notSearchBy = []
      var notSortable = []
      var relations = []

      var matches = params.path.match(/_with=\s*([^&]+)/)
      if (matches[1]) { relations = matches[1].split(/[\s,]+/) }

      if (this.returnSchema['setting']) {
        this.setting = this.returnSchema['setting']

        if (this.setting.search) {
          this.mainSearch = true
        }

        if (this.setting.notSearchBy) {
          notSearchBy = this.setting.notSearchBy
        }

        if (this.setting.notSortable) {
          notSortable = this.setting.notSortable
        }

        if (this.setting.list) {
          list = this.setting.list
        }

        if (this.setting.groupActions) {
          this.groupActions = this.setting.groupActions
        }

        this.getNotSearchable()

        if (this.setting.predefinedFilters) {
          this.getPredefinedFilters()
        }
      }

      if (this.returnSchema['groupActions']) {
        this.groupActions = this.returnSchema['groupActions']
      }

      if (params.path) {
        this.setDataSource(params.path)
      }

      this.setCells(notSearchBy, notSortable, relations, list)
      this.getSearchable(notSearchBy)

      this.isLoad = true
    },
    // set header table by metadata and json cells
    setCells (notSearchBy, notSortable, relations, list) {
      var cells = this.cells
      if (this.metaDataFields) {
        var metafields = this.metaDataFields
        var relation = this.metaDataRelations
        var obj = {}
        var newMeta = []
        var select = ''
        var path = ''

        Object.keys(metafields).map(function (key, index) {
          switch (metafields[key]['type']) {
            case 'boolean':
              Object.assign(metafields[key], { field: key }, { class: 'bool' })
              break
            case 'timestamp':
              Object.assign(metafields[key], { field: key }, { class: 'date' })
              break
            case 'decimal':
              Object.assign(
                metafields[key],
                { field: key },
                { class: 'money_short' }
              )
              break
            default:
              Object.assign(metafields[key], { field: key })
          }
        })

        metafields = Object.values(metafields)
        newMeta = cells.filter(this.getDifference(metafields))

        for (var i = 0; i < metafields.length; ++i) {
          var arrKey = metafields[i]
          // if (hideCells.indexOf(arrKey['field']) === -1) {
          obj = cells.find(o => o.field === arrKey['field'])

          if (arrKey['searchable'] && notSearchBy.indexOf(arrKey['field']) !== -1) {
            arrKey['searchable'] = false
          }

          if (arrKey['sortable'] && notSortable.indexOf(arrKey['field']) !== -1) {
            arrKey['sortable'] = false
          }

          if (obj) {
            var objKey = cells.indexOf(obj)
            var assign = Object.assign(arrKey, cells[objKey])
            newMeta.push(assign)
          } else {
            newMeta.push(arrKey)
          }
          // }
        }

        newMeta.map(function (cell, index) {
          if (relation[cell['field']]) {
            if (
              (select = relation[cell['field']]['select']) &&
              (path = relation[cell['field']]['path']) &&
              select !== 'multiple' &&
              cell['searchable']
            ) {
              if (path.charAt(0) === '/') {
                path = path.slice(1)
              }

              cell['relation_path'] = path
              cell['relationField'] = cell['field'] + '.id'
            }

            if (relations.indexOf(cell['field']) === -1) {
              newMeta.splice(index, 1)
            }
          }
        })

        if (list) {
          this.cells = this.sortedCells(newMeta, list)
        } else {
          this.cells = newMeta
        }
      }
    },
    // get predefined filters
    getPredefinedFilters () {
      var predefinedFilters = []
      var filters = []
      var self = this

      if (this.entity) {
        this.$http
          .get(
            'company_filters?_with=filters&_filters[]=filters.entity-eq=' +
              this.entity
          )
          .then(response => {
            if (response.data.data) {
              predefinedFilters = response.data.data
            }

            predefinedFilters.map(function (filter, index) {
              if (filter && filter['filters'] && filter['filters'][0]) {
                self.filterSelected[filter['filters'][0]['filter']] = false
                filters = filters.concat(Object.values(filter['filters']))
              }
            })

            this.predefinedFilters = filters
            // console.log('pF: ', this.predefinedFilters)
          })
      }
    },
    // sorting table header by list array from json settings
    sortedCells (currentCells, sortingCells) {
      var result = []
      for (var i = 0; i < sortingCells.length; i++) {
        for (var j = 0; j < currentCells.length; j++) {
          if (sortingCells[i] === currentCells[j]['field']) {
            result[i] = currentCells[j]
          }
        }
      }
      result = result.filter(function () { return true })
      // console.log(':', result)
      return result
    },
    // get difference options of metadata and json cells
    getDifference (meta) {
      return function (cells) {
        return (
          meta.filter(function (meta) {
            return meta.field === cells.field
          }).length === 0
        )
      }
    },

    // get variables from template
    parseVars (field, index, hdrClass) {
      let template = ''
      template = field
      let metadata = {}
      // check metadata for entity
      if (this.getMetaData[this.entity]) {
        metadata = this.getMetaData[this.entity]
        // check if metadata fiefd
        if (metadata['fields'][field]) {
          // get value for current label by metadata
          template = this.fetchValueByMetaData(
            this.data[index],
            template,
            metadata
          )
        }
      }
      // check if cell class
      if (hdrClass !== undefined) {
        // set label values by class
        switch (hdrClass) {
          case 'money_short':
            var text = parseInt(template)
            var mults = []
            mults = { 0: '', 1: 'K', 2: 'M', 3: 'B', 4: 'T' }
            var m = 0
            while (text > 100) {
              text = text / 1000
              m++
            }
            text = parseInt(text * 10) / 10.0
            text += mults[m]
            template = text
            break
          case 'date':
            template = template.substring(0, 10)
            break
        }
      }
      return template
    },
    // check or uncheck all
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.data.slice()
    },
    // check or uncheck checkbox
    toggleItem (item) {
      this.selected.includes(item)
        ? this.remove(this.selected, item)
        : this.selected.push(item)
    },
    // sort fields
    changeSort (column) {
      var page = this.pagination.page
      this.column = column

      if (this.pagination.sortBy === column) {
        this.sortSign = this.setSortSign(this.sortSign)
      } else {
        this.pagination.sortBy = column
        this.sortSign = this.setSortSign(this.sortSign)
      }

      this.dataLoad = false

      this.$http
        .get(
          this.dataSource +
            this.filterStr +
            '_sort=' +
            this.sortSign +
            column +
            '&_page=' +
            page
        )
        .then(function (response) {
          this.data = Object.values(response.data.data)
          this.pagination.page = page
          this.dataLoad = true
        })
    },
    // apply filters ()
    filterBy (filterType, predFilter, filterSelect) {
      var self = this
      var interval = 800

      // Delaying the function execute
      if (this.timer) {
        window.clearTimeout(this.timer)
      }

      if (['clear-filter', 'predefined-filter'].includes(filterType) || filterSelect) {
        interval = 0
      }

      this.timer = window.setTimeout(function () {
        switch (filterType) {
          case 'clear-filter':

            var filter = '&'

            self.clearHeaderFilter()
            self.search = ''
            self.filterSelected = self.selected = self.date = []
            self.filterCleared = true

            break
          case 'predefined-filter':

            self.clearHeaderFilter()
            self.filterSelected[predFilter] = !self.filterSelected[predFilter]
            self.search = ''

            var filterSelected = Object.keys(self.filterSelected)
            filter = '&'

            filterSelected.forEach(function (filterKey) {
              if (self.filterSelected[filterKey]) {
                filter += filterKey + '&'
              }
            })

            self.filterCleared = false

            break
          case 'all-fields':

            var notSearche = self.notSearchable
            var search = self.search
            var relationSearchable = []
            var filterArr = searchByCol

            filter = '&_filters[]='

            if (search.length > 2) {
              self.filterSelected = self.selected = self.date = []
            } else {
              return
            }

            if (search.toString().length > 0) {
              Object.keys(filterArr).forEach(function (field) {
                if (field.indexOf('.') === -1) {
                  if (notSearche.indexOf(field) === -1) {
                    filter += field + '-lk=*' + search + '*-!or!-'
                  }
                } else {
                  var splitField = field.split('.')

                  if (splitField[0]) {
                    var relation = self.metaDataRelations

                    if (relation[splitField[0]] && relation[splitField[0]]['short_view']) {
                      var shortView = self.matchVariables(relation[splitField[0]]['short_view'])

                      shortView.forEach(function (fieldName) {
                        fieldName = fieldName.replace('$', '')
                        filter += splitField[0] + '.' + fieldName + '-lk=*' + search + '*-!or!-'
                      })
                    }
                  }
                }
              })

              if (filter !== '&_filters[]=' && filter.slice(-6) === '-!or!-') {
                filter = filter.slice(0, -6) + '&'
              } else if (filter === '&_filters[]=') {
                filter = '&'
              } else {
                filter += '&'
              }
            }

            self.filterCleared = false

            break
          default:

            filter = '&'
            filterArr = self.searchByColumn
            relationSearchable = []

            Object.keys(filterArr).forEach(function (field) {
              if (filterArr[field]) {
                if (field.indexOf('.') !== -1) {
                  relationSearchable.push(field)
                  self.clearFilter()
                } else if (filterArr[field].length > 2 || ['0', '1'].includes(filterArr[field])) {
                  filter += '_filters[]=' + field + '-lk=*' + filterArr[field] + '*&'
                  self.clearFilter()
                }
              }
            })

            if (relationSearchable.length > 0) {
              relationSearchable.forEach(function (field) {
                var obj = filterArr[field]
                if (obj.id) {
                  filter += '_filters[]=' + field + '-eq=' + obj.id + '&'
                }
              })
            }

            if (self.date) {
              if (self.date && self.date[0] && self.date[1]) {
                var isDateFrom = self.isDate(self.date[0])
                var isDateTo = self.isDate(self.date[1])
                if (isDateFrom === true && isDateTo === true) {
                  filter += '_filters[]=created_at-between=' + self.date[0] + ',' + self.date[1] + '&'
                }
              } else if (self.date[0] && !self.date[1]) {
                isDateFrom = self.isDate(self.date[0])
                if (isDateFrom === true) {
                  filter += '_filters[]=created_at-ge=' + self.date[0] + '&'
                }
              } else if (!self.date[0] && self.date[1]) {
                isDateTo = self.isDate(self.date[1])
                if (isDateTo === true) {
                  filter += '_filters[]=created_at-le=' + self.date[1] + '&'
                }
              }
            }
            self.filterCleared = false
        }

        filter = filter.replace('&&', '&')

        if (filter === '&') {
          if (
            filterType !== 'predefined-filter' &&
            self.date !== null &&
            filterType.indexOf('.') === -1 &&
            filterType !== 'clear-filter' &&
            self.filterStr === filter
          ) {
            return
          }
        }

        self.filterStr = filter
        self.dataLoad = false
        // console.log('filter:', self.filterStr)

        self.$http.get(self.dataSource + self.filterStr + '_page=' + 1).then(function (response) {
          self.data = Object.values(response.data.data)
          self.totalItems = response.data.paginate.itemsCount
          self.pagination.page = 1
          self.selected = []
          self.dataLoad = true
        })
      }, interval)
    },
    // clear filter options
    clearFilter () {
      if (this.search) {
        this.search = ''
      }

      if (this.filterSelected) {
        this.filterSelected = []
      }

      if (this.selected) {
        this.selected = []
      }
    },

    clearHeaderFilter () {
      Object.keys(this.searchByColumn).forEach(function (field) {
        searchByCol[field] = ''
      })
      this.searchByColumn = searchByCol
    },
    // go to other window by link
    towindow (url, prItem) {
      if (prItem !== undefined) {
        var id = prItem['id']
        var match = url.match(/\$s*([^&]+)/)
        if (match[0] !== null) url = url.replace(match[0], id)
      }

      return url
      // window.open(url)
    },
    // submit function for table actions
    submit (button, item) {
      this.$confirm('{!!Are you sure!!}?')
          .then(_ => {
            var url = this.getLink(button)
            var method = this.getMethod(button)
            var success = this.getSuccess(button)
            var windowLink = this.setWindowLink(success)

            if (url.length === 0 || method.length === 0) return

            url = url.replace('$id', item.id)
            this.setVueRequest(url, method, windowLink, [item])
          })
          .catch(_ => {})
    },
    // submit function for selected items
    submitSelected (button) {
      this.$confirm('{!!Are you sure!!}?')
          .then(_ => {
            var url = this.getLink(button)
            var method = this.getMethod(button)
            var success = this.getSuccess(button)
            var windowLink = this.setWindowLink(success)

            if (url.length === 0 || method.length === 0) return

            if (!this.selected) {
              alert('Not selected!')
              return
            }

            var id = ''
            this.selected.forEach(function (col) {
              id += col['id'] + ','
            })

            if (id.length > 0) id = id.slice(0, -1)

            var m = url.match(/\$s*([^&]+)/)
            if (m[0] !== null) url = url.replace(m[0], id)

            this.setVueRequest(url, method, windowLink, this.selected)
          })
          .catch(_ => {})
    },
    // pagination, change page
    toPage: function (pageNum) {
      var sortSign = this.sortSign
      var column = this.column
      var sort = column.length > 0 ? '&_sort=' + sortSign + column : ''

      this.selected = []
      this.pagination.page = pageNum
      this.dataLoad = false
      // console.log(this.pagination)
      this.$http.get(this.dataSource + this.filterStr + '_page=' + this.pagination.page + sort).then(function (response) {
        this.data = Object.values(response.data.data)
        this.dataLoad = true
      })
    },

    // Helpers
    // set url
    setDataSource (url) {
      url = url.indexOf('?') === -1 ? url + '?' : url

      var m = url.match(/_page=s*([^&]+)/)

      if (m[0] !== null) { url = url.replace(m[0], '') }

      if (url.indexOf('?&') !== -1) { url = url.replace('?&', '?') }

      if (this.pagination.perPage) {
        if (url.indexOf('_limit=') === -1) { url = url + '&_limit=' + this.pagination.perPage }
      }

      this.dataSource = url
    },
    // change sign when apply sort
    setSortSign (sign) {
      if (sign.length < 1) { sign = '-' } else { sign = '' }

      return sign
    },
    // remove element from array
    remove (array, element) {
      const index = array.indexOf(element)

      if (index !== -1) { array.splice(index, 1) }
    },
    // check date
    isDate (date) {
      return new Date(date).toString() !== 'Invalid Date'
    },
    // check object
    isObject (value) {
      return value && typeof value === 'object' && value.constructor === Object
    },
    // get link from json action element
    getLink (btn) {
      if (btn && btn.url) {
        return btn.url
      } else {
        alert('Didn`t find link for this action!')
        return ''
      }
    },
    // get method from json action element
    getMethod (btn) {
      if (btn && btn.method) {
        return btn.method.toLowerCase()
      } else {
        alert('Didn`t find method for this action!')
        return ''
      }
    },
    // get success from json action element
    getSuccess (btn) {
      if (btn.onsuccess) { return btn.onsuccess }
      // else
      //     alert('Didn`t find method for this action!')
    },
    // apply request for actions table
    setVueRequest (url, method, windowLink, items) {
      var page = this.pagination.page

      this.$http[method](url).then(
        result => {
          var self = this
          items.forEach(function (item) {
            var i = self.data.indexOf(item)
            if (i !== -1) { self.data.splice(i, 1) }
          })

          self.dataLoad = false

          self.$http.get(
            self.dataSource + self.filterStr + '_sort=' + self.sortSign + self.column + '&_page=' + page
            ).then(function (response) {
              self.data = Object.values(response.data.data)
              self.dataLoad = true
            })

          this.setResult(result.data.data)
          // if(result.status === 200 && windowLink.length > 0) thisVue.towindow(windowLink)
        },
        result => {
          this.setResult(result.body)
        }
      )
      this.selected = []
    },

    setResult (result) {
      var txt = ''
      if (Array.isArray(result) || this.isObject(result)) {
        for (var i = 0; i < result.length; i++) {
          txt += result[i].toString() + '\n'
        }
      }
      result = result.message !== undefined ? result.message : result.toString()

      txt.length > 0 ? alert(txt) : alert(result)
    },

    setWindowLink (onsuccess) {
      if (
        onsuccess.type && onsuccess.type === 'nav' &&
        onsuccess.linktype && onsuccess.linktype === 'window' &&
        onsuccess.link
      ) {
        return onsuccess.link
      }
      return ''
    },
    // get searchable table fields
    getSearchable (notSearchBy) {
      var cells = this.cells
      var searchBy = []

      if (cells) {
        cells.forEach(function (val) {
          if (val['field'] && val['searchable'] && notSearchBy.indexOf(val['field']) === -1) {
            if (val['relation_path']) {
              searchBy[val['relationField']] = ''
            } else {
              searchBy[val['field']] = ''
            }
          }
        })
      }

      this.searchByColumn = searchByCol = searchBy
    },
    // get no searchable table fields
    getNotSearchable () {
      var metafields = this.metaDataFields
      var notSearch = []

      if (this.setting['notSearchable']) { notSearch = this.setting['notSearchable'] }

      Object.keys(metafields).map(function (key, index) {
        switch (metafields[key]['type']) {
          case 'boolean':
            notSearch.push(key)
            break
          case 'timestamp':
            notSearch.push(key)
            break
          case 'decimal':
            notSearch.push(key)
            break
          case 'integer':
            notSearch.push(key)
        }
      })

      this.notSearchable = notSearch.filter(this.onlyUnique)
    },
    // set array unique
    onlyUnique (value, index, self) {
      return self.indexOf(value) === index
    },
    // get data relation select by keyword (select with search)
    asyncFind (query, field) {
      var cells = this.cells
      var relation = this.metaDataRelations
      var filterSearch = '&_filters[]='
      var self = this

      if (cells && relation && query.length > 2) {
        if (relation[field] && relation[field]['short_view']) {
          var shortView = self.matchVariables(relation[field]['short_view'])
          shortView.forEach(function (field) {
            field = field.replace('$', '')
            filterSearch += field + '-lk=*' + query + '*-!or!-'
          })

          if (filterSearch.slice(-6) === '-!or!-') {
            filterSearch = filterSearch.slice(0, -6)
          }
        }

        cells.forEach(function (cell) {
          if (cell['field'] === field && cell['relation_path']) {
            self.$http.get(cell['relation_path'] + filterSearch).then(response => {
              if (response.data.data) {
                var result = response.data.data

                result.map(function (key) {
                  var optionName = ''

                  for (var i = 0; i < shortView.length; i++) {
                    var fieldName = shortView[i]
                    fieldName = fieldName.replace('$', '')

                    if (!key[fieldName] && key.i18n && key.i18n[fieldName]) {
                      optionName += key.i18n[fieldName] + ' - '
                    } else {
                      optionName += key[fieldName] + ' - '
                    }
                  }

                  if (optionName.slice(-3) === ' - ') {
                    optionName = optionName.slice(0, -3)
                  }

                  key.option_title = optionName
                })

                self.selectOptions = result
              }
            })
          }
        })
      }
    },

    checkRelation (col) {
      // console.log(this.searchByColumn[col])
      if (this.searchByColumn[col].length === 0) return
      this.filterBy(col, false, true)
      this.selectOptions = []
    },
    // clear relation select values
    clearSelectVal (field) {
      this.searchByColumn[field] = ''
      this.filterBy(field, false, true)
    },
    // set items per page ex: 25,50,100
    setPerPage () {
      var src = this.dataSource

      var matches = src.match(/_limit=\s*([^&]+)/)
      if (matches[1]) {
        var perPage = matches[1].split(/[\s,]+/)
        src = src.replace('_limit=' + perPage, '_limit=' + this.pagination.perPage)
      }

      if (src.slice(-1) !== '&') {
        src = src + '&'
      }

      this.dataSource = src
      this.dataLoad = false

      this.$http.get(this.dataSource + '_page=' + 1).then(function (response) {
        this.data = Object.values(response.data.data)
        this.totalItems = response.data.paginate.itemsCount
        this.pagination.page = 1
        this.selected = []
        this.dataLoad = true
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<!-- Add style for entitytable -->
<style scoped>
/* select style*/
.info-table .relation-select-block {
  text-align: left
}
.info-table .relation-select  {
  display:table-caption;
  font-size:10px;
}
.clear-relation-select {
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: absolute;
  margin-top: -55px;
  margin-left: 134px;
}
/* end select style*/
</style> 

<style>
@import "vue-multiselect/dist/vue-multiselect.min.css";

.info-table .select-boolean {
  height: 22px;
  width:93px!important;
}
 .info-table th .sort-field{
   cursor: pointer;
 }

/* actions button  style*/
.info-table a{
 cursor: pointer;
 color: #3378b8;
}
.info-table .group-actions a{
 margin: 15px 10px 0 0;
 font-size: 13px;
 display: inline-block;
}
.info-table .group-actions a.button{
 padding: 3px 8px
}
.info-table a.button {
  padding: 2px 2px;
  background-color: #ad936e;
  color: #fff;
  border-radius: 2px;
  border: none;
  box-shadow: 5px 1px 3px -4px #d8d8d8;
}
.info-table a.button:hover {
  background-color: #8a6c44;
}
.info-table a.link:hover {
  text-decoration: underline;
}
.info-table .data-table-action {
  display: inline-block;
  margin: 0 2px;
}
/* actions button  style*/

.info-table .bool-1,
.info-table .bool-0 {
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 auto;
}
.info-table .bool-1 {
  background-image: url('https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/png/check-2x.png');
}
.info-table .bool-0 {
  background-image: url('https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/png/x-2x.png');
}

/* data table style */
.info-table {
  /* padding: 0 35px; */
}   
.info-table > table input,
.info-table > table select {
  width: 100px !important;
  height: 18px;
  display: block;
  padding: 0;
  font-size: 11px!important;
}
.info-table table {
  font-size: 12px !important;
  width: 100%;
}
.info-table table > thead > tr > th,
.info-table table > tr > td {
  border: 1px solid #e0e0e0  !important;
  vertical-align: middle;
  padding: 2px;
}
.info-table table > tr > td {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 3px;
  height: 30px!important;
}
.info-table table > thead > tr > th > span > img,
.info-table table > thead > tr > th > span > div > span {
  display: inline-block;
}
.info-table table > thead > tr > th.selected-all,
.info-table table > tr > td.selected-all{
  text-align: center;
}
.info-table table > thead > tr > th.selected-all input,
.info-table table > tr > td.selected-all input{
  width: 30px!important;
  height: 17px!important;
  display: inline!important;
}
.info-table table > thead > tr > th.boolean-th{
  max-width: 100px!important;
}
.info-table table > thead > tr > th > span > div,
.info-table table > thead > tr > th > span {
  display: flex;
}
.info-table table > tr:nth-child(even) {
  background-color: #ece5da !important;
}
.info-table table > thead {
  background-color: #ad936e !important;
}
.info-table table>tr:hover{
  background-color: #dbd4c6 !important;
}
.info-table .table > thead > tr.datatable__progress > th {
  padding: 0 !important;
}
/* end data table style */

/* predefined-filters style */
.info-table .predefined-filters{
  -webkit-padding-start: 0;
}
.info-table .predefined-filters li {
  margin: 10px 0 0 0;
}
.info-table .predefined-filters li {
  display: inline-block;
  list-style: none;
}
.info-table .predefined-filters li button {
  background-color: #a08763;
  border-radius: 3px;
  border: none;
  font-size: 12px;
  padding: 3px 11px;
  margin-right: 3px;
  color: #e9e9e9;
  text-transform: lowercase;
  letter-spacing: 0.5px;
  outline: none;
}
.info-table .predefined-filters li button.active {
  background-color: #e0ccae;
  color: #000;
}
.info-table .predefined-filters li button:hover {
  opacity: 0.8;
  transition: 0.5s;
}
/* end predefined-filters style */

/* pagination style */
.info-table .per-page-list {
  float: right;
  margin-top: 15px;
}
.info-table .clear-both {
  clear: both;
}
.info-table .pagination {
  display: inline-block!important;
  padding-left: 0!important;
  margin: 20px 0!important;
  border-radius: 4px!important;
}
.info-table .pagination>li {
  display: inline!important;
}
.info-table .pagination>li>a,
.info-table .pagination>li>span {
  position: relative!important;
  float: left!important;
  padding: 4px 8px!important;
  font-size: 14px!important;
  line-height: 1.42857143!important;
  text-decoration: none!important;
  color: #725c3e!important;
  background-color: #fff!important;
  border: 1px solid #ddd!important;
  margin-left: -1px!important;
  outline: none!important;
}
.info-table .pagination>li>a:hover,
.info-table .pagination>li>span:hover{
  z-index: 3!important;
  color: #333!important;
  background-color: #ddd!important;
  border-color: #ddd!important;
}
.info-table .pagination > .active > a{
  z-index: 2!important;
  color: #fff!important;
  background-color: #ad936e!important;
  cursor: default!important;
}
.info-table .pagination > .disabled > a{
  color: #333!important;
  background-color: #ddd!important;
  border-color: #ddd!important;
  cursor: no-drop!important
}
/* pagination style end */

/* date time picker style*/
.info-table input.el-range-input {
  width: 60px!important;
  padding: 0 2px!important;
  font-size: 11.5px!important;
}
.info-table .el-range-editor.el-input__inner {
   padding: 0;
   width: 100%;
   max-width: 200px;
}
.info-table .el-input__inner {
    background-color: #fff;
    border-radius: 0;
    text-align: center;
    border: none; 
    height: 21px;
}
.info-table .el-date-editor .el-range-separator {
    width: 3%;
    color: #303133;
    line-height: 0;
}
.info-table .el-date-editor .el-icon-date {
  display: none;
}
.info-table .el-date-editor .el-range__close-icon {
  line-height: 0;
}
/* end date time picker style*/
</style>