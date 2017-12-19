import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({

    state: {
        clientName: '',
        currentRoom: 'public',
        socket: undefined
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
        }
    }
})
