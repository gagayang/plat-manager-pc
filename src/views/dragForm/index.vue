<template>
  <div class="report-params">
    <el-form ref="form" :model="valueClone" class="form" label-width="120px" :label-position="labelPosition">
      <!--<div-->
      <!--class="report-params-item"-->
      <!--:class="item.inputModel==='area'? 'w-full':''"-->
      <!--v-for="(item, $index) in paramsModelClone"-->
      <!--v-if="!item.isHidden"-->
      <!--:key="$index"-->
      <!--&gt;-->
      <grid-layout
        :layout="layout"
        :col-num="colNum"
        :row-height="rowHeight"
        :is-draggable="false"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="(item, $index) in paramsModelClone"
          :x="layout[$index].x"
          :y="layout[$index].y"
          :w="layout[$index].w"
          :key="$index"
          :h="layout[$index].h"
          :i="layout[$index].i"
        >
          <component
            :is="getComponentName(item)"
            ref="formComponents"
            :code="code"
            @vaildate="validateFunction"
            v-model="valueClone[item.name]"
            v-bind="item"
            :formData="formData"
          ></component>
        </grid-item>
      </grid-layout>
      <!--</div>-->
    </el-form>
  </div>
</template>
<script>
  import { inputModel } from '../../utils/inputModel'
  import _ from 'lodash'
  import helpService from '@/utils/manager'
  import VueGridLayout from 'vue-grid-layout'

  const GridLayout = VueGridLayout.GridLayout
  const GridItem = VueGridLayout.GridItem

  export default {
    name: 'drag-params',
    components: {
      GridLayout,
      GridItem
    },
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
      colNum: {
        type: Number,
        required: true
      },
      rowHeight: {
        type: Number,
        required: true
      },
      layout: {
        type: Object,
        required: true
      }
    },
    beforeMount() {
      if (this.inForm) {
        const helpSpace = window.helpSpace || {}
        if (!helpSpace[this.code]) {
          helpSpace[this.code] = {}
        }
        window.helpSpace = helpSpace
        helpSpace[this.code]['form'] = helpService.getForm(this)
        helpService.dealScript(this.code, this.script)
      }
    },
    data() {
      return {
        labelPosition: 'right',
        showAll: false,
        valueClone: {},
        paramsModelClone: [],
        backupValue: {},
        vaildateFlag: true,
        inputModel
      }
    },
    watch: {
      value: {
        handler(val) {
          this.valueClone = _.cloneDeep(val)
          if (_.isEmpty(this.backupValue)) {
            this.backupValue = _.cloneDeep(val)
          }
        },
        deep: true,
        immediate: true
      },
      paramsModel: {
        handler(val) {
          this.paramsModelClone = _.cloneDeep(val)
        },
        deep: true,
        immediate: true
      }
    },
    created() {
    },
    beforeDestroy() {
    },
    methods: {
      validateFunction(flag) {
      },
      beforSubmit() {
        const components = this.$refs.formComponents
        components.forEach((item) => {
          if (item.$v) {
            item.$v.defaultValue && item.$v.defaultValue.$touch()
            if (item.$v.defaultValue.$error) {
              this.vaildateFlag = false
            }
          }
        })
      },
      confirm(event) {
        // 应该是查询调用这里
        return new Promise((resolve, reject) => {
          this.vaildateFlag = true
          this.beforSubmit()
          this.$nextTick(() => {
            if (this.vaildateFlag) {
              this.$emit('input', this.valueClone)
              this.$nextTick(() => {
                resolve(this.valueClone)
              })
            }
          })
        })
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
        this.valueClone = _.cloneDeep(this.backupValue)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .report-params {
    display: flex;
    flex-direction: row;
    margin-left: 20px;
    flex-wrap: wrap;
    .form {
      width: 100%;
      .report-params-item {
        width: 30%;
        margin-top: 10px;
        float: left;
        // height: 45px;
      }
    }
  }

  .w-full {
    width: 100% !important;
  }
</style>
