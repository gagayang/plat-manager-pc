<template>
  <section class="app-main" style="flex: 1;display: flex;flex-direction: column">
    <div
      v-show="!showIframe"
      style="flex: 1;display: flex;flex-direction: column"
    >
      <!--<transition name="fade" mode="out-in">-->
      <keep-alive
        exclude="authorization,details,orderDetails,addtemplate,candyruleAdd,pushvolume,appliyObjectRule,contributiveRule,couponReceive">
        <router-view style="flex: 1;display: flex;flex-direction: column" :key="getKeys()"></router-view>
      </keep-alive>
      <!--</transition>-->
    </div>
    <div v-show="showIframe">
      <fe-iframes
        :activeIndex="activeIndex"
      ></fe-iframes>
    </div>
  </section>
</template>
<script>
  import iframes from '@/views/iframe/index'
  import {mapState} from 'vuex'
  import _ from 'lodash'

  export default {
    name: 'AppMain',
    components: {
      'fe-iframes': iframes
    },
    data() {
      return {
        showIframe: false,
        activeIndex: -1
      }
    },
    mounted() {
      const appHeight = document.body.offsetHeight - 84
      // this.$store.dispatch('setHieght', appHeight)
      this.getMainWidth()
      window.addEventListener('resize', _.debounce(() => {
        this.getMainWidth()
      }, 200))
    },
    watch: {
      '$route'(to, from) {
        if (~to.fullPath.indexOf('iframe')) {
          this.iframeData.forEach((item, index) => {
            if (item.path === to.path) {
              this.activeIndex = index
            }
          })
          this.showIframe = true
        } else {
          this.showIframe = false
          this.activeIndex = -1
        }
      }
    },
    computed: {
      ...mapState({
        'iframeData': state => state.app.iframeData
      }),
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      filterKey() {
        const occurrence = _.find(this.$store.state.tagsView.cachedViews, item => item.path === this.$route.fullPath)
        return occurrence ? occurrence.key : 0
      }
    },
    methods: {
      getKeys() {
        return this.$route.fullPath + this.filterKey
      },
      getMainWidth() {
        let width = 0
        if (this.$store.state.app.sidebar.opened) {
          width = document.body.offsetWidth - 220
        } else {
          width = document.body.offsetWidth - 36
        }
        this.$store.dispatch('setWidth', width)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .app-main > div {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>
