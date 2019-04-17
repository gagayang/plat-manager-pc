<template>
    <div class="block"
         style="text-align: right;display: flex;flex-direction: row;justify-content: flex-end;overflow:hidden;">
        <el-pagination
                style="text-align:right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page=currentPage
                :page-sizes=pageSizes
                :page-size=pageSize
                :layout=layout
                :total=total>
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'reportPagination',
        data() {
            return {
            }
        },
        props: {
            currentPage: {
                type: Number
            },
            pageSize: {
                type: Number
            },
            layout: {
                type: String
            },
            pageSizes: {
                type: Array
            },
            total: {
                type: Number
            }
        },
        methods: {
            handleSizeChange(val) {
                this.$emit('sizeChange', val)
            },
            handleCurrentChange(val) {
                this.$emit('currentChange', val)
            }
        }

    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped></style>
