<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container" v-if="hasMenu"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view v-if="hasTitle"></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>
<script>
  import { Navbar, Sidebar, AppMain, TagsView } from './components'
  export default {
    name: 'Layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened
        }
      }
    },
    created() {
      if (this.$route.query && this.$route.query.hasMenu) {
        if (this.$route.query.hasMenu === 'false') {
          this.hasMenu = false
        }
      }
      if (this.$route.query && this.$route.query.hasTitle) {
        if (this.$route.query.hasTitle === 'false') {
          this.hasTitle = false
        }
      }
    },
    data() {
      return {
        hasMenu: true,
        hasTitle: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../styles/mixin.scss';
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
