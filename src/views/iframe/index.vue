<template>
    <div id="show-iframes" style="display: flex; flex: 1;">
        <div
                v-for="(item, index) in iframeData"
                :key="index"
                style="display: flex; flex: 1;"
                v-show="index === activeIndex"
        >
            <iframe
                    frameborder='0'
                    height='100%'
                    width='100%'
                    :src='getPath(item.path)'
            ></iframe>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    export default {
        name: 'fe-iframes',
        props: {
            activeIndex: {
                type: Number,
                default: -1
            }
        },
        computed: {
            ...mapState({
                'iframeData': state => state.app.iframeData
            })
        },
        data() {
            return {}
        },
        methods: {
            getPath(path) {
                path = path.substr(8)
                return decodeURIComponent(path)
            },
            encodeSearchKey(key) {
                const encodeArr = [{
                    code: '%',
                    encode: '%25'
                }, {
                    code: '?',
                    encode: '%3F'
                }, {
                    code: '#',
                    encode: '%23'
                }, {
                    code: '&',
                    encode: '%26'
                }, {
                    code: '=',
                    encode: '%3D'
                }]
                return key.replace(/[%?#&=]/g, ($, index, str) => {
                    for (const k of encodeArr) {
                        if (k.code === $) {
                            return k.encode
                        }
                    }
                })
            }
        }
    }
</script>
