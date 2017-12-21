<template lang="html">
    <div class="">
        <h2 class="chat-title">Chat ({{ currentRoom }})</h2>
        <div class="chat-box" ref="chatbox" id="style-3">
            <span v-for="msg in chatMessages" class="chat-message">
                <strong>{{msg.name}}:</strong> {{msg.message}}
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
            'chatMessages'
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
