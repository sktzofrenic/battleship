<template lang="html">
    <div class="row">
        <div class="sub header">
            <button style="padding:10px;" class="ui labeled inverted icon button">
              <i class="plus icon"></i>
              Add New
            </button>
        </div>
        <table class="ui single line striped selectable table">
            <div class="ui inverted dimmer" :class="{'active': loading}">
                <div class="ui centered inline loader">Loading</div>
            </div>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Game Codes</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(gc, index) in gameCodeSets">
                    <td> {{gc.id}} </td>
                    <td> {{gc.name}} </td>
                    <td> {{gc.game_codes.length}} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
        return {
            loading: false,
            gameCodeSets: []
        }
    },
    methods: {
        refreshGamecodes () {
            var vm = this
            vm.loading = true
            axios.get('/api/v1/game_code_sets').then(function (response) {
                vm.gameCodeSets = response.data.game_code_sets
                vm.loading = false
            })
        }
    },
    mounted () {
        var vm = this
        vm.refreshGamecodes()
    }
}
</script>

<style lang="css">
</style>
