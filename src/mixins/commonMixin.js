import { mapMutations, mapState, mapGetters } from 'vuex'

const commonMixin = {
    computed: {
        ...mapGetters([
            'visitedViews'
        ]),
        ...mapState({
            visitedMap: state => state.app.visitedMap
        })
    },
    methods: {
        ...mapMutations({
            delMySelf: 'DEL_VISITED_VIEWS'
        }),
        goBack(path) {
            this.distoryTagView(path)
        },
        getFromRouter(key) {
            return this.visitedMap[key]
        },
        isActive() {
            let activeItem
            this.visitedViews.forEach((item, index) => {
                if (item.path === this.$route.fullPath) {
                    activeItem = item
                }
            })
            return activeItem
        },
        distoryTagView(path) {
            const activeItem = this.isActive(this.$route)
            this.$store.dispatch('delVisitViews', activeItem)
            const lastView = this.visitedViews.slice(-1)[0]
            if (path) {
               this.$router.push({
                   'path': path
               })
            } else {
                const routerFrom =  this.getFromRouter(this.$route.path)
                if (routerFrom) {
                    this.$router.push(routerFrom)
                } else {
                    this.$route.push('/')
                }
            }
        }
    }
}

export default commonMixin
