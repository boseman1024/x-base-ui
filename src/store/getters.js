const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  welcome: state => state.user.welcome,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  lang: state => state.i18n.lang,

  token: state => state.user.token,
  dept: state => state.user.dept,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  nickname: state => state.user.nickname,
  roles: state => state.user.roles,
  userInfo: state => state.user.info
}

export default getters
