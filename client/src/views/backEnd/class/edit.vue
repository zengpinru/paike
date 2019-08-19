<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>班级修改</i-breadcrumb-item>
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
import { getClassById, editClass } from 'api/class.js'

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
      currentMajorList: [],
      oldClassYear: null,
      oldMajorId: null
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
        classId: this.$route.query.classId,
        instituteId: this.formItem.instituteId,
        majorId: this.formItem.majorId,
        classYear: this.formItem.classYear.getFullYear(),
        classStuNum: parseInt(this.formItem.classStuNum)
      }
      let isChangeClassName = true
      // 判断是否要修改班级的名称
      if (parseInt(this.oldClassYear) === parseInt(data.classYear) && parseInt(this.oldMajorId) === parseInt(data.majorId)) {
        isChangeClassName = false
      }
      data.isChangeClassName = isChangeClassName
      editClass(data).then(res => {
        let _this = this
        this.$Message.success({
          content: '修改班级成功!',
          onClose: () => {
            _this.$router.push('/class-list')
          }
        })
      }).catch(err => {
        console.log(err)
        let _this = this
        this.$Message.error({
          content: '修改班级失败!',
          onClose: () => {
            _this.$router.push({
              path: 'class-edit',
              query: {
                classId: _this.$route.query.classId
              }
            })
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
      await getClassById(this.$route.query.classId).then(res => {
        this.formItem.instituteId = res.data.instituteId
        this.formItem.classYear = res.data.classYear
        this.formItem.classStuNum = res.data.classStuNum
        this.handleInstituteChange(this.formItem.instituteId)
        this.formItem.majorId = res.data.majorId
        // 保存旧的班级入学年份和旧的专业id
        this.oldClassYear = res.data.classYear
        this.oldMajorId = res.data.majorId
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
