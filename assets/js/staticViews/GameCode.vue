<template lang="html">
    <div class="row">
        <div class="sub header">
            <button style="padding:10px;" class="ui labeled inverted icon button" @click="toggleModal('Add')">
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
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(gc, index) in gameCodeSets">
                    <td> {{ gc.id }} </td>
                    <td> {{ gc.name }} </td>
                    <td> {{ gc.game_codes.length }} </td>
                    <td>
                        <a class="cursor" @click="deleteGameCodeSet(index)"><i class="close icon"></i> Delete</a>
                        <a class="cursor" @click="toggleModal('Edit', index)"><i class="edit icon"></i> Edit</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="ui modal modal-margin" :class="{'active': showModal}">
            <div class="header">
                {{ modalAction }} Gamecode Set
            </div>
            <div class="content">
                <form class="ui large form">
                    <div class="ui stacked segment">
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="cubes icon"></i>
                                <input type="text" v-model="gameCodeSetName" placeholder="Name">
                            </div>
                        </div>
                    </div>
                    <div class="ui error message"></div>
                </form>
            </div>
            <div class="actions">
                <div class="ui button" @click="toggleModal('')">Cancel</div>
                <div v-if="modalAction === 'Add'" class="ui button" :class="{'loading': buttonLoading}" @click="addGameCodeSet">
                    OK
                </div>
                <div v-else class="ui button" :class="{'loading': buttonLoading}" @click="editGameCodeSet()">OK</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
        return {
            loading: false,
            gameCodeSets: [],
            gameCodeSetName: '',
            showModal: false,
            modalAction: 'Add',
            editIndex: undefined
        }
    },
    methods: {
        toggleModal (title, index) {
            this.showModal = !this.showModal
            this.modalAction = title
            this.gameCodeSetName = ''
            if (index) {
                this.gameCodeSetName = this.gameCodeSets[index].name
                this.editIndex = index
            }
        },
        getGameCodeSets () {
            var vm = this
            vm.loading = true
            axios.get('/api/v1/game_code_sets').then(function (response) {
                vm.gameCodeSets = response.data.game_code_sets
                vm.loading = false
            })
        },
        getGameCodes (index) {
            var vm = this
            axios.get(`/api/v1/game_code_set/${vm.gameCodeSets[index].id}/game_codes`).then(function (response) {
                vm.gameCodeSets[index].game_codes = response.data.game_codes
            })
        },
        addGameCode (index) {
            var vm = this
            axios.post(`/api/v1/game_code_set/${vm.gameCodeSets[index].id}/game_codes`, {

            }).then(function (response) {
                vm.getGameCodes(index)
            })
        },
        addGameCodeSet () {
            var vm = this
            axios.post(`/api/v1/game_code_sets`, {
                'name': vm.gameCodeSetName
            }).then(function (response) {
                vm.getGameCodeSets()
                vm.toggleModal('')
            })
        },
        editGameCodeSet () {
            var vm = this
            axios.put(`/api/v1/game_code_sets/${vm.gameCodeSets[vm.editIndex].id}`, {
                'name': vm.gameCodeSetName
            }).then(function (response) {
                vm.getGameCodeSets()
                vm.toggleModal('')
            })
        },
        deleteGameCodeSet (index) {
            var vm = this
            axios.delete(`/api/v1/game_code_sets/${vm.gameCodeSets[index].id}`).then(function (response) {
                vm.getGameCodeSets()
            })
        }
    },
    mounted () {
        var vm = this
        vm.getGameCodeSets()
    }
}
</script>

<style lang="css" scoped>
.modal-margin {
    margin-top: -230px;
}
.cursor {
    cursor: pointer;
}
</style>
