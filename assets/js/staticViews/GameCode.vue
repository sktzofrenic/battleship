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
                    <th>ID</th>
                    <th>Name</th>
                    <th>Game Codes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> game_code_set.id </td>
                    <td> game_code_set.name </td>
                    <td> game_code_set.game_codes </td>
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
