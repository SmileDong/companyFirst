<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import Element from 'element-ui'
    import Vue from 'vue'
    Vue.use(Element)
    export default {
      name: 'my-project',
      mounted: function () {
        this.$store.dispatch('Init', {rows: 9999, page: 1, orgid: 'TELLHOW', customerid: null, projectid: null, assetnum: null, assettype: null})
      }
    }
</script>

<style>
    /* CSS */
</style>
