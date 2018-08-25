<template lang="html">
    <div class="">
        <audio ref="chatSound" style="display:none;" id="menu_music" src="/static/build/audio/new-chat.wav" type="audio/mpeg"></audio>
        <div class="chat-controls" v-if="participantType === 1">
            <button class="ui red tiny inverted button" disabled>Chat ({{ currentRoom }})</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 8}" name="button" @click="setChatRecipients([[1, 3, 4]])">GM Chat</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 10}"  name="button" @click="setChatRecipients([[1, 2, 3, 4]])">All</button>
        </div>
        <div class="chat-controls" v-if="participantType === 2">
            <button class="ui red tiny inverted button" disabled>Chat ({{ currentRoom }})</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 9}"  name="button" @click="setChatRecipients([[2, 3, 4]])">GM Chat</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 10}" name="button" @click="setChatRecipients([[1, 2, 3, 4]])">All</button>
        </div>
        <div class="chat-controls" v-if="participantType === 3">
            <button class="ui red tiny inverted button" disabled>Chat ({{ currentRoom }})</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 8}"  @click="setChatRecipients([[1, 3, 4]])">P1</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 9}"  @click="setChatRecipients([[2, 3, 4]])">P2</button>
            <button class="ui red tiny inverted button" :class="{'active': chatNumber == 10}"  @click="setChatRecipients([[1, 2, 3, 4]])">All</button>
        </div>
        <!-- <h2 class="chat-title" style="margin-top: 10px;">Chat ({{ currentRoom }})</h2> -->
        <div class="chat-box" ref="chatbox" id="style-3">
            <span v-for="msg in chatMessages" class="chat-message white" v-if="msg.room === currentRoom">
                <strong :class="{'red': msg.sender == 1, 'blue': msg.sender == 2, 'white': msg.sender > 2}">{{msg.name}}:</strong> {{msg.message}}
            </span>
        </div>
        <div class="ui inverted transparent icon input chat-input">
            <input type="text" placeholder="Chat..." v-model="clientMessage" @keyup.enter="send">
            <i class="comment outline icon"></i>
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
            clientMessage: ''
        }
    },
    methods: {
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
            if (msg.sender != vm.participantType && _.includes(msg.recipients, vm.participantType)) {
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
.red {
    color: #e22722;
}
.blue {
    color: lightskyblue;
}
.white {
    color: white;
}
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
    position: absolute;
    right: 15px;
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
    background: rgba(0, 0, 0, 0.2);
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
