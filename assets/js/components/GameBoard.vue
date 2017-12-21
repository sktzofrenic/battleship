<template lang="html">
    <div class="game-board-wrapper">
        <div class="game-board">
            <x-square
                :class="[i.baseClass, {'square-hover': i.squareHover}]"
                :style="i.style"
                v-for="(i, index) in gb"
                @mouseover="squareMouseOver(i.coords)" @contextmenu.prevent="squareMouseOver(i.coords, 'rotate')">
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
                <div class="item" v-if="selectedItem">
                    <div class="content arsenal-content" @click="selectItem('cancel')">
                        Cancel
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data () {
        return {
            gameBoard: _.range(17).map(function (item) {
    	       return _.range(9)
            }),
            hoverGrid: [],
            hoverShape: 'threeWide',
            rotate: false,
            selectedItem: false
        }
    },
    computed: {
      	gb: function () {
        	var final = []
            var vm = this
        	this.gameBoard.map(function (i, index) {
              	i.map(function (j) {
                	final.push({
                        style: {
                            transform: `translate(${index * 42}px, ${j * 42}px)`
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
        selectItem (item) {
            if (item == 'cancel') {
                this.selectedItem = false
                this.hoverShape = 'one'
                return
            }
            this.selectedItem = item
            if (item === 'salvo') {
                this.hoverShape = 'threeWide'
            } else if (item === 'missile' || item === 'torpedo') {
                this.hoverShape = 'one'
            } else if (item === 'radar') {
                this.hoverShape = 'radar'
            }
        },
        areInvalid (coords) {
            if (coords.j === 0 || coords.i === 0) {
                return true
            } else {
                return false
            }
        },
        squareMouseOver (coords, rotate) {
            if (this.areInvalid(coords)) {
                var vm = this
                vm.hoverGrid = []
                return
            }
            if (rotate) {
                this.rotate = !this.rotate
            }
            console.log(coords)
            var vm = this
            vm.hoverGrid = []
            if (vm.hoverShape === 'radar') {
                vm.hoverGrid.push({i: coords.i, j: coords.j})
                vm.hoverGrid.push({i: coords.i + 1, j: coords.j + 1})
                vm.hoverGrid.push({i: coords.i + 1, j: coords.j})
                vm.hoverGrid.push({i: coords.i + 1, j: coords.j - 1})
                vm.hoverGrid.push({i: coords.i, j: coords.j - 1})
                vm.hoverGrid.push({i: coords.i, j: coords.j + 1})
                vm.hoverGrid.push({i: coords.i - 1, j: coords.j + 1})
                vm.hoverGrid.push({i: coords.i - 1, j: coords.j})
                vm.hoverGrid.push({i: coords.i - 1, j: coords.j - 1})
            } else if (vm.hoverShape === 'threeWide') {
                if (vm.rotate) {
                    vm.hoverGrid.push({i: coords.i, j: coords.j - 1})
                    vm.hoverGrid.push({i: coords.i, j: coords.j})
                    vm.hoverGrid.push({i: coords.i, j: coords.j + 1})
                } else {
                    vm.hoverGrid.push({i: coords.i - 1, j: coords.j})
                    vm.hoverGrid.push({i: coords.i, j: coords.j})
                    vm.hoverGrid.push({i: coords.i + 1, j: coords.j})
                }
            } else if (vm.hoverShape === 'one') {
                vm.hoverGrid.push({i: coords.i, j: coords.j})
            }
        }
    }
}
</script>

<style lang="css" scoped>
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
  opacity: 0.4
}

.border-square, .border-square:hover {
   height: 42px;
  width: 42px;
  position: absolute;
  opacity: 0 important;
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
