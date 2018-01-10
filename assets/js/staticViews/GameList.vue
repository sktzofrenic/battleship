<template lang="html">
    <div class="row">
        <div class="sub header">
            <button style="padding:10px;" class="ui labeled inverted icon button" @click="toggleModal()">
              <i class="plus icon"></i>
              New Game
            </button>
        </div>
        <table class="ui single line striped selectable table" v-if="games.length > 0">
            <thead>
                <tr>
                    <th> #</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Players</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(game, index) in games">
                    <td>{{ game.id }}</td>
                    <td>{{ game.name }}</td>
                    <td>{{ game.status }}</td>
                    <td>{{ game.players.length }}</td>
                    <td><span v-if="game.isOffsite">Offsite</span></td>
                    <td>
                        <span>
                            <button @click="endGame(index)" type="button" class="ui red button">End</button>
                        </span>
                        <span v-if="game.status === 'Waiting for players...'">
                            <button type="button" class="ui green button" @click="joinGame(index)">Join</button>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="no-games" v-else>
            <p>No active games</p>
        </div>
        <div class="ui modal modal-margin" :class="{'active': showModal}">
            <div class="header">
                New Game
            </div>
            <div class="content">
                <form class="ui large form">
                    <div class="ui stacked segment">
                        <form class="ui form">
                            <div class="field">
                                <label>Game Name</label>
                                <input type="text" v-model="gameName" placeholder="Name">
                            </div>
                            <div class="field">
                                <label>Game Code Set</label>
                                <select class="ui dropdown" v-model="gameCodeSetID">
                                    <option value=""></option>
                                    <option :value="set.id" v-for="(set, index) in gameCodeSets">{{set.name}}</option>
                                </select>
                            </div>
                            <div class="field">
                                <div class="ui slider checkbox">
                                    <input v-model="isOffsite" type="checkbox" name="newsletter">
                                    <label>Offsite Game</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="ui error message"></div>
                </form>
            </div>
            <div class="actions">
                <div class="ui button" @click="toggleModal('')">Cancel</div>
                <div class="ui button" :class="{'loading': loading}" @click="createGame()">Start</div>
            </div>
        </div>
    </div>
</template>

<script>
import {Game} from '../models/game.js'
import axios from 'axios'
import {socket} from '../socket.js'
import {mapActions} from 'vuex'

export default {
    data () {
        return {
            showModal: false,
            loading: false,
            gameName: '',
            gameCodeSetID: '',
            isOffsite: false,
            gameCodeSets: [],
            games: []
        }
    },
    methods: {
        ...mapActions([
            'changeView',
            'changeCurrentRoom'
        ]),
        toggleModal () {
            this.showModal = !this.showModal
        },
        clearData () {
            this.gameName = ''
            this.gameCodeSetID = ''
            this.isOffsite = false
        },
        joinGame (index) {
            let vm = this
            let game = vm.games[index]
            game.joinGame(function () {
                vm.changeView(['game'])
                vm.changeCurrentRoom([game.id])
            })
        },
        createGame () {
            var vm = this
            var game = new Game({
                name: vm.gameName,
                isOffsite: vm.isOffsite,
                gameCodeSetID: vm.gameCodeSetID
            })
            vm.loading = true
            game.create(function () {
                vm.toggleModal()
                vm.loading = false
                vm.clearData()
            })
        },
        getGameCodeSets () {
            var vm = this
            axios.get('/api/v1/game_code_sets').then(function (response) {
                vm.gameCodeSets = response.data.game_code_sets
            })
        },
        getGames () {
            var vm = this
            axios.get('/api/v1/games').then(function (response) {
                vm.games = response.data.games.map(function (game) {
                    return new Game(game)
                })
            })
        },
        endGame (index) {
            var vm = this
            vm.games[index].end()
        }
    },
    mounted () {
        var vm = this
        vm.getGameCodeSets()
        vm.getGames()
        socket.on('create-game', function (data) {
            var newGame = new Game(data.game)
            vm.games.push(newGame)
        })
        socket.on('end-game', function (data) {
            vm.games = vm.games.filter(function (game) {
                return game.id != data.id
            })
        })
        socket.on('leave-game', function (data) {
            vm.getGames()
        })
        socket.on('join-game', function (data) {
            vm.getGames()
        })
    }
}
</script>

<style lang="css" scoped>
.modal-margin {
    margin-top: -230px;
}
</style>
