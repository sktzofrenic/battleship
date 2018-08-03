<template lang="html">
    <div class="">
        <audio ref="chatSound" style="display:none;" id="menu_music" src="/static/build/audio/new-chat.wav" type="audio/mpeg"></audio>
        <h2 class="chat-title" style="margin-top: 10px;">Chat ({{ currentRoom }})</h2>
        <div class="chat-box" ref="chatbox" id="style-3">
            <span v-for="msg in chatMessages" class="chat-message" v-if="msg.room === currentRoom">
                <strong>{{msg.name}}:</strong> {{msg.message}}
            </span>
        </div>
        <div class="ui inverted transparent icon input chat-input">
            <input type="text" placeholder="Chat..." v-model="clientMessage" @keyup.enter="send">
            <i class="comment outline icon"></i>
        </div>
        <div class="chat-controls" v-if="participantType === 1">
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 8}" name="button" @click="setChatRecipients([[1, 3, 4]])">GM Chat</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 10}"  name="button" @click="setChatRecipients([[1, 2, 3, 4]])">All</button>
        </div>
        <div class="chat-controls" v-if="participantType === 2">
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 9}"  name="button" @click="setChatRecipients([[2, 3, 4]])">GM Chat</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 10}" name="button" @click="setChatRecipients([[1, 2, 3, 4]])">All</button>
        </div>
        <div class="chat-controls" v-if="participantType === 3">
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 8}"  @click="setChatRecipients([[1, 3, 4]])">P1</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 9}"  @click="setChatRecipients([[2, 3, 4]])">P2</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 10}"  @click="setChatRecipients([[1, 2, 3, 4]])">All</button>
        </div>
        <div class="ui divider" v-if="participantType === 3">

        </div>
        <div class="gm-controls" v-if="participantType === 3">
            <h2 class="chat-title">GM Controls</h2>
            <div class="ui inverted red vertical menu gm-control-menu">
                <a class="item">
                    <h4 class="ui header">Game Timer</h4>
                    <button class="ui black tiny inverted icon button" name="button" @click="startTimer()">
                        <i class="play icon"></i>
                    </button>
                    <button class="ui black tiny inverted icon button" name="button" @click="pauseTimer()">
                        <i class="pause icon"></i>
                    </button>
                    <button class="ui black tiny inverted button smaller-padding" name="button" @click="addOneMinute()">+1 Min</button>
                    <button class="ui black tiny inverted button smaller-padding" name="button" @click="subtractOneMinute()">-1 Min </button>
                </a>
                <a class="item">
                    <button class="ui black tiny inverted button smaller-padding" name="button" @click="startGame()">Start Game</button>
                    <button v-if="!endGameConfirm" class="ui black tiny inverted button smaller-padding" name="button" @click="confirmButton">End Game</button>
                    <button v-if="endGameConfirm" class="ui black tiny inverted button smaller-padding" name="button" @click="endGame()">Confirm</button>
                    <button class="ui black tiny inverted button smaller-padding" name="button" @click="resetShips()">Reset Ships</button>
                </a>
                <a class="item" style="padding: 0px !important;">
                    <table class="ui compact inverted red table">
                        <tbody>
                            <tr>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('subtract', 'salvo')">
                                        <i class="minus icon"></i>
                                    </button>
                                </td>
                                <td>Salvo</td>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('add', 'salvo')">
                                        <i class="add icon"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('subtract', 'torpedo')">
                                        <i class="minus icon"></i>
                                    </button>
                                </td>
                                <td>Torpedo</td>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('add', 'torpedo')">
                                        <i class="add icon"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('subtract', 'missile')">
                                        <i class="minus icon"></i>
                                    </button>
                                </td>
                                <td>Missile</td>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('add', 'missile')">
                                        <i class="add icon"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('subtract', 'radar')">
                                        <i class="minus icon"></i>
                                    </button>
                                </td>
                                <td>Radar</td>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('add', 'radar')">
                                        <i class="add icon"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('subtract', 'lock')">
                                        <i class="minus icon"></i>
                                    </button>
                                </td>
                                <td>Arsenal Lock</td>
                                <td>
                                    <button class="ui black tiny inverted icon button" name="button" @click="changeArsenal('add', 'lock')">
                                        <i class="add icon"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import {socket} from '../socket.js'
import {mapGetters, mapActions} from 'vuex'
import _ from 'lodash'

export default {
    data () {
        return {
            clientMessage: '',
            endGameConfirm: false,
        }
    },
    methods: {
        changeArsenal (modify, item) {
            var vm = this
            vm.chatRecipients.map(function (each) {
                if (each < 3) {
                    socket.emit('arsenal-change', {
                        gameId: vm.currentRoom,
                        modify: modify,
                        item: item,
                        participantType: each
                    })
                }
            })
        },
        startGame () {
            socket.emit('start-game', {
                id: this.currentRoom
            })
        },
        addOneMinute () {
            socket.emit('add-minute', {
                id: this.currentRoom
            })
        },
        subtractOneMinute () {
            socket.emit('subtract-minute', {
                id: this.currentRoom
            })
        },
        confirmButton () {
            var vm = this
            vm.endGameConfirm = true
            setTimeout(function () {
                vm.endGameConfirm = false
            }, 4000)
        },
        startTimer () {
            socket.emit('start-timer', {
                id: this.currentRoom
            })
        },
        pauseTimer () {
            socket.emit('pause-timer', {
                id: this.currentRoom
            })
        },
        endGame () {
            socket.emit('end-game', {
                id: this.currentRoom
            })
        },
        resetShips () {
            var vm = this
            vm.chatRecipients.map(function (each) {
                if (each < 3) {
                    socket.emit('reset-ships', {
                        id: vm.currentRoom,
                        participantType: each
                    })
                }
            })
        },
        send () {
            socket.emit('chat', {
                message: this.clientMessage,
                name: this.clientName,
                room: this.currentRoom,
                recipients: this.chatRecipients,
                chatNumber: this.chatNumber,
                sender: this.participantType
            })
            this.clientMessage = ''
        },
        ...mapActions([
            'pushMessage',
            'setChatRecipients'
        ])
    },
    updated () {
        this.$refs.chatbox.scrollTop = this.$refs.chatbox.scrollHeight
    },
    computed: {
        ...mapGetters([
            'currentRoom',
            'clientName',
            'chatMessages',
            'participantType',
            'chatRecipients',
            'chatNumber'
        ])
    },
    mounted () {
        var vm = this
        socket.on('chat', function(msg) {
            if (msg.recipients) {
                if (_.includes(msg.recipients, vm.participantType)) {
                    if (msg.chatNumber < 10) {
                        msg.name = `${msg.name} (whispers)`
                    }
                    vm.pushMessage([msg])
                }
            } else {
                vm.pushMessage([msg])
            }
            if (msg.sender === vm.participantType) {
                vm.$refs.chatSound.play()
            }
        })
        socket.on('end-game', function (data) {
            if (data.id == vm.currentRoom) {
                Object.assign(vm.$data, vm.$options.data())
            }
        })
    }
}
</script>

<style lang="css" scoped>
.chat-message {
    display: block;
    font-family: 'Inconsolata', monospace;
}
.smaller-padding {
    padding: .78571429em .5em !important;
}
.gm-control-menu {
    margin: 0px !important;
    width: 100% !important;
}
.chat-controls {
    margin-top: 10px;
    text-align: center;
    margin-bottom: -3px;
}
.chat-input {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px!important;
    border-top: 1px solid #464646;
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #423e3e;
}
.chat-title {
    font-family: 'Black Ops One', cursive;
    color: #e22722;
    padding-top: -1px;
    padding-left: 10px;
    padding-bottom: 0px;
    margin-bottom: 0px;
}
.chat-box {
    height: 250px;
    width: 100%;
    padding: 10px;
    overflow-y: scroll;
}
#style-3::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}

#style-3::-webkit-scrollbar
{
	width: 6px;
	background-color: #F5F5F5;
}

#style-3::-webkit-scrollbar-thumb
{
	background-color: #000000;
}
</style>
