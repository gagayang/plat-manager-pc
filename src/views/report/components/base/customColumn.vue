<template>
    <div>
        <div
            v-if="exit"
            v-html="template"
            @click.stop="handleButton(index, row, {event: event}, searchData)"
        ></div>
        <div
            v-else
        >
            -
        </div>
        <el-dialog
            :title="title"
            :visible.sync="showDialog"
            width="75%"
            center>
            <report
                v-bind="meta"
                :isDialog="inDialog"
                :code="name"
                style="height: 600px"
                ref="customdialogReport"
            ></report>
        </el-dialog>
    </div>
</template>
<script>
    import Handlebars from 'handlebars'
    import operatorMixin from '../../../../mixins/operatorMixin'
    export default {
        name: 'custom-column',
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
            this.inDialog = true
            return {}
        },
        methods: {
        },
        computed: {
            template() {
                const template = this.event.template
                let message = ''
                if (template) {
                    const temp = Handlebars.compile(template)
                    message = temp(this.row)
                } else {
                    message = this.row[this.name]
                }
                return message
            },
            title() {
                return this.row[this.name]
            },
            exit() {
                if (this.row[this.name] && this.row[this.name] !== '-') {
                    return true
                } else {
                    return false
                }
            }
        }
    }
</script>
<style></style>
