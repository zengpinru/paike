<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>专业修改</i-breadcrumb-item>
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
import { getMajorById, editMajor } from 'api/major.js'

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
  created () {
    getInstitute().then(res => {
      this.instituteList = res.data
      getMajorById(this.$route.query.majorId).then(res => {
        this.formItem.instituteId = res.data.instituteId
        this.formItem.majorName = res.data.majorName
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    handleSubmit () {
      let data = {
        majorId: this.$route.query.majorId,
        majorName: this.formItem.majorName,
        instituteId: this.formItem.instituteId
      }
      editMajor(data).then(res => {
        let _this = this
        this.$Message.success({
          content: '修改专业成功!',
          onClose: () => {
            _this.$router.push('/major-list')
          }
        })
      }).catch(err => {
        console.log(err)
        let _this = this
        this.$Message.error({
          content: '修改专业失败!',
          onClose: () => {
            _this.$router.push({
              path: '/major-edit',
              query: {
                majorId: this.$route.query.majorId
              }
            })
          }
        })
      })
    }
  }
}
</script>
