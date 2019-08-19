<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>课程添加</i-breadcrumb-item>
      </i-breadcrumb>
      <i-form :model="formItem" :label-width="100" class="form">
        <i-form-item label="课程性质：">
          <i-select v-model="formItem.coursesProperty" placeholder="请选择课程性质">
            <i-option :value="1">公共课</i-option>
            <i-option :value="2">专业课</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="课程名称：">
          <i-input v-model="formItem.coursesName" placeholder="请输入课程名称" />
        </i-form-item>
        <i-form-item label="课程总学时：">
          <i-input v-model="formItem.coursesClassHours" placeholder="请输入课程总学时" />
        </i-form-item>
        <i-form-item>
          <i-button type="primary" @click="handleSubmit">Submit</i-button>
        </i-form-item>
      </i-form>
    </i-card>
  </pk-layout>
</template>

<script>
import { addCourses } from 'api/courses.js'

export default {
  data () {
    return {
      formItem: {
        coursesProperty: '',
        coursesName: '',
        coursesClassHours: ''
      }
    }
  },
  methods: {
    handleSubmit () {
      let data = {
        coursesProperty: this.formItem.coursesProperty,
        coursesName: this.formItem.coursesName,
        coursesClassHours: this.formItem.coursesClassHours
      }
      addCourses(data).then(res => {
        let _this = this
        this.$Message.success({
          content: '添加课程成功!',
          onClose: () => {
            _this.$router.push('/courses-list')
          }
        })
      }).catch(err => {
        console.log(err)
        let _this = this
        this.$Message.error({
          content: '添加课程失败!',
          onClose: () => {
            _this.$router.push('/courses-add')
          }
        })
      })
    }
  }
}
</script>
