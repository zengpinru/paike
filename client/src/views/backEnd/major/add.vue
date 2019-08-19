<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>专业添加</i-breadcrumb-item>
      </i-breadcrumb>
      <i-form :model="formItem" :label-width="100" class="form">
        <i-form-item label="所属学院：">
          <i-select v-model="formItem.instituteId" placeholder="请选择学院">
            <i-option v-for="item in instituteList" :key="item.instituteId" :value="item.instituteId">
              {{ item.instituteName }}
            </i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="专业名称：">
          <i-input v-model="formItem.majorName" placeholder="请输入专业名称" />
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
import { addMajor } from 'api/major.js'

export default {
  data () {
    return {
      formItem: {
        instituteId: '',
        majorName: ''
      },
      instituteList: []
    }
  },
  methods: {
    handleSubmit () {
      let data = {
        instituteId: this.formItem.instituteId,
        majorName: this.formItem.majorName
      }
      addMajor(data).then(res => {
        let _this = this
        this.$Message.success({
          content: '添加专业成功!',
          onClose: () => {
            _this.$router.push('/major-list')
          }
        })
      }).catch(err => {
        console.log(err)
        let _this = this
        this.$Message.error({
          content: '添加专业失败!',
          onClose: () => {
            _this.$router.push('/major-add')
          }
        })
      })
    }
  },
  created () {
    getInstitute().then(res => {
      this.instituteList = res.data
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
