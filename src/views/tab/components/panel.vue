<template>
    <div>
        <template
                v-if="configKey"
        >
            <fe-common
                    :path="configKey"
            ></fe-common>
        </template>
        <template
                v-else
        >
            <div refs="root">
                <component
                        :is="componentName"
                ></component>
            </div>
        </template>
    </div>

</template>
<script>
    import FeCommon from '@/views/config/index.vue'
    export default {
        name: 'fe-tab-panel',
        props: {
            path: String,
            configKey: String
        },
        components: {
            'fe-common': FeCommon
        },
        data() {
            return {
                componentName: ''
            }
        },
        watch: {
            path: {
                handler(val) {
                    if (val) {
                        this.getHtmlDom()
                    }
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            getHtmlDom() {
                const routes = this.$router.options.routes
                routes.forEach((route) => {
                    if (route.path === this.path) {
                        this.componentName = route.component
                    }
                })
            }
        }
    }
</script>
