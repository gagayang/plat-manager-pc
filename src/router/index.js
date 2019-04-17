import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout/Layout'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    hidden: false,
    alwaysShow: false,
    children: [
      {
        path: '/config/:path',
        component: () => import('@/views/config/index'),
        name: '统一管理入口',
        hidden: true,
        alwaysShow: false,
        props: true
      }
    ]
  },
  {
    path: '/tab',
    component: Layout,
    hidden: false,
    alwaysShow: false,
    children: [
      {
        path: '/tab/:code',
        component: () => import('@/views/tab/index'),
        name: 'tab签布局',
        hidden: true,
        alwaysShow: false,
        props: true
      }
    ]
  },
  {
    path: 'iframe',
    component: Layout,
    hidden: false,
    alwaysShow: false,
    children: [
      {
        path: '/iframe/:path',
        component: () => import('@/views/iframe/index'),
        name: 'iframe',
        hidden: true,
        alwaysShow: false,
        props: true
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    hidden: false,
    alwaysShow: false,
    children: [
      {
        path: '/report/:code',
        component: () => import('@/views/report/index'),
        name: '报表管理',
        hidden: true,
        alwaysShow: false,
        props: true
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    hidde: false,
    alwaysShow: false,
    children: [
      {
        path: '/form/:code',
        component: () => import('@/views/baseForm/index'),
        name: '标准表单',
        hidden: true,
        alwaysShow: false,
        props: true
      }
    ]
  },
  {
    path: '/dragForm',
    component: Layout,
    hidden: false,
    alwaysShow: false,
    children: [
      {
        path: '/dragForm',
        component: () => import('@/views/dragForm/index'),
        name: '布局表单',
        hidden: true,
        alwaysShow: false,
        props: true
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
