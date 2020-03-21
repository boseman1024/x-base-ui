import Vue from 'vue'
import { login, getInfo, logout,refreshToken } from '@/api/login'
import { ACCESS_TOKEN,REFRESH_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    refreshToken:'',
    nickname: '',
    username:'',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    dept:{}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_NAME: (state, { nickname, welcome }) => {
      state.nickname = nickname
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_DEPT: (state, dept) => {
      state.dept = dept
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          Vue.ls.set(ACCESS_TOKEN, response.access_token, 60 * 60 * 1000)
          Vue.ls.set(REFRESH_TOKEN, response.refresh_token, 6 * 60 * 60 * 1000)
          commit('SET_TOKEN', response.access_token)
          commit('SET_REFRESH_TOKEN',response.refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 刷新Token
    RefreshToken ({ commit }) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refreshToken).then(response => {
          Vue.ls.set(ACCESS_TOKEN, response.access_token, 60 * 60 * 1000)
          Vue.ls.set(REFRESH_TOKEN, response.refresh_token, 6 * 60 * 60 * 1000)
          commit('SET_TOKEN', response.access_token)
          commit('SET_REFRESH_TOKEN',response.refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data.roleList.length>0 && data.menuList.length > 0) {
            
            commit('SET_ROLES', data.roleList)
            commit('SET_INFO', data)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_USERNAME', data.sysUser.username)
          commit('SET_NAME', { nickname: data.sysUser.nickname, welcome: welcome() })
          commit('SET_AVATAR', data.sysUser.avatar)
          commit('SET_DEPT', data.dept)

          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
          Vue.ls.remove(REFRESH_TOKEN)
          resolve()
/*        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          
        })*/
      })
    }

  }
}

export default user
