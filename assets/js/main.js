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
import App from './App.vue'

console.log('HELLO WORLD', Vue)

// Vue.config.delimiters = ['[[', ']]']

new Vue({
  el: '#app',
  template: '<App/>',
  render: h => h(App),
  components: { App }
})
