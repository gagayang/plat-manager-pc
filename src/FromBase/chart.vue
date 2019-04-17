<template>
  <div
    class="fe-chart"
  >
    <template
      v-if="type === 'Map'">
      <fe-map
        :settings="clonsetting"
        :event="event"
        :width="width"
        :height="height"
      >
      </fe-map>
    </template>
    <template
      v-else
    >
      <component
        :is="componentName"
        :data="chartData"
        :settings="clonsetting"
        :event="event"
        :width="width"
        :height="height"
      >

      </component>
    </template>

  </div>
</template>
<script>
  import {getReportData} from '@/api/report.js'
  import charts from './chart.js'
  import VeLine from 'v-charts/lib/line.common'
  import VeHistogram from 'v-charts/lib/histogram.common'
  import VeBar from 'v-charts/lib/bar.common'
  import VePie from 'v-charts/lib/pie.common'
  import VeRing from 'v-charts/lib/ring.common'
  import VeRadar from 'v-charts/lib/radar.common'
  import VeScatter from 'v-charts/lib/scatter.common'
  import BaiduMap from './map/baiduMap.vue'
  import _ from 'lodash'

  export default {
    name: 'fe-chart',
    props: {
      type: {
        type: String,
        required: true
      },
      setting: {
        type: Object,
        default() {
          return {}
        }
      },
      event: {
        type: Object
      },
      columns: {
        type: Array
      },
      data: {
        type: Object
      },
      width: {
        type: String,
        required: true
      },
      height: {
        type: String,
        required: true
      }
    },
    components: {
      'fe-line': VeLine,
      'fe-histogram': VeHistogram,
      'fe-bar': VeBar,
      'fe-pie': VePie,
      'fe-ring': VeRing,
      'fe-radar': VeRadar,
      'fe-scatter': VeScatter,
      'fe-map': BaiduMap
    },
    data() {
      return {
        loading: false,
        clonsetting: {},
        chartData: {
          columns: [],
          rows: []
        },
        labelMap: {}
      }
    },
    computed: {
      componentName() {
        return charts[this.type]
      }
    },
    watch: {
      data: {
        handler(val, oldVal) {
          val && this.getData()
        },
        deep: true,
        immediate: true
      },
      columns: {
        handler(val, oldVal) {
          val && this.dealColumns(val)
        },
        deep: true,
        immediate: true
      },
      setting: {
        handler(val) {
          this.clonsetting = _.cloneDeep(val)
          this.clonsetting['labelMap'] = this.labelMap
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      getData() {
        if (this.loading) {
          return
        }
        this.loading = true
        const path = this.data.path
        const params = this.data.params
        return new Promise((resolve, reject) => {
          getReportData(path, params).then(res => {
            if (res.code === 0) {
              this.chartData.rows = res.data.data
              resolve(res)
            } else {
              this.$message.error('获取图表数据错误')
            }
            this.loading = false
          }, (err) => {
            this.loading = false
            reject(err)
          })
        })
      },
      dealColumns(columns) {
        const mapingObj = {}
        const retColumns = []
        columns.forEach(item => {
          if (!item.type || item.type === 'normal') {
            const name = item.name
            const title = item.title
            mapingObj[name] = title
            retColumns.push(name)
          }
        })
        this.chartData.columns = retColumns
        this.labelMap = mapingObj
      }
    }
  }
</script>
<style>

</style>
