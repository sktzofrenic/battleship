<template>
    <div id="app">
        <div class="ui active dimmer" v-if="currentView === 'ended'">
            <div class="content">
                <div class="center">
                    <img class="end-img" src="static/build/img/defeat.d74b71ec69166eb433a797a5ac9bec3a.png" v-if="gameEndedDetails.participantType < 3 && gameEndedDetails.won === false">
                    <img class="end-img" src="static/build/img/victory.6d896044b3d5fa12eddc53a21afd8c78.png" v-if="gameEndedDetails.participantType < 3 && gameEndedDetails.won === true">
                    <h2 class="ui inverted icon header">
                        <i class="heart icon" v-if="gameEndedDetails.participantType > 2"></i>
                        <span v-if="gameEndedDetails.participantType < 3 && gameEndedDetails.won === true">Victory! You've defeated your enemy!</span>
                        <span v-if="gameEndedDetails.participantType < 3 && gameEndedDetails.won === false">Defeat. We'll get 'em next time</span>
                        <span  v-if="gameEndedDetails.participantType > 2">Game Ended!</span> <br><br>
                        <div class="ui container" style="width: 90%" v-if="statsReady">
                            <div class="ui two column grid">
                                <div class="column">
                                    <h3>{{ statistics.playerOne.clientName }}</h3>
                                    <div class="ui inverted segment">
                                        <div class="ui inverted statistics">
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerOne.statistics.shipsDestroyed}}
                                                </div>
                                                <div class="label">
                                                    Enemy Ships Sunk
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerOne.statistics.hits}}
                                                </div>
                                                <div class="label">
                                                    Successful Hits
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ playerOnePuzzlesSolved}}
                                                </div>
                                                <div class="label">
                                                    Puzzles Solved
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerOne.statistics.missileCodes}} / {{ statistics.playerOne.statistics.missileCodesUsed}}
                                                </div>
                                                <div class="label">
                                                    Missiles Earned / Used
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerOne.statistics.torpedoCodes}} / {{ statistics.playerOne.statistics.torpedoCodesUsed}}
                                                </div>
                                                <div class="label">
                                                    Torpedos Earned / Used
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerOne.statistics.salvoCodes}} / {{ statistics.playerOne.statistics.salvoCodesUsed}}
                                                </div>
                                                <div class="label">
                                                    Salvos Earned / Used
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerOne.statistics.radarCodes}} / {{ statistics.playerOne.statistics.radarCodesUsed}}
                                                </div>
                                                <div class="label">
                                                    Radars Earned / Used
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value" v-if="statistics.playerOne.statistics.hits > 0">
                                                    {{ (statistics.playerOne.statistics.hits / (statistics.playerOne.statistics.misses + statistics.playerOne.statistics.hits) * 100 ).toFixed(2)}}%
                                                </div>
                                                <div class="value" v-else>
                                                    0%
                                                </div>
                                                <div class="label">
                                                    Accuracy Percentage
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerOne.statistics.invalidCodes }}
                                                </div>
                                                <div class="label">
                                                    Invalid Codes
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerOne.statistics.reusedCodes }}
                                                </div>
                                                <div class="label">
                                                    Duplicate Codes
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerOne.statistics.itemsAwardedToOpponent }}
                                                </div>
                                                <div class="label">
                                                    Arsenal Items Gifted to Opponent
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="column">
                                    <h3>{{ statistics.playerTwo.clientName }}</h3>
                                    <div class="ui inverted segment">
                                        <div class="ui inverted statistics">
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerTwo.statistics.shipsDestroyed}}
                                                </div>
                                                <div class="label">
                                                    Enemy Ships Sunk
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerTwo.statistics.hits}}
                                                </div>
                                                <div class="label">
                                                    Successful Hits
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ playerTwoPuzzlesSolved}}
                                                </div>
                                                <div class="label">
                                                    Puzzles Solved
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerTwo.statistics.missileCodes}} / {{ statistics.playerTwo.statistics.missileCodesUsed}}
                                                </div>
                                                <div class="label">
                                                    Missiles Earned / Used
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerTwo.statistics.torpedoCodes}} / {{ statistics.playerTwo.statistics.torpedoCodesUsed}}
                                                </div>
                                                <div class="label">
                                                    Torpedos Earned / Used
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerTwo.statistics.salvoCodes}} / {{ statistics.playerTwo.statistics.salvoCodesUsed}}
                                                </div>
                                                <div class="label">
                                                    Salvos Earned / Used
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerTwo.statistics.radarCodes}} / {{ statistics.playerTwo.statistics.radarCodesUsed}}
                                                </div>
                                                <div class="label">
                                                    Radars Earned / Used
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value" v-if="statistics.playerTwo.statistics.hits > 0">
                                                    {{ (statistics.playerTwo.statistics.hits / (statistics.playerTwo.statistics.misses + statistics.playerTwo.statistics.hits) * 100 ).toFixed(2)}}%
                                                </div>
                                                <div class="value" v-else>
                                                    0%
                                                </div>
                                                <div class="label">
                                                    Accuracy Percentage
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerTwo.statistics.invalidCodes }}
                                                </div>
                                                <div class="label">
                                                    Invalid Codes
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerTwo.statistics.reusedCodes }}
                                                </div>
                                                <div class="label">
                                                    Duplicate Codes
                                                </div>
                                            </div>
                                            <div class="statistic">
                                                <div class="value">
                                                    {{ statistics.playerTwo.statistics.itemsAwardedToOpponent }}
                                                </div>
                                                <div class="label">
                                                    Arsenal Items Gifted to Opponent
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ui container" v-else>
                            <h2>Generating statistics...</h2>
                        </div>
                        <br><br>
                        <button class="ui inverted button" @click="changeView(['main'])" name="button"> Exit </button>
                    </h2>
                </div>
            </div>
        </div>
        <div class="ui huge inverted borderless fixed fluid menu game-header">
            <img src="static/build/img/houston_logo_white.88f80812ce0c22e9475b88b716203ef3.png" class="game-header-image">
            <div class="right menu">
                <div class="vs-battleship item">
                    <span style="color:#e22722">NAVAL</span> <span style="color:#fff"> WARFARE</span>
                </div>
            </div>
        </div>
        <div class="ui grid">
            <div class="row">
                <div class="column" id="content">
                    <GameList v-if="currentView === 'main'"></GameList>
                    <GameBoard v-if="currentView === 'game' || currentView === 'ended'"></GameBoard>
                </div>
                <div class="column" id="sidebar">
                    <Chat></Chat>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Chat from './components/Chat.vue'
import GameList from './staticViews/GameList.vue'
import GameBoard from './components/GameBoard.vue'
import axios from 'axios'
import {socket} from './socket.js'

export default {
    name: 'app',
    data () {
        return {
            statsReady: false,
            statistics: {
                playerOne: {
                    clientName: '',
                    id: 0,
                    participantType: 1,
                    statistics: {
                        hits: 0,
                        invalidCodes: 0,
                        itemsAwardedToOpponent: 0,
                        misses: 0,
                        missileCodes: 0,
                        missileCodesUsed: 0,
                        radarCodes: 0,
                        radarCodesUsed: 0,
                        shipsDestroyed: 0,
                        ownShipsDestroyed: 0,
                        reusedCodes: 0,
                        salvoCodes: 0,
                        salvoCodesUsed: 0,
                        torpedoCodes: 0,
                        torpedoCodesUsed: 0
                    }
                },
                playerTwo: {
                    clientName: '',
                    id: 0,
                    participantType: 0,
                    statistics: {
                        hits: 0,
                        invalidCodes: 0,
                        itemsAwardedToOpponent: 0,
                        misses: 0,
                        missileCodes: 0,
                        missileCodesUsed: 0,
                        shipsDestroyed: 0,
                        ownShipsDestroyed: 0,
                        radarCodes: 0,
                        radarCodesUsed: 0,
                        reusedCodes: 0,
                        salvoCodes: 0,
                        salvoCodesUsed: 0,
                        torpedoCodes: 0,
                        torpedoCodesUsed: 0
                    }
                }
            }
        }
    },
    components: {
        Chat,
        GameList,
        GameBoard
    },
    watch: {
        currentView (oldValue, newValue) {
            var vm = this
            vm.statsReady = false
            if (vm.gameEndedDetails !== null) {
                axios.get(`/api/v1/eventstats/${vm.gameEndedDetails.id}/stats`).then(function (response) {
                    vm.statistics = response.data
                    if (vm.statistics.playerOne.statistics !== undefined) {
                        axios.get(`/api/v1/eventstats/${vm.gameEndedDetails.id}/stats`).then(function (response) {
                            vm.statistics = response.data
                            vm.statsReady = true
                        })
                    } else {
                        vm.statsReady = true
                    }

                })
            }
        }
    },
    methods: {
        ...mapActions([
            'changeClientName',
            'changeCurrentRoom',
            'changeView',
            'connectSocket',
            'pushMessage',
            'setGameEndedDetails'
        ]),
        getClientData () {
            var vm = this
            axios.get('/api/v1/users/current_user').then(function (response) {
                vm.changeClientName([response.data.user.full_name])
            })
        }
    },
    computed: {
        ...mapGetters([
            'currentRoom',
            'clientName',
            'currentView',
            'gameEndedDetails'
        ]),
        playerOnePuzzlesSolved () {
            return (this.statistics.playerOne.statistics.missileCodes + this.statistics.playerOne.statistics.torpedoCodes + this.statistics.playerOne.statistics.salvoCodes)
        },
        playerTwoPuzzlesSolved () {
            return (this.statistics.playerTwo.statistics.missileCodes + this.statistics.playerTwo.statistics.torpedoCodes + this.statistics.playerTwo.statistics.salvoCodes)
        }
    },
    mounted () {
        var vm = this
        vm.getClientData()
        socket.emit('join-room', {
            room: 'public'
        })
    }
}
</script>

<style lang="css" scoped>
#content {
  margin-right: 19%;
  width: 81%;
  padding-right: 3em;
  padding-left: 3em;
  float: left;
}
#sidebar {
    position: fixed;
    top: 51.8px;
    right: 0;
    bottom: 0;
    width: 18%;
    color: #fff;
    padding-top: 25px !important;
    background-color: rgba(245, 245, 245, .5);
    padding: 0px;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#242220+0,1f1e1c+27,312e2b+100 */
    background: #242220; /* Old browsers */
    background: -moz-linear-gradient(top, #242220 0%, #1f1e1c 27%, #312e2b 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #242220 0%,#1f1e1c 27%,#312e2b 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #242220 0%,#1f1e1c 27%,#312e2b 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#242220', endColorstr='#312e2b',GradientType=0 ); /* IE6-9 */
}
.vs-battleship {
    font-family: 'Black Ops One', cursive;
    font-size: 40px;
}
.end-img {
    display: block;
    margin: auto;
}
.game-header-image {
    max-width: 179px;
    max-height: 60px;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-left: 10px;
}
.game-header {
    border-bottom: 3px solid #1d1c1a !important;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#1d1c1a+0,1f1e1c+27,312e2b+100 */
    background: #1d1c1a !important; /* Old browsers */
    background: -moz-linear-gradient(left, #1d1c1a 0%, #1f1e1c 27%, #312e2b 100%) !important; /* FF3.6-15 */
    background: -webkit-linear-gradient(left, #1d1c1a 0%,#1f1e1c 27%,#312e2b 100%) !important; /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, #1d1c1a 0%,#1f1e1c 27%,#312e2b 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1d1c1a', endColorstr='#312e2b',GradientType=1 ) !important; /* IE6-9 */
    height: 80px;
}
</style>
