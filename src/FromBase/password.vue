<template>
  <div class="fe-password">
    <el-form-item
      :label="endTitle | capitalize"
      :class="{ 'form-group--error': $v.defaultValue.$error, 'is-required': isRequired }"
    >
      <el-input
        :placeholder="placeholder"
        ref="input"
        v-model="defaultValue"
        class="fe-input-content"
        :disabled="disabled"
        @blur="triggerVaildate"
        :type="passwordType"
      ></el-input>
      <span class="show-pwd"
            @click="showPwd"
      >
        <i :class="icon"/>
      </span>
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
    name: 'fe-password',
    mixins: [validateMixin, baseMixin],
    props: {
      icon: {
        type: String,
        default() {
          return 'el-icon-view'
        }
      },
      value: {
        type: String | Number
      }
    },
    data() {
      return {
        defaultValue: '',
        passwordType: 'password'
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
    },
    methods: {
      showPwd() {
        if (this.passwordType) {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
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

  .error_input {
    width: 178px;
  }

  .fe-password {
    margin-top: 5px;
    margin-bottom: 5px;
    width: unset;
    .el-form-item {
      margin-bottom: 0px !important;
      position: relative;
      .el-form-item__content {
        .fe-input-content > input {
          padding-right: 20px;
        }
        .show-pwd {
          position: absolute;
          top: 0px;
          right: 6px;
        }
      }
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
