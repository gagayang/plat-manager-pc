<template>
    <div class="tab-container">
        <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card">
            <el-tab-pane v-for="item in tabMapOptions" :label="item.name" :key='item.name' :name="item.name">
                <keep-alive :key="item.name">
                    <fe-tab-panel
                            v-bind="item"
                    >
                    </fe-tab-panel>
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import { getConfig } from '../../api/tab.js'
    import panel from './components/panel.vue'
    export default {
        name: 'fe-tabs',
        props: {
            code: {
                type: String
            }
        },
        components: {
            'fe-tab-panel': panel
        },
        data() {
            return {
                tabMapOptions: [],
                activeName: ''
            }
        },
        computed: {
        },
        watch: {
            code: {
                handler(val) {
                    this.$nextTick(() => {
                        this.getMetaData()
                    })
                },
                deep: true,
                immediate: true
            },
            tabMapOptions: {
                handler(val) {
                    if (val && val.length > 0) {
                        val.forEach(option => {
                            if (option.active) {
                                this.activeName = option.name
                            }
                        })
                    }
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            getMetaData() {
              debugger
                getConfig(this.code).then(res => {
                    if (res.code === 0) {
                        this.tabMapOptions = res.data
                    }
                })
            }
        }
    }
</script>
<style lang="sass">

</style>
