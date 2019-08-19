<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>教学任务列表</i-breadcrumb-item>
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
          <i-form-item label="年级：">
            <i-select v-model="formItem.classYear" placeholder="请选择年级" style="width: 200px;" @on-change="handleClassYearChange">
              <i-option v-for="item in classYearList" :key="item.classYear" :value="item.classYear">
               {{ item.classYear }}
              </i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="班级：">
            <i-select v-model="formItem.classId" placeholder="请选择班级" style="width: 200px;" @on-change="handleClassChange">
              <i-option v-for="item in classList" :key="item.classId" :value="item.classId">
               {{ item.className }}
              </i-option>
            </i-select>
          </i-form-item>
        </i-form>
        <div class="button">
          <i-button type="primary" icon="md-add" @click="toAddTeachTask">添加</i-button>
          <i-button type="primary" icon="ios-cut" class="delete" @click="deleteTeachTasks">批量删除</i-button>
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
            @on-change="getTeachTask"
            @on-page-size-change="handleChangePageSize"
          />
        </div>
      </div>
    </i-card>
  </pk-layout>
</template>

<script>
import { getInstitute } from 'api/institute.js'
import { getClassYearByInstituteId, getClassForTeachTask } from 'api/class.js'
import { getTeachTask, deleteTeachTask, deleteTeachTasks } from 'api/teachTask.js'

export default {
  data () {
    return {
      formItem: {
        instituteId: '',
        classYear: '',
        classId: ''
      },
      instituteList: [],
      classYearList: [],
      classList: [],
      data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '班级',
          key: 'className'
        },
        {
          title: '课程',
          key: 'coursesName'
        },
        {
          title: '任课教师',
          key: 'teacherName'
        },
        {
          title: '总学时',
          key: 'coursesClassHours'
        },
        {
          title: '周学时',
          key: 'weekClassHours'
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
                    //
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
                    this.$Modal.confirm({
                      title: '信息',
                      content: '老铁确定要删除吗?',
                      onOk: () => {
                        deleteTeachTask(row.teachTaskId).then(res => {
                          this.$Message.success({ content: '删除成功' })
                          this.current = 1
                          this.getTeachTask()
                        }).catch(err => {
                          console.log(err)
                          this.$Message.error({ content: '删除失败' })
                        })
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      loading: false,
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 20, 30, 40],
      teachTaskIdArr: []
    }
  },
  methods: {
    async getData () {
      await this.getInstitute()
      await this.getTeachTask()
    },
    getInstitute () {
      getInstitute().then(res => {
        this.instituteList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getClassYear (instituteId) {
      getClassYearByInstituteId(instituteId).then(res => {
        this.classYearList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getClass ({ instituteId, classYear }) {
      getClassForTeachTask({ instituteId, classYear }).then(res => {
        this.classList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getTeachTask () {
      if (this.loading) {
        return
      }
      this.loading = true
      let where = {
        classId: this.formItem.classId,
        current: this.current,
        pageSize: this.pageSize
      }
      getTeachTask(where).then(res => {
        this.data = res.data
        this.total = res.total
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    handleInstituteChange (val) {
      this.classYearList = []
      this.formItem.classYear = ''
      this.getClassYear(val)
    },
    handleClassYearChange (val) {
      this.classList = []
      this.formItem.classId = ''
      if (val) {
        let where = {
          instituteId: this.formItem.instituteId,
          classYear: val
        }
        this.getClass(where)
      }
    },
    handleClassChange (val) {
      if (val) {
        this.current = 1
        this.getTeachTask()
      }
    },
    handleSelectionChange (val) {
      this.teachTaskIdArr = val.map(item => {
        return item.teachTaskId
      })
    },
    handleChangePageSize (val) {
      this.current = 1
      this.pageSize = val
      this.getTeachTask()
    },
    toAddTeachTask () {
      this.$router.push({
        path: '/teachTask-add',
        name: 'teachTask-add',
        params: {
          instituteId: this.formItem.instituteId,
          classYear: this.formItem.classYear,
          classId: this.formItem.classId
        }
      })
    },
    deleteTeachTasks () {
      this.$Modal.confirm({
        title: '信息',
        content: '老铁确定要删除选中的内容吗?',
        onOk: () => {
          if (this.teachTaskIdArr.length) {
            deleteTeachTasks(this.teachTaskIdArr).then(res => {
              this.$Message.success({ content: '删除成功' })
              this.current = 1
              this.getTeachTask()
            }).catch(err => {
              console.log(err)
              this.$Message.error({ content: '删除失败' })
            })
          }
        }
      })
    }
  },
  created () {
    this.getData()
    // if (Object.keys(this.$route.params).length !== 0) { // 由添加页面跳转过来的
    //   // this.formItem.instituteId = this.$route.params.instituteId
    //   // this.formItem.classYear = this.$route.params.classYear
    //   // this.formItem.classId = this.$route.params.classId
    // }
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
