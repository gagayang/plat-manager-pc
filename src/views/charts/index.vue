<template>
    <div
            class="fe-dashboard"
    >
        <grid-layout
                :layout="layoutMessage"
                :col-num="colNum"
                :row-height="rowHeight"
                :is-draggable="false"
                :is-resizable="false"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
        >
            <grid-item
                    v-for="(item, $index) in items"
                    :x="layoutMessage[$index].x"
                    :y="layoutMessage[$index].y"
                    :w="layoutMessage[$index].w"
                    :key="$index"
                    :h="layoutMessage[$index].h"
                    :i="layoutMessage[$index].i"
            >
                <fe-chart
                        v-bind="item"
                        :allWidth="allWidth"
                        :width="getItemWidth(layoutMessage[$index])"
                        :height="getItemHeight(layoutMessage[$index])"
                >

                </fe-chart>
            </grid-item>
        </grid-layout>
    </div>
</template>
<script>
    import VueGridLayout from 'vue-grid-layout'
    const GridLayout = VueGridLayout.GridLayout
    const GridItem = VueGridLayout.GridItem
    import charts from '../../FromBase/chart.vue'
    import _ from 'lodash'
    export default {
        name: 'fe-dashboard',
        props: {
            items: {
                type: Array,
                required: true
            },
            layout: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                allWidth: null
            }
        },
        components: {
            GridLayout,
            GridItem,
            'fe-chart': charts
        },
        activated() {
            window.removeEventListener('resize', this.flush)
            window.addEventListener('resize', this.flush)
        },
        deactivated() {
            window.removeEventListener('resize', this.flush)
        },
        mounted() {
            window.removeEventListener('resize', this.flush)
            window.addEventListener('resize', this.flush)
        },
        beforeDestroy() {
            window.removeEventListener('resize')
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
        methods: {
            flush: _.throttle(function() {
                this.allWidth = this.$parent.$el.offsetWidth
            }, 400),
            getItemWidth(item) {
                const w = item.w
                const allWidth = this.$parent.$el.offsetWidth
                const everyWidth = allWidth / this.colNum
                return (w * everyWidth + 'px')
            },
            getItemHeight(item) {
                const h = item.h
                return (this.rowHeight * h + 'px')
            }
        }
    }
</script>

