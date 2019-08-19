import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const getTerm = () => {
  return axios.request({
    url: '/api/getTerm',
    method: 'get'
  })
}

export const editTerm = (termName) => {
  return axios.request({
    url: '/api/editTerm',
    method: 'post',
    data: {
      termName
    }
  })
}

export const addTeachTask = (data) => {
  return axios.request({
    url: '/api/addTeachTask',
    method: 'post',
    data: data
  })
}

export const getTeachTask = (params) => {
  return axios.request({
    url: '/api/getTeachTask',
    method: 'get',
    params
  })
}

export const getTeachTaskByTerm = () => {
  return axios.request({
    url: '/api/getTeachTaskByTerm',
    method: 'get'
  })
}

export const deleteTeachTask = (teachTaskId) => {
  return axios.request({
    url: '/api/deleteTeachTask',
    method: 'post',
    data: {
      teachTaskId
    }
  })
}

export const deleteTeachTasks = (teachTaskIdArr) => {
  return axios.request({
    url: '/api/deleteTeachTasks',
    method: 'post',
    data: {
      teachTaskIdArr
    }
  })
}
