import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

console.log(store)

const whiteMenu = ['/login']
console.log(store)

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if(to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.userId.length === 0) {
        store.dispatch('GetUserInfo').then(res => {
          const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            // router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(res => {
            Message.error('登录失效，请重新登录') //@todo 这里需要国际化
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (~whiteMenu.indexOf(to.path)) {
      next()
    } else {
      next(`/login?reirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
