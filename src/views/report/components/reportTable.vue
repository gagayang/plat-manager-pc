<template>
  <div
    id="reportTable"
    class="report-table"
  >
    <el-table
      ref="table"
      :data="realTableData"
      border
      stripe
      height="100%"
      style="width:100%;overflow:auto;height:100%;"
      :cell-style="bodyStyle"
      :header-cell-style=headerStyle
      @sort-change="handlerSort"
      @cell-click="handlerCellClick"
      highlight-current-row
      :row-key="getRowKeys"
      @selection-change = "handleCurrentChange"
      @row-click="selectRow"
      @select="handlerSelect"
      @select-all="handlerSelectAll"
      @current-change="handlerCurrent"
      @expand-change="showSubTable"
    >
      <report-column
        v-for="(column, $index) in realTableColumns"
        v-if="!column.hidden"
        :key="$index"
        v-bind="column"
        :columnsLen="realTableColumns.length"
        :searchData="searchData"
        @refresh="refresh"
        @radioChecked="radioChecked"
        @radio.native="radioChecked"
        :radioCheckedValue="radioCheckedValue"
        :radioIndex="radioIndex"
        :subTable="subTable"
        @addDataBack="addDataBack"
        @showReport="showColumnButtonReport"
      ></report-column>
    </el-table>
    <el-popover
      placement="top-start"
      title=""
      width="300"
      trigger="hover"
    >
      <div
        v-html="columnExp"
      >
      </div>
      <span class="tabel-tip" slot="reference"
            v-if="showColumnExp" >
        <i
          class="iconfont icon-knodetailinfor ">
      </i>
      </span>
    </el-popover>
    <div
      v-if="showSetting"
      class="table-column-setting"
      @click="showTransfer"
    >
      <i class="icon-knodetailinfor setting-icon"></i>
    </div>
    <el-dialog
      title=""
      :visible.sync="showDialog"
      modal-append-to-body
      width="50%"
      center>
      <report
        v-bind="meta"
        :isDialog="inDialog"
        code="name"
        ref="customdialogReport"
        @radioChecked="radioCheckedMethod"
        @checkbox="getCheckedReport"
      ></report>
      <div class="button-operator-area">
        <el-button @click.native="reset">取 消</el-button>
        <el-button type="primary" @click.native="sureInTable()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="showTran"
      width="550px"
      :append-to-body="appendToBody"
      class="el-dialog_report-column-tran"
      @close="reset"
      center>
      <el-transfer
        v-model="tranValue"
        :data="tranData"
        :titles="titles"
      ></el-transfer>
      <div class="report-column-tran-buttons">
        <el-button @click="resetTran">取 消</el-button>
        <el-button type="primary" @click="sureTran">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import reportColumn from './reportColumns.vue'
  import operatorMixin from '../../../mixins/operatorMixin.js'
  import { getReportData } from '../../../api/report.js'
  export default {
    name: 'report-table',
    mixins: [operatorMixin],
    props: {
      searchData: {
        type: Object,
        default() {
          return {}
        }
      },
      tableColumns: {
        type: Array
      },
      tableData: {
        type: Array
      },
      reportCode: {
        type: String
      },
      loading: {
        type: Boolean
      },
      indexH: {
        type: String
      },
      radioCheckedValue: {
        type: Object
      },
      radioIndex: {
        type: Number
      },
      subTable: {
        type: Object
      },
      showSetting: {
        type: Boolean,
        default: false
      },
      columnExp: {
        type: String
      }
    },
    components: {
      reportColumn
    },
    data() {
      this.scrollTop = 0
      this.scrollLeft = 0
      this.rowKey = 'key'
      this.bodyStyle = {
        'font-size': '12px',
        'padding': '0'
      }
      this.appendToBody = true
      this.titles = ['展示', '隐藏']
      return {
        height: '',
        headerStyle: {
          'font-size': '12px',
          'background-color': '#fff',
          'color': 'rgba(49, 65, 86, 0.82)',
          'padding': '0'
        },
        realTableColumns: this.tableColumns,
        realTableData: this.tableData,
        showTran: false,
        tranData: [],
        tranValue: [],
        showExp: false,
        isTrue: false
      }
    },
    watch: {
      tableData: {
        handler(val) {
          this.realTableData = val
        },
        immediate: true,
        deep: true
      },
      tableColumns: {
        handler(val) {
          this.realTableColumns = val
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      mainHeight() {
        return this.$store.state.app.height
      },
      showColumnExp() {
        return !! this.columnExp
      }
    },
    mounted() {
      this.$nextTick(() => {

      })
      const that = this
      this.$el.querySelector('.el-table__body-wrapper').onscroll = function(event) {
        const top = that.$el.querySelector('.el-table__body-wrapper').scrollTop
        const left = that.$el.querySelector('.el-table__body-wrapper').scrollLeft

        that.scrollTop = top
        that.scrollLeft = left
      }
    },
    deactivated() {},
    activated() {
      const body = this.$el.querySelector('.el-table__body-wrapper')
      body.scrollTop = this.scrollTop
      body.scrollLeft = this.scrollLeft
    },
    methods: {
      showColumnExpDia() {
        this.showExp = true
      },
      sureTran() {
        this.realTableColumns.forEach((item, index) => {
          if (~this.tranValue.indexOf(index)) {
            item.hidden = true
          } else {
            item.hidden = false
          }
        })
        this.$nextTick(() => {
          this.showTran = false
        })
      },
      showTransfer() {
        this.showTran = true
      },
      resetTran() {
        this.showTran = false
      },
      addDataBack(obj) {
        const index = obj.index
        const type = obj.type
        const data = obj.data
        const open = obj.open
        if (type === 'table') {
          this.realTableData = this.realTableData.concat(data)
        } else if (type === 'row') {
          if (open) {
            const tempTableData = _.cloneDeep(this.realTableData)
            const length = tempTableData.length
            const tempData = tempTableData.splice(index + 1, length - (index + 1))
            const nData = tempTableData.concat(data, tempData)
            nData[index]['subData_opened'] = true
            this.realTableData = nData
          } else {
            const tiempTableData = _.cloneDeep(this.realTableData)
            const tiemplength = data.length
            tiempTableData.splice(index + 1, tiemplength)
            tiempTableData[index]['subData_opened'] = false
            this.realTableData = tiempTableData
          }
        }
      },
      showSubTable(row, expandedRows) {
        if (!row.children) {
          this.getData(row)
        }
        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
      },
      getData(row) {
        const path = this.subTable.path
        const that = this
        getReportData(path, row).then(res => {
          if (res.code === 0) {
            const data = res.data
            // const findRow = _.find(this.realTableData, row)
            that.$set(row, 'children', that.setDataKey(data.data, row))
          } else {
            this.$message({
              type: 'error',
              message: res.message,
              showClose: true
            })
          }
        }).catch(errData => {
          this.loadingData = false
        })
      },
      setDataKey(data, row) {
        data.forEach((item, index) => {
          item.key = 'children' + row.key + index
        })
        return data
      },
      setCheckeds(rows) {
        if (rows && rows.length > 0) {
          rows.forEach(row => {
            this.$refs.table.toggleRowSelection(row, true)
          })
        }
      },
      refresh(index) {
        this.tableData.splice(index, 1)
        this.$emit('refresh')
      },
      handlerSort(col) { // 排序
        this.$emit('sort', {
          'order': this.getSort(col.order),
          'prop': col.prop
        })
      },
      getSort(order) {
        if (!order) {
          return ''
        }
        if (order.indexOf('desc') > -1) {
          return 'desc'
        }
        if (order.indexOf('asc') > -1) {
          return 'asc'
        }
        return ''
      },
      radioChecked(row) {
        this.$emit('radioChecked', row)
      },
      handlerCellClick(row, column, cell, event) {},
      handleCurrentChange(val) {
        this.$emit('checkBoxChange', val)
      },
      selectRow(row, event, column) {
        // this.$emit('radioChecked', row)
      },
      handlerSelect(selection, row) {},
      handlerSelectAll(selection) {},
      handlerCurrent(currentRow, oldCurrentRow) {},
      getRowKeys(row) {
        return row.key
      },
      clearSelection() {
        this.$refs.table.clearSelection()
      },
      showColumnButtonReport(obj) {
        this.showReport(obj.event, obj.row, obj.index)
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped="">
  $height: 32px;
  .button-operator-area{
    float: right;
    display: inline-block;
    margin-bottom:18px;
    padding-right:30px;
    .el-button {
      display: block;
      float: right;
      &:first-child{
        margin-left: 10px;
      }
    }
  }
  .el-dialog_report-column-tran{
    .report-column-tran-buttons{
      margin-left: 160px;
      margin-top: 24px;
    }
  }
  .report-table{
    flex:1;
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;
    padding-top:20px;
    .el-table{
      height: none !important;
      height: auto !important;
    }
    .table-column-Exp{
      position: absolute;
      height: 14px;
      width: 20px;
      background: #42b983;
      border-top-left-radius: 14px;
      border-top-right-radius: 14px;
      left: 31px;
      top: -15px;
      z-index: 2;
      transition: .3s ease-in-out;
      cursor: pointer;
      &:hover{
        top: -30px;
        height:30px;
        .Exp-icon{
          display: block;
        }
      }
      .Exp-icon{
        font-size: 20px;
        color: #FAFAFA;
      }
    }
    .table-column-setting{
      position: absolute;
      height: 14px;
      width: 20px;
      background: #42b983;
      border-top-left-radius: 14px;
      border-top-right-radius: 14px;
      right: 31px;
      top: -15px;
      z-index: 2;
      transition: .3s ease-in-out;
      cursor: pointer;
      &:hover{
        top: -30px;
        height:30px;
        .setting-icon{
          display: block;
        }
      }
      .setting-icon{
        font-size: 20px;
        color: #FAFAFA;
      }
    }

  }
  .tabel-tip{
    color: #00a0e9; font-size: 20px; position: absolute; left:10px; top:1px;z-index: 99;
  }
</style>
