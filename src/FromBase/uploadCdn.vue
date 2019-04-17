<template>
  <div class="UploadCdn" style="width: 370px;">
    <label v-if="hasLabel">{{title}}</label>
    <div>
      <el-input v-model="saveurl" disabled size="small" :placeholder="placeholder" style="width:250px"></el-input>
      <div style="display: block;margin-top: 10px;">

        <el-button v-if="saveurl" size="small" style="margin-left: 10px;margin-right:10px" @click="imgShow">预览
        </el-button>
        <el-upload
          class="upload-demo"
          style="display: inline-block"
          :action="action"
          :limit="limit"
          name="file"
          :accept="action"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeupload"
          :show-file-list="false"
        >
          <span v-if="!disabled && !saveurl" style="color: #606266;font-size: 12px">{{fileName}}</span>
          <el-button size="small" v-if="!disabled && !saveurl">选择</el-button>
        </el-upload>
        <el-button v-if="!disabled && !saveurl" size="small" @click="onSubmit()">上传</el-button>
        <el-button :disabled="disabled" size="small" icon="el-icon-delete" style="margin-left: 0"
                   @click="clearFile()"></el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import {Message} from 'element-ui'

  export default {
    name: 'UploadCdn',
    components: {},
    props: {
      name: {
        type: String,
        required: true
      },
      code: String,
      accept: {
        type: String,
        default: '.jpg,.jpeg,.png'
      },
      limit: {
        type: Number,
        default: 1
      },
      action: {
        type: String,
        default: 'http://192.168.60.250:3050/upload/picture/'
      },
      placeholder: {
        type: String,
        default: '请选择文件上传'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      typePage: {
        type: String
      },
      value: {
        type: String
      },
      title: {
        type: String
      },
      hasLabel: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        saveurl: '', // 传出的value值
        fileName: '',
        formData: ''
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
    watch: {
      value: {
        handler(val) {
          this.saveurl = val
        },
        deep: true,
        immediate: true
      },
      saveurl(val) {
        this.$emit('input', val)
      }
    },
    methods: {
      onSubmit() {
        if (!this.fileName) {
          Message({
            message: '请选择图片',
            type: 'warning',
            duration: 5 * 1000
          })
          return false
        }
        axios({
          method: 'post',
          url: 'https://upload.winhxd.com/crm/uploadResource2CDNAction.do?method=addRecordNewJson',
          data: this.formData
        }).then((res) => {
          var data = res.data
          if (typeof data === 'string' && data.indexOf('存在') !== -1) {
            Message({
              message: '该文件名已存在',
              type: 'warning',
              duration: 5 * 1000
            })
            this.fileName = ''
            return
          }
          if (data.path) {
            this.saveurl = data.path
          } else {
            Message({
              message: '上传失败，请重新上传',
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
      },
      clearFile() {
        this.saveurl = ''
        this.fileName = ''
      },
      beforeupload(file) {
        this.fileName = file.name
        var formData = new FormData()
        // 名称是file
        formData.append('file', file)
        formData.append('grp', 'hsc')
        formData.append('retValue', '')
        formData.append('jmValue', '')
        formData.append('autoGenThumbailFlag', '1')
        // formData.append('jmFlag', "1")
        formData.append('isModify', '1')
        this.formData = formData
        return false
      },
      uploadSuccess(res) {
        console.log(res)
        const {code, data, message} = res
        if (code !== 0) {
          this.$message(message)
        } else {
          this.$message('上传成功')
          this.saveurl = data.url
        }
      },
      uploadError() {
        this.$message('上传失败')
      },
      submit(res) {
        console.log(res)
      },
      imgShow() {
        window.open(this.saveurl)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .UploadCdn {
    display: flex;
    align-items: top;
    flex-wrap: wrap;
    margin-top: 5px;
    margin-bottom: 5px;
    .el-form-item {
      margin-bottom: 0px !important;
    }
    label {
      display: inline-block;
      width: 120px;
      line-height: 36px;
      text-align: right;
      font-size: 14px;
      font-style: normal;
      padding-right: 12px;
      color: #606266
    }
    & /deep/ .el-upload-list {
      display: none
    }
  }
</style>
