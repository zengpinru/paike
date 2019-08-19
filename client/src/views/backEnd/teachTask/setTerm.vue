<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>设置学期</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <i-form :label-width="60" style="width: 445px;">
          <i-form-item label="年度:">
            <i-date-picker type="year" placeholder="Select year" v-model="frontYear" :disabled="disabled"/>
            -
            <i-date-picker type="year" placeholder="Select year" v-model="endYear" :disabled="disabled"/>
          </i-form-item>
          <i-form-item label="学期:">
            <i-select v-model="term" placeholder="选择学期" :disabled="disabled">
              <i-option value="1">一</i-option>
              <i-option value="2">二</i-option>
            </i-select>
          </i-form-item>
          <i-form-item>
            <i-button type="primary" @click="handleEdit" class="btn" v-show="!isEdit">更改</i-button>
            <i-button type="primary" @click="handleSubmit" class="btn" v-show="isEdit">保存</i-button>
            <i-button type="primary" @click="handleCancel" class="btn" v-show="isEdit">取消</i-button>
          </i-form-item>
        </i-form>
      </div>
    </i-card>
  </pk-layout>
</template>

<script>
import { getTerm, editTerm } from 'api/teachTask.js'

export default {
  data () {
    return {
      frontYear: '',
      endYear: '',
      term: '',
      termName: '',
      disabled: true,
      isEdit: false
    }
  },
  methods: {
    getTerm () {
      getTerm().then(res => {
        this.termName = res.data.termName
        this.initData(res.data.termName)
      }).catch(err => {
        console.log(err)
      })
    },
    initData (data) {
      data = data.split('-')
      this.frontYear = data[0]
      this.endYear = data[1]
      this.term = data[2]
    },
    handleEdit () {
      this.disabled = false
      this.isEdit = true
    },
    handleSubmit () {
      let termName = `${this.frontYear.getFullYear()}-${this.endYear.getFullYear()}-${this.term}`
      editTerm(termName).then(res => {
        this.disabled = true
        this.isEdit = false
        this.termName = termName
        this.initData(termName)
        this.$Message.success({
          content: '更改学期成功!'
        })
      }).catch(err => {
        this.initData(this.termName)
        this.$Message.error({
          content: '更改学期失败!'
        })
        console.log(err)
      })
    },
    handleCancel () {
      this.disabled = true
      this.isEdit = false
      this.initData(this.termName)
    }
  },
  created () {
    this.getTerm()
  }
}
</script>

<style lang="less">
.btn {
  margin-right: 5px;
  width: 50px;
  height: 30px;
}
</style>
