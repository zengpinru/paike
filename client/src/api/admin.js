import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const login = ({ username, password }) => {
  return axios.request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export const authorization = (adminName) => {
  return axios.request({
    url: '/api/authorization',
    method: 'get',
    params: {
      adminName
    }
  })
}

export const addAdmin = (data) => {
  return axios.request({
    url: '/api/addAdmin',
    method: 'post',
    data: data
  })
}

export const getAdmin = () => {
  return axios.request({
    url: '/api/getAdmin',
    method: 'get'
  })
}

export const changePwd = (data) => {
  return axios.request({
    url: '/api/changePwd',
    method: 'post',
    data: data
  })
}
