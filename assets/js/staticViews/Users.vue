<template lang="html">
    <div class="row">
        <div class="sub header">
            <button style="padding:10px;" class="ui labeled inverted icon button">
              <i class="plus icon"></i>
              Add New
            </button>
        </div>
        <table class="ui single line striped selectable table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Roles</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> user.username </td>
                    <td> user.email </td>
                    <td> user.full_name </td>
                    <td> user.display_roles </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg: 'Hello'
        }
    }
}
</script>

<style lang="css">
</style>
