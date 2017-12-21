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
                    <td class="game_code_cell">
                        {{ gc.game_codes.length }}
                        <a class="cursor" @click="viewIndex = index">Show</a>
                        <div class="ui card game_code_box" v-if="viewIndex === index">
                            <div class="content">
                                <div class="header">
                                    {{ gc.name }}
                                    <a class="cursor" @click="viewIndex = undefined">
                                        <i class="close icon" style="float:right"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="content code-content">
                                <h4 class="ui sub header">Codes</h4>
                                <div class="ui small feed">
                                    <div v-for="(code, i) in gc.game_codes" class="event">
                                        <div class="content">
                                            <div class="summary">
                                                <a>{{ code.name }}</a> {{ code.action.name }} &nbsp;
                                                <i class="trash icon cursor" @click="deleteGameCode(index, i)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="extra content">
                                <div class="ui form">
                                    <div class="ui form">
                                        <div class="two fields">
                                            <div class="field">
                                                <input v-model="newCode" type="text" placeholder="Code" class="input-width">
                                            </div>
                                            <div class="field">
                                                <select v-model="newAction">
                                                    <option value="">Action</option>
                                                    <option v-for="action in actions" :value="action.id">
                                                        <strong>{{ action.id }}</strong> {{ action.name }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="ui icon button" @click="addGameCode(index)">
                                        Add Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    </td>
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
            editIndex: undefined,
            actions: [],
            viewIndex: undefined,
            newCode: '',
            newAction: ''
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
        getActions () {
            var vm = this
            axios.get('/api/v1/actions').then(function (response) {
                vm.actions = response.data.actions
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
                actionId: vm.newAction,
                code: vm.newCode
            }).then(function (response) {
                vm.getGameCodes(index)
                vm.newAction = ''
                vm.newCode = ''
            })
        },
        deleteGameCode (index, i) {
            var vm = this
            var gameCodeId = vm.gameCodeSets[index].game_codes[i].id
            axios.delete(`/api/v1/game_code_set/${vm.gameCodeSets[index].id}/game_codes/${gameCodeId}`)
                .then(function (response) {
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
        vm.getActions()
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
.game_code_cell {
    position: relative;
}
.game_code_box {
    position: absolute;
    left: 80px;
    top: -200px;
    z-index: 2000;
}
.input-width {
    width: 200px;
}

.code-content {
    max-height: 300px;
    overflow-y: scroll;
}
</style>
