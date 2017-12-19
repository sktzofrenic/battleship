/*
 * Main Javascript file for battleship.
 *
 * This file bundles all of your javascript together using webpack.
 */

// JavaScript modules
require('jquery');
require('font-awesome-webpack');
require('bootstrap');

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import { store } from './store/store'
import GameCode from './staticViews/GameCode.vue'
import Users from './staticViews/Users.vue'
import GameList from './staticViews/GameList.vue'

// Vue.config.delimiters = ['[[', ']]']
Vue.use(Vuex)

new Vue({
  el: '#app',
  template: '<App/>',
  store: store,
  render: h => h(App),
  components: { App }
})

new Vue({
  el: '#gameCodes',
  template: '<GameCode/>',
  render: h => h(GameCode),
  components: { GameCode }
})

new Vue({
  el: '#users',
  template: '<Users/>',
  render: h => h(Users),
  components: { Users }
})

new Vue({
  el: '#gameList',
  template: '<GameList/>',
  render: h => h(GameList),
  components: { GameList }
})
