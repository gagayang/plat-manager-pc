<template>
  <div class="fe-double-data-picker">
    <el-form-item
      :label="endTitle | capitalize"
      :class="{'is-required': isRequired }"
    >
      <el-date-picker
        v-model="defaultValue"
        :range-separator="rangeSeparator"
        :start-placeholder="startPlaceholder"
        :end-placeholder="endPlaceholder"
        :default-time="['00:00:00', '23:59:59']"
        :value-format="format"
        :type="dateType"
        :disabled="disabled"
        ref="input"
        :picker-options="dataOptions"
        class="fe-double-data-picker-input-content"
        style="width: 178px"
      >
      </el-date-picker>
      <!--<div-->
      <!--class="el-form-item__error error_input"-->
      <!--v-if="inForm && $v.defaultValue.$error"-->
      <!--&gt;{{errorMessage}}-->
      <!--</div>-->
    </el-form-item>
  </div>
</template>
<script>
  import validateMixin from './mixin/validateMixin'
  import moment from 'moment'
  import baseMixin from './mixin/baseMixin'
  import _ from 'lodash'

  export default {
    name: 'fe-double-date-picker',
    mixins: [validateMixin, baseMixin],
    props: {
      format: {
        type: String,
        default: 'yyyy-MM-dd HH:mm:ss'
      },
      rangeSeparator: String,
      startPlaceholder: String,
      endPlaceholder: String,
      isArray: false,
      value: {
        type: Object | Array
      },
      quickCard: {
        type: Object
      }
    },
    methods: {
      setDateRange(newDate) {
        let maxValue = (this.validate && this.validate.maxValue) || ''
        let minValue = (this.validate && this.validate.minValue) || ''
        if (this.quickCard) {
          const nowMax = moment()
          const nowMin = moment()
          const years = this.quickCard.years
          const months = this.quickCard.months
          const days = this.quickCard.days
          let beforeFlag = false
          let afterFlag = false
          if (years && !_.isEmpty(years)) {
            const before = years.before
            const after = years.after
            if (before !== undefined) {
              beforeFlag = true
              nowMin.subtract(before, 'years')
            }
            if (after !== undefined) {
              afterFlag = true
              nowMax.add(after, 'years')
            }
            /* nowMin.subtract(before, 'years')
             nowMax.add(after, 'years') */
          }
          if (months && !_.isEmpty(months)) {
            const before = months.before
            const after = months.after
            if (before !== undefined) {
              beforeFlag = true
              nowMin.subtract(before, 'months')
            }
            if (after !== undefined) {
              afterFlag = true
              nowMax.add(after, 'months')
            }
          }
          if (days && !_.isEmpty(days)) {
            const before = days.before
            const after = days.after
            if (before !== undefined) {
              beforeFlag = true
              nowMin.subtract(before, 'days')
            }
            if (after !== undefined) {
              afterFlag = true
              nowMax.add(after, 'days')
            }
          }
          if (beforeFlag) {
            minValue = nowMin
          }
          if (afterFlag) {
            maxValue = nowMax
          }
        }
        if (maxValue && minValue) {
          const max = moment(maxValue)
          const min = moment(minValue)
          return !((max > moment(newDate)) && moment(newDate) > min)
        } else if (maxValue) {
          const max = moment(maxValue)
          return !(max > moment(newDate))
        } else if (maxValue) {
          const min = moment(newDate)
          return !(moment(newDate) > min)
        } else {
          if (this.limit === 1) {
            return newDate.getTime() < (Date.now() - 86400000)
          } else {
            return false
          }
        }
      }
    },
    computed: {
      endTitle() {
        if (this.hasLabel) {
          return this.title
        } else {
          return ''
        }
      }
    },
    data() {
      this.dataOptions = {
        disabledDate: this.setDateRange,
        firstDayOfWeek: 1
      }
      return {
        defaultValue: [],
        dateType: 'datetimerange',
        defaultTime: ['00:00:00', '24:00:00']
      }
    },
    watch: {
      value: {
        handler(val) {
          if (val && val.start && val.end) {
            this.defaultValue[0] = val.start
            this.defaultValue[1] = val.end
          } else {
            this.defaultValue = null
          }
        },
        deep: true,
        immediate: true
      },
      defaultValue(val) {
        let retObj = {start: '', end: ''}
        if (val instanceof Array) {
          retObj.start = val[0]
          retObj.end = val[1]
        } else {
          retObj = val
        }
        this.$emit('input', retObj)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .fe-double-data-picker {
    width: unset;
    margin-top: 5px;
    margin-bottom: 5px;
    label {
      font-size: 14px;
      width: 100px;
      line-height: 30px;
      display: inline-block;
    }
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
    .fe-double-data-picker-input-content {
      width: 178px;
    }
  }
</style>
