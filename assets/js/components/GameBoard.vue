<template lang="html">
    <div class="game-board-wrapper">
        <div class="game-board" @mouseleave="clearHoverGrid()">
            <x-board-object
                class="board-object"
                :style="o.style"
                @contextmenu.prevent=""
                v-for="(o, index) in gameBoard.boardObjects">
            </x-board-object>
            <x-square
                :class="[i.baseClass, {'square-hover': i.squareHover}]"
                :style="i.style"
                v-for="(i, index) in gb"
                @click="boardClick($event)"
                @mouseover="squareMouseOver(i.coords)"
                @contextmenu.prevent="squareMouseOver(i.coords, 'rotate')">
            </x-square>
        </div>
        <div class="arsenal">
            <h3>Arsenal</h3>
            <div class="ui list">
                <div class="item">
                    <i class="bomb icon"></i>
                    <div class="content arsenal-content" @click="selectItem('salvo')" :class="{'highlight': selectedItem === 'salvo'}">
                        Salvo
                    </div>
                </div>
                <div class="item">
                    <i class="anchor icon"></i>
                    <div class="content arsenal-content" @click="selectItem('torpedo')" :class="{'highlight': selectedItem === 'torpedo'}">
                        Torpedo
                    </div>
                </div>
                <div class="item">
                    <i class="rocket icon"></i>
                    <div class="content arsenal-content" @click="selectItem('missile')" :class="{'highlight': selectedItem === 'missile'}">
                        Missile
                    </div>
                </div>
                <div class="item">
                    <i class="bullseye icon"></i>
                    <div class="content arsenal-content" @click="selectItem('radar')" :class="{'highlight': selectedItem === 'radar'}">
                        Radar
                    </div>
                </div>
                <div class="ui divider"></div>
                <div class="item">
                    <i class="anchor icon"></i>
                    <div class="content arsenal-content" @click="selectItem('destroyer')" :class="{'highlight': selectedItem === 'destroyer'}">
                        Destroyer
                    </div>
                </div>
                <div class="item">
                    <i class="rocket icon"></i>
                    <div class="content arsenal-content" @click="selectItem('cruiser')" :class="{'highlight': selectedItem === 'cruiser'}">
                        Cruiser
                    </div>
                </div>
                <div class="item">
                    <i class="bullseye icon"></i>
                    <div class="content arsenal-content" @click="selectItem('carrier')" :class="{'highlight': selectedItem === 'carrier'}">
                        Carrier
                    </div>
                </div>
                <div class="item">
                    <i class="bullseye icon"></i>
                    <div class="content arsenal-content" @click="selectItem('outpost')" :class="{'highlight': selectedItem === 'outpost'}">
                        Outpost
                    </div>
                </div>
                <div class="item">
                    <i class="bullseye icon"></i>
                    <div class="content arsenal-content" @click="selectItem('submarine')" :class="{'highlight': selectedItem === 'submarine'}">
                        Submarine
                    </div>
                </div>
                <div class="ui divider"></div>
                <div class="item" v-if="selectedItem">
                    <div class="content arsenal-content" @click="selectItem('cancel')">
                        Cancel (Right click to rotate)
                    </div>
                </div>
                <div class="ui divider"></div>
                <div class="item" v-if="gameBoard.boardObjects.length > 0">
                    <div class="content arsenal-content" @click="gameBoard.boardObjects = []">
                        Clear Board
                    </div>
                </div>
                <div class="item" v-if="boardMessage">
                    <div class="content arsenal-content" >
                        {{ boardMessage }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import {GameBoard} from '../models/gameBoard.js'

export default {
    data () {
        return {
            gameBoard: new GameBoard(),
            hoverGrid: [],
            hoverShape: 'one',
            hoverColor: '#fff',
            boardMessage: '',
            rotate: false,
            selectedItem: false
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
        }
    },
    methods: {
        boardClick (event) {
            var vm = this
            if (_.includes(['torpedo', 'missile', 'salvo', 'radar'], vm.selectedItem)) {
                return
            }
            if (vm.gameBoard.areInvalid(vm.hoverGrid, vm.selectedItem)) {
                vm.boardMessage = 'Invalid placement'
                setTimeout(function () {
                    vm.boardMessage = ''
                }, 1000)
            } else if (!vm.gameBoard.shipLimitExceeded(vm.selectedItem, vm.hoverGrid)){
                vm.hoverGrid.map(function (square) {
                    vm.gameBoard.boardObjects.push({
                        type: vm.selectedItem,
                        style: {
                            transform: `translate(${square.i * 42}px, ${square.j * 42}px)`,
                            background: vm.hoverColor
                        },
                        i: square.i,
                        j: square.j
                    })
                })
            }
        },
        clearHoverGrid () {
            this.hoverGrid = []
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
    }
}
</script>

<style lang="css" scoped>
.board-object {
    position: absolute;
    height: 42px;
    width: 42px;
    background: #fff;
    opacity: 0.5
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
