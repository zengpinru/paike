import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const addInstitute = ({ instituteName }) => {
  return axios.request({
    url: '/api/addInstitute',
    method: 'post',
    data: {
      instituteName
    }
  })
}

export const getInstitute = () => {
  return axios.request({
    url: '/api/getInstitute',
    method: 'get'
  })
}

export const getInstituteById = (instituteId) => {
  return axios.request({
    url: '/api/getInstituteById',
    method: 'get',
    params: {
      instituteId
    }
  })
}

export const editInstitute = (params) => {
  return axios.request({
    url: '/api/editInstitute',
    method: 'post',
    data: params
  })
}
