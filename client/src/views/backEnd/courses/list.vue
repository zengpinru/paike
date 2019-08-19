<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>课程列表</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
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
          <i-button type="primary" icon="md-add" @click="toAddCourses">添加</i-button>
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
import { getCourses } from 'api/courses'

export default {
  data () {
    return {
      search: '',
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 20, 30],
      data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
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
                      path: '/courses-edit',
                      query: {
                        coursesId: row.coursesId
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
      loading: false
    }
  },
  methods: {
    handleSearch () {
      this.current = 1
      this.getData()
    },
    toAddCourses () {
      this.$router.push('/courses-add')
    },
    handleSelectionChange () {
      //
    },
    getData () {
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
    handleChangePageSize (val) {
      this.current = 1
      this.pageSize = val
      this.getData()
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="less">
.form {
  width: 400px;
}
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
