<template>
    <div>
        <template
            v-if="title"
        >
            <div
                @click.stop="handleButton(index, row, {event: event})"
                class="fe-expend-column"
            >
                <i
                    class="el-icon-arrow-right expend-arrow"
                    :class="{'is-open': isOpend}"
                ></i>{{title}}
            </div>
        </template>
    </div>
</template>

<script>
    import operatorMixin from '../../../../mixins/operatorMixin'
    export default {
        name: 'fe-expend-column',
        props: {
            row: Object,
            column: Object | String,
            index: Number,
            columnTemplate: String,
            event: Object,
            name: String
        },
        mixins: [operatorMixin],
        data() {
            return {
                isOpend: false
            }
        },
        watch: {
            row: {
                handler(val) {
                    if (val['subData_opened']) {
                        this.isOpend = true
                    } else {
                        this.isOpend = false
                    }
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            title() {
                return this.row[this.name]
            }
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    .fe-expend-column {
        .expend-arrow{
            transition: .3s ease-in-out;
            &.is-open{
                transform: rotate(90deg);
            }
        }
    }

</style>
