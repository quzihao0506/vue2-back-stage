import axios from 'axios'
import { getToken } from './auth'
// import { Promise } from 'core-js'
// import { Message } from 'element-ui'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

request.interceptors.request.use(config => {
  const token = window.localStorage.getItem('hrsaas_hm__token')
  if (token) {
    config.headers['token'] = getToken()
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(response => {
  return response?.data
}, error => {
  // Message.error(error.message)
  return Promise.reject(error)
})

export default request
