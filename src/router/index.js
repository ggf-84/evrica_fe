import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/components/pages/Auth'
import Main from '@/components/pages/Main'
import Settings from '@/components/pages/Settings'
import DynamicUI from '@/components/pages/DynamicUI'
import Chat from '@/components/pages/Chat'
import Search from '@/components/pages/Search'
import PM from '@/components/pages/PM'
import Push from '@/components/pages/Push'
import DataExchange from '@/components/pages/dataexchange/DataExchange'
import DataExchangeShowView from '@/components/pages/dataexchange/ShowView'
import DataExchangeShowEdit from '@/components/pages/dataexchange/ShowEdit'

Vue.use(Router)

export default new Router({
//  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/push',
      name: 'Push',
      component: Push
    },
    {
      path: '/dataexchange',
      name: 'DataExchange',
      component: DataExchange
    },
    {
      path: '/file/:token',
      name: 'DataExchangeView',
      component: DataExchangeShowView
    },
    {
      path: '/dataexchange/view/:hash',
      name: 'DataExchangeShowView',
      component: DataExchangeShowView
    },
    {
      path: '/dataexchange/edit/:hash',
      name: 'DataExchangeShowEdit',
      component: DataExchangeShowEdit
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/search/:key/:filter',
      name: 'Search',
      component: Search
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/page/:entity',
      component: DynamicUI,
      props: true
    },
    {
      path: '/page/:entity/:id',
      component: DynamicUI,
      props: true
    },
    {
      path: '/pm',
      name: 'PM',
      component: PM
    }
  ]
})
