<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>学院修改</i-breadcrumb-item>
      </i-breadcrumb>
      <i-form :label-width="100" class="form">
        <i-form-item label="学院名称：">
          <i-input v-model="instituteName" placeholder="请输入学院名称" />
        </i-form-item>
        <i-form-item>
          <i-button type="primary" @click="handleSubmit">Submit</i-button>
        </i-form-item>
      </i-form>
    </i-card>
  </pk-layout>
</template>

<script>
import { getInstituteById, editInstitute } from 'api/institute.js'

export default {
  data () {
    return {
      instituteName: ''
    }
  },
  created () {
    let instituteId = this.$route.query.instituteId
    getInstituteById(instituteId).then(res => {
      this.instituteName = res.data.instituteName
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    handleSubmit () {
      editInstitute({
        instituteId: this.$route.query.instituteId,
        instituteName: this.instituteName
      }).then(res => {
        let _this = this
        this.$Message.success({
          content: '修改学院成功!',
          onClose: () => {
            _this.$router.push('/institute-list')
          }
        })
      }).catch(err => {
        console.log(err)
        let _this = this
        this.$Message.error({
          content: '修改学院失败!',
          onClose: () => {
            _this.$router.push('/institute-list')
          }
        })
      })
    }
  }
}
</script>
