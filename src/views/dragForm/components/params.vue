<template>
    <div class="form-container"
         :id="code"
    >
        <div
                ref="form-mask"
                class="form-mask"
                :code="code"
                :loading="loading"
        >
        </div>
        <div
                ref="form-warrper"
                :formCode="code"
                class="form-warrper"
        >
            <form-header
                    :title="title"
                    :buttons="buttons"
                    @button-method="buttonMethod"
                    @destroy="destroy"
            >
            </form-header>
            <form-body
                    :paramsModel="items"
                    v-model="submitData"
                    :resouceType="report = 'form'"
                    :code="code"
                    :script="script"
                    ref="formBody"
                    :formData="true"
                    :inForm="true"
                    :colNum="colNum"
                    :rowHeight="rowHeight"
                    :layout="layoutMessage"
            >
            </form-body>
        </div>
    </div>
</template>
<script>
    import reportHeader from '@/views/report/components/reportHeader.vue'
    import reportParams from './components/params.vue'
    import { getFromMetaData, submitForm, getFormData } from '@/api/form.js'
    import commonMixin from '../../../mixins/commonMixin'
    import helpService from '@/utils/manager'
    import _ from 'lodash'
    export default {
        name: 'drag-form',
        components: {
            'form-header': reportHeader,
            'form-body': reportParams
        },
        mixins: [commonMixin],
        beforeMount() {
            helpService.dealCss(this.code, this.css)
        },
        computed: {
            colNum() {
                return this.layout.config.colNum
            },
            rowHeight() {
                return this.layout.config.rowHeight
            },
            layoutMessage() {
                return this.layout.message
            }
        },
        props: {
            code: {
                type: String
            },
            title: String,
            items: Array,
            buttons: Array,
            path: String,
            css: '',
            script: '',
            layout: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                loading: false,
                loadingData: false,
                submitData: {},
                status: 'add',
                disable: false,
                dynamicWatches: [],
                inForm: true
            }
        },
        watch: {
            path: {
                handler(val) {
                    if (val) {
                        const method = this.$route.query && this.$route.query.method
                        if (method) {
                            const query = this.$route.query
                            let tempUrl = _.cloneDeep(val)
                            for (const i in query) {
                                tempUrl = _.replace(tempUrl, '{' + i + '}', query[i])
                            }
                            this.$nextTick(() => {
                                getFormData(tempUrl, this.$route.query).then((res) => {
                                    this.dealDetailData(res)
                                })
                            })
                            if (method === 'detail') {
                                this.disableAllInput()
                            }
                        }
                    }
                },
                immediate: true,
                deep: true
            },
            items: {
                handler() {
                    this.dealSubmitData()
                },
                immediate: true,
                deep: true
            }
        },
        beforDestroy() {
            this.dynamicWatches.forEach(unwatch => {
                unwatch()
            })
            helpService.removeScriptOrCss(this.code)
        },
        methods: {
            destroy() {
                this.$nextTick(() => {
                    this.$destroy()
                })
            },
            dealDetailData(res) {
                if (res.code === 0) {
                    this.submitData = res.data
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message,
                        showClose: true
                    })
                }
            },
            deactivated() {
                this.$destroy()
            },
            disableAllInput() {
                this.items.forEach((item) => {
                    this.$set(item, 'disabled', true)
                })
            },
            submitThisForm(event) {
                const params = _.merge({}, { code: this.code }, this.submitData, this.$route.query)
                submitForm(event.path, params).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '保存成功',
                            showClose: true
                        })
                        this.goBack()
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.$bus.$emit('refresh-grid')
                            }, 0)
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message,
                            showClose: true
                        })
                    }
                }).catch((error) => {
                    this.$message({
                        type: 'error',
                        message: error,
                        showClose: true
                    })
                })
            },
            getMeatData: function() {
                const params = {
                    code: this.code
                }
                getFromMetaData(params).then((res) => {
                    const data = res.data
                    const meta = data.meta
                    this.title = meta.title
                    this.items = meta.items
                    this.buttons = meta.buttons
                    this.dealSubmitData()
                    this.$nextTick(() => {
                        this.loading = false
                    })
                })
            },
            submitMethod(event) {
                this.$refs.formBody.confirm(event).then(() => {
                    this.submitThisForm(event)
                })
            },
            dealSubmitData() {
                const model = {}
                const textArr = []
                this.items.forEach((item, index) => {
                    model[item.name] = item.value || ''
                    if (item.inputModel === 'inputDia') {
                        textArr.push(item)
                    }
                })
                this.submitData = model
                this.$nextTick(() => {
                    this.$eventBus.$emit('textValue', textArr)
                })
            },
            buttonMethod(event) {
                const type = event.type
                this[type + 'Method'] && this[type + 'Method'](event)
            }
        }
    }
</script>

<style type="text/scss" lang="scss">

</style>
