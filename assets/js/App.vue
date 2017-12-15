<template>
    <div id="app">
        <div class="message">{{ msg }}</div>
        <p>asdifasiudf</p>
        <h2>Sent</h2>
        <p v-for="msg in sent">{{ msg }}</p>
        <h2>Received</h2>
        <p v-for="msg in received">{{ msg }}</p>
        <input type="text" name="" v-model="clientMessage">
        <button type="button" name="button" @click="send">send</button>
    </div>
</template>

<script>
import io from 'socket.io-client'

export default {
    name: 'app',
    data () {
        return {
            msg: 'Hello from vue-loader!',
            received: [],
            sent: [],
            clientMessage: '',
            socket: undefined
        }
    },
    methods: {
        send () {
            this.socket.emit('my event', {data: this.clientMessage})
            this.sent.push(this.clientMessage)
            this.clientMessage = ''
        }
    },
    mounted () {
        var vm = this
        vm.socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port)
        vm.socket.on('connect', function() {
            vm.socket.emit('my event', {data: 'I\'m connected!'})
        })
        vm.socket.on('my event', function(msg) {
            vm.received.push(msg)
        })
    }
}
</script>

<style lang="css" scoped>
.message {
  color: blue;
}
</style>
