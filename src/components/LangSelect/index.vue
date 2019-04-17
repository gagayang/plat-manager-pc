<template>
    <el-dropdown trigger="click" class="international" @command="handlerSetLanguage">
        <div>
            <svg-icon icon-class="language" class-name="international-icon"></svg-icon>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="zh" :disabled="language === 'zh'">
                中文
            </el-dropdown-item>
            <el-dropdown-item command="en" :disabled="language === 'en'">
                英文
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<script>
    // @todo 循环
    import ElDropdown from "../../../node_modules/element-ui/packages/dropdown/src/dropdown.vue";
    import SvgIcon from "../SvgIcon/index.vue";
    import ElDropdownMenu from "../../../node_modules/element-ui/packages/dropdown/src/dropdown-menu.vue";
    import ElDropdownItem from "../../../node_modules/element-ui/packages/dropdown/src/dropdown-item.vue";

    export default {
        components: {
            ElDropdownItem,
            ElDropdownMenu,
            SvgIcon,
            ElDropdown},
        computed: {
            language() {
                return this.$store.getters.language
            }
        },
        methods: {
            handlerSetLanguage(lang) {
                this.$i18n.local = lang
                this.$store.dispatch('setLanguage', lang)
                this.$message({
                    message: 'switch language success', //@todo 国际化
                    type: 'success'
                })
            }
        }
    }
</script>
<style type="text/scss" lang="scss" scoped>

</style>