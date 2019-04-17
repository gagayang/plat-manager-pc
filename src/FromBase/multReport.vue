<template>
  <div class="fe-input_mult-report">
    <el-form-item
      :label="endTitle | capitalize"
      :class="{ 'form-group--error': $v.defaultValue.$error, 'is-required': isRequired }"
    >
      <div class="select-area">
        <div class="select-tags" v-if="defaultValue.length > 0">
          <span>
            <span class="tag">
              <span class="text">
                {{getText(defaultValue[0])}}
              </span>
              <i class="el-icon-close close"
                 @click="removeOne"
              ></i>
            </span>
            <span class="tag" v-if="defaultValue.length > 1">
              <span class="text">+ {{defaultValue.length - 1}}</span>
            </span>
          </span>
        </div>
        <el-input
          :placeholder="placeholder"
          :prefix-icon="icon"
          ref="input"
          v-model="textValue"
          :disabled="disabled"
          :readonly="true"
          @focus="showReport"
          @blur="triggerVaildate"
          class="fe-input-content"
        ></el-input>
      </div>
      <div
        class="el-form-item__error error_input"
        v-if="inForm && $v.defaultValue.$error"
      >{{errorMessage}}
      </div>
      <el-dialog
        title=""
        :visible.sync="showDialog"
        width="75%"
        height="600px"
        :append-to-body="appendToBody"
        class="el-dialog_report"
        center>
        <report
          v-if="metaComplate"
          v-bind="meta"
          :isDialog="inDialog"
          :code="meta.code || meta.id"
          style="height: 600px"
          @checkbox="getCheckedReport"
          :checkeds="defaultValue"
          :staticParams="getMetaParams"
          ref="dialogReport"
          :autoFocus="true"
        ></report>
        <div class="mult-report-buttons">
          <el-button @click="reset">取 消</el-button>
          <el-button type="primary" @click="sure">确 定</el-button>
        </div>
      </el-dialog>
    </el-form-item>
  </div>
</template>
<script>
  import _ from 'lodash'
  import {getConfig} from '@/api/common.js'
  import validateMixin from './mixin/validateMixin'
  import baseMixin from './mixin/baseMixin'

  export default {
    name: 'multiple-report',
    mixins: [validateMixin, baseMixin],
    props: {
      value: {
        type: Array
      },
      textValueProps: {
        type: String
      },
      params: {
        type: Array
      },
      configKey: {
        type: String,
        required: true
      }
    },
    data() {
      this.appendToBody = true
      return {
        type: 'report',
        inDialog: true,
        meta: {},
        textValue: '',
        defaultValue: [],
        showDialog: false,
        height: '600px',
        checkedValue: [],
        getMetaParams: {}
      }
    },
    computed: {
      metaComplate: function () {
        return !_.isEmpty(this.meta)
      }
    },
    watch: {
      value: {
        handler(val) {
          this.defaultValue = val
          if (val.length > 0) {
            this.textValue = ' '
          } else {
            this.textValue = ''
          }
          // let v = ''
          // val.forEach((item) => {
          //  v += ',' + item[this.textValueProps]
          // })
          // this.textValue = v.substr(1, v.length)
        },
        deep: true,
        immediate: true
      },
      defaultValue(val) {
        this.$emit('input', val)
      },
      showDialog: {
        handler(val) {
          if (!val) {
            // 清除选中
          }
        }
      }
    },
    methods: {
      clearAllSelect() {
        // 清除选中
      },
      removeOne() {
        this.defaultValue.shift()
      },
      getText(item) {
        return item[this.textValueProps]
      },
      showReport() {
        this.showDialog = true
        this.getReportMeta()
      },
      getReportMeta() {
        if (this.configKey) {
          const vaildateFlag = this.checkParams()
          if (vaildateFlag) {
            getConfig(this.configKey, this.getMetaParams).then(res => {
              const columns = res.data.meta.columns
              this.addGridSelect(columns)
              this.meta = res.data.meta
            })
          } else {
            this.showDialog = false
            this.$nextTick(() => {
              this.$message.error('您配置了前置条件参数，没有选择。请先填写')
            })
          }
        }
      },
      checkParams() {
        let retFlag = true
        const params = {}
        const form = window.helpSpace[this.code] && window.helpSpace[this.code].form
        if (this.params && this.params.length > 0) {
          this.params.forEach((param) => {
            const name = param.name
            let value = param.value
            const required = param.required
            if (value) {
              params[name] = value
            } else {
              if (form) {
                value = form.getValue(name)
                if (required) {
                  if (!value || value.length === 0) {
                    retFlag = false
                  } else {
                    params[name] = value
                  }
                }
              } else {
                retFlag = false
              }
            }
          })
        }
        this.getMetaParams = params
        return retFlag
      },
      addGridSelect(columns) {
        const selection = {
          'type': 'selection',
          'name': '',
          'title': '多选',
          'align': 'center',
          'width': '60',
          'fixed': 'left'
        }
        let hasSelection = false
        columns.forEach((column) => {
          if (column.type && column.type === 'selection') {
            hasSelection = true
          }
        })
        if (!hasSelection) {
          if (columns[0].type && columns[0].type === 'index') {
            columns.splice(1, 0, selection)
          } else {
            columns.splice(0, 0, selection)
          }
        }
      },
      getCheckedReport(val) {
        this.checkedValue = val
      },
      reset() {
        this.showDialog = false
        this.checkedValue = []
      },
      sure() {
        this.showDialog = false
        this.defaultValue = this.checkedValue
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-dialog__body {
    padding-bottom: 20px !important;
    .mult-report-buttons {
      float: right;
      margin-right: 30px;
      .el-button {
        margin-top: 16px;
      }
    }
  }

  .fe-input_mult-report {
    margin-top: 5px;
    margin-bottom: 5px;
    width: unset;
    .el-form-item {
      margin-bottom: 0px !important;
      position: relative;
      .select-area {
        .select-tags {
          position: absolute;
          line-height: normal;
          white-space: normal;
          z-index: 1;
          top: 50%;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          .tag {
            box-sizing: border-box;
            border-color: transparent;
            margin: 2px 0 2px 6px;
            background-color: #f0f2f5;
            height: 24px;
            padding: 2px 0 2px 6px;
            border-radius: 3px;
            .close {
              border-radius: 50%;
              text-align: center;
              position: relative;
              cursor: pointer;
              font-size: 12px;
              height: 16px;
              width: 16px;
              line-height: 16px;
              background-color: #c0c4cc;
              top: 0;
              color: #fff;
            }
          }
        }
      }
      &.s-required {
        &::before {
          content: "*";
          color: #f56c6c;
          margin-right: 4px;
          position: absolute;
          bottom: 5px;
          left: 0;
        }
      }
    }
    label {
      font-size: 14px;
      width: 100px;
      line-height: 30px;
      display: inline-block;
    }
    .error_input {
      width: 178px;
    }
    .fe-input-content {
      width: 178px;
    }
    & /deep/ .el-dialog__body {
      text-align: right;
    }
  }
</style>
