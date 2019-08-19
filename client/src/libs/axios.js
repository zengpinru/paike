import axios from 'axios'
import { getToken } from '@/libs/util.js'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://139.199.90.62:8888'

class HttpRequest {
  constructor (baseURL = baseUrl) {
    this.baseURL = baseURL
    this.queue = {}
  }
  /**
   * 获取全局配置
   */
  getInsideConfig () {
    const config = {
      baseURL: this.baseURL,
      withCredentials: true
    }
    return config
  }
  interceptors (instance) {
    // 请求拦截器
    instance.interceptors.request.use(config => {
      config.headers['Authorization'] = getToken()
      console.log('config', config)
      return config
    }, err => {
      return Promise.reject(err)
    })
    // 响应拦截器
    instance.interceptors.response.use(res => {
      return res.data
    }, err => {
      return Promise.reject(err)
    })
  }
  request (options) {
    const instance = axios.create()
    // 合并配置项
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance)
    return instance(options)
  }
}

export default HttpRequest
