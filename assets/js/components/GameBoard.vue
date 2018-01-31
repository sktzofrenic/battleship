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
                                <option :value="option.type" v-for="option in participantTypeOptions">{{ option.name }}</option>
                            </select>
                        </div>
                    </div>
                <div class="ui submit button" @click="submitGameSettings()">Submit</div>
                <div class="ui submit button" @click="changeView(['main'])">Back</div>
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
                    class="hit-miss"
                    v-for="(hm, index) in gameBoard.hitMissGrid">
                    <span class="hit-miss" :class="[hm.type]"></span>
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
                                    <div class="content arsenal-content" @click="selectItem('cancel')" v-if="selectedItem === 'destroyer' || selectedItem === 'cruiser' || selectedItem === 'carrier' || selectedItem === 'outpost' || selectedItem === 'submarine'">
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
                                    {{ ships.playerOne.destroyer}}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.destroyer / 2) === 0}">
                                    {{ ships.playerTwo.destroyer }}
                                </td>
                            </tr>
                            <tr>
                                <td class="arsenal-content" @click="selectItem('cruiser')" :class="{'highlight': selectedItem === 'cruiser'}">
                                    Cruiser x{{ this.gameBoard.shipLimits.cruiser / 3 }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerOne.cruiser / 3) === 0}">
                                    {{ ships.playerOne.cruiser  }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.cruiser / 3) === 0}">
                                    {{ ships.playerTwo.cruiser }}
                                </td>
                            </tr>
                            <tr>
                                <td class="arsenal-content" @click="selectItem('carrier')" :class="{'highlight': selectedItem === 'carrier'}">
                                    Carrier x{{ this.gameBoard.shipLimits.carrier / 6 }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerOne.carrier / 6) === 0}">
                                    {{ ships.playerOne.carrier }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.carrier / 6) === 0}">
                                    {{ ships.playerTwo.carrier  }}
                                </td>
                            </tr>
                            <tr>
                                <td class="arsenal-content" @click="selectItem('outpost')" :class="{'highlight': selectedItem === 'outpost'}">
                                    Outpost x{{ this.gameBoard.shipLimits.outpost }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerOne.outpost) === 0}">
                                    {{ ships.playerOne.outpost }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.outpost) === 0}">
                                    {{ ships.playerTwo.outpost }}
                                </td>
                            </tr>
                            <tr>
                                <td class="arsenal-content" @click="selectItem('submarine')" :class="{'highlight': selectedItem === 'submarine'}">
                                    Submarine x{{ this.gameBoard.shipLimits.submarine }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerOne.submarine) === 0}">
                                    {{ ships.playerOne.submarine }}
                                </td>
                                <td :class="{'highlight': Math.ceil(ships.playerTwo.submarine) === 0}">
                                    {{ ships.playerTwo.submarine }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ship-timer highlight">
                    {{ timerDisplay }} <br>
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
                                <div class="content arsenal-content" @click="selectItem('cancel')" v-if="selectedItem === 'salvo' || selectedItem === 'radar' || selectedItem === 'missile' || selectedItem === 'torpedo'">
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
                                <span v-if="participantType === 1 || participantType > 2">
                                    <span v-if="arsenals.playerOne.lock"><i class="lock icon"></i> </span>
                                    <span v-else>{{ arsenals.playerOne.salvo }} </span>
                                </span>
                            </td>
                            <td>
                                <span v-if="participantType === 2 || participantType > 2">
                                    <span v-if="arsenals.playerTwo.lock"><i class="lock icon"></i> </span>
                                    <span v-else>{{ arsenals.playerTwo.salvo }} </span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="arsenal-content" @click="selectItem('torpedo')" :class="{'highlight': selectedItem === 'torpedo'}">Torpedo</td>
                            <td>
                                <span v-if="participantType === 1 || participantType > 2">
                                    <span v-if="arsenals.playerOne.lock"><i class="lock icon"></i> </span>
                                    <span v-else>{{ arsenals.playerOne.torpedo }} </span>
                                </span>
                            </td>
                            <td>
                                <span v-if="participantType === 2 || participantType > 2">
                                    <span v-if="arsenals.playerTwo.lock"><i class="lock icon"></i> </span>
                                    <span v-else>{{ arsenals.playerTwo.torpedo }} </span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="arsenal-content" @click="selectItem('missile')" :class="{'highlight': selectedItem === 'missile'}">Missile</td>
                            <td>
                                <span v-if="participantType === 1 || participantType > 2">
                                    <span v-if="arsenals.playerOne.lock"><i class="lock icon"></i> </span>
                                    <span v-else>{{ arsenals.playerOne.missile }} </span>
                                </span>
                            </td>
                            <td>
                                <span v-if="participantType === 2 || participantType > 2">
                                    <span v-if="arsenals.playerTwo.lock"><i class="lock icon"></i> </span>
                                    <span v-else>{{ arsenals.playerTwo.missile }} </span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="arsenal-content" @click="selectItem('radar')" :class="{'highlight': selectedItem === 'radar'}">Radar</td>
                            <td>
                                <span v-if="participantType === 1 || participantType > 2">
                                    <span v-if="arsenals.playerOne.lock"><i class="lock icon"></i> </span>
                                    <span v-else>{{ arsenals.playerOne.radar }} </span>
                                </span>
                            </td>
                            <td>
                                <span v-if="participantType === 2 || participantType > 2">
                                    <span v-if="arsenals.playerTwo.lock"><i class="lock icon"></i> </span>
                                    <span v-else>{{ arsenals.playerTwo.radar }} </span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="ship-timer highlight" v-if="arsenals[longParticipantType].lock && isOffsite">
                    {{ gameBoard.arsenalTimerDisplay }} <br>
                    <span style="color:#fff; margin-bottom: 10px; font-size:11px">
                        Arsenal Locked!
                    </span>
                </div>
                <div class="arsenal-content highlight" @click="leaveGame()" style="position: absolute; top: -20px;">
                    Exit
                </div>
                <i @click="toggleBackgroundMusic()" class="music icon" :class="{'active-bg-music': backgroundMusicStatus}"></i>
                <audio ref="backgroundMusic" autoplay="true" style="display:none;" id="menu_music" src="/static/build/audio/menu_music.mp3" type="audio/mpeg" loop></audio>
                <audio ref="win_sound" style="display:none;" id="win_sound" src="/static/build/audio/win_jingle.wav" type="audio/mpeg"></audio>
                <audio ref="lose_sound" style="display:none;" id="lose_sound" src="/static/build/audio/lose_jingle.wav" type="audio/mpeg"></audio>
                <audio ref="ship_destroy_sound" style="display:none;" id="ship_destroy_sound" src="/static/build/audio/destroyed.wav" type="audio/mpeg"></audio>
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
                <div class="gc-history">
                    <div class="gc-item" v-for="item in gameCodeHistory">
                        {{ item.name }}
                        <span :class="[item.result]" :data-tooltip="gcHistoryMsg[item.result]">
                            <i :class="[item.icon]"></i>
                        </span>
                    </div>
                </div>
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
            arsenalLockTimer: new Timer(),
            backgroundMusicStatus: true,
            isOffsite: false,
            participantTypeOptions: [
                {type: 1, name: 'Player One'},
                {type: 2, name: 'Player Two'},
                {type: 3, name: 'Game Master'},
                {type: 4, name: 'Observer'}
            ],
            selectedTeamName: '',
            gcHistoryMsg: {
                'gc-wrong-warn': 'Wrong code... be careful',
                'gc-wrong': 'Wrong code, you helped the enemy!',
                'gc-success': 'Correct code',
                'gc-dupe': 'You already entered this correct code'
            },
            playerOneName: '',
            playerTwoName: '',
            gameCodeHistory: [],
            gameCodes: [],
            arsenalTimeout: 10,
            opponentName: '',
            rotate: false,
            arsenals: {
                playerOne: {
                    lock: false,
                    salvo: 0,
                    torpedo: 0,
                    missile: 0,
                    radar: 0
                },
                playerTwo: {
                    lock: false,
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
        longParticipantType: function () {
            var vm = this
            return vm.participantType === 1 ? 'playerOne' : 'playerTwo'
        },
        timerDisplay: function () {
            var vm = this
            console.log(vm.gameBoard.timerDisplay)
            var milliseconds = Math.round(vm.gameBoard.timerDisplay)
                , seconds = Math.floor(Math.round(vm.gameBoard.timerDisplay / 1000) % 60)
                , minutes = Math.floor((vm.gameBoard.timerDisplay / (1000 * 60)) % 60)
                , hours = Math.floor((vm.gameBoard.timerDisplay / (1000 * 60 * 60)) % 24)

            hours = (hours < 10) ? "0" + hours : hours
            seconds = (seconds < 10) ? "0" + seconds : seconds
            if (seconds === '00') {
                minutes = Math.floor(Math.round(vm.gameBoard.timerDisplay / (1000 * 60)) % 60)
            }
            minutes = (minutes < 10) ? "0" + minutes : minutes
            return hours + ':' + minutes + ":" + seconds
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
            'setParticipantType',
            'setChatRecipients',
            'changeView'
        ]),
        toggleBackgroundMusic () {
            var vm = this
            if (this.backgroundMusicStatus) {
                vm.$refs.backgroundMusic.pause()
            } else {
                vm.$refs.backgroundMusic.play()
            }
            this.backgroundMusicStatus = !this.backgroundMusicStatus
        },
        arsenalLock (participantType) {
            let player = participantType === 1 ? 'playerOne' : 'playerTwo'
            return this.arsenals[player].lock
        },
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
                vm.boardMessage = `There are ${shipCount} squares occupied by the enemy in this area.`
                setTimeout(function () {
                    vm.boardMessage = ''
                }, 5000)
                socket.emit('radar-used', {
                    gameId: vm.currentRoom,
                    player: player,
                    selectedItem: vm.selectedItem
                })
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
                    // Dont allow players to shoot on themselves
                    if (vm.participantType === 1 && square.i < 9) {
                        return
                    } else if (vm.participantType === 2 && square.i > 8) {
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
                        let hitSquare = _.find(vm.gameBoard.boardObjects, function (o) {
                            return o.i === square.i && o.j === square.j
                        })
                        let hit ={
                            type: 'hit',
                            style: {
                                transform: `translate(${square.i * 42}px, ${square.j * 42}px)`,
                                background: hitSquare.style.background
                            },
                            i: square.i,
                            j: square.j,
                            gameId: vm.currentRoom,
                            shipType: hitSquare.type,
                            participantType: vm.participantType,
                            spliceIndex: weaponHit,
                            shotCounter: index,
                            item: vm.selectedItem,
                            player: player
                        }
                        socket.emit('weapon-hit', {
                            hit: hit,
                            hitSquare: hitSquare
                        })
                    } else if (weaponHit === -1 && _.findIndex(vm.gameBoard.hitMissGrid, function (o) {
                        return o.i === square.i && o.j === square.j
                    }) === -1) {
                        let miss = {
                            type: 'miss',
                            style: {
                                transform: `translate(${square.i * 42}px, ${square.j * 42}px)`,
                                background: 'none',
                            },
                            i: square.i,
                            j: square.j,
                            gameId: vm.currentRoom,
                            participantType: vm.participantType,
                            item: vm.selectedItem,
                            shotCounter: index,
                            player: player
                        }
                        socket.emit('weapon-miss', miss)
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
                let fullShip = []
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
                    fullShip.push(ship)
                })
                socket.emit('ship-placed', {
                    gameId: vm.currentRoom,
                    participantType: vm.participantType,
                    fullShip: fullShip
                })
            }
        },
        clearHoverGrid () {
            this.hoverGrid = []
        },
        leaveGame () {
            var vm = this
            socket.emit('leave-game', {
                gameId: vm.currentRoom,
                clientName: vm.clientName,
                participantType: vm.participantType
            })
            vm.changeView(['main'])
        },
        submitGameSettings () {
            var vm = this
            vm.changeClientName([vm.selectedTeamName])
            vm.gameBoard.gameState = 'setup'
            vm.setParticipantType([vm.participantType])
            vm.updatePlayerNames()
            vm.updateGameActions()
            socket.emit('player-name', {
                p1: vm.participantType === 1 ? vm.clientName : false,
                p2: vm.participantType === 2 ? vm.clientName : false,
                gameId: vm.currentRoom,
                clientName: vm.clientName,
                participantType: vm.participantType
            })
            socket.emit('join-game', {
                p1: vm.participantType === 1 ? vm.clientName : false,
                p2: vm.participantType === 2 ? vm.clientName : false,
                gameId: vm.currentRoom,
                clientName: vm.clientName,
                participantType: vm.participantType
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
                socket.emit('successful-game-code', {
                    gameId: vm.currentRoom,
                    player: player,
                    item: item,
                    participantType: vm.participantType
                })
                vm.gameCodeHistory.unshift({name: vm.gameCode, result: 'gc-success', icon: 'checkmark icon'})
                vm.boardMessage =`One ${item} added to your arsenal!`
                setTimeout(function () {
                    vm.boardMessage = ''
                }, 2000)
                vm.gameBoard.usedGameCodes.push(vm.gameCode)
            } else if (_.includes(vm.gameBoard.usedGameCodes, vm.gameCode)) {
                // game code is valid but has already been used
                vm.boardMessage = 'You already used that game code!'
                vm.gameCodeHistory.unshift({name: vm.gameCode, result: 'gc-dupe', icon: 'circle thin icon'})
                setTimeout(function () {
                    vm.boardMessage = ''
                }, 2000)
            } else {
                // game code is not valid
                if (vm.gameBoard.badGuesses < 2) {
                    vm.boardMessage = 'Bad Code! Incorrect codes will give the enemy free arsenal items...'
                    vm.gameBoard.badGuesses += 1
                    vm.gameCodeHistory.unshift({name: vm.gameCode, result: 'gc-wrong-warn', icon: 'warning sign icon'})
                    setTimeout(function () {
                        vm.boardMessage = ''
                    }, 2000)
                } else {
                    let freeItem = vm.gameBoard.badGuesses % 2 ? 'torpedo' : 'missile'
                    vm.boardMessage = `Bad Code! You just gave the enemy a free ${freeItem}`
                    vm.gameBoard.badGuesses += 1
                    vm.gameCodeHistory.unshift({name: vm.gameCode, result: 'gc-wrong', icon: 'close icon'})
                    socket.emit('bad-game-code', {
                        gameId: vm.currentRoom,
                        player: player === 'playerOne' ? 'playerTwo' : 'playerOne',
                        item: freeItem,
                        participantType: vm.participantType
                    })
                    setTimeout(function () {
                        vm.boardMessage = ''
                    }, 2000)
                }
            }
            vm.gameCode = ''
        },
        updatePlayerNames () {
            var vm = this
            axios.get(`/api/v1/game/${vm.currentRoom}`).then(function (response) {
                response.data.participants.map(function (each) {
                    if (each.game_role == 1) {
                        vm.playerOneName = each.name
                        vm.participantTypeOptions = _.remove(vm.participantTypeOptions, function(o) {
                            return o.type !== 1
                        })
                    } else if (each.game_role == 2) {
                        vm.playerTwoName = each.name
                        vm.participantTypeOptions = _.remove(vm.participantTypeOptions, function(o) {
                            return o.type !== 2
                        })
                    } else if (each.game_role == 3) {
                        vm.participantTypeOptions = _.remove(vm.participantTypeOptions, function(o) {
                            return o.type !== 3
                        })
                    }
                })
            })
        },
        updateGameActions () {
            var vm = this
            axios.get(`/api/v1/game/${vm.currentRoom}`).then(function (response) {
                response.data.actions.map(function (each) {
                    // do something with list of game actions
                    if (each.action.name === 'Ship Placed') {
                        var player = each.action.data[0].i > 8 ? 'playerTwo' : 'playerOne'
                        vm.gameBoard.originalShips[player][each.action.data[0].type].push(each.action.data)
                        each.action.data.map(function (shipTile) {
                            vm.gameBoard.boardObjects.push(shipTile)
                        })
                    }
                })
            })
        },
        selectItem (item) {
            var vm = this
            let player = vm.participantType === 1 ? 'playerOne' : 'playerTwo'
            if (_.includes(['salvo', 'cruiser', 'carrier', 'destroyer'], item) && this.gameBoard.gameState === 'setup' && this.participantType < 3) {
                vm.boardMessage =`Right click to rotate`
                setTimeout(function () {
                    vm.boardMessage = ''
                }, 2000)
            }
            if (this.arsenals[player].lock) {
                this.selectedItem = false
                this.hoverColor = '#fff'
                this.hoverShape = 'one',
                this.selectedItem = false
                this.hoverGrid = []
                return
            }
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
        vm.updatePlayerNames()
        axios.get(`/api/v1/game/${vm.currentRoom}`).then(function (response) {
            vm.gameCodes = response.data.game_codes
            vm.isOffsite = response.data.game.is_offsite
            vm.arsenalTimeout = response.data.game.arsenal_timeout
        })
        socket.on('ship-placed', function (data) {
            if (data.gameId == vm.currentRoom) {
                data.fullShip.map(function (ship) {
                    vm.gameBoard.boardObjects.push(ship)
                })
                let gameSide = data.fullShip[0].i > 8 ? 'playerTwo' : 'playerOne'
                vm.gameBoard.originalShips[gameSide][data.fullShip[0].type].push(data.fullShip)
                vm.ships = vm.gameBoard.shipCount()
            }
        })
        socket.on('weapon-hit', function (data) {
            if (data.hit.gameId == vm.currentRoom) {
                // Remove the board object for the ship in question
                vm.gameBoard.boardObjects.splice(_.findIndex(vm.gameBoard.boardObjects, function (o) {
                    return o.i === data.hit.i && o.j === data.hit.j
                }), 1)
                // Remove the ship piece from our ship counter to help us
                // calculate when a ship is destroyed. We need to do this because
                // it is the easiest way to count partial ships that have been hit.
                let shipDestroyed = vm.gameBoard.removeShipPiece(data.hit, data.hitSquare)
                // Add the hit marker to the map
                vm.gameBoard.hitMissGrid.push(data.hit)
                // Only subtract a salvo from an arsenal when we've used the last of three shtos
                if (data.hit.item === 'salvo') {
                    if (data.hit.shotCounter === 2 && data.hit.participantType < 3) {
                        vm.arsenals[data.hit.player][data.hit.item] -= 1
                    }
                } else if (data.hit.participantType < 3) {
                    vm.arsenals[data.hit.player][data.hit.item] -= 1
                }
                // update the ship count on the board
                vm.ships = vm.gameBoard.shipCount()

                // Check to see if a ship was destroyed and lock the arsenal if appropriate
                if (shipDestroyed.result) {
                    vm.$refs.ship_destroy_sound.play()
                    if (_.includes(['destroyer', 'cruiser', 'carrier'], shipDestroyed.ship)) {
                        let player = data.hit.i < 9 ? 'playerOne' : 'playerTwo'
                        vm.arsenals[player].lock = true
                        if (player === vm.longParticipantType) {
                            vm.boardMessage = 'Your arsenal is locked!'
                            if (vm.isOffsite) {
                                vm.arsenalLockTimer.start(vm.arsenalTimeout)
                            }
                            setTimeout(function () {
                                vm.boardMessage = ''
                            }, 2000)
                        }
                    }
                }
                // After every weapon hit, we need to check to see if the victory
                // conditions have been acheived.
                if (vm.gameBoard.checkVictoryConditions()) {
                    console.log('victory conditions', vm.gameBoard.checkVictoryConditions())
                    vm.$refs.win_sound.play()
                    socket.emit('end-game', {
                        id: vm.currentRoom
                    })
                }
            }
        })
        socket.on('weapon-miss', function (data) {
            if (data.gameId == vm.currentRoom) {
                vm.gameBoard.hitMissGrid.push(data)
                if (data.item === 'salvo') {
                    if (data.shotCounter === 2 && data.participantType < 3) {
                        vm.arsenals[data.player][data.item] -= 1
                    }
                } else if (data.participantType < 3) {
                    vm.arsenals[data.player][data.item] -= 1
                }
            }
        })
        socket.on('start-timer', function (data) {
            if (data.id == vm.currentRoom) {
                vm.gameTimer.start(vm.gameBoard.timerDisplay / 1000)
                vm.setChatRecipients([[vm.participantType, 3, 4]])
            }
        })
        socket.on('radar-used', function (data) {
            if (data.gameId == vm.currentRoom) {
                vm.arsenals[data.player][data.selectedItem] -= 1
            }
        })
        socket.on('pause-timer', function (data) {
            if (data.id == vm.currentRoom) {
                vm.gameTimer.pause()
                vm.setChatRecipients([[1, 2, 3, 4]])
            }
        })
        socket.on('start-game', function (data) {
            if (data.id == vm.currentRoom) {
                vm.gameBoard.gameState = 'playing'
                vm.gameTimer.stop()
                vm.gameBoard.timerDisplay = 60*60*1000
            }
        })
        socket.on('leave-game', function (data) {
            vm.updatePlayerNames()
        })
        socket.on('end-game', function (data) {
            if (data.id == vm.currentRoom) {
                vm.gameBoard.gameState = 'ended'
                vm.gameTimer.stop()
                vm.gameBoard.timerDisplay = 0
                setTimeout(function () {
                    Object.assign(vm.$data, vm.$options.data())
                }, 7000)
                vm.changeView(['ended'])
            }
        })
        socket.on('arsenal-change', function (data) {
            if (data.gameId == vm.currentRoom) {
                let player = data.participantType == 1 ? 'playerOne' : 'playerTwo'
                if (data.modify == 'subtract') {
                    if (data.item == 'lock') {
                        vm.arsenals[player][data.item] = false
                    } else if (vm.arsenals[player][data.item] > 0) {
                        vm.arsenals[player][data.item] -= 1
                    }

                } else if (data.modify == 'add') {
                    if (data.item == 'lock') {
                        vm.arsenals[player][data.item] = true
                    } else {
                        vm.arsenals[player][data.item] += 1
                    }
                }
            }
        })
        socket.on('reset-ships', function (data) {
            if (data.id == vm.currentRoom) {
                vm.ships = {
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
                }
                vm.gameBoard.boardObjects = []
                vm.gameBoard.originalShips = {
                    playerOne: {
                        destroyer: [],
                        cruiser: [],
                        carrier: [],
                        outpost: [],
                        submarine: []
                    },
                    playerTwo: {
                        destroyer: [],
                        cruiser: [],
                        carrier: [],
                        outpost: [],
                        submarine: []
                    }
                }
            }
        })
        socket.on('add-minute', function (data) {
            if (data.id == vm.currentRoom) {
                if (vm.gameTimer.getStatus() === 'started') {
                    vm.gameTimer.stop()
                    vm.gameTimer.start((vm.gameBoard.timerDisplay / 1000) + 60)
                }
                vm.gameBoard.timerDisplay += 60*1000
            }
        })
        socket.on('subtract-minute', function (data) {
            if (data.id == vm.currentRoom) {
                if (vm.gameTimer.getStatus() === 'started') {
                    vm.gameTimer.stop()
                    vm.gameTimer.start((vm.gameBoard.timerDisplay / 1000) - 60)
                }
                vm.gameBoard.timerDisplay -= 60*1000
            }
        })
        socket.on('player-name', function (data) {
            if (data.gameId == vm.currentRoom) {
                vm.updatePlayerNames()
                if (data.p1) {
                    vm.playerOneName = data.p1
                }
                if (data.p2) {
                    vm.playerTwoName = data.p2
                }
            }
        })
        socket.on('successful-game-code', function (data) {
            if (data.gameId == vm.currentRoom && data.participantType != vm.participantType) {
                vm.arsenals[data.player][data.item] += 1
            }
        })
        socket.on('bad-game-code', function (data) {
            if (data.gameId == vm.currentRoom && data.participantType != vm.participantType) {
                vm.arsenals[data.player][data.item] += 1
            }
        })
        socket.on('join-game', function (data) {
            // redownload all players
            vm.updatePlayerNames()
        })
        vm.gameTimer.on('tick', function (duration) {
            vm.gameBoard.timerDisplay = duration
        })
        vm.gameTimer.on('end', function () {
            vm.gameBoard.timerDisplay = 0
            if (vm.gameBoard.gameState === 'playing') {
                socket.emit('end-game', {
                    id: vm.currentRoom
                })
            }
        })
        vm.arsenalLockTimer.on('tick', function (duration) {
            var milliseconds = parseInt((duration%1000)/100)
                , seconds = parseInt(Math.round(duration/1000)%60)
                , minutes = parseInt((duration/(1000*60))%60)
                , hours = parseInt((duration/(1000*60*60))%24);

            hours = (hours < 10) ? "0" + hours : hours
            minutes = (minutes < 10) ? "0" + minutes : minutes
            seconds = (seconds < 10) ? "0" + seconds : seconds
            vm.gameBoard.arsenalTimerDisplay = minutes + ":" + seconds
        })
        vm.arsenalLockTimer.on('end', function () {
            let player = vm.participantType == 1 ? 'playerOne' : 'playerTwo'
            vm.arsenals[player].lock = false
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
    width: 550px;
    text-align: center;
    top: 430px;
    left: 500px;
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
}

.hit-miss {
    position: absolute;
    height: 42px;
    width: 42px;
}

.hit {
    background: url(/static/build/img/x.e7680db3e4b66837463c2d7208e70294.png);
}

.miss {
    background: url(/static/build/img/o.ce7403ad50b153c281f3493a9d14d06d.png);
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
.gc-history {
    position: absolute;
    top: 100px;
    color: #636363;
    font-size: 25px;
    line-height: 30px;
    height: 200px;
    overflow-y: scroll;
    width: 200px;
}
.gc-success {
    color: #4adb28;
}

.gc-dupe {
    color: #708278;
}

.gc-wrong-warn {
    color: #a1a515;
}

.gc-wrong {
   color: #db2828;
}

.active-bg-music {
    color: #4adb28;
}
</style>
