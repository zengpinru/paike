<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>学院列表</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <i-table
        :data="data"
        :columns="columns"
        :loading="loading"
        stripe
        border
        />
      </div>
    </i-card>
  </pk-layout>
</template>

<script>
import { getInstitute } from 'api/institute.js'

export default {
  data () {
    return {
      loading: false,
      data: [],
      columns: [
        {
          title: '学院名称',
          key: 'instituteName'
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
                      path: '/institute-edit',
                      query: {
                        instituteId: row.instituteId
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
                    //
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
    getData () {
      if (this.loading) {
        return
      }
      this.loading = true
      getInstitute().then(res => {
        this.data = res.data
        this.loading = false
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
