<template>
    <div id="app">
        <div class="message">{{ msg }}</div>
        <p>asdifasiudf</p>
    </div>
</template>

<script>
export default {
    name: 'app',
    data () {
        return {
            msg: 'Hello from vue-loader!'
        }
    },
    mounted () {
        console.log('mounted', this.msg)
    }
}
</script>

<style lang="css" scoped>
.message {
  color: blue;
}
</style>
