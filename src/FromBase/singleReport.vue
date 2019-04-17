<template>
  <div class="fe-input_mult-report">
    <el-form-item
      :label="endTitle | capitalize"
      :class="{ 'form-group--error': $v.defaultValue.$error, 'is-required': isRequired }"
    >
      <el-input
        :placeholder="placeholder"
        :prefix-icon="icon"
        v-model="textValue"
        :disabled="disabled"
        @focus="showReport"
        @blur="triggerVaildate"
        class="fe-input-content"
        :readonly="true"
        ref="input"
      ></el-input>
      <div
        class="el-form-item__error error_input"
        v-if="inForm && $v.defaultValue.$error"
      >{{errorMessage}}
      </div>
      <el-dialog
        title=""
        :visible.sync="showDialog"
        width="75%"
        :append-to-body="appendToBody"
        center>
        <report
          v-if="metaComplate"
          v-bind="meta"
          :isDialog="inDialog"
          :code="meta.code || meta.id"
          style="height: 600px"
          @radioChecked="radioChecked"
          :staticParams="getMetaParams"
          :radioCheckedValue="defaultValue"
          :autoFocus="true"
        ></report>
        <div class="mult-report-buttons">
          <el-button @click="reset">取 消</el-button>
          <el-button type="primary" @click="sure" class="mult-report-buttons-sure">确 定</el-button>
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
    name: 'single-report',
    mixins: [validateMixin, baseMixin],
    props: {
      value: {
        type: Object
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
        defaultValue: {},
        showDialog: false,
        height: '600px',
        checkedValue: {},
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
          this.textValue = val[this.textValueProps]
        },
        deep: true
      },
      defaultValue(val) {
        this.$emit('input', val)
      }
    },
    methods: {
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
                  if (!value) {
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
          'aglign': 'center',
          'fixed': 'left',
          'name': 'orgId',
          'title': '选择',
          'type': 'radio',
          'width': '50'
        }
        let hasSelection = false
        let haseCheckbox = false
        columns.forEach((column, index) => {
          if (column.type && column.type === 'selection') {
            haseCheckbox = index
          }
        })
        if (haseCheckbox) {
          columns.splice(haseCheckbox, 1)
        }
        columns.forEach((column, index) => {
          if (column.type && column.type === 'radio') {
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
      radioChecked(val) {
        this.checkedValue = val
      },
      reset() {
        this.showDialog = false
        this.checkedValue = {}
      },
      sure() {
        this.showDialog = false
        this.defaultValue = this.checkedValue
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        padding-top: 3px !important;
      }
    }
  }

  .el-dialog__headerbtn:hover .el-dialog__close {
    color: #fff;
  }

  .el-dialog__body {
    padding-bottom: 0px !important;
    .mult-report-buttons {
      margin-right: 30px;
      .el-button {
        margin-top: 16px;
        margin-bottom: 10px;
        float: right;
        &.mult-report-buttons-sure {
          margin-right: 11px;
        }
      }
    }
  }

  .fe-input_mult-report {
    margin-top: 5px;
    margin-bottom: 5px;
    width: unset;
    .el-form-item {
      margin-bottom: 0px !important;
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

  }
</style>
