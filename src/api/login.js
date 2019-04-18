import request from '@/utils/request'

const AUTH_RUL = '/auth'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: AUTH_RUL + '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(id) {
  return request({
    url: AUTH_RUL + '/user/' + id,
    method: 'get'
  })
}

