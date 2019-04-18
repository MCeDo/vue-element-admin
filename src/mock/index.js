import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import cateAPI from './cate'
import productAPI from './product'
import orderAPI from './order'
import commentAPI from './comment'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
// Mock.mock(/\/auth\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/auth\/user\/1\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', cateAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// cate
// Mock.mock(/\/shop\/cate/, 'get', cateAPI.getList)
// Mock.mock(/\/shop\/cate/, 'post', cateAPI.createCate)
// Mock.mock(/\/shop\/cate/, 'get', cateAPI.getCate)
// Mock.mock(/\/shop\/cate/, 'put', cateAPI.updateCate)

// 物品相关^[0-9]*$
// Mock.mock(/\/shop\/product/, 'get', productAPI.getList)
// Mock.mock(/\/shop\/product\/^[0-9]*$/, 'get', productAPI.getProduct)
// Mock.mock(/\/shop\/product/, 'post', productAPI.createProduct)
// Mock.mock(/\/shop\/product/, 'put', productAPI.updateProduct)

// 订单相关
// Mock.mock(/\/shop\/order/, 'get', orderAPI.getList)
// Mock.mock(/\/shop\/order\/^[0-9]*$/, 'get', orderAPI.getOrder)
// Mock.mock(/\/shop\/order/, 'post', orderAPI.createOrder)
// Mock.mock(/\/shop\/order/, 'put', orderAPI.updateOrder)

// 留言相关
// Mock.mock(/\/shop\/comment/, 'get', commentAPI.getList)
// Mock.mock(/\/shop\/comment\/^[0-9]*$/, 'get', commentAPI.getComment)
// Mock.mock(/\/shop\/comment/, 'post', commentAPI.createComment)
// Mock.mock(/\/shop\/comment/, 'put', commentAPI.updateComment)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

export default Mock
