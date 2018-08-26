<template lang="html">
    <div class="row hot-fix">
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
                    <th>Code</th>
                    <th>Text</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(gc, index) in chatCodes">
                    <td> {{ gc.id }} </td>
                    <td> {{ gc.code }} </td>
                    <td :title="gc.text"> {{ gc.text.substring(0, 120) }} <span v-if="gc.text.length > 120">...</span> </td>
                    <td>
                        <a class="cursor" @click="deleteChatCode(index)"><i class="close icon"></i> Delete</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="ui modal modal-margin" :class="{'active': showModal}">
            <div class="header">
                {{ modalAction }} Chat quick Codes
            </div>
            <div class="content">
                <form class="ui large form">
                    <div class="ui stacked segment">
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="cubes icon"></i>
                                <input type="text" v-model="newCode" placeholder="code">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="cubes icon"></i>
                                <input type="text" v-model="newText" placeholder="text">
                            </div>
                        </div>
                    </div>
                    <div class="ui error message"></div>
                </form>
            </div>
            <div class="actions">
                <div class="ui button" @click="toggleModal('')">Cancel</div>
                <div v-if="modalAction === 'Add'" class="ui button" :class="{'loading': buttonLoading}" @click="addChatCode">
                    OK
                </div>
                <div v-else class="ui button" :class="{'loading': buttonLoading}" @click="editChatCodeSet()">OK</div>
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
            chatCodes: [],
            showModal: false,
            modalAction: 'Add',
            editIndex: undefined,
            viewIndex: undefined,
            newCode: '',
            newText: ''
        }
    },
    methods: {
        toggleModal (title, index) {
            this.showModal = !this.showModal
            this.modalAction = title
        },
        getChatCodes () {
            var vm = this
            vm.loading = true
            axios.get('/api/v1/chat-codes').then(function (response) {
                vm.chatCodes = response.data.codes
                vm.loading = false
            })
        },
        addChatCode (index) {
            var vm = this
            axios.post(`/api/v1/chat-codes`, {
                text: vm.newText,
                code: vm.newCode
            }).then(function (response) {
                vm.getChatCodes(index)
                vm.newText = ''
                vm.newCode = ''
                vm.toggleModal('')
            })
        },
        deleteChatCode (index, i) {
            var vm = this
            axios.delete(`/api/v1/chat-codes/${vm.chatCodes[index].id}`)
                .then(function (response) {
                    vm.getChatCodes(index)
                })
        }
    },
    mounted () {
        var vm = this
        vm.getChatCodes()
        // vm.getActions()
    }
}
</script>

<style lang="css" scoped>
.hot-fix {
    overflow-x: scroll;
    overflow-y: scroll;
    max-height: 80vh;
}
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
