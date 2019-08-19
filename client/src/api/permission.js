import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const getPermissionRules = () => {
  return axios.request({
    url: '/api/getPermissionRules',
    method: 'get'
  })
}

export const addPagePermission = (data) => {
  return axios.request({
    url: '/api/addPagePermission',
    method: 'post',
    data: data
  })
}

export const getPagePermission = () => {
  return axios.request({
    url: '/api/getPagePermission',
    method: 'get'
  })
}

export const getPagePermissionById = (pagePermissionId) => {
  return axios.request({
    url: '/api/getPagePermissionById',
    method: 'get',
    params: {
      pagePermissionId
    }
  })
}

export const addRole = (data) => {
  return axios.request({
    url: '/api/addRole',
    method: 'post',
    data: data
  })
}

export const getRole = () => {
  return axios.request({
    url: '/api/getRole',
    method: 'get'
  })
}

export const getRolePermission = (roleId) => {
  return axios.request({
    url: '/api/getRolePermission',
    method: 'get',
    params: {
      roleId
    }
  })
}
