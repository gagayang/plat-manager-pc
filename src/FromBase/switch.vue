<template>
  <div class="fe-switch">
    <el-form-item
      :label="endTitle | capitalize"
    >
      <el-switch
        v-model="defaultValue"
        :disabled="disabled"
        ref="input"
      ></el-switch>
    </el-form-item>
  </div>
</template>
<script>
  import baseMixin from './mixin/baseMixin'

  export default {
    name: 'fe-switch',
    mixins: [baseMixin],
    props: {
      value: {
        type: String | Array | Boolean
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
<style type="text/scss" lang="scss" scoped>
  .el-form-item {
    margin-bottom: 0px !important;
  }
</style>
