import Vue from 'vue'
import Vuex from 'vuex'
import {Game} from '../models/game.js'

Vue.use(Vuex)

export const store = new Vuex.Store({

    state: {
        clientName: '',
        currentRoom: 'public',
        currentView: 'main',
        chatMessages: [],
        currentGame: new Game(),
        participantType: 0,
        chatRecipients: [1, 2, 3, 4]
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
            return state.currentGame
        },
        currentView: state => {
            return state.currentView
        },
        participantType: state => {
            return state.participantType
        },
        chatRecipients: state => {
            return state.chatRecipients
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
        },
        changeView: (state, [data]) => {
            state.currentView = data
        },
        setParticipantType: (state, [data]) => {
            state.participantType = data
        },
        setChatRecipients: (state, [data]) => {
            state.chatRecipients = data
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
        },
        changeView: (context, payload) => {
            context.commit('changeView', payload)
        },
        setParticipantType: (context, payload) => {
            context.commit('setParticipantType', payload)
        },
        setChatRecipients: (context, payload) => {
            context.commit('setChatRecipients', payload)
        }
    }
})
