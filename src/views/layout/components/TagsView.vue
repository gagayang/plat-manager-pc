<template>
    <div class="tags-view-container">
        <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
            <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
                         :to="tag.path" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
                {{generateTitle(tag.title)}}
                <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
            </router-link>
        </scroll-pane>
        <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
            <li @click="closeSelectedTag(selectedTag)">Close</li>
            <li @click="closeOthersTags">Close Others</li>
            <li @click="closeAllTags">Close All</li>
        </ul>
    </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import ScrollPane from '@/components/ScrollPane'
  import { generateTitle } from '@/utils/i18n'
  import Hamburger from '@/components/Hamburger'
  import LangSelect from '@/components/LangSelect'
  import Screenfull from '@/components/Screenfull'
  import Close from '@/components/Close'
  export default {
    components: { ScrollPane, Hamburger, LangSelect, Screenfull, 'fe-close': Close },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {}
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'roles'
      ]),
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      },
      menus() {
        return this.$store.state.user.menus
      }
    },
    watch: {
      $route() {
        this.addViewTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.addViewTags()
    },
    methods: {
      generateTitle, // generateTitle by vue-i18n
      generateRoute() {
        if (this.$route.name) {
          return this.$route
        }
        return false
      },
      isActive(route) {
        // return route.path === this.$route.path || route.name === this.$route.name
        return route.path === this.$route.fullPath
      },
      getLevelOnetitle(data = [], path) {
        let name = ''
        data.forEach(item => {
          if (item.path && (item.path.toLowerCase() === path.toLowerCase())) {
            name = item.title || item.menuName
          }
          if (!name && item.configKey) {
            const containPath = '/config/' + encodeURIComponent(item.configKey)
            if (containPath.toLowerCase() === path.toLowerCase()) {
              name = item.title || item.menuName
            }
          }
          if (!name && item.children && item.children.length > 0) {
            var tempName = this.getLevelOnetitle(item.children, path)
            if (tempName) {
              name = tempName
            }
          }
        })
        return name
      },
      addViewTags() {
        const route = this.generateRoute()
        if (!route) {
          return false
        }
        if (~route.fullPath.indexOf('/config') || !route.fullPath.indexOf(('/iframe'))) {
          let levelOneName = this.getLevelOnetitle(this.menus, route.path)
          if (!levelOneName) {
            const method = route.query.method
            if (!method) {
              levelOneName = '详情'
            } else if (method === 'update') {
              levelOneName = '编辑'
            } else if (method === 'detail') {
              levelOneName = '查看'
            }
          }
          route.meta.title = levelOneName
        } else {
          if (route.query && route.query.name) {
            route.meta.title = route.query.name
          } else if ((route.query && route.query.fromType && route.meta.detailName) || (route.query && route.query.method)) { // 控制nav上的title
            if (route.query.fromType === 'details' || route.query.method === 'details') {
              route.meta.title = route.meta.detailName || route.name
            } else {
              route.meta.title = route.meta.editName || route.name
            }
          } else if (route.meta.addName) {
            route.meta.title = route.meta.addName || route.name
          } else {
            if (route.path === '/dashboard') {
              route.meta.title = '首页'
            }
          }
        }
        this.$store.dispatch('addVisitedViews', route)
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el)
              break
            }
          }
        })
      },
      closeSelectedTag(view) {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0]
            if (latestView) {
              this.$router.push({ path: latestView.path, query: latestView.query })
            } else {
              this.$router.push('/')
            }
          }
        })
      },
      closeOthersTags() {
        this.$router.push(this.selectedTag.path)
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags() {
        this.$store.dispatch('delAllViews')
        this.$router.push('/')
      },
      openMenu(tag, e) {
        this.visible = true
        this.selectedTag = tag
        this.left = e.clientX
        this.top = e.clientY
      },
      closeMenu() {
        this.visible = false
      },
      // 添加新页面
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      clickBtnNav(index) {
        var scrollWrapper = document.getElementById('scrollWrapper').offsetWidth - 70 - 175
        var scrollMain = document.getElementById('scrollMain')
        var aMain = scrollMain.getElementsByTagName('a')
        var speed = 20
        var scrollMainWidth = 0
        for (var i = 0; i < aMain.length; i++) {
          scrollMainWidth += aMain[i].offsetWidth
        }
        scrollMainWidth = scrollMainWidth + (aMain.length - 1) * 16
        if (scrollMainWidth > scrollWrapper) {
          if (index === 2) {
            if (scrollMain.style.left > 70 + 'px') {
              return false
            } else {
              scrollMain.style.left = scrollMain.offsetLeft + speed + 'px'
            }
          } else {
            if (Math.abs(parseInt(scrollMain.style.left)) > (scrollMainWidth - 400) / 2) {
              return false
            } else {
              scrollMain.style.left = scrollMain.offsetLeft - speed + 'px'
            }
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
    position:relative;
    .tags-view-wrapper {
      background: #fff;
      // height: 34px;
      height:50px;
      border-bottom: 1px solid #d8dce5;
      //box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
      .tags-view-item {
        min-width:80px;
        border-radius:3px;
        display: inline-block;
        position: relative;
        height: 32px;
        line-height:30px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 14px;
        font-size: 12px;
        margin-left:10px;
        margin-top:8px;
        // display:flex;
        // align-items: center;
        &:first-of-type {
          margin-left:5px;
        }
        .el-icon-hr{
          display:none;
        }
        &.active {
          background-color: #42b983;
          color: #fff;
          border-color: #42b983;
          &::before {
            content: '';
            background: #fff;
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;
            margin-right: 2px;
          }
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 2;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;
        font-size:20px;
        &:before {
          transform: scale(.6);
          display: inline-block;
          vertical-align: -5px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
  .tags-view-wrapper .tags-view-item .el-icon-close:hover{
    background-color:transparent;
  }
</style>
