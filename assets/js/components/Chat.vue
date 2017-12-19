<template lang="html">
    <div class="chat-box" refs="chatbox" id="style-3">
        <h2 class="chat-title">Chat {{ currentRoom }}</h2>
        <span v-for="msg in messages">
            <strong>{{clientName}}:</strong> {{msg.message}}
        </span>
        <div class="ui inverted transparent icon input chat-input">
            <input type="text" placeholder="Chat..." v-model="clientMessage" @keyup.enter="send">
            <i class="comment outline icon"></i>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client'
import {mapGetters} from 'vuex'

export default {
    data () {
        return {
            messages: [
                {
                    name: 'dan',
                    message: 'test'
                }
            ],
            clientMessage: '',
            socket: undefined,
            connected: false,
        }
    },
    methods: {
        send () {
            this.socket.emit('chat', {
                message: this.clientMessage,
                name: this.clientName,
                room: this.currentRoom
            })
            this.clientMessage = ''
        }
    },
    updated () {
        this.$refs.chatbox.scrollTop = this.$refs.chatbox.clientHeight
    },
    computed: {
        ...mapGetters([
            'socket',
            'currentRoom',
            'clientName'
        ])
    },
    mounted () {
        vm.socket.on('chat', function(msg) {
            console.log(msg)
            vm.messages.push(msg)
        })
    }
}
</script>

<style lang="css" scoped>
.chat-input {
    width: 100%;
}
.chat-title {
    font-family: 'Black Ops One', cursive;
    color: #e22722;
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
