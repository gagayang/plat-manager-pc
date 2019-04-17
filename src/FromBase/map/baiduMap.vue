<template>
    <ve-bmap
            :settings="chartSettings"
            :series="chartSeries"
            :tooltip="chartTooltip"
            :event="event"
            :width="width"
            :height="height"
    >
    </ve-bmap>
</template>
<script>
    import VeMap from 'v-charts/lib/bmap.common'
    export default {
        name: 'fe-baiduMap',
        components: {
            've-bmap': VeMap
        },
        props: {
            settings: {
                type: Object,
                default() {
                    return {}
                }
            },
            event: {
                type: Object,
                default() {
                    return {}
                }
            },
            width: {
                type: String,
                required: true
            },
            height: {
                type: String,
                required: true
            }
        },
        data() {
            this.chartTooltip = { show: true }
            this.chartSettings = {
                key: 'oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK',
                bmap: {
                    center: [120, 30],
                    zoom: 14,
                    roam: true,
                    mapStyle: {}
                }
            }
            return {
                chartSeries: [
                    {
                        type: 'scatter',
                        coordinateSystem: 'bmap',
                        data: [
                            [120, 30, 1]
                        ]
                    }
                ]
            }
        }
    }
</script>
