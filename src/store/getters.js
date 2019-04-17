const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.app.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.id,
  menus: state => state.user.menus,
  roles: state => state.user.roles,
  introduction: state => state.user.introduction,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routers: state => state.permission.routers,
  errorLogs: state => state.errorLog.logs
}

export default getters
