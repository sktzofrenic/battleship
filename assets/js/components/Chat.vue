<template lang="html">
    <div class="">
        <h2 class="chat-title">Chat ({{ currentRoom }})</h2>
        <div class="chat-box" ref="chatbox" id="style-3">
            <span v-for="msg in chatMessages" class="chat-message" v-if="msg.room === currentRoom">
                <strong>{{msg.name}}:</strong> {{msg.message}}
            </span>
        </div>
        <div class="ui inverted transparent icon input chat-input">
            <input type="text" placeholder="Chat..." v-model="clientMessage" @keyup.enter="send">
            <i class="comment outline icon"></i>
        </div>
        <div class="gm-controls" v-if="participantType === 3">
            <h2 class="chat-title">GM Controls</h2>
            <button class="ui red tiny inverted button" name="button" @click="startGame()">Start Game</button>
            <button class="ui red tiny inverted button" name="button" @click="startTimer()">Start Timer</button>
            <button class="ui red tiny inverted button" name="button" @click="pauseTimer()">Pause Timer</button>
            <button class="ui red tiny inverted button" name="button" @click="endGame()">End Game</button>
            <button class="ui red tiny inverted button" name="button" @click="restartGame()">Restart Game</button>
            <button class="ui red tiny inverted button" name="button" @click="addOneMinute()">Add Minute</button>

        </div>
    </div>
</template>

<script>
import {socket} from '../socket.js'
import {mapGetters, mapActions} from 'vuex'

export default {
    data () {
        return {
            clientMessage: ''
        }
    },
    methods: {
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
        restartGame () {
            socket.emit('restart-game', {
                id: this.currentRoom
            })
        },
        send () {
            socket.emit('chat', {
                message: this.clientMessage,
                name: this.clientName,
                room: this.currentRoom
            })
            this.clientMessage = ''
        },
        ...mapActions([
            'pushMessage'
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
            'participantType'
        ])
    },
    mounted () {
        var vm = this
        socket.on('chat', function(msg) {
            vm.pushMessage([msg])
        })
    }
}
</script>

<style lang="css" scoped>
.chat-message {
    display: block;
    font-family: 'Inconsolata', monospace;
}
.chat-input {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px !important;
    border-top: 1px solid #464646;
    padding-top: 5px;
}
.chat-title {
    font-family: 'Black Ops One', cursive;
    color: #e22722;
    padding-top: 10px;
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
