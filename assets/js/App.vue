<template>
    <div id="app">
        <div class="ui active dimmer" v-if="currentView === 'ended'">
            <div class="content">
                <div class="center">
                    <h2 class="ui inverted icon header">
                        <i class="heart icon"></i>
                        Game Ended! <br><br>
                        <button class="ui inverted button" @click="changeView(['main'])" name="button"> Exit </button>
                    </h2>
                </div>
            </div>
        </div>
        <div class="ui huge inverted borderless fixed fluid menu game-header">
            <img src="static/build/img/houston_logo_white.88f80812ce0c22e9475b88b716203ef3.png" class="game-header-image">
            <div class="right menu">
                <div class="vs-battleship item">
                    <span style="color:#e22722">VS</span> <span style="color:#fff"> BATTLESHIP</span>
                </div>
            </div>
        </div>
        <div class="ui grid">
            <div class="row">
                <div class="column" id="content">
                    <GameList v-if="currentView === 'main'"></GameList>
                    <GameBoard v-if="currentView === 'game' || currentView === 'ended'"></GameBoard>
                </div>
                <div class="column" id="sidebar">
                    <Chat></Chat>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import Chat from './components/Chat.vue'
import GameList from './staticViews/GameList.vue'
import GameBoard from './components/GameBoard.vue'
import axios from 'axios'
import {socket} from './socket.js'

export default {
    name: 'app',
    data () {
        return {
        }
    },
    components: {
        Chat,
        GameList,
        GameBoard
    },
    methods: {
        ...mapActions([
            'changeClientName',
            'changeCurrentRoom',
            'changeView',
            'connectSocket',
            'pushMessage'
        ]),
        getClientData () {
            var vm = this
            axios.get('/api/v1/users/current_user').then(function (response) {
                vm.changeClientName([response.data.user.full_name])
            })
        }
    },
    computed: {
        ...mapGetters([
            'currentRoom',
            'clientName',
            'currentView'
        ])
    },
    mounted () {
        var vm = this
        vm.getClientData()
        socket.emit('join-room', {
            room: 'public'
        })
    }
}
</script>

<style lang="css" scoped>
#content {
  margin-right: 19%;
  width: 81%;
  padding-right: 3em;
  padding-left: 3em;
  float: left;
}
#sidebar {
    position: fixed;
    top: 51.8px;
    right: 0;
    bottom: 0;
    width: 18%;
    color: #fff;
    padding-top: 25px !important;
    background-color: rgba(245, 245, 245, .5);
    padding: 0px;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#242220+0,1f1e1c+27,312e2b+100 */
    background: #242220; /* Old browsers */
    background: -moz-linear-gradient(top, #242220 0%, #1f1e1c 27%, #312e2b 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #242220 0%,#1f1e1c 27%,#312e2b 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #242220 0%,#1f1e1c 27%,#312e2b 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#242220', endColorstr='#312e2b',GradientType=0 ); /* IE6-9 */
}
.vs-battleship {
    font-family: 'Black Ops One', cursive;
    font-size: 40px;
}
.game-header-image {
    max-width: 179px;
    max-height: 60px;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-left: 10px;
}
.game-header {
    border-bottom: 3px solid #1d1c1a !important;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#1d1c1a+0,1f1e1c+27,312e2b+100 */
    background: #1d1c1a !important; /* Old browsers */
    background: -moz-linear-gradient(left, #1d1c1a 0%, #1f1e1c 27%, #312e2b 100%) !important; /* FF3.6-15 */
    background: -webkit-linear-gradient(left, #1d1c1a 0%,#1f1e1c 27%,#312e2b 100%) !important; /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, #1d1c1a 0%,#1f1e1c 27%,#312e2b 100%) !important; /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1d1c1a', endColorstr='#312e2b',GradientType=1 ) !important; /* IE6-9 */
    height: 80px;
}
</style>
