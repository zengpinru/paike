<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>教师列表</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <i-form class="form">
          <i-form-item>
            <i-input
              search
              enter-button
              placeholder="输入学院或教师编号或教师姓名"
              v-model="search"
              @on-search="handleSearch"
            />
          </i-form-item>
        </i-form>
        <div class="button">
          <i-button type="primary" icon="md-add" @click="toAddTeacher">添加</i-button>
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
import { getTeacher } from 'api/teacher.js'

export default {
  data () {
    return {
      search: '',
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 15, 20],
      data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          key: 'teacherNum'
        },
        {
          title: '所属学院',
          key: 'instituteName'
        },
        {
          title: '姓名',
          key: 'teacherName'
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
                      path: '/teacher-edit',
                      query: {
                        teacherId: row.teacherId
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
    toAddTeacher () {
      this.$router.push('/teacher-add')
    },
    handleSelectionChange () {
      //
    },
    getData () {
      if (this.loading) {
        return
      }
      this.loading = true
      let data = {
        current: this.current,
        pageSize: this.pageSize,
        search: this.search
      }
      getTeacher(data).then(res => {
        this.data = res.data
        this.total = res.total
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    handleChangePageSize (val) {
      this.pageSize = val
      this.current = 1
      this.getData()
    },
    handleSearch () {
      this.current = 1
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
