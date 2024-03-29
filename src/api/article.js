import request from '@/utils/request'

const AUTH_URL = '/auth'

export function fetchList(query) {
  return request({
    url: AUTH_URL + '/user',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: AUTH_URL + '/user/' + id,
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: AUTH_URL + '/user',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: AUTH_URL + '/user',
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: AUTH_URL + '/user/' + id,
    method: 'delete'
  })
}
