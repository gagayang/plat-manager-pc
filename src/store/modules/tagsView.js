const tagsViews = {
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, views) => {
      if (state.visitedViews.some(v => v.path === views.fullPath)) return
      state.visitedViews.push({
        name: views.meta.title,
        path: views.fullPath,
        title: views.meta.title || 'no-name',
        query: views.query
      })
      const history = _.find(state.cachedViews, v => v.path === views.fullPath)
      if(history) {
        history.key++
      } else {
        state.cachedViews.push({
          path: views.pullPath,
          key: 0
        })
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, i + 1)
          break
        }
      }
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      state.cachedViews = []
    },
    ADD_CACHED_VIEWS: (state, path) => {
      state.cachedViews.push(path)
    },
    DEL_CACHED_VIEWS: (state, view) => {
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    }
  },
  actions: {
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    addCachedViews({ commit }, path) {
      commit('ADD_CACHED_VIEWS', path)
    },
    delCachedViews({ commit, state }, path) {
      return new Promise((resolve) => {
        commit('DEL_CACHED_VIEWS', path)
        resolve([...state.cachedViews])
      })
    }
  }
}

export default tagsViews
