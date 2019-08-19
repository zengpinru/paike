import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const addCourses = (data) => {
  return axios.request({
    url: '/api/addCourses',
    method: 'post',
    data: data
  })
}

export const getCourses = (params) => {
  return axios.request({
    url: '/api/getCourses',
    method: 'get',
    params: params
  })
}

export const getCoursesById = (coursesId) => {
  return axios.request({
    url: '/api/getCoursesById',
    method: 'get',
    params: {
      coursesId
    }
  })
}

export const editCourses = (data) => {
  return axios.request({
    url: '/api/editCourses',
    method: 'post',
    data: data
  })
}
