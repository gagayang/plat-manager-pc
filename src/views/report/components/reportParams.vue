<template>
  <div class="report-params"
       :class="{'report-params-inForm': inForm}"
  >
    <el-form ref="form" :model="valueClone" class="form" label-width="120px" :label-position="labelPosition"
             @submit.native.prevent>
      <div class="main-form-wrapper">
        <div
          class="report-params-item"
          :class="[{'is-hidden':item.isHidden, 'is-report': !inForm}, item.inputModel]"
          v-for="(item, $index) in paramsModelClone"
          v-show="showItem($index, item, paramsModelClone.length)"
          :key="$index"
        >
          <component
            :is="getComponentName(item)"
            ref="formComponents"
            :code="code"
            :inForm="inForm"
            @vaildate="validateFunction"
            v-model="valueClone[item.name]"
            v-bind="item"
            :formData="formData"
          ></component>
        </div>
      </div>
      <div v-if="isShowArrow()">
        <div class="show-more-wrapper"
             @click="showAllParams"
        >
          <i
            class="el-icon-arrow-down show-more-arrow"
            :class="{'is-open': showAll}"
          ></i>
        </div>
      </div>
      <div
        class="sub-form-wrapper"
        v-if="subForms != undefined"
      >
        <template
          v-for="(subForm, $index) in subForms"
        >
          <table
            class="sub-form-table"
            v-if="subForm.layout === 'table'"
            :key="$index"
          >
            <thead>
            <tr>
              <th
                class="operator-th"
              >
                <button style="width: 60px" @click="addSubFormRow($index)">
                  新增
                </button>
              </th>
              <th
                class="sub-form-table-th"
                v-for="(component, $idx) in subForm.items"
                v-if="!component.isHidden"
              >
                {{component.title}}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="(row, $idxR) in valueClone.subForms[$index]"
            >
              <td style="border-bottom: 1px solid #42b983">
                <button style="width: 60px;" @click="removeRow($index, $idxR)">
                  删除
                </button>
              </td>
              <td
                v-for="(value, key) in row"
                class="sub-form-table-row-td"
                v-if="!isShowInSubForm($index, key)"
              >
                <component
                  :is="getSubFormComponentName($index, key)"
                  ref="subFormComponents[key]"
                  :code="code"
                  v-model="row[key]"
                  v-bind="retItem($index, key)"
                  :formData="formData"
                  :hasLabel="false"
                ></component>
              </td>
            </tr>
            </tbody>
          </table>
        </template>
      </div>
    </el-form>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import input from '@/FromBase/input.vue'
  import textArea from '@/FromBase/textArea.vue'
  import select from '@/FromBase/select.vue'
  import feSwitch from '@/FromBase/switch.vue'
  import checkbox from '@/FromBase/checkbox.vue'
  import datePicker from '@/FromBase/datePicker.vue'
  import doubleDatePicker from '@/FromBase/doubleDatePicker.vue'
  import commonTree from '@/FromBase/commonTree.vue'
  import uploadCdn from '@/FromBase/uploadCdn.vue'
  import multipleReport from '@/FromBase/multReport.vue'
  import singleReport from '@/FromBase/singleReport.vue'
  import password from '@/FromBase/password.vue'
  import weekPicker from '@/FromBase/weekPicker.vue'
  import monthPicker from '@/FromBase/monthPicker.vue'
  import inputModel from '../../../utils/inputModel.js'
  import _ from 'lodash'
  import helpService from '../../../utils/manager'

  export default {
    name: 'report-params',
    components: {},
    props: {
      code: String,
      resouceType: String,
      script: String,
      paramsModel: {
        type: Array
      },
      value: Object,
      formData: {
        type: Boolean
      },
      inForm: {
        type: Boolean,
        default: false
      },
      subForms: {
        type: Array
      },
      autoFocus: {
        type: Boolean,
        default: false
      },
      loadingData: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'fe-input': input,
      'fe-text': textArea,
      'fe-select': select,
      'fe-switch': feSwitch,
      'fe-checkbox': checkbox,
      'fe-single-date-picker': datePicker,
      'fe-double-date-picker': doubleDatePicker,
      'fe-common-tree': commonTree,
      'fe-uploadCdn': uploadCdn,
      'multiple-report': multipleReport,
      'single-report': singleReport,
      'fe-password': password,
      'fe-weekPicker': weekPicker,
      'fe-monthPicker': monthPicker,
    },
    computed: {
      ...mapGetters([
        'width'
      ]),
      showNumber() {
        return Math.floor((this.$store.state.app.width) / 298) * 1
      }
    },
    mounted() {
      this.$emit('ready-height', this.$el.offsetHeight)
    },
    beforeMount() {
      const helpSpace = window.helpSpace || {}
      if (!helpSpace[this.code]) {
        helpSpace[this.code] = {}
      }
      window.helpSpace = helpSpace
      helpSpace[this.code]['form'] = helpService.getForm(this)
    },
    data() {
      this.labelPosition = 'right'
      this.inputModel = inputModel
      this.hiddenLength = 0
      return {
        showAll: false,
        valueClone: {},
        paramsModelClone: [],
        backupValue: {},
        vaildateFlag: true,
        subFormsClone: [],
        dynamicWatches: []
      }
    },
    watch: {
      value: {
        handler(val) {
          this.valueClone = _.cloneDeep(val)
          const query = _.cloneDeep(this.$route.query || {})
          for (let i in query) {
            this.valueClone[i] = query[i]
          }
          if (_.isEmpty(this.backupValue)) {
            this.backupValue = _.cloneDeep(val)
          }
        },
        deep: true,
        immediate: true
      },
      paramsModel: {
        handler(val) {
          if (!val) {
            return
          }
          this.paramsModelClone = _.cloneDeep(val)
          const hiddenArray = this.paramsModelClone.filter((item, index) => {
            if (item.isHidden) {
              return true
            }
          })
          this.hiddenLength = hiddenArray.length
        },
        deep: true,
        immediate: true
      },
      subForms: {
        handler(val) {
          this.subFormsClone = _.cloneDeep(val)
        },
        deep: true,
        immediate: true
      }
    },
    beforeDestroy() {
      this.dynamicWatches.forEach(unwatch => {
        unwatch()
      })
    },
    methods: {
      isShowArrow() {
        if (!this.inForm) {
          if (this.paramsModelClone.length - this.hiddenLength > this.showNumber) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      validateFunction(flag) {},
      showItem($index, item, length) {
        if (this.showAll || this.inForm) {
          return true
        }
        if (this.showNumber > $index - this.hiddenLength) {
          return true
        } else {
          return false
        }
      },
      beforeSubmit() {
        const components = this.$refs.formComponents
        this.vaildateFlag = true
        if (components && components.length > 0) {
          components.forEach((item) => {
            item.$v && item.$v.defaultValue && item.$v.defaultValue.$touch()
            if (item.$v.defaultValue.$error) {
              this.vaildateFlag = false
            }
          })
        }
      },
      confirm(event) {
        return new Promise((resolve, reject) => {
          this.vaildateFlag = true
          this.beforeSubmit()
          this.$nextTick(() => {
            if (this.vaildateFlag) {
              this.$emit('input', this.valueClone)
              this.$nextTick(() => {
                resolve({
                  value: this.valueClone,
                  flag: this.vaildateFlag
                })
              })
            }
          })
        })
      },
      removeRow(subFormIndex, rowIndex) {
        const subFormValue = this.valueClone.subForms[subFormIndex]
        console.log('删除子表单：' + subFormIndex)
        subFormValue.splice(rowIndex, 1)
      },
      retItem(index, name) {
        const subForm = this.subForms[index].items
        let retItem = null
        subForm.forEach((item) => {
          if (item.name === name) {
            retItem = item
          }
        })
        return retItem
      },
      isShowInSubForm(index, name) {
        const subForm = this.subForms[index].items
        let componentName = null
        subForm.forEach((item) => {
          if (item.name === name) {
            componentName = item
          }
        })
        return componentName.isHidden
      },
      getSubFormComponentName(index, name) {
        const subForm = this.subForms[index].items
        let componentName = null
        subForm.forEach((item) => {
          if (item.name === name) {
            const inputModel = item.inputModel
            componentName = this.inputModel[inputModel]
          }
        })
        return componentName
      },
      addSubFormRow(index) {
        const subForm = this.subForms[index]
        const items = subForm.items
        const retObj = {}
        items.forEach((item) => {
          const value = item.value || ''
          const name = item.name
          retObj[name] = value
        })
        this.valueClone.subForms[index].push(retObj)
      },
      getComponentName(item) {
        const inputModel = item.inputModel
        const componentName = this.inputModel[inputModel]
        return componentName
      },
      getSendValue(name) {
        return this.valueClone[name]
      },
      reset(isDialog) {
        // this.backupValue = {}
        this.$emit('clearReport')
        this.valueClone = _.cloneDeep(this.backupValue)
      },
      showAllParams() {
        this.showAll = !this.showAll
      }

    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  report-params-inForm {
    flex: 1;
  }

  .report-params {
    display: flex;
    flex-direction: row;
    margin-left: 20px;
    margin-right: 20px;
    flex-wrap: wrap;
    position: relative;
    // margin-bottom: 15px;
    .form {
      width: 100%;
      display: flex;
      flex-direction: column;
      // border: 1px solid #e6e6e6;
      border-left: none;
      border-right: none;
      padding: 5px 0;
      .main-form-wrapper {
        display: flex;
        flex-wrap: wrap;
        .report-params-item {
          /*&:nth-child(n+4) {*/
          /*margin-top: 0px;*/
          /*margin-bottom: -3px;*/
          /*}*/
        }
      }
      .show-more-wrapper {
        width: 40px;
        height: 15px;
        line-height: 15px;
        background: #ebeef5;
        position: absolute;
        left: calc(50% - 20px);
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        cursor: pointer;
        bottom: -15px;
        z-index: 11;
        text-align: center;
        .show-more-arrow {
          transition: .3s ease-in-out;
          &.is-open {
            transform: rotate(-180deg);
          }
        }
      }
      .report-params-item {
        width: 298px;
        float: left;
        margin-bottom: 12px;
        &.is-report {
          margin-bottom: 0px;
        }
        &.is-hidden {
          display: none;
        }
        // height: 45px;
        &.area-select {
          width: auto !important;
          margin-bottom: 0px;
        }
      }
      .sub-form-wrapper {
        overflow: auto;
        flex: 1;
        .sub-form-table {
          font-family: Helvetica Neue, Arial, sans-serif;
          font-size: 14px;
          color: #444;
          width: 100%;
          border: 2px solid #42b983;
          border-radius: 3px;
          /*background-color: #fff;*/
          overflow: auto;
          flex: 1;
          .sub-form-table-row-td {
            border-bottom: 1px solid #42b983;
            border-left: 1px solid #42b983;
          }
          .operator-th {
            width: 60px;
            cursor: pointer;
            border-bottom: 1px solid #42b983;
            button: {
              width: 60px;
              cursor: pointer;
            }
          }
          .sub-form-table-th {
            /*background-color: #42b983;*/
            cursor: pointer;
            min-width: 178px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            border-left: 1px solid #42b983;
            border-bottom: 1px solid #42b983;
          }
        }
      }
    }
  }

  /*class="item.inputModel==='area'? 'w-full':''" */
  .isBlock,
  .area {
    width: 100% !important;
  }

</style>
