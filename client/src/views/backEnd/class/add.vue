<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>班级添加</i-breadcrumb-item>
      </i-breadcrumb>
      <i-form :model="formItem" :label-width="100" class="form">
        <i-form-item label="所属学院：">
          <i-select v-model="formItem.instituteId" placeholder="请选择学院" @on-change="handleInstituteChange">
            <i-option v-for="item in instituteList" :key="item.instituteId" :value="item.instituteId">
              {{ item.instituteName }}
            </i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="所属专业：">
          <i-select v-model="formItem.majorId" placeholder="请选择专业">
            <i-option v-for="item in currentMajorList" :key="item.majorId" :value="item.majorId">
              {{ item.majorName }}
            </i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="班级人数：">
          <i-input v-model="formItem.classStuNum" placeholder="请输入班级人数" />
        </i-form-item>
        <i-form-item label="入学年份：">
          <i-date-picker type="year" placeholder="选择入学年份" v-model="formItem.classYear"/>
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
import { getMajorNoWhere } from 'api/major.js'
import { addClass } from 'api/class.js'

export default {
  data () {
    return {
      formItem: {
        instituteId: '',
        majorId: '',
        classYear: '',
        classStuNum: ''
      },
      instituteList: [],
      majorList: [],
      currentMajorList: []
    }
  },
  methods: {
    handleInstituteChange (val) {
      this.currentMajorList = []
      this.formItem.majorId = ''
      this.majorList.forEach(item => {
        if (parseInt(item.instituteId) === parseInt(val)) {
          this.currentMajorList.push(item)
        }
      })
    },
    handleSubmit () {
      let data = {
        instituteId: this.formItem.instituteId,
        majorId: this.formItem.majorId,
        classYear: this.formItem.classYear.getFullYear(),
        classStuNum: parseInt(this.formItem.classStuNum)
      }
      addClass(data).then(res => {
        let _this = this
        this.$Message.success({
          content: '添加班级成功!',
          onClose: () => {
            _this.$router.push('/class-list')
          }
        })
      }).catch(err => {
        console.log(err)
        let _this = this
        this.$Message.error({
          content: '添加班级失败!',
          onClose: () => {
            _this.$router.push('/class-add')
          }
        })
      })
    },
    async getData () {
      await getInstitute().then(res => {
        this.instituteList = res.data
      }).catch(err => {
        console.log(err)
      })
      await getMajorNoWhere().then(res => {
        this.majorList = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="less">
.form {
  width: 60%;
}
</style>
