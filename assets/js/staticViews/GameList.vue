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
                </tr>
            </thead>
            <tbody>
                <tr v-for="(game, index) in games">
                    <td>{{ game.id }}</td>
                    <td>{{ game.name }}</td>
                    <td>{{ game.status }}</td>
                    <td>{{ game.players }}</td>
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
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="flag icon"></i>
                                <input type="text" v-model="gameName" placeholder="Name">
                                <input type="text" v-model="gameCodeSetID" placeholder="Game Code Set">
                                <label for="isOffsite">Offsite Game:</label>
                                <div class="field">
                                    <div class="ui radio checkbox">
                                        <input type="radio" v-model="isOffsite" name="isOffsite" value="true" checked="" tabindex="0" class="hidden">
                                        <label>Yes</label>
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="ui radio checkbox">
                                        <input type="radio" v-model="isOffsite" name="isOffsite" value="false" tabindex="0" class="hidden">
                                        <label>No</label>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default {
    data () {
        return {
            showModal: false,
            loading: false,
            gameName: '',
            gameCodeSetID: '',
            isOffsite: '',
            games: [
                {
                    id: 1232,
                    name: 'Offsite 14',
                    status: 'Waiting for players',
                    players: 2
                }
            ]
        }
    },
    methods: {
        toggleModal () {
            this.showModal = !this.showModal
        },
        createGame () {
            var vm = this
            var game = new Game({
                name: vm.gameName,
                isOffsite: (vm.isOffsite == 'true'),
                gameCodeSetID: vm.gameCodeSetID
            })
            game.start(function () {
                console.log('Game Started')
                vm.toggleModal()
            })
        }
    }
}
</script>

<style lang="css" scoped>
.modal-margin {
    margin-top: -230px;
}
</style>
