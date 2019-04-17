<template>
  <div class="fe-text">
    <el-form-item
      :label="endTitle | capitalize"
      :class="{ 'form-group--error': $v.defaultValue.$error, 'is-required': isRequired }"
    >
      <el-input
        type="textarea"
        :placeholder="placeholder"
        :prefix-icon="icon"
        v-model="defaultValue"
        :rows="rows"
        class="fe-text-content"
        :disabled="disabled"
        @blur="triggerVaildate"
        ref="input"
      ></el-input>
      <div
        class="el-form-item__error error_input"
        v-if="$v.defaultValue.$error"
      >{{errorMessage}}
      </div>
    </el-form-item>
  </div>
</template>
<script>
  import validateMixin from './mixin/validateMixin'
  import baseMixin from './mixin/baseMixin'

  export default {
    name: 'fe-text',
    mixins: [validateMixin, baseMixin],
    props: {
      rows: {
        type: String,
        default: '4'
      },
      value: {
        type: String | Array
      }
    },
    data() {
      return {
        defaultValue: ''
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
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .fe-text {
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
    }

    .fe-text-content {
      width: 178px;
    }

  }
</style>
