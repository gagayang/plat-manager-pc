<template>
  <div class="fe-select">
    <el-form-item
      :label="endTitle | capitalize"
      :class="{ 'form-group--error': $v.defaultValue.$error, 'is-required': isRequired  }"
    >
      <el-select
        v-model="defaultValue"
        :placeholder="placeholder"
        class="fe-select-content"
        :disabled="disabled"
        filterable
        clearable
        dataOptions
        @blur="triggerVaildate"
        :multiple="multiple"
        :loading="loading"
        ref="input"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <!--<el-option-->
        <!--value=""-->
        <!--key="all"-->
        <!--label="全部"-->
        <!--&gt;全部</el-option>-->
        <el-option
          v-for="item in dataOptions"
          :key="item.value"
          v-bind="item"
        >
        </el-option>
      </el-select>
      <div
        class="el-form-item__error error_input"
        v-if="inForm && $v.defaultValue.$error"
      >{{errorMessage}}
      </div>
    </el-form-item>
  </div>
</template>
<script>
  import validateMixin from './mixin/validateMixin'
  import baseMixin from './mixin/baseMixin'
  import request from '@/utils/request'
  import _ from 'lodash'
  /* eslint-disable */
  export default {
    name: 'fe-select',
    mixins: [validateMixin, baseMixin],
    props: {
      options: Array,
      value: {
        type: String | Array
      },
      multiple: {
        type: Boolean,
        default: false
      },
      path: {
        type: String
      },
      immediate: {
        type: Boolean,
        default: false
      },
      target: {
        type: Array
      },
      staticParams: {
        type: Object,
        default() {
          return {}
        }
      },
      paramsMaping: {
        type: Object,
        default() {
          return {
            'label': 'label',
            'value': 'value'
          }
        }
      }
    },
    mounted() {
      if (this.immediate) {
        this.getData()
      }
    },
    data() {
      return {
        defaultValue: this.multiple ? [] : '',
        params: {},
        loading: false,
        dataOptions: []
      }
    },
    watch: {
      value: {
        handler(val) {
          this.defaultValue = val
        },
        deep: true,
        immediate: true
      },
      defaultValue(val) {
        this.$emit('input', val)
        if (this.target && this.target.length > 0) {
          this.target.forEach(item => {
            const component = window.helpSpace[this.code].form.getComponentByName(item.name)
            component.params = {}
            component.params[item['params']] = val
          })
        }
      },
      options: {
        handler(val) {
          if (!this.path) {
            this.dataOptions = val
          }
        },
        immediate: true,
        deep: true
      },
      params: {
        handler(val) {
          if (val && !_.isEmpty(val)) {
            if (Object.values(val).length > 0 && Object.values(val)[0]) {
              this.getData()
            }
          }
        },
        deep: true
      }
    },
    methods: {
      getData() {
        const endParams = _.merge({}, this.staticParams, this.params, this.$route.query)
        request({
          url: this.path,
          method: 'post',
          data: endParams
        }).then(res => {
          if (res.code === 0) {
            this.dealData(res.data)
          } else {
            this.$message.error('获取下拉框数据错误')
          }
        })
      },
      dealData(data) {
        data.map((item) => {
          item['label'] = item[this.paramsMaping['label']]
          item['value'] = item[this.paramsMaping['value']]
        })
        this.dataOptions = data
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .fe-select {
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
      font-size: 12px;
      width: 100px;
      line-height: 30px;
      display: inline-block;
    }
    .fe-select-content {
      width: 178px;
    }
  }
</style>
