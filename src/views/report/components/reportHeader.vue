<template>
  <div class="report-header">
    <div class="report-title">
      <span class="log"></span>
      <span class="title">{{title}}</span>
    </div>
    <div class="report-button-wrapper">
      <div
        v-for="(item, $index) in buttons"
        :key="$index"
        style="display: inline-block;vertical-align: center;padding-left: 5px;padding-right: 5px;"
      >
        <el-button
          :type="getButtonType(item.event, $index)"
          @click.stop="clickButton(item, $index)"
          :key="$index"
          v-waves
          size="small"
          class="btn-font"
        >
          <i class="iconfont"
             v-if="item.icon"
             :class="item.icon"
          ></i>
          <label>{{item.name}}</label>
        </el-button>
      </div>
      <el-dialog
        :title="title"
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
          <el-button type="primary" @click.native="getDialgMethod">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  //@todo 国际化
  import commonMixin from '../../../mixins/commonMixin.js'
  import operatorMixin from '../../../mixins/operatorMixin.js'
  import waves from '../../..//directive/waves/index.js'
  import _ from 'lodash'

  export default {
    name: 'report-header',
    mixins: [commonMixin, operatorMixin],
    directives: {
      waves
    },
    props: {
      title: {
        type: String
      },
      buttons: {
        type: Array
      },
      isDialog: {
        required: false
      },
      radioCheckedValue: {
        type: Object
      },
      checkeboxChecked: {
        type: Array
      }
    },
    methods: {
      clickButton(button, index, $event) {
        const event = button.event
        const flag = this.judgMethod(event)
        if (!flag) {
          return false
        }
        switch (event.type) {
          case 'router':
            this.routerMethod(event)
            break
          case 'cancel':
            this.goBack()
            break
          case 'custom':
            this.customMethod(button, index, $event)
            break
          case 'dialog-report':
            if (!_.isEmpty(this.radioCheckedValue) || !this.checkeboxChecked.length <= 0) {
              this.buttonIndex = index
              if (!_.isEmpty(this.radioCheckedValue)) {
                this.showReport(event, this.radioCheckedValue, index)
              } else {
                this.showReport(event, this.checkeboxChecked, index)
              }
            } else {
              this.$message.warning('请选择数据')
            }
            break
          default:
            this.$emit('button-method', event)
        }
      },
      getButtonType(item, index) {
        if (item.type === 'router' || item.type === 'ajax' || item.type === 'submit' || item.type === 'add' || item.type === 'import' || item.type === 'batchUpdate' ||
          item.type === 'ajaxBatchUpdate' || item.type === 'saveToForm' || item.type === 'saveToRep' || item.type ===
          'alternative' || item.type === 'reset' || item.type === 'export' || item.type === 'yongHongExport' || item.type === 'feExport') {
          return 'primary'
        }
      },
      getDialgMethod() {
        if (!_.isEmpty(this.radioCheckedValue)) {
          this.sure(this.radioCheckedValue)
        } else {
          this.sureInHeader(this.checkeboxChecked)
        }
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .button-operator-area {
    display: inline-flex;
    position: relative;
  }

  .report-header {
    width: 100%;
    height: 50px;
    background-color: #fff;
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    border-bottom: 1px solid #d8dce5;
    .report-title {
      padding-left: 20px;
      float: left;
      line-height: 50px;
      white-space: nowrap;
      font-size: 0px;
      .title {
        display: inline-block;
        font-size: 15px;
        white-space: nowrap;
        vertical-align: middle;
        padding-left: 10px;
        color: #666;
      }
      .logo {
        display: inline-block;
        background-color: #25adfb;
        white-space: nowrap;
        width: 2px;
        border-radius: 2px;
        height: 16px;
        display: inline-block;
        position: relative;
        left: 0;
        vertical-align: middle;
      }

    }
    .report-button-wrapper {
      float: right;
      line-height: 48px;
      padding-right: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      button {
        display: flex;
        flex: 1;
        align-items: center;
      }
    }
    .download {
      position: relative;
      a {
        line-height: 30px;
        position: absolute;
        text-align: center;
        top: 0px;
        left: 0;
        bottom: 0;
        right: 0;
      }
    }
  }
</style>
