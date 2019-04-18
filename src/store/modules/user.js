import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getUserId, setUserId, getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    id: getUserId(),
    username: '',
    nickname: '',
    actualName: '',
    email: '',
    school: '',
    alipay: '',
    status: '',
    token: getToken(),
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: ''
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname
    },
    SET_ACTUALNAME: (state, actualName) => {
      state.actualName = actualName
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_SCHOOL: (state, school) => {
      state.school = school
    },
    SET_ALIPAY: (state, alipay) => {
      state.alipay = alipay
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.data.data
          // const data = response.data
          commit('SET_TOKEN', data.token)
          commit('SET_ID', data.userId)
          setToken(data.token)
          setUserId(data.userId)
          resolve()
        }).catch(error => {
          const resp = error.response
          console.log(error)
          reject()
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.id).then(response => {
          console.log(response)
          // 由于mockjs 不支持自定义状态码只能这样hack
          if (!response.data) {
            reject('Verification failed, please login again.')
          }
          const data = response.data
          commit('SET_ROLES', "['admin']")
          data.roles = ['admin']
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_USERNAME', data.username)
          // commit('SET_AVATAR', data.avatar)
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
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

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_USERNAME', data.username)
          commit('SET_AVATAR', data.avatar)
          commit('SET_EMAIL', data.email)
          commit('SET_ALIPAY', data.alipay)
          commit('SET_SCHOOL', data.school)
          commit('SET_NICKNAME', data.nickname)
          commit('SET_ACTUALNAME', data.actualname)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
