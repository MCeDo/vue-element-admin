import request from '@/utils/request'

const SHOP_URL = '/shop'

export function fetchList(query) {
  return request({
    url: SHOP_URL + '/product',
    method: 'get',
    params: query
  })
}

export function fetchProduct(id) {
  return request({
    url: SHOP_URL + '/product/' + id,
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

export function createProduct(data) {
  return request({
    url: SHOP_URL + '/product',
    method: 'post',
    data
  })
}

export function createProductPic(data) {
  return request({
    url: SHOP_URL + '/product/pic',
    method: 'post',
    data
  })
}

export function deleteProductPic(id) {
  return request({
    url: SHOP_URL + '/product/pic/' + id,
    method: 'delete'
  })
}

export function updateProduct(data) {
  return request({
    url: SHOP_URL + '/product',
    method: 'put',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: SHOP_URL + '/product/' + id,
    method: 'delete'
  })
}
