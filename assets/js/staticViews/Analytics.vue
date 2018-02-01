<template lang="html">
    <div class="row">
        <span class="ui inverted secondary button" v-if="page > 1" @click="prev()">Prev</span> <span class="ui inverted secondary button" v-if="games.length > 0" @click="next()">Next</span>
        <table class="ui single line striped selectable table">
            <div class="ui inverted dimmer" :class="{'active': loading}">
                <div class="ui centered inline loader">Loading</div>
            </div>
            <thead>
                <tr>
                    <th> #</th>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Ended</th>
                    <th>Offsite</th>
                    <th>Events</th>
                    <th>Chat Log</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(game, index) in games">
                    <td>{{ game.id }}</td>
                    <td>{{ game.name }}</td>
                    <td>{{ formatDate(game.createdOn) }}</td>
                    <td>{{ formatDate(game.endedOn) }}</td>
                    <td><span v-if="game.isOffsite">Offsite</span></td>
                    <td><a :href="game.eventStatsUrl">Download</a></td>
                    <td><a :href="game.chatStatsUrl">Download</a></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios'
import {Game} from '../models/game.js'
import moment from 'moment'
export default {
    data () {
        return {
            games: [],
            loading: false,
            page: 1
        }
    },
    methods: {
        prev () {
            this.getGames(this.page - 1)
            this.page -= 1
        },
        next () {
            this.getGames(this.page + 1)
            this.page += 1
        },
        getGames (page) {
            let url = `/api/v1/games`
            if (page != undefined) {
                url = `/api/v1/games?page=${page}`
            }
            var vm = this
            vm.loading = true
            axios.get(url).then(function (response) {
                vm.games = response.data.all_games.map(function (game) {
                    return new Game(game)
                })
                vm.loading = false
            })
        },
        formatDate (date) {
            if (!date) {
                return 'Game in Progress'
            }
            return moment.utc(date).local().format('MM/DD/YYYY h:mm a')
        }
    },
    mounted () {
        var vm = this
        vm.getGames()
    }
}
</script>

<style lang="css">
</style>
