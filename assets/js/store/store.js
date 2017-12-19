import Vue from 'vue'
import Vuex from 'vuex'
import {Game} from '../models/game.js'

Vue.use(Vuex)

export const store = new Vuex.Store({

    state: {
        clientName: '',
        currentRoom: 'public',
        socket: undefined,
        chatMessages: [],
        currentGame: new Game()
    },
    getters: {
        clientName: state => {
            return state.clientName
        },
        currentRoom: state => {
            return state.currentRoom
        },
        socket: state => {
            return state.socket
        },
        chatMessages: state => {
            return state.chatMessages
        },
        currentGame: state => {
            return this.currentGame
        }
    },
    mutations: {
        changeClientName: (state, [data]) => {
            state.clientName = data
        },
        changeCurrentRoom: (state, [data]) => {
            state.currentRoom = data
        },
        connectSocket: (state, [data]) => {
            state.socket = data
        },
        pushMessage: (state, [data]) => {
            state.chatMessages.push(data)
        },
        newGame: (state, [data]) => {
            state.currentGame = new Game()
        }
    },
    actions: {
        changeClientName: (context, payload) => {
            context.commit('changeClientName', payload)
        },
        changeCurrentRoom: (context, payload) => {
            context.commit('changeCurrentRoom', payload)
        },
        connectSocket: (context, payload) => {
            context.commit('connectSocket', payload)
        },
        pushMessage: (context, payload) => {
            context.commit('pushMessage', payload)
        },
        newGame: (context, payload) => {
            context.commit('newGame', payload)
        }
    }
})
