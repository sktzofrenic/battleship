import Vue from 'vue'
import Vuex from 'vuex'
import {Game} from '../models/game.js'

Vue.use(Vuex)

export const store = new Vuex.Store({

    state: {
        clientName: '',
        currentRoom: 'public',
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
        pushMessage: (context, payload) => {
            context.commit('pushMessage', payload)
        },
        newGame: (context, payload) => {
            context.commit('newGame', payload)
        }
    }
})
