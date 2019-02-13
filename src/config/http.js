import axios from 'axios'
import {Message} from 'element-ui'

const http = axios.create({
  baseURL: 'http://183.221.192.58:38081/ccpit',
  timeout: 10 * 1000
})

http.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

http.interceptors.response.use((respoens) => {
  return respoens.data
}, (error) => {
  console.log(error)
  if (error && error.response) {
    switch (error.response.status) {
      case 500:
        Message.error('服务器繁忙')
        break
    }
  } else {
    Message.error('连接超时，请刷新页面')
  }
})

http.all = axios.all
// 定义插件的配置来扩展 Vue 本身
const httpPlugin = {}
httpPlugin.install = function (Vue, options) {
  Vue.prototype.$http = http
}
export let $http = http
export default httpPlugin
