<template>
  <div class="fe-common-tree">
    <el-popover
      v-model="showTree"
      width="280"
    >
      <el-tree
        class="fe-el-tree"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255,255,255,.9)"
        :load="loadData"
        :lazy="lazy"
        :node-key="paramsMaping.id"
        ref="tree"
        :highlight-current="highlightCurren"
        @node-click="getChecked"
        :show-checkbox="showCheckbox"
        :expand-on-click-node="expand"
        :check-strictly="strictly"
        @check="check"
        :data="treeData"
        :props="paramsMaping">
      </el-tree>
      <div>
        <el-button
          type="primary"
          @click.stop="sureMethod"
          size="small"
          class="tree-button"
        >
          确认
        </el-button>
        <el-button
          @click.stop="cancel"
          size="small"
        >
          取消
        </el-button>
      </div>
      <el-form-item
        slot="reference"
        :label="title"
        :class="{ 'form-group--error': $v.defaultValue.$error, 'is-required': isRequired }"
      >
        <el-input
          :placeholder="placeholder"
          :prefix-icon="icon"
          v-model="atextValue"
          ref="input"
          :readonly="true"
          class="fe-input-content"
          @blur="triggerVaildate"
        ></el-input>
        <div
          class="el-form-item__error error_input"
          v-if="inForm && $v.defaultValue.$error"
        >{{errorMessage}}
        </div>
      </el-form-item>
    </el-popover>
  </div>
</template>
<script type="text/ecmascript-6">
  import request from '@/utils/request'
  import {Message} from 'element-ui'
  import _ from 'lodash'
  /* eslint-disable */
  import validateMixin from './mixin/validateMixin'
  import baseMixin from './mixin/baseMixin'

  export default {
    name: 'fe-common-tree',
    mixins: [validateMixin, baseMixin],
    props: {
      text: String,
      multi: {
        type: Boolean,
        default: false
      },
      path: String, // 获取异步加载树 数据接口
      baseParams: {
        type: Object,
        default: {}
      },
      lazy: {
        type: Boolean,
        default() {
          return true
        }
      },
      paramsMaping: {
        type: Object,
        default() {
          return {
            id: 'id',
            children: 'children',
            label: 'text',
            isLeaf: 'leaf'
          }
        }
      },
      params: {
        type: Array,
        default: function () {
          return []
        }
      },
      value: {
        type: String | Array
      }
    },
    beforeMount() {
      if (!this.lazy) {
        this.loadData()
      }
    },
    data() {
      const defaultValue = this.multi ? '' : []
      return {
        atextValue: '',
        defaultValue: defaultValue,
        emptyText: '无数据',
        highlightCurren: true,
        loadingText: '加载中...',
        showCheckbox: true,
        showTree: false,
        expand: false,
        strictly: false,
        treeData: [],
        tempDefaultValue: [],
        tempSingleKey: Object.freeze('')
      }
    },
    watch: {
      showTree: {
        handler(val) {
          if (val) {
            this.setCheckBack(this.value)
          }
        }
      },
      value: {
        handler(val) {
          this.defaultValue = val
        },
        deep: true
      },
      defaultValue: {
        handler(val) {
          if (val) {
            let endStr = ''
            val.forEach(item => {
              if (item.checkedStatus && item.checkedStatus === 'all') {
                endStr += ',' + item[this.paramsMaping.label]
              } else if (!item.checkedStatus) {
                endStr += ',' + item[this.paramsMaping.label]
              }
            })
            this.atextValue = endStr.substr(1, endStr.length)
          }
        },
        deep: true
      },
      text: {
        handler(val) {
          this.textValue = val
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {
      // this.setCheckBack(this.value)
    },
    methods: {
      setCheckBack(val) {
        if (val) {
          const checkData = _.filter(val, (item) => {
            if (item.checkedStatus && item.checkedStatus === 'all') {
              return true
            } else if (!item.checkedStatus) {
              return true
            }
          })
          const checkedKeys = []
          checkData.forEach(item => {
            checkedKeys.push(item[this.paramsMaping['id']])
          })
          this.$refs.tree && this.$refs.tree.setCheckedKeys(checkedKeys)
        }
      },
      loadData(node, resolve) { // @todo 获取树懒加载数据
        let params = this.baseParams
        if (node && node.level !== 0) {
          params = {}
          this.params.forEach((item) => {
            params[item] = node[item]
          })
        }
        this.getNodeAjax(this.path, params).then((res) => {
          if (parseInt(res.code) === 0) {
            const data = res.data
            if (resolve) {
              resolve(data)
            } else {
              this.treeData = data
            }
          }
        })
      },
      getNodeAjax(url, params) {
        return request({
          url: url,
          method: 'get',
          data: params
        })
      },
      getChecked(data) { // @todo checkbox 点击时候的回调
      },
      check(data, checkObj) {
        if (!this.multi) {
          Message.error('暂时不支持单选模式')
        }
      },
      sureMethod() {
        const halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes()
        const checkedNodes = this.$refs.tree.getCheckedNodes()
        checkedNodes.forEach(item => {
          item.checkedStatus = 'all'
        })
        // this.tempTextValue = endStr.substr(1, endStr.length)
        halfCheckedNodes.forEach(item => {
          item.checkedStatus = 'half'
        })
        this.tempDefaultValue = checkedNodes.concat(halfCheckedNodes)
        this.defaultValue = this.tempDefaultValue
        this.$emit('input', this.defaultValue)
        this.showTree = false
      },
      cancel() {
        if (this.multi) {
          this.tempDefaultValue = []
        } else {
          this.tempDefaultValue = ''
        }
        this.tempTextValue = ''
        this.showTree = false
      }
    }
  }
</script>
<style type="text/scss" lang="scss" scoped>
  .fe-el-tree {
    margin-top: 5px;
    margin-bottom: 5px;
    min-width: 220px;
    height: 300px;
    overflow: auto;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    margin-top: 10px;
    padding-top: 10px;
    .el-form-item {
      margin-bottom: 0px !important;
    }
  }

  .tree-button {
    margin-left: 56px;
    margin-top: 8px;
  }

  .fe-common-tree {
    width: unset;
    .el-form-item {
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

    .fe-input-content {
      width: 178px;
    }

  }
</style>
