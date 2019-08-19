<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>教室添加</i-breadcrumb-item>
      </i-breadcrumb>
      <i-form :model="formItem" :label-width="100" class="form">
        <i-form-item label="教室编号：">
          <i-input v-model="formItem.classroomNum" placeholder="请输入教室编号,如C1-101" />
        </i-form-item>
        <i-form-item label="教室容量：">
          <i-input v-model="formItem.classroomCapacity" placeholder="请输入教室容量,默认为100" />
        </i-form-item>
        <i-form-item>
          <i-button type="primary" @click="handleSubmit">Submit</i-button>
        </i-form-item>
      </i-form>
    </i-card>
  </pk-layout>
</template>

<script>
import { addClassroom } from 'api/classroom.js'

export default {
  data () {
    return {
      formItem: {
        classroomNum: '',
        classroomCapacity: ''
      },
      loading: false
    }
  },
  methods: {
    handleSubmit () {
      if (this.loading) {
        return
      }
      this.loading = true
      let data = {
        classroomNum: this.formItem.classroomNum,
        classroomCapacity: parseInt(this.formItem.classroomCapacity)
      }
      addClassroom(data).then(res => {
        let _this = this
        this.$Message.success({
          content: '添加教室成功!',
          onClose: () => {
            _this.$router.push('/classroom-list')
          },
          duration: 1
        })
      }).catch(err => {
        let _this = this
        this.$Message.error({
          content: '添加教室失败!',
          onClose: () => {
            _this.$router.push('/classroom-add')
          }
        })
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less">
.form {
  width: 60%;
}
</style>
