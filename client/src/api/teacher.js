import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const addTeacher = ({ instituteId, teacherName }) => {
  return axios.request({
    url: '/api/addTeacher',
    method: 'post',
    data: {
      instituteId,
      teacherName
    }
  })
}

export const getTeacher = (params) => {
  return axios.request({
    url: '/api/getTeacher',
    method: 'get',
    params: params
  })
}

export const getTeacherById = (teacherId) => {
  return axios.request({
    url: '/api/getTeacherById',
    method: 'get',
    params: {
      teacherId
    }
  })
}

export const getTeacherByInstituteId = (instituteId) => {
  return axios.request({
    url: '/api/getTeacherByInstituteId',
    method: 'get',
    params: {
      instituteId
    }
  })
}

export const editTeacher = (params) => {
  return axios.request({
    url: '/api/editTeacher',
    method: 'post',
    data: params
  })
}
