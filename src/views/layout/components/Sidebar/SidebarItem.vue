<template>
  <div class="menu-wrapper" :style="{'margin-left': '0'}" ref="menuWrapper">
    <el-menu-item
      v-for="(item,index) in routes"
      v-if="!item.hidden&& (!item.children || item.children.length == 0)"
      :index="getIndex(item)"
      :key="index"
      @click="clickRouter(item)"
    >
      <em class="iconfont sideBar" :class="item.icon?item.icon:''"></em>
      <span v-if="item.menuName">{{item.menuName}}</span>
    </el-menu-item>
    <el-submenu
      v-else="!item.hidden&&item.children&&item.children.length > 0"
      :index="getIndex(item)"
      :key="index"
      @click="clickRouter(item)"
      unique-opened="true"
    >
      <template slot="title">
        <em  class="iconfont sideBar" :class="item.icon?item.icon:''"></em>
        <span v-if="item.menuName">{{item.menuName}}</span>
      </template>
      <sidebar-item
        :is-nest="true"
        :routes="item.children"
        :key="index"></sidebar-item>
    </el-submenu>
  </div>
</template>

<script>
  import { generateTitle } from '@/utils/i18n'
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      generateTitle,
      getIcon(item) {
        let iconItem = null
        if (!item.icon) {
          if (item.level === 1) {
            iconItem = 'documentation'
          } else if (item.level === 2) {
            iconItem = 'clipboard'
          } else if (item.level === 3) {
            iconItem = 'table'
          } else {
            iconItem = 'excel'
          }
        } else {
          iconItem = item.icon
        }
        return iconItem
      },
      getLayout() {
        return true
      },
      getIndex(item) {
        if (item.path) {
          return item.path
        } else if (item.configKey) {
          return '/config/' + encodeURIComponent(item.configKey)
        } else {
          return item.id
        }
      },
      clickRouter(item) {
        if (item.configKey) {
          item.path = '/config/' + encodeURIComponent(item.configKey)
        }
        if (item.query && item.query.params) {
          const a = JSON.stringify(item.query.params)
          item.query.params = a
        }
        debugger
        if (item.path && ~item.path.indexOf('iframe')) {
          this.$store.dispatch('addIframeData', item)
        }
        this.$router.push(item)
      },
      encodeSearchKey(key) {
        const encodeArr = [{
          code: '%',
          encode: '%25'
        }, {
          code: '?',
          encode: '%3F'
        }, {
          code: '#',
          encode: '%23'
        }, {
          code: '&',
          encode: '%26'
        }, {
          code: '=',
          encode: '%3D'
        }]
        return key.replace(/[%?#&=]/g, ($, index, str) => {
          for (const k of encodeArr) {
            if (k.code === $) {
              return k.encode
            }
          }
        })
      }
    }
  }
</script>
