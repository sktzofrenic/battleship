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
            <div class="arsenal">
                <h3>Arsenal</h3>
                <div class="ui list">
                    <div class="item">
                        <i class="bomb icon"></i>
                        <div class="content arsenal-content" @click="selectItem('salvo')" :class="{'highlight': selectedItem === 'salvo'}">
                            Salvo
                            <span v-if="participantType === 1 || participantType > 2">  x{{ arsenals.playerOne.salvo }} </span>
                            <span v-if="participantType === 2 || participantType > 2">  x{{ arsenals.playerTwo.salvo }} </span>
                        </div>
                    </div>
                    <div class="item">
                        <i class="anchor icon"></i>
                        <div class="content arsenal-content" @click="selectItem('torpedo')" :class="{'highlight': selectedItem === 'torpedo'}">
                            Torpedo
                            <span v-if="participantType === 1 || participantType > 2">  x{{ arsenals.playerOne.torpedo }} </span>
                            <span v-if="participantType === 2 || participantType > 2">  x{{ arsenals.playerTwo.torpedo }} </span>
                        </div>
                    </div>
                    <div class="item">
                        <i class="rocket icon"></i>
                        <div class="content arsenal-content" @click="selectItem('missile')" :class="{'highlight': selectedItem === 'missile'}">
                            Missile
                            <span v-if="participantType === 1 || participantType > 2">  x{{ arsenals.playerOne.missile }} </span>
                            <span v-if="participantType === 2 || participantType > 2">  x{{ arsenals.playerTwo.missile }} </span>
                        </div>
                    </div>
                    <div class="item">
                        <i class="bullseye icon"></i>
                        <div class="content arsenal-content" @click="selectItem('radar')" :class="{'highlight': selectedItem === 'radar'}">
                            Radar
                            <span v-if="participantType === 1 || participantType > 2">  x{{ arsenals.playerOne.radar }} </span>
                            <span v-if="participantType === 2 || participantType > 2">  x{{ arsenals.playerTwo.radar }} </span>
                        </div>
                    </div>
                    <div class="ui divider"></div>
                    <div class="item">
                        <i class="anchor icon"></i>
                        <div class="content arsenal-content" @click="selectItem('destroyer')" :class="{'highlight': selectedItem === 'destroyer'}">
                            Destroyer
                            ({{ Math.ceil(ships.playerOne.destroyer / 2 )}} of {{ this.gameBoard.shipLimits.destroyer / 2 }})
                            ({{ Math.ceil(ships.playerTwo.destroyer / 2) }} of {{ this.gameBoard.shipLimits.destroyer / 2 }})
                        </div>
                    </div>
                    <div class="item">
                        <i class="rocket icon"></i>
                        <div class="content arsenal-content" @click="selectItem('cruiser')" :class="{'highlight': selectedItem === 'cruiser'}">
                            Cruiser
                            ({{ Math.ceil(ships.playerOne.cruiser / 3) }} of {{ this.gameBoard.shipLimits.cruiser / 3 }})
                            ({{ Math.ceil(ships.playerTwo.cruiser / 3) }} of {{ this.gameBoard.shipLimits.cruiser / 3 }})
                        </div>
                    </div>
                    <div class="item">
                        <i class="bullseye icon"></i>
                        <div class="content arsenal-content" @click="selectItem('carrier')" :class="{'highlight': selectedItem === 'carrier'}">
                            Carrier
                            ({{ Math.ceil(ships.playerOne.carrier / 6) }} of {{ this.gameBoard.shipLimits.carrier / 6 }})
                            ({{ Math.ceil(ships.playerTwo.carrier / 6 )}} of {{ this.gameBoard.shipLimits.carrier / 6 }})
                        </div>
                    </div>
                    <div class="item">
                        <i class="bullseye icon"></i>
                        <div class="content arsenal-content" @click="selectItem('outpost')" :class="{'highlight': selectedItem === 'outpost'}">
                            Outpost
                            ({{ ships.playerOne.outpost }} of {{ this.gameBoard.shipLimits.outpost }})
                            ({{ ships.playerTwo.outpost }} of {{ this.gameBoard.shipLimits.outpost }})
                        </div>
                    </div>
                    <div class="item">
                        <i class="bullseye icon"></i>
                        <div class="content arsenal-content" @click="selectItem('submarine')" :class="{'highlight': selectedItem === 'submarine'}">
                            Submarine
                            ({{ ships.playerOne.submarine }} of {{ this.gameBoard.shipLimits.submarine }})
                            ({{ ships.playerTwo.submarine }} of {{ this.gameBoard.shipLimits.submarine }})
                        </div>
                    </div>
                    <div class="ui divider"></div>
                    <div class="item ui input">
                        <input type="text" name="" v-model.number="participantType">
                    </div>
                    <div class="item" v-if="selectedItem">
                        <div class="content arsenal-content" @click="selectItem('cancel')">
                            Cancel (Right click to rotate)
                        </div>
                    </div>
                    <div class="item" v-if="gameBoard.boardObjects.length > 0">
                        <div class="content arsenal-content" @click="clearBoard()">
                            Clear Board
                        </div>
                    </div>
                </div>
            </div>
            <div class="ui action inverted huge input game-code">
                <input type="text" :value="gameCode" maxlength="5" @input="gameCode = $event.target.value.toUpperCase()">
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

export default {
    data () {
        return {
            gameBoard: new GameBoard(),
            hoverGrid: [],
            hoverShape: 'one',
            hoverColor: '#fff',
            boardMessage: '',
            selectedTeamName: '',
            rotate: false,
            arsenals: {
                playerOne: {
                    salvo: '∞',
                    torpedo: '∞',
                    missile: '∞',
                    radar: '∞'
                },
                playerTwo: {
                    salvo: '∞',
                    torpedo: '∞',
                    missile: '∞',
                    radar: '∞'
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
            'pushMessage'
        ]),
        boardClick (event) {
            var vm = this
            if (vm.selectedItem === 'radar') {
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
                return
            }
            if (_.includes(['salvo', 'missile', 'torpedo'], vm.selectedItem)) {
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
                        vm.gameBoard.hitMissGrid.push({
                            type: 'hit',
                            style: {
                                transform: `translate(${square.i * 42}px, ${square.j * 42}px)`
                            },
                            i: square.i,
                            j: square.j
                        })
                        vm.gameBoard.boardObjects.splice(weaponHit, 1)
                    } else if (weaponHit === -1 && _.findIndex(vm.gameBoard.hitMissGrid, function (o) {
                        return o.i === square.i && o.j === square.j
                    }) === -1) {
                        vm.gameBoard.hitMissGrid.push({
                            type: 'miss',
                            style: {
                                transform: `translate(${square.i * 42}px, ${square.j * 42}px)`
                            },
                            i: square.i,
                            j: square.j
                        })
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
        },
        verifyGameCode () {
            this.gameCode = ''
        },
        clearBoard () {
            this.gameBoard.boardObjects = []
            this.ships = this.gameBoard.shipCount()
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
        socket.on('ship-placed', function (data) {
            console.log(data)
            if (data.gameId == vm.currentRoom && data.participantType != vm.participantType) {
                vm.gameBoard.boardObjects.push(data)
                vm.ships = vm.gameBoard.shipCount()
            }
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
    top: 390px;
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
    width: 200px;
    top: 390px;
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
    color: #e22722
}
.game-board-wrapper {
    width: 100%;
    position: relative;
}
.game-board {
    position: absolute;
    top: 0px;
    left: 0px;
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
    -webkit-border-top-right-radius: 10px;
    -webkit-border-bottom-right-radius: 10px;
    -moz-border-radius-topright: 10px;
    -moz-border-radius-bottomright: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: #1b1b1b;
    width: 240px;
    position: absolute;
    left: 714px;
    padding: 10px;
    border-left: solid 2px #c1c1c1;
    color: #fff;
    height: 378px;
}
</style>
