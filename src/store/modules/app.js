import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    language: Cookies.get('language') || 'en',
    height: '',
    width: '',
    visitedMap: {},
    iframeData: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_HEIGHT: (state, height) => {
      state.height = height
    },
    SET_WIDTH: (state, width) => {
      state.width = width
    },
    SET_VISITED_MAP: (state, keyObj) => {
      if (!state.visitedMap[keyObj.key]) {
        state.visitedMap[keyObj.key] = keyObj.val
      }
    },
    ADD_IFRAME_DATA: (state, data) => {
      if (!state.iframeData.includes(data)) {
        state.iframeData.push(data)
      }
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setHeight({ commit }, height) {
      commit('SET_HEIGHT', height)
    },
    setWidth({ commit }, width) {
      commit('SET_WIDTH', width)
    },
    addVisitMap({ commit }, keyObj) {
      commit('SET_VISITED_MAP', keyObj)
    },
    addIframeData({ commit }, data) {
      commit('ADD_IFRAME_DATA', data)
    },
    addVisitedMap({ commit }, keyObj) {
      commit('SET_VISITED_MAP', keyObj)
    },
  }
}

export default app
