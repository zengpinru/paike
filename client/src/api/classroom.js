import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const addClassroom = ({ classroomNum, classroomCapacity }) => {
  return axios.request({
    url: '/api/addClassroom',
    method: 'post',
    data: {
      classroomNum,
      classroomCapacity
    }
  })
}

export const getClassroom = (params) => {
  return axios.request({
    url: '/api/getClassroom',
    method: 'get',
    params: params
  })
}

export const getClassroomById = (classroomId) => {
  return axios.request({
    url: '/api/getClassroomById',
    method: 'get',
    params: {
      classroomId
    }
  })
}

export const getAllClassroom = () => {
  return axios.request({
    url: '/api/getAllClassroom',
    method: 'get'
  })
}

export const editClassroom = (params) => {
  return axios.request({
    url: '/api/editClassroom',
    method: 'post',
    data: params
  })
}
