<template>
  <div class="fe-checkbox">
    <el-form-item
      :label="endTitle | capitalize"
      :class="{ 'form-group--error': $v.defaultValue.$error, 'is-required': isRequired }"
    >
      <el-checkbox-group
        v-model="defaultValue"
        class="fe-checkbox-content"
        @change="dealData"
        :disabled="disabled"
      >
        <el-checkbox
          v-for="item in options"
          :key="item.value"
          v-bind="item"
          :checked="item.checked"
        >
        </el-checkbox>
      </el-checkbox-group>
      <div
        class="el-form-item__error error_input"
        v-if="inForm && $v.defaultValue.$error"
      >{{errorMessage}}
      </div>
    </el-form-item>
  </div>
</template>
<script>
  import _ from 'lodash'
  import validateMixin from './mixin/validateMixin'
  import baseMixin from './mixin/baseMixin'

  export default {
    name: 'fe-checkbox',
    mixins: [validateMixin, baseMixin],
    props: {
      options: Array,
      value: {
        type: String | Array
      }
    },
    data() {
      return {
        defaultValue: []
      }
    },
    watch: {
      value: {
        handler(val) {
          if (val) {
            this.defaultValue = val
            this.dataLabel(val)
          } else {
            this.defaultValue = []
          }
        },
        deep: true,
        immediate: true
      },
      defaultValue(val) {
        // this.$emit('input', val)
      }
    },
    methods: {
      dataLabel(val) {
        const retValue = []
        this.defaultValue.forEach((item) => {
          _.find(this.options, function (o) {
            if (o.value === item) {
              o.checked = true
            }
          })
        })
        return retValue
      },
      dealData() {
        const retValue = []
        this.defaultValue.forEach((item) => {
          const ret = _.find(this.options, function (o) {
            return o.label === item
          })
          retValue.push(ret.value)
        })
        this.$emit('input', retValue)
        this.$nextTick(() => {
          this.triggerVaildate()
        })
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .fe-checkbox {
    width: unset;
    margin-top: 5px;
    margin-bottom: 5px;
    .el-form-item {
      margin-bottom: 0px !important;
      position: relative;
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
    .fe-checkbox-content {
      width: 178px;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0px;
    }
  }
</style>
