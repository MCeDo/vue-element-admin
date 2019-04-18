import request from '@/utils/request'

const SHOP_URL = '/shop'

export function fetchList(query) {
  return request({
    url: SHOP_URL + '/order',
    method: 'get',
    params: query
  })
}

export function fetchOrder(id) {
  return request({
    url: SHOP_URL + '/order/' + id,
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

export function createOrder(data) {
  return request({
    url: SHOP_URL + '/order',
    method: 'post',
    data
  })
}

export function updateOrder(data) {
  return request({
    url: SHOP_URL + '/order',
    method: 'put',
    data
  })
}

export function deleteOrder(id) {
  return request({
    url: SHOP_URL + '/order/' + id,
    method: 'delete'
  })
}
