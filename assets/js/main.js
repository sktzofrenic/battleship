/*
 * Main Javascript file for battleship.
 *
 * This file bundles all of your javascript together using webpack.
 */

// JavaScript modules
require('jquery');
require('font-awesome-webpack');
require('bootstrap');

// Your own code
require('./plugins.js');
require('./script.js');

import Vue from 'vue'

new Vue({
    el: '#app',
    components: { App }
})
