<template lang="html">
    <div class="game-board-wrapper">
        <div class="game-board-wrapper" v-if="gameBoard.gameState === 'waiting'">
            <div class="ui inverted segment">
                <div class="ui inverted form">
                    <div class="two fields">
                        <div class="field">
                            <label>Team Name</label>
                            <input v-model="selectedTeamName" type="text">
                        </div>
                        <div class="field">
                            <label>Participant Type</label>
                            <select class="ui dropdown" v-model.number="participantType">
                                <option value="1">Player One</option>
                                <option value="2">Player Two</option>
                                <option value="3">Game Master</option>
                                <option value="4">Observer</option>
                            </select>
                        </div>
                    </div>
                    <div class="inline field">
                        <div class="ui checkbox">
                            <input type="checkbox" tabindex="0" class="hidden">
                            <label>I agree to have fun and follow the rules.</label>
                        </div>
                    </div>
                <div class="ui submit button" @click="submitGameSettings()">Submit</div>
              </div>
            </div>
        </div>
        <div class="game-board-wrapper" v-else>
            <div class="game-board" @mouseleave="clearHoverGrid()">
                <x-board-object
                    class="board-object"
                    :style="o.style"
                    @contextmenu.prevent=""
                    v-for="(o, index) in gameBoard.boardObjects">
                </x-board-object>
                <x-mask
                    class="participant-one-mask"
                    v-if="participantType === 1">
                </x-mask>
                <x-mask
                    class="participant-two-mask"
                    v-if="participantType === 2">
                </x-mask>
                <x-hit-miss-object
                    :style="hm.style"
                    :class="[hm.type]"
                    v-for="(hm, index) in gameBoard.hitMissGrid">
                </x-hit-miss-object>
                <x-square
                    :class="[i.baseClass, {'square-hover': i.squareHover}]"
                    :style="i.style"
                    v-for="(i, index) in gb"
                    @click="boardClick($event)"
                    @mouseover="squareMouseOver(i.coords)"
                    @contextmenu.prevent="squareMouseOver(i.coords, 'rotate')">
                </x-square>
                <x-mask
                    class="participant-four-mask"
                    v-if="participantType > 3">
                </x-mask>
            </div>
            <div class="ship-inventory">
                <h3 class="highlight title" v-if="gameBoard.gameState === 'setup'">Place Your Ships</h3>
                <h3 class="highlight title" v-else>Remaining Ships</h3>
                <div class="ship-count">
                    <table class="ui selectable compact inverted table">
                        <thead>
                            <tr>
                                <th>
                                    <div class="content arsenal-content" @click="selectItem('cancel')" v-if="selectedItem">
                                    Cancel
                                    <span v-if="selectedItem === 'destroyer' || selectedItem ==='cruiser' || selectedItem === 'carrier'"><img style="height: 18px; margin-left: 10px; position: absolute;" src="/static/build/img/rclickicon.bdeff0be54bbcfcb0db2759d7a8d1aee.png" alt=""> </span>
                                    </div>
                                </th>
                                <th>P1</th>
                                <th>P2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="arsenal-content" @click="selectItem('destroyer')" :class="{'highlight': selectedItem === 'destroyer'}">
                                    Destroyer x{{ this.gameBoard.shipLimits.destroyer / 2 }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerOne.destroyer / 2) === 0}">
                                    {{ Math.ceil(ships.playerOne.destroyer / 2)}}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.destroyer / 2) === 0}">
                                    {{ Math.ceil(ships.playerTwo.destroyer / 2) }}
                                </td>
                            </tr>
                            <tr>
                                <td class="arsenal-content" @click="selectItem('cruiser')" :class="{'highlight': selectedItem === 'cruiser'}">
                                    Cruiser x{{ this.gameBoard.shipLimits.cruiser / 3 }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerOne.cruiser / 3) === 0}">
                                    {{ Math.ceil(ships.playerOne.cruiser / 3) }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.cruiser / 3) === 0}">
                                    {{ Math.ceil(ships.playerTwo.cruiser / 3) }}
                                </td>
                            </tr>
                            <tr>
                                <td class="arsenal-content" @click="selectItem('carrier')" :class="{'highlight': selectedItem === 'carrier'}">
                                    Carrier x{{ this.gameBoard.shipLimits.carrier / 6 }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerOne.carrier / 6) === 0}">
                                    {{ Math.ceil(ships.playerOne.carrier / 6) }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.carrier / 6) === 0}">
                                    {{ Math.ceil(ships.playerTwo.carrier / 6) }}
                                </td>
                            </tr>
                            <tr>
                                <td class="arsenal-content" @click="selectItem('outpost')" :class="{'highlight': selectedItem === 'outpost'}">
                                    Outpost x{{ this.gameBoard.shipLimits.outpost }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerOne.outpost) === 0}">
                                    {{ Math.ceil(ships.playerOne.outpost) }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.outpost) === 0}">
                                    {{ Math.ceil(ships.playerTwo.outpost) }}
                                </td>
                            </tr>
                            <tr>
                                <td class="arsenal-content" @click="selectItem('submarine')" :class="{'highlight': selectedItem === 'submarine'}">
                                    Submarine x{{ this.gameBoard.shipLimits.submarine }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerOne.submarine) === 0}">
                                    {{ Math.ceil(ships.playerOne.submarine) }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.submarine) === 0}">
                                    {{ Math.ceil(ships.playerTwo.submarine) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ship-timer highlight">
                    {{ gameBoard.timerDisplay }} <br>
                    <span style="color:#fff; margin-bottom: 10px; font-size:11px" v-if="gameBoard.gameState === 'setup'">
                        Place your ships!
                    </span>
                </div>
            </div>
            <div class="arsenal">
                <h3 class="highlight title">Arsenal</h3>
                <table class="ui selectable compact inverted table">
                    <thead>
                        <tr>
                            <th>
                                <div class="content arsenal-content" @click="selectItem('cancel')" v-if="selectedItem">
                                Cancel
                                <span v-if="selectedItem === 'salvo'"><img style="height: 18px; margin-left: 10px; position: absolute;" src="/static/build/img/rclickicon.bdeff0be54bbcfcb0db2759d7a8d1aee.png" alt=""> </span>
                                </div>
                            </th>
                            <th>P1</th>
                            <th>P2</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="arsenal-content" @click="selectItem('salvo')" :class="{'highlight': selectedItem === 'salvo'}">Salvo</td>
                            <td>
                                <span v-if="participantType === 1 || participantType > 2">  {{ arsenals.playerOne.salvo }} </span>
                            </td>
                            <td>
                                <span v-if="participantType === 2 || participantType > 2">  {{ arsenals.playerTwo.salvo }} </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="arsenal-content" @click="selectItem('torpedo')" :class="{'highlight': selectedItem === 'torpedo'}">Torpedo</td>
                            <td>
                                <span v-if="participantType === 1 || participantType > 2">  {{ arsenals.playerOne.torpedo }} </span>
                            </td>
                            <td>
                                <span v-if="participantType === 2 || participantType > 2">  {{ arsenals.playerTwo.torpedo }} </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="arsenal-content" @click="selectItem('missile')" :class="{'highlight': selectedItem === 'missile'}">Missile</td>
                            <td>
                                <span v-if="participantType === 1 || participantType > 2">  {{ arsenals.playerOne.missile }} </span>
                            </td>
                            <td>
                                <span v-if="participantType === 2 || participantType > 2">  {{ arsenals.playerTwo.missile }} </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="arsenal-content" @click="selectItem('radar')" :class="{'highlight': selectedItem === 'radar'}">Radar</td>
                            <td>
                                <span v-if="participantType === 1 || participantType > 2">  {{ arsenals.playerOne.radar }} </span>
                            </td>
                            <td>
                                <span v-if="participantType === 2 || participantType > 2">  {{ arsenals.playerTwo.radar }} </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="player-one-name">
                <span class="highlight">P1:</span> {{ playerOneName }}
            </div>
            <div class="versus">
                VS
            </div>
            <div class="player-two-name">
                <span class="highlight">P2:</span> {{ playerTwoName }}
            </div>
            <div class="ui action inverted huge input game-code">
                <input type="text" :value="gameCode" maxlength="6" @input="gameCode = $event.target.value.toUpperCase()">
                <button class="ui red huge labeled icon button" @click="verifyGameCode()">
                    <i class="crosshairs icon"></i>
                    Verify
                </button>
            </div>
            <div class="board-message" v-if="boardMessage">
                {{ boardMessage }}
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import {GameBoard} from '../models/gameBoard.js'
import {mapGetters, mapActions} from 'vuex'
import {socket} from '../socket.js'
import Timer from 'timer.js'
import axios from 'axios'

export default {
    data () {
        return {
            gameBoard: new GameBoard(),
            hoverGrid: [],
            hoverShape: 'one',
            hoverColor: '#fff',
            boardMessage: '',
            gameTimer: new Timer(),
            selectedTeamName: '',
            playerOneName: '',
            playerTwoName: '',
            gameCodes: [],
            opponentName: '',
            rotate: false,
            arsenals: {
                playerOne: {
                    salvo: 0,
                    torpedo: 0,
                    missile: 0,
                    radar: 0
                },
                playerTwo: {
                    salvo: 0,
                    torpedo: 0,
                    missile: 0,
                    radar: 0
                }
            },
            ships: {
                playerOne: {
                    destroyer: 0,
                    cruiser: 0,
                    carrier: 0,
                    outpost: 0,
                    submarine: 0
                },
                playerTwo: {
                    destroyer: 0,
                    cruiser: 0,
                    carrier: 0,
                    outpost: 0,
                    submarine: 0
                }
            },
            gameCode: '',
            selectedItem: false,
            participantType: 3 // 1 is player one, 2 is player two, 3 is game master, 4 is observer
        }
    },
    computed: {
      	gb: function () {
        	var final = []
            var vm = this
        	vm.gameBoard.grid.map(function (i, index) {
              	i.map(function (j) {
                	final.push({
                        style: {
                            transform: `translate(${index * 42}px, ${j * 42}px)`,
                            background: vm.hoverColor
                        },
                        coords: {
                            i: index,
                            j: j
                        },
                        baseClass: (index === 0 || j === 0 ? 'border-square' : 'square'),
                        squareHover: _.find(vm.hoverGrid, {i: index, j:j})
                    })
                })
            })
            return final
        },
        ...mapGetters([
            'currentRoom',
            'clientName'
        ])
    },
    methods: {
        ...mapActions([
            'changeClientName',
            'changeCurrentRoom',
            'connectSocket',
            'pushMessage',
            'setParticipantType'
        ]),
        boardClick (event) {
            var vm = this
            let player = vm.participantType === 1 ? 'playerOne' : 'playerTwo'
            if (vm.selectedItem === 'radar') {
                if (!vm.arsenals[player][vm.selectedItem]) {
                    return
                }
                let shipCount = 0
                vm.hoverGrid.map(function (square, index) {
                    if (vm.gameBoard.boardObjects.some(function (each) {
                        return each.i === square.i && each.j === square.j
                    })) {
                        shipCount += 1
                    }
                })
                vm.boardMessage = `There are ${shipCount} squares occupied by ships in this area.`
                setTimeout(function () {
                    vm.boardMessage = ''
                }, 5000)
                vm.arsenals[player][vm.selectedItem] -= 1
                return
            }
            if (_.includes(['salvo', 'missile', 'torpedo'], vm.selectedItem)) {
                if (!vm.arsenals[player][vm.selectedItem]) {
                    return
                }
                vm.hoverGrid.map(function (square, index) {
                    // Check to see if salvo falls off the grid
                    if (square.j === 0 || square.i === 0 || square.i > 16 || square.j > 8){
                        return
                    }
                    // Check to see if the weapon hit an object on the gameboard
                    var weaponHit = _.findIndex(vm.gameBoard.boardObjects, function (o) {
                        return o.i === square.i && o.j === square.j
                    })
                    if (weaponHit > -1 && vm.gameBoard.boardObjects[weaponHit].type === 'submarine' && vm.selectedItem === 'missile') {
                        vm.boardMessage = 'Enemy sub dodged your missile!'
                        setTimeout(function () {
                            vm.boardMessage = ''
                        }, 5000)
                        return
                    }
                    if (vm.selectedItem === 'torpedo' && _.some(vm.gameBoard.landCoords, {i: square.i, j: square.j})) {
                        vm.boardMessage = 'Torpedoes can\'t target land!'
                        setTimeout(function () {
                            vm.boardMessage = ''
                        }, 5000)
                        return
                    }
                    //If the weapon hit and we haven't already added this result, add it
                    if (weaponHit > -1 && _.findIndex(vm.gameBoard.hitMissGrid, function (o) {
                        return o.i === square.i && o.j === square.j
                    }) === -1) {
                        let hit ={
                            type: 'hit',
                            style: {
                                transform: `translate(${square.i * 42}px, ${square.j * 42}px)`
                            },
                            i: square.i,
                            j: square.j,
                            gameId: vm.currentRoom,
                            participantType: vm.participantType,
                            spliceIndex: weaponHit
                        }
                        vm.gameBoard.hitMissGrid.push(hit)
                        vm.arsenals[player][vm.selectedItem] -= 1
                        socket.emit('weapon-fired', hit)
                        vm.gameBoard.boardObjects.splice(weaponHit, 1)
                    } else if (weaponHit === -1 && _.findIndex(vm.gameBoard.hitMissGrid, function (o) {
                        return o.i === square.i && o.j === square.j
                    }) === -1) {
                        let miss = {
                            type: 'miss',
                            style: {
                                transform: `translate(${square.i * 42}px, ${square.j * 42}px)`
                            },
                            i: square.i,
                            j: square.j,
                            gameId: vm.currentRoom,
                            participantType: vm.participantType
                        }
                        vm.gameBoard.hitMissGrid.push(miss)
                        vm.arsenals[player][vm.selectedItem] -= 1
                        socket.emit('weapon-fired', miss)
                    }
                })
                vm.ships = vm.gameBoard.shipCount()
                return
            }
            if (!vm.selectedItem) {
                return
            }
            if (vm.gameBoard.areInvalid(vm.hoverGrid, vm.selectedItem, vm.participantType)) {
                vm.boardMessage = 'Invalid placement'
                setTimeout(function () {
                    vm.boardMessage = ''
                }, 1000)
            } else if (!vm.gameBoard.shipLimitExceeded(vm.selectedItem, vm.hoverGrid)){
                vm.hoverGrid.map(function (square) {
                    let ship = {
                        type: vm.selectedItem,
                        style: {
                            transform: `translate(${square.i * 42}px, ${square.j * 42}px)`,
                            background: vm.hoverColor
                        },
                        i: square.i,
                        j: square.j,
                        gameId: vm.currentRoom,
                        participantType: vm.participantType
                    }
                    vm.gameBoard.boardObjects.push(ship)
                    socket.emit('ship-placed', ship)
                })
            }
            vm.ships = vm.gameBoard.shipCount()
        },
        clearHoverGrid () {
            this.hoverGrid = []
        },
        submitGameSettings () {
            var vm = this
            vm.changeClientName([vm.selectedTeamName])
            vm.gameBoard.gameState = 'setup'
            vm.setParticipantType([vm.participantType])
            socket.emit('player-name', {
                p1: vm.participantType === 1 ? vm.clientName : false,
                p2: vm.participantType === 2 ? vm.clientName : false,
                gameId: vm.currentRoom
            })
        },
        verifyGameCode () {
            var vm = this
            let player = vm.participantType === 1 ? 'playerOne' : 'playerTwo'
            let gcIndex = _.findIndex(vm.gameCodes, function(gCode) {
                if (gCode.name === vm.gameCode) {
                    return true
                }
            })
            if (gcIndex > -1 && !_.includes(vm.gameBoard.usedGameCodes, vm.gameCode)) {
                // game code is valid and we haven't used it yet
                var item = ''
                if (vm.gameCodes[gcIndex].action.type_ == 5) {
                    vm.arsenals[player].torpedo += 1
                    item = 'torpedo'
                } else if (vm.gameCodes[gcIndex].action.type_ == 3) {
                    vm.arsenals[player].missile += 1
                    item = 'missile'
                } else if (vm.gameCodes[gcIndex].action.type_ == 4) {
                    vm.arsenals[player].salvo += 1
                    item = 'salvo'
                } else if (vm.gameCodes[gcIndex].action.type_ == 4) {
                    vm.arsenals[player].radar += 1
                    item = 'radar'
                }
                vm.boardMessage =`One ${item} added to your arsenal!`
                setTimeout(function () {
                    vm.boardMessage = ''
                }, 2000)
                vm.gameBoard.usedGameCodes.push(vm.gameCode)
            } else if (_.includes(vm.gameBoard.usedGameCodes, vm.gameCode)) {
                // game code is valid but has already been used
                vm.boardMessage = 'You already used that game code!'
                setTimeout(function () {
                    vm.boardMessage = ''
                }, 2000)
            } else {
                // game code is not valid
                if (vm.gameBoard.badGuesses < 2) {
                    vm.boardMessage = 'Bad Code! Incorrect codes will give the enemy free arsenal items...'
                    vm.gameBoard.badGuesses += 1
                    setTimeout(function () {
                        vm.boardMessage = ''
                    }, 2000)
                } else {
                    let freeItem = vm.gameBoard.badGuesses % 2 ? 'torpedo' : 'missile'
                    vm.boardMessage = `Bad Code! You just gave the enemy a free ${freeItem}`
                    vm.gameBoard.badGuesses += 1
                    setTimeout(function () {
                        vm.boardMessage = ''
                    }, 2000)
                }
            }
            vm.gameCode = ''
        },
        selectItem (item) {
            if (item == 'cancel') {
                this.selectedItem = false
                this.hoverColor = '#fff'
                this.hoverShape = 'one',
                this.selectedItem = false
                this.hoverGrid = []
                return
            }
            if (_.includes(['salvo', 'torpedo', 'missile', 'radar'], item) && this.gameBoard.gameState === 'setup' && this.participantType < 3) {
                return
            }
            if (_.includes(['destroyer', 'cruiser', 'outpost', 'carrier', 'submarine'], item) && this.gameBoard.gameState === 'playing' && this.participantType < 3) {
                return
            }
            this.hoverColor = this.gameBoard.colors[item]
            this.selectedItem = item
            if (item === 'salvo' || item === 'cruiser') {
                this.hoverShape = 'threeWide'
            } else if (item === 'missile' || item === 'torpedo' || item === 'submarine' || item === 'outpost') {
                this.hoverShape = 'one'
            } else if (item === 'radar') {
                this.hoverShape = 'radar'
            } else if (item === 'carrier') {
                this.hoverShape = 'carrier'
            } else if (item === 'destroyer') {
                this.hoverShape = 'twoWide'
            }
        },
        squareMouseOver (coords, rotate) {
            if (rotate) {
                this.rotate = !this.rotate
            }
            this.hoverGrid = this.gameBoard.hoverGrid(this.hoverShape, this.rotate, coords)
        }
    },
    mounted () {
        var vm = this
        axios.get(`/api/v1/game/${vm.currentRoom}`).then(function (response) {
            vm.gameCodes = response.data.game_codes
        })
        socket.on('ship-placed', function (data) {
            if (data.gameId == vm.currentRoom && data.participantType != vm.participantType) {
                vm.gameBoard.boardObjects.push(data)
                vm.ships = vm.gameBoard.shipCount()
            }
        })
        socket.on('weapon-fired', function (data) {
            if (data.gameId == vm.currentRoom && data.participantType != vm.participantType) {
                if (data.spliceIndex) {
                    vm.gameBoard.boardObjects.splice(data.spliceIndex, 1)
                }
                vm.gameBoard.hitMissGrid.push(data)
                vm.ships = vm.gameBoard.shipCount()
            }
        })
        socket.on('start-timer', function (data) {
            if (vm.gameBoard.gameState === 'setup') {
                var duration = 5*60
            } else {
                var duration = 60*60
            }
            if (data.id == vm.currentRoom) {
                vm.gameTimer.start(duration)
            }
        })
        socket.on('pause-timer', function (data) {
            if (data.id == vm.currentRoom) {
                vm.gameTimer.pause()
            }
        })
        socket.on('start-game', function (data) {
            if (data.id == vm.currentRoom) {
                vm.gameBoard.gameState = 'playing'
                vm.gameTimer.stop()
                vm.gameBoard.timerDisplay = '60:00'
            }
        })
        socket.on('end-game', function (data) {
            if (data.id == vm.currentRoom) {
                vm.gameBoard.gameState = 'ended'
            }
        })
        socket.on('restart-game', function (data) {
            if (data.id == vm.currentRoom) {
                vm.gameBoard = new GameBoard()
                vm.gameTimer.stop()
                vm.gameBoard.timerDisplay = '05:00'
                vm.selectedItem = false
                vm.ships = vm.gameBoard.shipCount()
            }
        })
        socket.on('add-minute', function (data) {
            if (data.id == vm.currentRoom) {
                vm.gameTimer.pause()
                vm.gameTimer.start((vm.gameTimer.getDuration() / 1000) + 60)
            }
        })
        socket.on('player-name', function (data) {
            if (data.gameId == vm.currentRoom) {
                if (data.p1) {
                    vm.playerOneName = data.p1
                }
                if (data.p2) {
                    vm.playerTwoName = data.p2
                }
            }
        })
        socket.on('join-game', function (data) {
            socket.emit('player-name', {
                p1: vm.participantType === 1 ? vm.clientName : false,
                p2: vm.participantType === 2 ? vm.clientName : false,
                gameId: vm.currentRoom
            })
        })
        vm.gameTimer.on('tick', function (duration) {
            var milliseconds = parseInt((duration%1000)/100)
                , seconds = parseInt(Math.round(duration/1000)%60)
                , minutes = parseInt((duration/(1000*60))%60)
                , hours = parseInt((duration/(1000*60*60))%24);

            hours = (hours < 10) ? "0" + hours : hours
            minutes = (minutes < 10) ? "0" + minutes : minutes
            seconds = (seconds < 10) ? "0" + seconds : seconds
            vm.gameBoard.timerDisplay = minutes + ":" + seconds
        })
    }
}
</script>

<style lang="css" scoped>
.board-message {
    position: absolute;
    font-size: 30px;
    color: red;
    height: 80px;
    width: 450px;
    text-align: center;
    top: 430px;
    left: 450px;
    line-height: 40px;
}
.game-code input {
    padding: 20px !important;
}
.game-code button {
    font-size: 30px !important;
}
.game-code {
    font-size: 40px !important;
    position: absolute;
    height: 80px;
    width: 220px;
    top: 430px;
    left: 0px;
}
.board-object {
    position: absolute;
    height: 42px;
    width: 42px;
    background: #fff;
    opacity: 0.5
}

.hit {
    position: absolute;
    height: 42px;
    width: 42px;
    background: url(/static/build/img/x.cd8fb4e86a7c5b75f287ddc343c94555.png);
}

.miss {
    position: absolute;
    height: 42px;
    width: 42px;
    background: url(/static/build/img/o.db70076e0610804d2447412c85acffb0.png);
}
.participant-two-mask {
    position: absolute;
    top: 0px;
    left: 0px;
    background: url(/static/build/img/left-gray.f97d507e49d3696ddd187b009b54205b.png);
    overflow:hidden;
    width: 379px;
    height: 378px;
}
.participant-one-mask {
    position: absolute;
    top: 0px;
    left: 379px;
    background: url(/static/build/img/right-gray.8260c0c5fecc26d292602ed075f3b673.png);
    overflow:hidden;
    width: 335px;
    height: 378px;
}
.participant-four-mask {
    position: absolute;
    top: 0px;
    left: 0px;
    background: #fff;
    opacity: 0;
    overflow:hidden;
    width: 714px;
    height: 378px;
}
.highlight {
    color: #e22722 !important;
}
.game-board-wrapper {
    width: 100%;
    position: relative;
}
.game-board {
    position: absolute;
    top: 40px;
    left: 220px;
    background: url(/static/build/img/game-map-small.c27ec7300208ac92eacdfa6c4e2fa594.png);
    overflow:hidden;
    width: 714px;
    height: 378px;
}
.board-background {
    max-width: 700px;
}

.square {
  position: absolute;
  background: #ff5757;
  height: 42px;
  width: 42px;
  opacity: 0;
  will-change: transform;
}
.square-hover {
  opacity: 0.6
}

.border-square, .border-square:hover {
   height: 42px;
  width: 42px;
  position: absolute;
  opacity: 0 !important;
}
.arsenal-content {
    cursor: pointer;
}

.arsenal {
    -webkit-border-top-left-radius: 10px;
    -webkit-border-bottom-left-radius: 10px;
    -moz-border-radius-topleft: 10px;
    -moz-border-radius-bottomleft: 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background: #1b1b1b;
    width: 220px;
    position: absolute;
    left: 0px;
    padding: 10px;
    border-right: solid 2px #c1c1c1;
    color: #fff;
    height: 378px;
    font-family: 'Black Ops One', cursive;
    text-align: center;
    top: 40px;
}

.ship-inventory {
    text-align: center;
    -webkit-border-top-right-radius: 10px;
    -webkit-border-bottom-right-radius: 10px;
    -moz-border-radius-topright: 10px;
    -moz-border-radius-bottomright: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: #1b1b1b;
    width: 240px;
    position: absolute;
    left: 934px;
    padding: 10px;
    border-left: solid 2px #c1c1c1;
    color: #fff;
    height: 378px;
    top: 40px;
}
.ship-count {
    color: #fff;
    font-family: 'Black Ops One', cursive;
    text-align: center;
}

.title {
    font-family: 'Black Ops One', cursive !important;
}
.ship-timer {
    font-family: 'Black Ops One', cursive !important;
    font-size: 35px;
    padding: 20px;
    text-align: center;
}
.player-one-name {
    position: absolute;
    top: 0px;
    font-family: 'Black Ops One', cursive !important;
    font-size: 25px;
    color: #fff;
    left: 230px;
    height: 55px;
    width: 300px;
    text-align: right;
}

.player-two-name {
    position: absolute;
    top: 0px;
    font-family: 'Black Ops One', cursive !important;
    font-size: 25px;
    color: #fff;
    left: 660px;
    height: 55px;
}
.versus {
    position: absolute;
    top: 0px;
    font-family: 'Black Ops One', cursive !important;
    font-size: 40px;
    color: #e22722;
    left: 570px;
    height: 55px;
}
</style>
