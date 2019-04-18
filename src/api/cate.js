import request from '@/utils/request'

const SHOP_URL = '/shop'

export function getAll() {
  return request({
    // url: SHOP_URL+'/cate',
    url: '/shop/cate',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    // url: SHOP_URL+'/cate',
    url: '/shop/cate',
    method: 'get',
    params: query
  })
}

export function fetchCate(id) {
  return request({
    url: SHOP_URL + '/cate/' + id,
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

export function createCate(data) {
  return request({
    url: SHOP_URL + '/cate',
    method: 'post',
    data
  })
}

export function updateCate(data) {
  return request({
    url: SHOP_URL + '/cate',
    method: 'put',
    data
  })
}

export function deleteCate(id) {
  return request({
    url: SHOP_URL + '/cate/' + id,
    method: 'delete'
  })
}
