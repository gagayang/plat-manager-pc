<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="index" v-if='item.menuName'>
        <span class="no-redirect"
              :class="['no-redirect', 'redirect-level-'+item.level]"
        >{{item.menuName}}</span>
        <!--<router-link v-else :to="item.path">{{item.title}}</router-link>-->
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    created() {
      this.getBreadcrumb()
    },
    computed: {
      ...mapState({
        menus: state => state.user.menus,
        visitedMap: state => state.app.visitedMap
      }),
      path() {
        return this.$route.path
      }
    },
    data() {
      return {
        levelList: null
      }
    },
    watch: {
      $route() {
        this.getBreadcrumb()
      }
    },
    methods: {
      getMenuItem(data = [], path) {
        let retObj = null
        data.forEach(item => {
          if (item.path && item.path.toLowerCase() === path.toLowerCase()) {
            retObj = item
          }
          if (!retObj && item.configKey) {
            const containPath = '/config/' + encodeURIComponent(item.configKey)
            if (containPath.toLowerCase() === path.toLowerCase()) {
              retObj = item
            }
          }
          if (!retObj && item.children && item.children.length > 0) {
            retObj = this.getMenuItem(item.children, path)
          }
        })
        return retObj
      },
      getBreadcrumb() {
        if (~this.path.indexOf('dashboard')) {
          this.levelList = [{
            menuName: '首页',
            level: 1
          }]
        } else {
          const item = this.getMenuItem(this.menus, this.path)
          if (item) {
            this.levelList = [{
              menuName: item.menuName,
              level: 1
            }]
          } else {
            const method = this.$route.query.method
            let name = ''
            if (!method) {
              name = '新增'
            } else if (method === 'update') {
              name = '编辑'
            } else if (method === 'detail') {
              name = '查看'
            }
            const fromItem = this.visitedMap[this.path]
            if (fromItem) {
              this.levelList = [{
                menuName: fromItem.meta.title,
                level: 1
              }, {
                menuName: name,
                level: 2
              }]
            } else {
              this.levelList = [{
                menuName: name,
                level: 2
              }]
            }
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /*.app-breadcrumb.el-breadcrumb {*/
  /*display: inline-block;*/
  /*font-size: 16px;*/
  /*line-height:60px;*/
  /*margin-left: 10px;*/
  /*.no-redirect {*/
  /*color: #fff;*/
  /*cursor: text;*/
  /*}*/
  /*}*/
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
