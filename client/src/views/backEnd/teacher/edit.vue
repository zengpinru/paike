<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>教师修改</i-breadcrumb-item>
      </i-breadcrumb>
      <i-form :model="formItem" :label-width="100" class="form">
        <i-form-item label="所属学院：">
          <i-select v-model="formItem.instituteId" placeholder="请选择学院">
            <i-option v-for="item in instituteList" :key="item.instituteId" :value="item.instituteId">
              {{ item.instituteName }}
            </i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="教师名称：">
          <i-input v-model="formItem.teacherName" placeholder="请输入教师名称" />
        </i-form-item>
        <i-form-item>
          <i-button type="primary" @click="handleSubmit">Submit</i-button>
        </i-form-item>
      </i-form>
    </i-card>
  </pk-layout>
</template>

<script>
import { getInstitute } from 'api/institute.js'
import { editTeacher, getTeacherById } from 'api/teacher.js'

export default {
  data () {
    return {
      formItem: {
        instituteId: '',
        teacherName: ''
      },
      teacherId: 0,
      instituteList: []
    }
  },
  methods: {
    handleSubmit () {
      let data = {
        teacherId: this.teacherId,
        instituteId: this.formItem.instituteId,
        teacherName: this.formItem.teacherName
      }
      editTeacher(data).then(res => {
        let _this = this
        this.$Message.success({
          content: '修改教师成功!',
          onClose: () => {
            _this.$router.push('/teacher-list')
          }
        })
      }).catch(err => {
        console.log(err)
        let _this = this
        this.$Message.error({
          content: '修改教师失败!',
          onClose: () => {
            _this.$router.push({
              name: 'teacher-edit',
              params: {
                teacherId: this.teacherId
              }
            })
          }
        })
      })
    }
  },
  created () {
    getInstitute().then(res => {
      this.instituteList = res.data
      this.teacherId = this.$route.query.teacherId
      getTeacherById(this.$route.query.teacherId).then(res => {
        this.formItem.instituteId = res.data.instituteId
        this.formItem.teacherName = res.data.teacherName
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style lang="less">
.form {
  width: 60%;
}
</style>
