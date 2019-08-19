import HttpRequest from '@/libs/axios.js'

const axios = new HttpRequest()

export const addTemporary = ({ temporaryData, checkListData }) => {
  return axios.request({
    url: '/api/addTemporary',
    method: 'post',
    data: {
      temporaryData,
      checkListData
    }
  })
}

export const getTemporaryByClassId = (classId) => {
  return axios.request({
    url: '/api/getTemporaryByClassId',
    method: 'get',
    params: {
      classId
    }
  })
}

export const getTemporaryByTeacherNum = (teacherNum) => {
  return axios.request({
    url: '/api/getTemporaryByTeacherNum',
    method: 'get',
    params: {
      teacherNum
    }
  })
}

export const getTemporaryByClassroomNum = (classroomNum) => {
  return axios.request({
    url: '/api/getTemporaryByClassroomNum',
    method: 'get',
    params: {
      classroomNum
    }
  })
}

export const getTemporaryByTeachTaskId = (teachTaskId) => {
  return axios.request({
    url: '/api/getTemporaryByTeachTaskId',
    method: 'get',
    params: {
      teachTaskId
    }
  })
}

/**
 * 重置数据(清空checkList和temporary的数据表)
 */
export const resetData = () => {
  return axios.request({
    url: '/api/resetData',
    method: 'get'
  })
}

export const getCheckList = () => {
  return axios.request({
    url: '/api/getCheckList',
    method: 'get'
  })
}

export const handPaike = (data) => {
  return axios.request({
    url: '/api/handPaike',
    method: 'post',
    data: data
  })
}

export const updatePaike = (data) => {
  return axios.request({
    url: '/api/updatePaike',
    method: 'post',
    data: data
  })
}

export const statistics = () => {
  return axios.request({
    url: '/api/statistics',
    method: 'get'
  })
}
