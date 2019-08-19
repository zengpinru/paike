<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>班级列表</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <i-form inline :label-width="60">
          <i-form-item label="学院：">
            <i-select v-model="formItem.instituteId" placeholder="请选择学院" @on-change="handleInstituteChange" style="width: 200px;">
              <i-option v-for="item in instituteList" :key="item.instituteId" :value="item.instituteId">
                {{ item.instituteName }}
              </i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="专业：">
            <i-select v-model="formItem.majorId" placeholder="请选择专业" style="width: 200px;">
              <i-option v-for="item in currentMajorList" :key="item.majorId" :value="item.majorId">
                {{ item.majorName }}
              </i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="年级：">
            <i-date-picker type="year" placeholder="选择入学年份" v-model="formItem.classYear"/>
          </i-form-item>
          <i-button type="primary" @click="getQueryData">查询</i-button>
        </i-form>
        <div class="button">
          <i-button type="primary" icon="md-add" @click="handleAddClassroom">添加</i-button>
          <i-button type="primary" icon="ios-cut" class="delete">批量删除</i-button>
        </div>
        <i-table
          :columns="columns"
          :data="data"
          :loading="loading"
          stripe
          border
          @on-selection-change="handleSelectionChange"
        />
        <div class="page">
          <i-page
            :total="total"
            :current.sync="current"
            :page-size="pageSize"
            :page-size-opts="pageSizeOpts"
            show-sizer
            @on-change="getClassData"
            @on-page-size-change="handleChangePageSize"
          />
        </div>
      </div>
    </i-card>
  </pk-layout>
</template>

<script>
import { getInstitute } from 'api/institute.js'
import { getMajorNoWhere } from 'api/major.js'
import { getClass } from 'api/class.js'

export default {
  data () {
    return {
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 15, 20],
      formItem: {
        instituteId: '',
        majorId: '',
        classYear: ''
      },
      instituteList: [],
      majorList: [],
      currentMajorList: [],
      loading: false,
      data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '学院',
          key: 'instituteName'
        },
        {
          title: '班级名称',
          key: 'className'
        },
        {
          title: '入学年份',
          key: 'classYear'
        },
        {
          title: '班级人数',
          key: 'classStuNum'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, { row }) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      path: '/class-edit',
                      query: {
                        classId: row.classId
                      }
                    })
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    alert('删除')
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  methods: {
    getClassData () {
      if (this.loading) {
        return
      }
      this.loading = true
      let where = {
        current: this.current,
        pageSize: this.pageSize,
        instituteId: this.formItem.instituteId,
        majorId: this.formItem.majorId,
        classYear: this.formItem.classYear ? this.formItem.classYear.getFullYear() : ''
      }
      getClass(where).then(res => {
        this.data = res.data
        this.total = res.total
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    getQueryData () {
      this.current = 1
      this.getClassData()
    },
    async getData () {
      await this.getClassData()
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
    },
    handleInstituteChange (val) {
      this.currentMajorList = []
      this.formItem.majorId = ''
      this.majorList.forEach(item => {
        if (parseInt(item.instituteId) === parseInt(val)) {
          this.currentMajorList.push(item)
        }
      })
    },
    handleAddClassroom () {
      this.$router.push('/class-add')
    },
    handleSelectionChange () {
      //
    },
    handleChangePageSize (val) {
      this.current = 1
      this.pageSize = val
      this.getClassData()
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="less">
.button {
  margin-bottom: 3px;
}
.delete {
  margin-left: 5px;
}
.page {
  margin-top: 20px;
  text-align: center;
}
</style>
