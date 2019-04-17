import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from './auth'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5 * 1000,
  responseType: 'json',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Token'] = getToken()
    }
    return config
  },
  error => {
    console.error(error)
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    if( response.config.responseType === 'blob') {
      return response
    }
    if(response.data.code !== 0) {
      if(response.data.code === 2008) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: response.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.error(error)
    Message.error(error.message)
    return Promise.reject(error)
  }
)

export default service
