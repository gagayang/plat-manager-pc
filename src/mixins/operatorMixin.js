import _ from 'lodash'
import { getConfig, ajaxSend } from '../api/common.js'
const operatorMixin = {
  props: {
    searchData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    this.buttonIndex = -1
    this.inDialog = true
    return {
      showDialog: false,
      params: {},
      meta: {},
      subData: {},
      checkedValue: {},
      checkedValues: [],
    }
  },
  methods: {
    handleButton(index, row, button, searchData) {
      const script = button.event.script
      switch (button.event.type) {
        case 'router':
          this.updateMethod(button.event, row, searchData)
          break
        case 'cancel':
          this.goBack()
          this.delMyself({ path: this.$route.path })
          break
        case 'custom':
          if (~script.indexOf('function')) {
            const Fn = Function
            new Fn('return ' + script)()()
          } else {
            window[script] && window[script]()
          }
          break
        case 'dialog':
          this.showReport(button.event, row, index)
          break
        case 'ajax':
          this.ajaxMethod(button.event, row, index)
          break
        case 'dialog-report':
          this.showReport(button.event, row, index)
          break
        case 'dialog-report-column':
          this.showReportColumn(button.event, row, index)
          break
        default:
          this.$emit('button-method', event)
          break
      }
    },
    judgMethod(event) {
      let flag = true
      if(event.judgement) {
        const judgement = event.judgement
        if(judgement instanceof Function){
          flag = judgement(row, index, event)
        } else {
          const Fn = Function
          flag = new Fn('return ' + judgement)()(row, index, event)
        }
      }
      return flag
    },
    routerMethod(event) {
      if(event.configKey) {
        event.path = '/config/' + encodeURIComponent(event.configKey)
      }
      const target = {
        path: event.path,
        query: _.merge({}, event.query || {}, { _: Date.now()})
      }
      this.$router.push(target)
    },
    customMethod(event, index, $event) {
      const script = event.script
      if(script instanceof Function){
        script(event, index, $event)
      } else {
        const Fn = Function
        new Fn('return ' + script)()(event, index, $event)
      }
    },
    getReportMeta(event, row) {
      const configKey = event.configKey
      const params = event.params
      const query = {}
      row && params && params.forEach((item) => {
        query[item] = row[item]
      })
      this.params = query
      if (configKey) {
        getConfig(configKey).then(res => {
          this.meta = res.data.meta
        })
      } else {
        this.showDialog = false
        this.$nextTick(() => {
          this.$message.error('请先配置configKey')
        })
      }
    },
    showReport(event, data, index) {
      this.buttonIndex = index
      this.showDialog = true
      this.rowData = data
      this.getReportMeta(event, data)
    },
    reset() {
      this.rowData = null
      this.showDialog = false
      this.checkedValue = {}
      this.checkedValues = []
      this.buttonIndex = -1
    },
    sureInHeader(rows) {
      const button = this.buttons[this.buttonIndex].event
      const sureMethod = button.sure
      let values = this.checkedValue
      if(_.isEmpty(values)) {
        this.$message.warning('请选择')
        return
      }
      const params = button.params
      let newObj = []
      if (params) {
        rows.forEach(row => {
          const temp = {}
          params.forEach(item => {
            temp[item] = row[item]
          })
          newObj.push(temp)
        })
      } else {
        newObj = rows
      }
      rows.forEach(row => {
        _.merge(row, values)
      })

      const newEvent = {
        url: sureMethod.path,
        params: rows,
        ajaxType: sureMethod.ajaxType,
        callBack: sureMethod.callBack
      }
      if (sureMethod.confirm) {
        const confirm = sureMethod.confirm
        this.$confirm(confirm.message, confirm.title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.realSendAjax(newEvent, this.buttonIndex, rows)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else {
        this.realSendAjax(newEvent, this.buttonIndex, rows)
      }
    },
    sureInTable() {
      const buttonColumn = this.realTableColumns.filter((item) => {
        if(item.type && item.type === 'button') {
          return true
        } else {
          return false
        }
      })[0]
      const buttons = buttonColumn.buttons[this.buttonIndex]
      const button = buttons.event
      const sureMethod = button.sure
      let values = this.checkedValues.length > 0 ? this.checkedValues : this.checkedValue
      if (_.isArray(values)) {
        if(values.length <= 0) {
          this.$message.warning('请选择')
          return
        }
      } else {
        if(_.isEmpty(values)) {
          this.$message.warning('请选择')
          return
        }
      }
      const params = button.params
      let newObj = {}
      if (params) {
        params.forEach(item => {
          newObj[item] = this.rowData[item]
        })
      } else {
        newObj = this.rowData
      }
      // newObj['gaoyang'] = '111'
      if (_.isArray(values)) {
        values.forEach(value => {
          _.merge(value, newObj)
        })
      } else {
        values = _.merge(values, newObj)
      }
      const newEvent = {
        url: sureMethod.path,
        params: values,
        ajaxType: sureMethod.ajaxType,
        callBack: sureMethod.callBack
      }
      if (sureMethod.confirm) {
        const confirm = sureMethod.confirm
        this.$confirm(confirm.message, confirm.title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.realSendAjax(newEvent, this.buttonIndex, this.rowData)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else {
        this.realSendAjax(newEvent, this.buttonIndex, this.rowData)
      }
    },
    sure(index, row) {
      const button = this.buttons[this.buttonIndex].event
      const sureMethod = button.sure
      let values = this.checkedValues.length > 0 ? this.checkedValues : this.checkedValue
      if (_.isArray(values)) {
        if(values.length <= 0) {
          this.$message.warning('请选择')
          return
        }
      } else {
        if(_.isEmpty(values)) {
          this.$message.warning('请选择')
          return
        }
      }
      const params = button.params
      let newObj = {}
      if (params) {
        params.forEach(item => {
          newObj[item] = row[item]
        })
      } else {
        newObj = row
      }
      // newObj['gaoyang'] = '111'
      if (_.isArray(values)) {
        values.forEach(value => {
          _.merge(value, newObj)
        })
      } else {
        values = _.merge(values, newObj)
      }
      const newEvent = {
        url: sureMethod.path,
        params: values,
        ajaxType: sureMethod.ajaxType
      }
      if (sureMethod.confirm) {
        const confirm = sureMethod.confirm
        this.$confirm(confirm.message, confirm.title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.realSendAjax(newEvent, index, row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else {
        this.realSendAjax(newEvent, index, row)
      }
    },
    getCheckedReport(val) {
      this.checkedValues = val
    },
    radioCheckedMethod(val) {
      this.checkedValue = val
    },
    updateMethod(event, row, searchData = {}) {
      let params = event.params || []
      let query = {}
      if (!_.isArray(params)) {
        params = params.split(',')
      }
      params.forEach((item) => {
        if (item === 'details' || item === 'edit') {
          query['fromType'] = item
        } else {
          query[item] = row[item]
        }
      })
      let search = {}
      params.forEach((item) => {
        if (item === 'details' || item === 'edit') {
          query['fromType'] = item
        } else {
          search[item] = searchData[item]
        }
      })
      query = _.merge({}, query, event.static || {}, search)
      if(event.configKey) {
        event.path = '/config/' + encodeURIComponent(event.configKey)
      }
      const target = {
        path: event.path,
        query: _.merge({}, query, { _: Date.now()})
      }
      this.$router.push(target)
    },
    ajaxMethod(Nevent, row, index) {
      const callback = Nevent.callBack || { showMessage: true }
      if(callback.addDataBack) {
        if(this.subData[index]) {
          this.subData[index].open = !this.subData[index].open
          this.$emit('addDataBack', {
            type: callback.addDataBack,
            data: this.subData[index].data,
            index,
            open: this.subData[index].open
          })
          return
        }
      }
      const event = _.cloneDeep(Nevent)
      const that = this
      let params = event.params || []
      if (!_.isArray(params)) {
        params = params.split(',')
      }
      const query = {}
      let url = event.path
      params.forEach((item) => {
        query[item] = row[item]
        url = _.replace(url, '{' + item + '}', row[item])
      })
      event.params = query
      event.url = url
      if (event.confirm) {
        const confirm = event.confirm
        this.$confirm(confirm.message, confirm.title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          that.realSendAjax(event, index, row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else {
        that.realSendAjax(event, index, row)
      }
    },
    realSendAjax(query, index, row) {
      const callback = query.callBack || { showMessage: true, refresh: true }
      ajaxSend(query).then(res => {
        if (res.code === 0) {
          if(callback.showMessage) {
            this.$message({
              type: 'success',
              message: '操作成功',
              showClose: true
            })
          }
          if (callback.refresh) {
            this.$emit('refresh', index)
            this.$refs.customdialogReport && this.$refs.customdialogReport.resetCheckeds()
          }
          if (callback.autoClose) {
            this.showDialog = false
          }
          if(index) {
            this.subData[index] = {
              data: res.data,
              open: true
            }
          }
          if (callback.addDataBack) {
            this.$emit('addDataBack', {
              type: callback.addDataBack,
              data: res.data.data,
              index,
              open: true
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: res.message,
            showClose: true
          })
        }
      }).catch((error) => {
        this.$message({
          type: 'error',
          message: error,
          showClose: true
        })
      })
    },
    showReportColumn(event, row, index) {
      this.$emit('showReport', {
        event,
        row,
        index
      })
    }
  }
}
export default operatorMixin
