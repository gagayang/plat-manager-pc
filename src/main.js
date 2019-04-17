import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import '@/styles/index.scss'
import Vuelidate from 'vuelidate'
import App from './App'
import report from '../src/views/report/index.vue'
import table from '../src/views/report/components/reportTable.vue'
import form from '../src/views/baseForm/index.vue'

import router from './router'
import store from './store'
import i18n from './lang'

import './errorLog'
import './permission'
import './icons'

Vue.component('base-form', form)
Vue.component('report', report)
Vue.component('report-table', table)

Vue.use(ElementUI, {
        size: 'medium',
        i18n: (key, value) => i18n.t(key, value)
    }
)
Vue.use(Vuelidate)
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: { App }
})
