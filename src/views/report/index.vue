<template>
  <div class="report-container">
    <div
      ref="report-mask"
      class="report-mask"
      :code="code"
      :loading="loading"
    >
    </div>
    <div
      ref="report-warrper"
      :reportCode="code"
      @keyup.enter.stop="submitMethod"
      class="report-warrper"
    >
      <report-header
        :title="title"
        :buttons="buttons"
        :isDialog="isDialog"
        :radioCheckedValue="radioValue"
        :checkeboxChecked="checked"
        @button-method="buttonMethod"
        @refresh="refresh"
      ></report-header>
      <report-params
        ref="queryParams"
        @clearReport="clearReportParams"
        :code="code"
        :paramsModel="params"
        :type="type"
        v-model="searchData"
        :resouceType="report = 'report'"
        @confirm="refresh"
        :script="script"
        :autoFocus="autoFocus"
      ></report-params>
      <report-info-bar :data="infoBar" v-if="infoBar && infoBar.position ==='middle'">
      </report-info-bar>
      <report-table
        ref="reportTable"
        :tableColumns="columns"
        :tableData="gridData"
        :indexH="configHeight"
        :reportCode="code"
        :searchData="searchData"
        :loading=loadingData
        :current-page="pageNo"
        :page-size="pageSize"
        :paramsHeight=paramsHeight
        @refresh="refresh"
        @sort="handlerSort"
        @checkBoxChange="handlerChangeCheckbox"
        @radioChecked="radioChecked"
        :radioCheckedValue="radioCheckedValue"
        :select-on-indeterminate="false"
        :radioIndex="radioIndex"
        :subTable="subTable"
        :columnExp="columnExp"
      >
      </report-table>
    </div>
    <div class="report-info-all"
         v-if="hasPage"
    >
      <report-pagination
        ref="pagination"
        :current-page=pageNo
        :page-size="pageSize * 1"
        :page-sizes=pageSizes
        :total=totalRows
        :layout="defaultLayout"
        @sizeChange="handlerSizeChange"
        @currentChange="handlerCurrentChange"
      ></report-pagination>
    </div>
  </div>
</template>
<script>
  import reportHeader from './components/reportHeader.vue'
  import reportParams from './components/reportParams.vue'
  import reportPagination from './components/reportPagination.vue'
  import reportTable from './components/reportTable.vue'
  import { getReportData, ajaxSendBatch, exportSend, getInfoForExport } from '@/api/report.js'
  import _ from 'lodash'
  import helpService from '@/utils/manager'

  export default {
    name: 'report',
    props: {
      code: {
        type: String
      },
      infoBar: {
        type: Object
      },
      title: {
        type: String
      },
      buttons: {
        type: Array
      },
      params: {
        type: Array
      },
      columns: {
        type: Array
      },
      columnExp: {
        type: String
      },
      path: {
        type: String
      },
      configHeight: {
        type: String
      },
      value: {
        type: String
      },
      type: {
        type: String
      },
      css: {
        type: String
      },
      script: {
        type: String
      },
      inDialog: {
        required: false
      },
      staticParams: {
        type: Object,
        default() {
          return {}
        }
      },
      checkeds: {
        type: Array,
        default() {
          return []
        }
      },
      radioCheckedValue: {
        type: Object,
        default() {
          return {}
        }
      },
      autoFocus: {
        type: Boolean,
        default: false
      },
      subTable: {
        type: Object
      },
      autoLoad: {
        type: Boolean,
        default: true
      },
      page: {
        type: Object | Boolean,
        default() {
          return {
            pageSize: 20,
            pageSizes: [20, 100, 1000]
          }
        }
      },
      isDialog: {
        required: false
      },
    },
    computed: {
      hasPage() {
        if (!this.page) {
          return false
        } else {
          return true
        }
      }
    },
    components: {
      'report-header': reportHeader,
      reportParams,
      reportPagination,
      reportTable
    },
    beforeMount() {
      const helpSpace = window.helpSpace || {}
      if (!helpSpace[this.code]) {
        helpSpace[this.code] = {}
      }
      helpSpace[this.code]['report'] = helpService.getReport(this)
      window.helpSpace = helpSpace
      helpService.dealCss(this.code, this.css)
      helpService.dealScript(this.code, this.script)
    },
    data() {
      this.defaultLayout = 'total, sizes, prev, pager, next, jumper'
      this.pageSizes = this.page.pageSizes || [20, 50, 100]
      this.columnMaping = {}
      return {
        loading: true,
        loadingData: false,
        reportData: {},
        gridData: [],
        searchData: {},
        paramsHeight: 0,
        sort: '',
        pageSize: this.page.pageSize || 20,
        pageNo: 1,
        totalRows: 0,
        testInfoData: {},
        checked: [],
        radioValue: {},
        checkedFlag: Object.freeze(false),
        checkedAllObjct: {},
        setBackNum: 0,
        radioIndex: null,
        searchDataClone: {}, // 复制searchData
        firstIn: 1 // 第一次进入该列表的时候复制searchData
      }
    },
    activated(){},
    mounted() {
      this.$el.addEventListener('copy', (e) => {
        this.addCopyMessage(e)
      })
    },
    watch: {
      path: {
        handler(val) {
          this.$nextTick(() => {
            this.dealQueryData()
          })
          if (this.autoLoad) {
            this.$nextTick(() => {
              this.getData()
            })
          }
        },
        deep: true,
        immediate: true
      },
      checkeds: {
        handler(val) {
          this.$refs.reportTable && this.$refs.reportTable.clearSelection()
          this.setChecked(val)
        },
        deep: true,
        immediate: true
      },
      gridData: {
        handler(val) {
          if (val) {
            val.forEach((column) => {
              this.columnMaping[column['name']] = column
            })
          }
        },
        deep: true,
        immediate: true
      },
      params: {
        handler(val) {
          this.$nextTick(() => {
            this.dealQueryData()
            this.getData()
          })
        },
        deep: true
      }
    },
    methods: {
      resetCheckeds() {
        this.$refs.reportTable.clearSelection()
        this.radioIndex = null
      },
      setChecked(rows) {
        this.$nextTick(() => {
          this.$refs.reportTable.setCheckeds(this.dealKeys(rows, this.gridData))
        })
      },
      dealKeys(checkedRows, data) {
        const returnCheckeds = []
        data.forEach(item => {
          checkedRows.forEach(dataItem => {
            let flat = true
            for (const i in dataItem) {
              if (typeof dataItem[i] === 'object') {
                if (dataItem[i].value !== item[i].value) {
                  flat = false
                }
              } else {
                if (dataItem[i] !== item[i] && i !== 'key') {
                  flat = false
                }
              }
            }
            if (flat) {
              returnCheckeds.push(item)
            }
          })
        })
        return returnCheckeds
      },
      dealRadioChecked() {
        this.gridData.forEach((item) => {
          let flat = true
          for (const i in this.radioCheckedValue) {
            if (typeof this.radioCheckedValue[i] === 'object') {
              if (this.radioCheckedValue[i].value !== item[i].value) {
                flat = false
              }
            } else {
              if (this.radioCheckedValue[i] !== item[i] && i !== 'key') {
                flat = false
              }
            }
          }
          if (flat) {
            this.radioIndex = item.key
          }
        })
      },
      radioChecked(val) {
        this.radioValue = val
        this.$emit('radioChecked', val)
      },
      handlerChangeCheckbox(val) {
        if (this.checkedFlag) {
          this.checkedFlag = false
          return
        }
        const numStr = this.pageNo
        if (!this.checkedAllObjct[numStr]) {
          this.checkedAllObjct[numStr] = {}
        }
        this.checkedAllObjct[this.pageNo] = val
        this.checked = val
        this.$emit('checkbox', val)
      },
      buttonMethod(event, isDialog) {
        const type = event.type
        this[type + 'Method'] && this[type + 'Method'](event, isDialog)
      },
      realExportMethod(event) {
        const defaultCellStyle = {
          font: {
            name: 'Verdana',
            sz: 11,
            color: 'FF00FF88'
          },
          fill: {
            fgColor: {
              rgb: 'FFFFAA00'
            }
          }
        }
        const wopts = {
          bookType: 'xlsx',
          bookSST: false,
          type: 'binary',
          defaultCellStyle: defaultCellStyle,
          showGridLines: false
        }
        const wb = {
          SheetNames: ['Sheet1'],
          Sheets: {},
          Props: {}
        }
        const data = _.cloneDeep(this.checked)
        const endData = []
        data.forEach(item => {
          const temp = {}
          for (const i in item) {
            const title = this.columnMaping[i] && this.columnMaping[i]['title']
            if (title) {
              temp[title] = item[i]
            }
          }
          endData.push(temp)
        })
        wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(endData)

        const tmpDown = new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: 'application/octet-stream' })
        FileSaver.saveAs(tmpDown, event.fileName)
      },
      feExportMethod(event) {
        if (event.confirm) {
          const confirm = event.confirm
          this.$confirm(confirm.message, confirm.title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.realExportMethod(event)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        } else {
          this.realExportMethod(event)
        }
      },
      s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
          const buf = new ArrayBuffer(s.length)
          var view = new Uint8Array(buf)
          for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
          return buf
        } else {
          const buf = new Array(s.length)
          for (var i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
          return buf
        }
      },
      exportMethod(Nevent) {
        const event = _.cloneDeep(Nevent)
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          sort: this.sort
        }
        const path = event.path
        const ajaxType = event.ajaxType
        const fileName = event.fileName || '导出数据.xls'
        params = _.merge({}, this.staticParams, params, this.searchData, this.$route.query)
        exportSend(path, ajaxType, params).then(res => {
          const blob = res.data
          var a = document.createElement('a')
          var url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = fileName
          a.click()
          window.URL.revokeObjectURL(url)
        })
      },
      batchMethod(Nevent) {
        const that = this
        const event = _.cloneDeep(Nevent)
        let params = event.params || []
        if (!_.isArray(params)) {
          params = params.split(',')
        }
        const query = []
        if (this.checked.length < 1) {
          this.$message('请选择')
          return
        }
        this.checked.forEach(row => {
          const temp = {}
          params.forEach((item) => {
            temp[item] = row[item]
          })
          query.push(temp)
        })
        event.params = query
        event.url = event.path
        if (event.confirm) {
          const confirm = event.confirm
          this.$confirm(confirm.message, confirm.title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            that.realSendAjax(event)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        } else {
          that.realSendAjax(query)
        }
      },
      batchRouterMethod(Nevent) { // 列表选中行后跳转页面
        const that = this
        const event = _.cloneDeep(Nevent)
        const params = event.params || []
        const query = []
        if (this.checked.length < 1) {
          this.$message('请选择')
          return
        }
        this.checked.forEach(row => {
          const temp = {}
          params.forEach((item) => {
            temp[item] = row[item]
          })
          query.push(temp)
        })
        event.params = query
        event.url = event.path
        if (event.confirm) {
          const confirm = event.confirm
          this.$confirm(confirm.message, confirm.title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            that.$router.push({ 'path': event.configKey, 'query': { querys: JSON.stringify(event.params) }})
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        } else {
          that.$router.push({ 'path': event.configKey, 'query': ({ querys: JSON.stringify(event.params) }) })
        }
      },
      realSendAjax(query, index) {
        ajaxSendBatch(query).then(res => {
          if (res.code === 0) {
            this.checked = []
            this.$message({
              type: 'success',
              message: '成功',
              showClose: true
            })
            this.refresh().then(() => {
              this.$refs.reportTable.clearSelection()
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message,
              showClose: true
            })
          }
        })
      },
      printMethod(Nevent) {
        const params = Nevent.params || []
        const query = []
        const path = Nevent.path || ''
        if (!path) {
          this.$message('请配置接口地址')
          return
        }
        if (!Nevent.templateName) {
          this.$message('请配置打印模板名称')
          return
        }
        if (Nevent.especial) { // 特殊情况，全打印
          if (this.gridData && this.gridData.length > 0) {
            this.gridData.forEach((row) => {
              const temp = {}
              params.forEach((item) => {
                console.log(row)
                temp[item] = row[item]
              })
              query.push(temp)
            })
          } else {
            this.$message('暂无数据，无法打印')
            return
          }
        } else {
          if (this.checked.length < 1) {
            this.$message('请选择')
            return
          }
          this.checked.forEach(row => {
            const temp = {}
            params.forEach((item) => {
              temp[item] = row[item]
            })
            query.push(temp)
          })
        }
        console.log(query)
        methodPost(path, query).then(res => {
          if (res.code === 0) {
            this.printInfo(res.data, Nevent.templateName)
          } else {
            this.$message.error('获取打印数据出错！')
          }
        })
      },
      // PC打印
      printInfo(data, title) {
        const printInfo = JSON.stringify(data)
        const _this = this
        // PC打印回调
        window.printCallback = function(printStatus) {
          if (printStatus === 'true') {
            // 成功回调
          } else {
            _this.$message('打印失败')
          }
        }
        const funcName = 'printCallback'
        printOrderPC(title, printInfo, funcName)
      },
      submitMethod(event) {
        if (event && _.isObject(event.path)) {
          event = undefined
        }
        this.checked = []
        this.pageNo = 1
        this.sort = ''
        // this.$bus.$emit('submitreport' + this.code, event)
        this.$refs.queryParams.confirm(event).then(() => {
          this.refresh(event).then(() => {
            this.checkedFlag = Object.freeze(false)
            this.$refs.reportTable.clearSelection()
          })
        })
      },
      resetMethod(event, isDialog) {
        this.$refs.queryParams.reset(isDialog)
      },
      refresh(event) {
        this.checkedFlag = true
        const that = this
        return new Promise((resolve, reject) => {
          that.getData(event).then((res) => {
            resolve(res)
          })
        })
      },
      getData: _.debounce(function(event) {
        if (this.loadingData || !this.path) {
          return
        }
        this.loadingData = true

        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          sort: this.sort
        }
        if (this.$route.fullPath.indexOf('/tab') === 0) {
          let queryTab = this.$route.query
          delete(queryTab["method"])
          Object.assign(params, queryTab)
        }
        let path = this.path
        let columnParams = {}
        if(process.env.PROJECT !== 'dealer_pc'){
          if (this.$parent && this.$parent.$parent && this.$parent.$parent.params) {
            columnParams = this.$parent.$parent.params
          }
        }
        // Object.assign(this.searchData,this.$route.query)
        // params = _.merge({}, this.staticParams, params, this.searchData,columnParams)
        params = _.merge({}, this.staticParams, this.searchData, params, columnParams)
        if (event && event.path) {
          path = event.path
        }
        return new Promise((resolve, reject) => {
          getReportData(path, params).then(res => {
            if (res.code === 0) {
              const data = res.data
              this.gridData = this.setDataKey(data.data)
              this.totalRows = data.totalRows
              if (this.hasPage) {
                this.pageNo = data.pageNo
              }
              this.$nextTick(() => {
                this.loadingData = false
                resolve(res)
              })
            } else {
              this.loadingData = false
              this.$message({
                type: 'error',
                message: res.message,
                showClose: true
              })
            }
            resolve(res)
          }).catch(errData => {
            this.loadingData = false
            // reject(errData)
          })
        })
      }, 300),
      // 新增详情进入列表清空默认值的方法
      clearReportParams() {
        if (_.isEmpty(this.searchDataClone)) {

        } else {
          this.searchData = _.cloneDeep(this.searchDataClone)
        }
      },
      setDataKey(data) {
        data.forEach((item, index) => {
          item.key = this.pageNo * this.pageSize + index
        })
        return data
      },
      dealQueryData(row) {
        const model = {}
        if (this.params) {
          this.params.forEach((item, index) => {
            model[item.name] = item.value || ''
          })
          this.searchData = model
        }
      },
      handlerSizeChange(val) {
        window.localStorage.setItem(this.$route.path, val)
        this.pageSize = val
        this.pageNo = 1
        if (this.$refs.queryParams) {
          this.$refs.queryParams.confirm().then(res => {
            if (res.flag) {
              this.getData()
            }
          })
        } else {
          this.getData()
        }
      },
      // 当前展示的页数
      handlerCurrentChange(val) {
        this.pageNo = val
        if (this.$refs.queryParams) {
          this.$refs.queryParams.confirm().then(res => {
            if (res.flag) {
              this.getData()
            }
          })
        } else {
          this.getData()
        }
      },
      handlerSort(val) {
        this.sort = ''
        if (val && val.prop) {
          // this.sort[val.prop] = val.order
          this.sort = val.prop + ' ' + val.order
        }
        if (this.$refs.queryParams) {
          this.$refs.queryParams.confirm().then(res => {
            if (res.flag) {
              this.getData()
            }
          })
        } else {
          this.getData()
        }
      },
      addCopyMessage(e) {
        if (process.env.PROJECT === 'bi') {
          var clipboardData = event.clipboardData || window.clipboardData
          if (!clipboardData) { return }
          var text = window.getSelection().toString()
          if (text) {
            event.preventDefault()
            if (process.env.NODE_ENV === 'production') {
              clipboardData.setData('text/plain', '版权为北京惠赢天下网络技术有限公司所有。\n 如有需要请联系本公司: 400-687-0066')
            } else {
              clipboardData.setData('text/plain', '如需调试请联系我')
            }
          }
        }
      }
    }
  }

</script>

<style type="text/scss" lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .report-container {
    /*height: 100%;*/
    display: flex;
    max-width:100%;
    display:block\9;
    flex-direction: column;
    flex: 1;
    .report-warrper {
      display: flex;
      display:block\9;
      max-width:100%;
      flex-direction: column;
      flex: 1;
    }
    .report-info-all {
      display:block;
      margin-right: 20px;
    }
    .report-box {
      font-family: Tahoma, "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
      font-size: 12px;
      height: 100%;
      position: relative;
      background-color: #F6F7F8;
      padding: 0 20px;
    }
  }
</style>
