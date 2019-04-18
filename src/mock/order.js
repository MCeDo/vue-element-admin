import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 30

const baseContent = '<p>我是测试数据我是测试数据</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    productName: '闲置物品' + i,
    count: i,
    price: i,
    totalPrice: i,
    userId: '发布者',
    consignee: '广技师',
    phone: 'miao shu',
    pay: '标题',
    delivery: 9,
    address: 0,
    confirm: i,
    paidTime: '详细地址',
    deliveryTime: '@datetime',
    confirmTime: '@datetime',
    postalCode: i,
    // url: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80',
    createdTime: '@datetime',
    updateTime: '@datetime'
  }))
}

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      records: pageList
    }
  },
  getPv: () => ({
    pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
  }),
  getOrder: (config) => {
    const { id } = param2Obj(config.url)
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createOrder: () => ({
    data: 'success'
  }),
  updateOrder: () => ({
    data: 'success'
  })
}
