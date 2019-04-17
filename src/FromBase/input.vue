<template>
  <div class="fe-input">
    <el-form-item
      :label="endTitle | capitalize"
      :class="{ 'form-group--error': $v.defaultValue.$error, 'is-required': isRequired }"
    >
      <el-input
        :placeholder="placeholder"
        :prefix-icon="icon"
        ref="input"
        v-model="defaultValue"
        class="fe-input-content"
        :disabled="disabled"
        @blur="triggerVaildate"
      ></el-input>
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

  export default {
    name: 'fe-input',
    mixins: [validateMixin, baseMixin],
    props: {
      value: {
        type: String | Number
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
<style rel="stylesheet/scss" lang="scss">
  #app {
    .form-group--error {
      .el-form-item__content {
        .el-input__inner {
          border-color: #F08047 !important;
        }
        .fe-input-content, .fe-select-content, .fe-single-data-picker-input-content, .fe-double-data-picker-input-content, .fe-text-content {
          .el-input__inner, .el-textarea__inner {
            border-color: #F08047 !important;
          }
        }
      }
    }
  }

  .error_input {
    width: 178px;
  }

  .fe-input {
    margin-top: 5px;
    margin-bottom: 5px;
    width: unset;
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

    .fe-input-content {
      width: 178px;
    }

  }
</style>
