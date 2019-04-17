import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, logout, getUserInfo } from '../../api/login'

const user = {
  state: {
    id: '',
    avatar: '',
    name: '',
    roles: [],
    menus: [],
    token: getToken(),
    introduction: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },
  actions: {
    LoginByName({ commit }, userInfo) {
      const userName = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(userName, userInfo.password).then(res => {
          const data = res.data
          const token = data.token
          setToken(token)
          commit('SET_TOKEN', token)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          if (!res.data) {
            reject('error')
          }
          const data = res.data
          commit('SET_ID', data.userId)
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          commit('SET_MENUS', data.menus)
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    LogOut({ commit }) {
      return Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
  }
}

export default user
