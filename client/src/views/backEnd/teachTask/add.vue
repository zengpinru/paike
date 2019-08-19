<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>教学任务添加</i-breadcrumb-item>
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
            <i-select v-model="formItem.classId" placeholder="请选择班级" style="width: 200px;">
              <i-option v-for="item in classList" :key="item.classId" :value="item.classId">
               {{ item.className }}
              </i-option>
            </i-select>
          </i-form-item>
        </i-form>
        <i-tabs value="coursesList">
          <i-tab-pane label="课程库列表" name="coursesList">
            <i-form class="form">
              <i-form-item>
                <i-input
                  search
                  enter-button
                  placeholder="输入课程编号或课程名称"
                  v-model="search"
                  @on-search="handleSearch"
                />
              </i-form-item>
            </i-form>
            <div class="button">
              <i-upload
                action="http://139.199.90.62:8888/api/uploadTeachTask"
                :headers="headers"
                :format="['xlsx']"
                :on-success="handleUploadSuccess"
                :on-format-error="handleFormatError"
                :on-error="handleUploadError"
              >
                <i-button icon="ios-cloud-upload-outline" type="primary">上传教学任务</i-button>
              </i-upload>
            </div>
            <i-table
              :columns="columns"
              :data="data"
              :loading="loading"
              stripe
              border
            />
            <div class="page">
              <i-page
                :total="total"
                :current.sync="current"
                :page-size="pageSize"
                :page-size-opts="pageSizeOpts"
                show-sizer
                @on-change="getCourses"
                @on-page-size-change="handleChangePageSize"
              />
            </div>
          </i-tab-pane>
          <i-tab-pane :label="tabLabel" name="selectedCourse">
            <i-table
              :columns="selectedCourseColumns"
              :data="selectedCourseData"
              stripe
              border
            />
            <div class="submit-button"><i-button type="primary" icon="md-add" @click="handleSubmit">提交</i-button></div>
          </i-tab-pane>
        </i-tabs>
      </div>
    </i-card>
    <!-- 设置老师和周学时的弹窗  -->
    <i-modal
      v-model="showModal"
      title="设置周学时和选择老师"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
    >
      <i-form :label-width="60" style="width: 300px;">
        <i-form-item label="周学时:">
          <i-input-number v-model="weekClassHours" placeholder="请设置周学时" :max="10" :min="1" style="width: 240px;"/>
        </i-form-item>
        <i-form-item label="学院:">
          <i-select v-model="teacherInstituteId" placeholder="请选择学院" @on-change="handleTeaInstituteChange">
            <i-option v-for="item in instituteList" :key="item.instituteName" :value="item.instituteId">{{ item.instituteName }}</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="教师:">
          <i-select v-model="teacherNum" placeholder="请选择教师" @on-change="handleTeaNumChange" label-in-value>
            <i-option v-for="item in teacherList" :key="item.teacherNum" :value="item.teacherNum">{{ item.teacherName }}</i-option>
          </i-select>
        </i-form-item>
      </i-form>
    </i-modal>
    <!-- 设置老师和周学时的弹窗/ -->
  </pk-layout>
</template>

<script>
import { getInstitute } from 'api/institute.js'
import { getClassYearByInstituteId, getClassForTeachTask } from 'api/class.js'
import { getCourses } from 'api/courses.js'
import { getTeacherByInstituteId } from 'api/teacher.js'
import { addTeachTask } from 'api/teachTask.js'
import { getToken } from '@/libs/util.js'

export default {
  data () {
    return {
      headers: {
        Authorization: getToken()
      },
      search: '',
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 15, 20],
      formItem: {
        instituteId: '',
        classYear: '',
        classId: ''
      },
      teacherInstituteId: '',
      weekClassHours: 2,
      teacherNum: '',
      instituteList: [],
      classYearList: [],
      classList: [],
      teacherList: [],
      tabLabel: (h) => {
        return h('div', [
          h('span', '已选课程'),
          h('Badge', {
            props: {
              count: this.count,
              'show-zero': true,
              type: 'primary'
            }
          })
        ])
      },
      loading: false,
      data: [],
      columns: [
        {
          title: '课程编号',
          key: 'coursesNum'
        },
        {
          title: '课程名称',
          key: 'coursesName'
        },
        {
          title: '课程性质',
          key: 'coursesProperty',
          render: (h, { row }) => {
            if (parseInt(row.coursesProperty) === 1) {
              return h('span', {}, '公共课')
            } else if (parseInt(row.coursesProperty) === 2) {
              return h('span', {}, '专业课')
            }
          }
        },
        {
          title: '总学时',
          key: 'coursesClassHours'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, { row }) => {
            if (this.selectedCourse[row.coursesId]) {
              return h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    delete this.selectedCourse[row.coursesId]
                    this.selectedCourseData = this.getSelectedCourseData()
                    // 重新渲染表格
                    let data = this.data
                    this.data = []
                    this.$nextTick(() => {
                      this.data = data
                    })
                  }
                }
              }, '取消')
            } else {
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.showModal = true
                    this.row = row
                  }
                }
              }, '添加')
            }
          }
        }
      ],
      selectedCourse: {},
      selectedCourseData: [],
      selectedCourseColumns: [
        {
          title: '课程编号',
          key: 'coursesNum'
        },
        {
          title: '课程名称',
          key: 'coursesName'
        },
        {
          title: '课程性质',
          key: 'coursesProperty',
          render: (h, { row }) => {
            if (parseInt(row.coursesProperty) === 1) {
              return h('span', {}, '公共课')
            } else if (parseInt(row.coursesProperty) === 2) {
              return h('span', {}, '专业课')
            }
          }
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
          title: '教师',
          key: 'teacherName'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, { row }) => {
            return h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  delete this.selectedCourse[row.coursesId]
                  this.selectedCourseData = this.getSelectedCourseData()
                  // 重新渲染课程库表格
                  let data = this.data
                  this.data = []
                  this.$nextTick(() => {
                    this.data = data
                  })
                }
              }
            }, '删除')
          }
        }
      ],
      showModal: false,
      row: null,
      teacherInfo: null
    }
  },
  computed: {
    count () {
      return this.selectedCourseData.length
    }
  },
  methods: {
    async getData () {
      await getInstitute().then(res => {
        this.instituteList = res.data
      }).catch(err => {
        console.log(err)
      })
      await this.getCourses()
    },
    getCourses () {
      if (this.loading) {
        return
      }
      this.loading = true
      let where = {
        current: this.current,
        pageSize: this.pageSize,
        search: this.search
      }
      getCourses(where).then(res => {
        this.data = res.data
        this.total = res.total
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    getSelectedCourseData () {
      return Object.values(this.selectedCourse)
    },
    handleInstituteChange (val) {
      this.classYearList = []
      this.formItem.classYear = ''
      getClassYearByInstituteId(val).then(res => {
        this.classYearList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    handleClassYearChange (val) {
      this.classList = []
      this.formItem.classId = ''
      if (val) {
        let where = {
          instituteId: this.formItem.instituteId,
          classYear: val
        }
        getClassForTeachTask(where).then(res => {
          this.classList = res.data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleChangePageSize (val) {
      this.current = 1
      this.pageSize = val
      this.getCourses()
    },
    handleSearch () {
      this.current = 1
      this.getCourses()
    },
    handleSubmit () {
      // 提交
      let data = {
        classId: this.formItem.classId,
        data: this.selectedCourseData
      }
      addTeachTask(data).then(res => {
        this.$Message.success({
          content: '添加教学任务成功!',
          onClose: () => {
            this.$router.push({
              name: 'teachTask-list',
              path: '/teachTask-list',
              params: {
                instituteId: this.formItem.instituteId,
                classYear: this.formItem.classYear,
                classId: this.formItem.classId
              }
            })
          }
        })
      }).catch(err => {
        this.$$Message.error({
          content: '添加教学任务失败!'
        })
        console.log(err)
      })
      console.log(this.selectedCourseData)
    },
    handleOk () {
      if (this.teacherInfo) {
        this.selectedCourse[this.row.coursesId] = {
          ...this.row,
          teacherNum: this.teacherInfo.value,
          teacherName: this.teacherInfo.label,
          weekClassHours: this.weekClassHours
        }
        this.selectedCourseData = this.getSelectedCourseData()
        // 重新渲染表格
        let data = this.data
        this.data = []
        this.initModalData()
        this.$nextTick(() => {
          this.data = data
        })
      }
    },
    handleCancel () {
      this.initModalData()
    },
    handleTeaInstituteChange (val) {
      this.teacherList = []
      this.teacherNum = ''
      if (val) {
        getTeacherByInstituteId(val).then(res => {
          this.teacherList = res.data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleTeaNumChange (val) {
      this.teacherInfo = val
    },
    // 初始化弹窗数据
    initModalData () {
      this.row = null
      this.weekClassHours = 2
      this.teacherInstituteId = ''
      this.teacherNum = ''
      this.teacherList = []
      this.teacherInfo = null
    },
    // 上传教务任务
    handleUploadSuccess (res) {
      this.$Message.success({
        content: '上传教学任务成功',
        onClose: () => {
          this.$router.push('/teachTask-list')
        }
      })
    },
    handleFormatError () {
      this.$Message.error({ content: '请上传正确的文件格式' })
    },
    handleUploadError () {
      this.$Message.error({ content: '上传教学任务失败' })
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
.page {
  margin-top: 20px;
  text-align: center;
}
.submit-button {
  margin-top: 20px;
  text-align: center;
}
</style>
