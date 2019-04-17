<template>

  <el-table-column
    :label="title"
    :prop="name"
    v-if="!type"
    :align="align"
    :header-align="headerAlign"
    :fixed="fixed"
    :sortable="sortable"
    :formatter="format"
    :width="width"
  >
  </el-table-column>
  <el-table-column
    v-else-if="type === 'expand'"
    :header-align="headerAlign"
    type="expand"
  >
    <template slot-scope="props">
      <report-table
        v-if="columns.length > 0"
        ref="reportSubTable"
        :tableColumns="columns"
        :tableData="props.row.children"
        :paramsHeight="0"
        indexH="300px"
        reportCode="reportSubTable"
        :subTable="subsubTable"
      >
      </report-table>
      <div
        v-if="template!==''"
        v-html="template(props.row)"
      >
      </div>
    </template>
  </el-table-column>
  <el-table-column
    :label="title"
    :prop="name"
    :fixed="fixed"
    :align="align"
    :header-align="headerAlign"
    :formatter="format"
    :width="buttonWidth"
    v-else-if="type === 'button'"
  >
    <template
      slot-scope="scope"
      v-if="type === 'button'"
    >
      <el-button
        v-for="(button, idx) in buttons"
        v-if="buttonShow(scope.$index, scope.row, button)"
        :key="idx"
        size="mini"
        @click.native.prevent.stop="handleButton(idx, scope.row, button, searchData)">{{button.name}}
      </el-button>
    </template>
  </el-table-column>
  <el-table-column
    :label="title"
    :prop="name"
    :fixed="fixed"
    :align="align"
    :header-align="headerAlign"
    :width="width"
    v-else-if="type === 'alertconten' || type=== 'goRouter'"
  >
    <template
      slot-scope="scope"
    >
      <span  style="color: #5F995F;cursor: pointer;" @click.prevent.stop="alertconten(scope.$index, scope.row)">{{scope.row[name]}}</span>
    </template>
  </el-table-column>

  <el-table-column
    :type=type
    :label="title"
    :prop="name"
    :fixed="fixed"
    :align="align"
    :header-align="headerAlign"
    :width="width"
    v-else-if="type === 'radio'"
  >
    <template
      slot-scope="scope"
    >
      <el-radio style="cursor: pointer;" @change.native="radio(scope.$index, scope, scope.row)" v-model="radios" :label="getLabel(scope)">&nbsp;</el-radio>
    </template>
  </el-table-column>
  <el-table-column
    :type=type
    :label="title"
    :prop="name"
    :fixed="fixed"
    :align="align"
    :header-align="headerAlign"
    :width="width"
    v-else-if="type === 'image'"
  >
    <template
      slot-scope="scope"
    >
      <img style="height: 10vh; width:10vh; cursor: pointer;" :src="scope.row[name]" />
    </template>
  </el-table-column>
  <el-table-column
    :type=type
    :label="title"
    :prop="name"
    :fixed="fixed"
    :align="align"
    :header-align="headerAlign"
    :selectable="selectAble.bind(this)"
    :width="80"
    :reserve-selection="true"
    v-else-if="type === 'selection'"
  >
  </el-table-column>
  <el-table-column
    v-else-if="type === 'custom'"
    :type="type"
    :label="title"
    :prop="name"
    :fixed="fixed"
    :width="width"
    :align="align"
    :header-align="headerAlign"
    @addDataBack.native="addDa"
  >
    <template
      slot-scope="scope"
    >
      <custom-column
        :name="name"
        :index="scope.$index"
        :row="scope.row"
        :column="scope.column"
        :searchData="searchData"
        :event="event"
        @addDataBack="addDataBack"
      >&nbsp;</custom-column>
    </template>
  </el-table-column>
  <el-table-column
    v-else-if="type === 'expend'"
    :type="type"
    :label="title"
    :prop="name"
    :fixed="fixed"
    :width="width"
    :align="align"
    :header-align="headerAlign"
    @addDataBack.native="addDa"
  >
    <template
      slot-scope="scope"
    >
      <expend-column
        :name="name"
        :index="scope.$index"
        :row="scope.row"
        :column="scope.column"
        :event="event"
        @addDataBack="addDataBack"
      >&nbsp;</expend-column>
    </template>
  </el-table-column>
  <el-table-column
    v-else
    :type="type"
    :label="title"
    :prop="name"
    :fixed="fixed"
    :width="width"
    :align="align"
    :header-align="headerAlign"
  >
  </el-table-column>
</template>
<script>
    import customColumn from './base/customColumn.vue'
    import expendColumn from './base/expendColumn.vue'
    import Handlebars from 'handlebars'
    import operatorMixin from '../../../mixins/operatorMixin.js'

    export default {
        name: 'report-column',
        components: {
            'custom-column': customColumn,
            'expend-column': expendColumn
        },
        mixins: [operatorMixin],
        props: {
            fixed: {
                type: String
            },
            width: {
                type: String
            },
            hidden: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                defalut: ''
            },
            title: {
                type: String
            },
            name: {
                type: String
            },
            formatter: {
                type: String
            },
            align: {
                type: String,
                default: 'center'
            },
            buttons: {
                type: Array,
                defalut: []
            },
            sortable: {
                type: Boolean,
                default: false
            },
            isShow: {
                type: String
            },
            event: {
                type: Object
            },
            radioCheckedValue: {
                type: Object
            },
            radioIndex: {
                type: Number
            },
            headerAlign: {
                type: String
            },
            subTable: {
                type: Object,
                default() {
                    return {}
                }
            },
            selectable: {
                type: String
            }
        },
        data() {
            let temp = ''
            if (this.subTable && this.subTable.template) {
                temp = Handlebars.compile(this.subTable.template)
            }
            return {
                showTooltip: true,
                radios: this.radioIndex ? this.radioIndex : null,
                buttonWidth: this.buttons ? this.buttons.length * 100 : this.width,
                isShowSubTable: false,
                getMetaParams: {},
                columns: this.subTable && this.subTable.columns,
                gridData: [],
                subsubTable: this.subTable && this.subTable.subTable,
                loadingData: false,
                template: temp
            }
        },
        watch: {
            radioIndex: {
                handler(val) {
                    if (val) {
                        this.radios = val
                    }
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            selectAble(row, index) {
                if (this.selectable) {
                    if(this.select instanceof Function){
                        return this.select(row, index)
                    }else {
                        const Fn = Function
                        return new Fn('return ' + this.selectable)()(row, index)
                    }
                } else {
                    return true
                }
            },
            addDataBack(obj) {
                this.$emit('addDataBack', obj)
            },
            buttonShow(index, row, button) {
                if (button.isShow) {
                    if (button.isShow instanceof Function){
                        return button.isShow(index, row, button)
                    } else {
                        const Fn = Function
                        return new Fn('return ' + button.isShow)()(index, row, button)
                    }

                } else {
                    return true
                }
            },
            format(row, column, cellValue, index) {
                if (this.formatter) {
                    if (this.formatter instanceof Function){
                        return this.formatter(row, column, cellValue, index)
                    } else {
                        const Fn = Function
                        return new Fn('return ' + this.formatter)()(row, column, cellValue, index)
                    }
                } else {
                    if (typeof (cellValue) === 'number') {
                        return cellValue.toString().replace(/\d+/, function(n) { // 先提取整数部分
                            return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) { // 对整数部分添加分隔符
                                return $1 + ','
                            })
                        })
                    } else {
                        return cellValue
                    }
                }
            },
            defaultFormat(row, column, cellValue, index) {
                return cellValue
            },
            getType() {
                return this.type
            },
            getLabel(scope) {
                return scope.row.key
            },
            radio(index, scope, row) {
                switch (this.type) {
                    case 'radio':
                        this.radios = row.key
                        this.$emit('radioChecked', row)
                        this.$emit('radio', row)
                        break
                    default:
                        this.$emit('button-method', event)
                        break
                }
            }
        }
    }
</script>
<style type="text/scss" lang="scss" scoped="">
    .button-operator-area{
        float: right;
    }
</style>
