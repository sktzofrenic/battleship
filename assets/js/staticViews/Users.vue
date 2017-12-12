<template lang="html">
    <div class="row">
        <div class="sub header">
            <button style="padding:10px;" class="ui labeled inverted icon button" @click="toggleModal">
              <i class="plus icon"></i>
              Add New
            </button>
        </div>
        <table class="ui single line striped selectable table" >
            <div class="ui inverted dimmer" :class="{'active': loading}">
                <div class="ui centered inline loader">Loading</div>
            </div>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Roles</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in users">
                    <td> {{ user.username }} </td>
                    <td> {{ user.email }} </td>
                    <td> {{ user.full_name }} </td>
                    <td> {{ user.roles }} </td>
                    <th>
                        <a class="cursor" @click="deleteUser(index)"><i class="remove user icon"></i> Delete</a>
                        <a class="cursor" @click="editUser(index)"><i class="edit icon"></i> Edit</a>
                    </th>
                </tr>
            </tbody>
        </table>
        <div class="ui modal modal-margin" :class="{'active': showModal}">
            <div class="header">
                {{ modalAction }} User
            </div>
            <div class="content">
                <form class="ui large form">
                    <div class="ui stacked segment">
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input type="text" v-model="newUser.firstName" placeholder="First Name">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input type="text" v-model="newUser.lastName" placeholder="Last Name">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input type="text" v-model="newUser.userName" placeholder="Username">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="mail icon"></i>
                                <input type="text" v-model="newUser.email" placeholder="Email">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input type="password" v-model="newUser.password" placeholder="Password">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input type="password" v-model="newUser.password2" placeholder="Repeat Password">
                            </div>
                        </div>
                    </div>
                    <div class="ui error message"></div>
                </form>
            </div>
            <div class="actions">
                <div class="ui button" @click="toggleModal">Cancel</div>
                <div v-if="modalAction === 'Add'" class="ui button" :class="{'loading': buttonLoading}" @click="addUser">OK</div>
                <div v-else class="ui button" :class="{'loading': buttonLoading}" @click="editUser('send')">OK</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data () {
        return {
            users: [],
            loading: false,
            showModal: false,
            buttonLoading: false,
            modalAction: 'Add',
            newUser: {
                id: '',
                userName: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                password2: ''
            }
        }
    },
    methods: {
        toggleModal () {
            this.showModal = !this.showModal
        },
        deleteUser (index) {
            var vm = this
            var user = vm.users[index]
            vm.loading = true
            axios.delete('/api/v1/users/' + user.id).then(function (response) {
                vm.refreshUsers()
                vm.loading = false
            })
        },
        editUser (index) {
            var vm = this
            if (index === 'send') {
                vm.buttonLoading = true
                axios.put('/api/v1/users/' + vm.newUser.id, {
                    userName: vm.newUser.userName,
                    firstName: vm.newUser.firstName,
                    lastName: vm.newUser.lastName,
                    email: vm.newUser.email,
                    password: vm.newUser.password,
                    password2: vm.newUser.password2
                }).then(function (response) {
                    vm.refreshUsers()
                    vm.toggleModal()
                    vm.buttonLoading = false
                    vm.modalAction = 'Add'
                    vm.newUser = {
                        id: '',
                        userName: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        password2: ''
                    }
                })
            } else {
                vm.toggleModal()
                vm.modalAction = 'Edit'
                vm.newUser = {
                    id: vm.users[index].id,
                    userName: vm.users[index].username,
                    firstName: vm.users[index].first_name,
                    lastName: vm.users[index].last_name,
                    email: vm.users[index].email,
                    password: '',
                    password2: ''
                }
            }
        },
        addUser () {
            var vm = this
            vm.buttonLoading = true
            axios.post('/api/v1/users', {
                userName: vm.newUser.userName,
                firstName: vm.newUser.firstName,
                lastName: vm.newUser.lastName,
                email: vm.newUser.email,
                password: vm.newUser.password,
                password2: vm.newUser.password2
            }).then(function (response) {
                vm.refreshUsers()
                vm.toggleModal()
                vm.buttonLoading = false
                vm.newUser = {
                    id: '',
                    userName: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    password2: ''
                }
            })
        },
        refreshUsers () {
            var vm = this
            vm.loading = true
            axios.get('/api/v1/users').then(function (response) {
                vm.users = response.data.users
                vm.loading = false
            })
        }
    },
    mounted () {
        var vm = this
        vm.refreshUsers()
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
