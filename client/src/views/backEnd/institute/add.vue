<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>学院添加</i-breadcrumb-item>
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
import { addInstitute } from 'api/institute.js'

export default {
  data () {
    return {
      instituteName: '',
      loading: false
    }
  },
  methods: {
    handleSubmit () {
      if (this.loading) {
        return
      }
      this.loading = true
      addInstitute({ instituteName: this.instituteName }).then(res => {
        let _this = this
        this.$Message.success({
          content: '添加学院成功!',
          onClose: () => {
            _this.$router.push('/institute-list')
          }
        })
      }).catch(err => {
        console.log(err)
        let _this = this
        this.$Message.error({
          content: '添加学院失败!',
          onClose: () => {
            _this.$router.push('/institute-add')
          }
        })
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
