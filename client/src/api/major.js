import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const addMajor = ({ instituteId, majorName }) => {
  return axios.request({
    url: '/api/addMajor',
    method: 'post',
    data: {
      instituteId,
      majorName
    }
  })
}

export const getMajor = (params) => {
  return axios.request({
    url: '/api/getMajor',
    method: 'get',
    params: params
  })
}

export const getMajorNoWhere = () => {
  return axios.request({
    url: '/api/getMajorNoWhere',
    method: 'get'
  })
}

export const getMajorById = (majorId) => {
  return axios.request({
    url: '/api/getMajorById',
    method: 'get',
    params: {
      majorId
    }
  })
}

export const editMajor = (params) => {
  return axios.request({
    url: '/api/editMajor',
    method: 'post',
    data: params
  })
}
