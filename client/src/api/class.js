import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const addClass = (data) => {
  return axios.request({
    url: '/api/addClass',
    method: 'post',
    data: data
  })
}

export const getClass = (params) => {
  return axios.request({
    url: '/api/getClass',
    method: 'get',
    params: params
  })
}

export const getClassById = (classId) => {
  return axios.request({
    url: '/api/getClassById',
    method: 'get',
    params: {
      classId
    }
  })
}

export const editClass = (data) => {
  return axios.request({
    url: '/api/editClass',
    method: 'post',
    data: data
  })
}

export const getClassYearByInstituteId = (instituteId) => {
  return axios.request({
    url: '/api/getClassYearByInstituteId',
    method: 'get',
    params: {
      instituteId
    }
  })
}

export const getClassForTeachTask = ({ instituteId, classYear }) => {
  return axios.request({
    url: '/api/getClassForTeachTask',
    method: 'get',
    params: {
      instituteId,
      classYear
    }
  })
}
