<template>
  <div>
    <component
      :is="type"
      v-bind="meta"
      :isDialog="isDialog"
      :code="meta.code || meta.id"
      :configH="isHeight"
      :layout="layout"
    ></component>
  </div>
</template>
<script>
  import {getConfig} from '@/api/common.js'
  import report from '@/views/report/index.vue'
  import form from '@/views/baseForm/index.vue'
  import requirejsMixin from '@/mixins/requirejsMixin.js'
  import dashboard from '@/views/charts/index.vue'
  import dragForm from '@/views/dragForm/index.vue'

  export default {
    name: 'fe-common',
    mixins: [requirejsMixin],
    props: {
      path: {
        type: String
      },
      isHeight: {
        type: String
      },
      isDialog: {
        required: false
      }
    },
    components: {
      'report': report,
      'base-form': form,
      'dashboard': dashboard,
      'drag-form': dragForm,
    },
    data() {
      return {
        type: '',
        meta: {},
        layout: {}
      }
    },
    watch: {
      path: {
        handler(val) {
//          this.getConfigByJSONP(val)
           this.getConfigByPath(val)
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      getConfigByJSONP(path) {
        path = decodeURIComponent(path)
        const time = new Date().getTime()
        const callbackName = 'getConfig' + time
        window[callbackName] = this.setConfig
        const url = path + '?callback=' + callbackName
        this.loadScript({}, time, url)
      },
      getConfigByPath(path) {
        getConfig(path).then(res => {
          this.type = res.data.meta.type ? res.data.meta.type : 'report'
          this.meta = res.data.meta
          this.layout = res.data.layout
        })
      },
      setConfig(configObj) {
        this.type = configObj.data.meta.type ? configObj.data.meta.type : 'report'
        this.meta = configObj.data.meta
        this.layout = configObj.data.layout
      }
    }
  }
</script>
<style>

</style>
