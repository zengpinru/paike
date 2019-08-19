<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>教室列表</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <i-form inline :label-width="80">
          <i-form-item label="教学区：">
            <i-select v-model="formItem.classroomArea" placeholder="请选择" style="width: 200px;">
              <i-option value="C">C</i-option>
              <i-option value="D">D</i-option>
              <i-option value="E">E</i-option>
              <i-option value="F">F</i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="是否可用：">
            <i-select v-model="formItem.classroomStatus" placeholder="请选择" style="width: 200px;">
              <i-option :value="2">所有</i-option>
              <i-option :value="1">是</i-option>
              <i-option :value="0">否</i-option>
            </i-select>
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
            @on-change="getData"
            @on-page-size-change="handleChangePageSize"
          />
        </div>
      </div>
    </i-card>
  </pk-layout>
</template>

<script>
import { getClassroom } from 'api/classroom.js'

export default {
  data () {
    return {
      formItem: {
        classroomArea: '',
        classroomStatus: ''
      },
      data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          key: 'classroomNum'
        },
        {
          title: '容量',
          key: 'classroomCapacity'
        },
        {
          title: '是否可用',
          key: 'classroomStatus',
          render: (h, { row }) => {
            if (row.classroomStatus === 1) {
              return h('Tag', {
                props: {
                  color: 'green'
                },
                nativeOn: {
                  click: () => {
                    this.handleChangeClassroomStauts(row)
                  }
                }
              }, '是')
            } else {
              return h('Tag', {
                props: {
                  color: 'red'
                },
                nativeOn: {
                  click: () => {
                    this.handleChangeClassroomStauts(row)
                  }
                }
              }, '否')
            }
          }
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
                      path: '/classroom-edit',
                      query: {
                        classroomId: row.classroomId
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
      ],
      loading: false,
      total: 0,
      current: 1,
      pageSize: 5,
      pageSizeOpts: [5, 10, 15]
    }
  },
  methods: {
    handleSelectionChange (selection) {
      console.log(selection)
    },
    handleChangeClassroomStauts (row) {
      console.log(row)
    },
    handleAddClassroom () {
      this.$router.push('/classroom-add')
    },
    getData () {
      if (this.loading) {
        return
      }
      this.loading = true
      getClassroom({
        current: this.current,
        pageSize: this.pageSize,
        classroomArea: this.formItem.classroomArea,
        classroomStatus: this.formItem.classroomStatus
      }).then(res => {
        this.data = res.data
        this.total = res.total
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    getQueryData () {
      this.current = 1
      this.pageSize = 5
      this.getData()
    },
    handleChangePageSize (val) {
      this.pageSize = val
      this.$nextTick(() => {
        this.getData()
      })
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
