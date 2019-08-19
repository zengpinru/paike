<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>教室修改</i-breadcrumb-item>
      </i-breadcrumb>
      <i-form :model="formItem" :label-width="100" class="form">
        <i-form-item label="教室编号：">
          <i-input v-model="formItem.classroomNum" placeholder="请输入教室编号,如C1-101" />
        </i-form-item>
        <i-form-item label="教室容量：">
          <i-input v-model="formItem.classroomCapacity" placeholder="请输入教室容量" />
        </i-form-item>
        <i-form-item label="是否可用：">
          <i-radio-group v-model="formItem.classroomStatus">
            <i-radio :label="1">是</i-radio>
            <i-radio :label="0">否</i-radio>
          </i-radio-group>
        </i-form-item>
        <i-form-item>
          <i-button type="primary" @click="handleSubmit">Submit</i-button>
        </i-form-item>
      </i-form>
    </i-card>
  </pk-layout>
</template>

<script>
import { getClassroomById, editClassroom } from 'api/classroom.js'

export default {
  data () {
    return {
      formItem: {
        classroomId: '',
        classroomNum: '',
        classroomCapacity: '',
        classroomStatus: 1
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
        classroomId: this.formItem.classroomId,
        classroomNum: this.formItem.classroomNum,
        classroomCapacity: parseInt(this.formItem.classroomCapacity),
        classroomStatus: parseInt(this.formItem.classroomStatus)
      }
      editClassroom(data).then(res => {
        let _this = this
        this.$Message.success({
          content: '修改教室成功!',
          onClose: () => {
            _this.$router.push('/classroom-list')
          },
          duration: 1
        })
      }).catch(err => {
        let _this = this
        this.$Message.error({
          content: '修改教室失败!',
          onClose: () => {
            _this.$router.push('/classroom-list')
          }
        })
        console.log(err)
      })
    }
  },
  created () {
    this.formItem.classroomId = this.$route.query.classroomId
    getClassroomById(this.$route.query.classroomId).then(res => {
      this.formItem.classroomNum = res.data.classroomNum
      this.formItem.classroomStatus = res.data.classroomStatus
      this.formItem.classroomCapacity = res.data.classroomCapacity
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
