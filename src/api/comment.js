import request from '@/utils/request'

const SHOP_URL = '/shop'

export function fetchList(query) {
  return request({
    url: SHOP_URL + '/comment',
    method: 'get',
    params: query
  })
}

export function fetchComment(id) {
  return request({
    url: SHOP_URL + '/comment/' + id,
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

export function createComment(data) {
  return request({
    url: SHOP_URL + '/comment',
    method: 'post',
    data
  })
}

export function updateComment(data) {
  return request({
    url: SHOP_URL + '/comment',
    method: 'put',
    data
  })
}

export function deleteComment(id) {
  return request({
    url: SHOP_URL + '/comment/' + id,
    method: 'delete'
  })
}
