<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>专业列表</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <i-form inline :label-width="80">
          <i-form-item label="学院：">
            <i-select v-model="instituteId" placeholder="请选择学院" style="width: 300px;">
              <i-option v-for="item in instituteList" :key="item.instituteId" :value="item.instituteId">
                {{ item.instituteName }}
              </i-option>
            </i-select>
          </i-form-item>
          <i-button type="primary" @click="getQueryData">查询</i-button>
        </i-form>
        <div class="button">
          <i-button type="primary" icon="md-add" @click="handleAddMajor">添加</i-button>
        </div>
        <i-table
          :data="data"
          :columns="columns"
          :loading="loading"
          stripe
          border
        />
        <div class="page">
          <i-page
            :total="total"
            :current.sync="current"
            :page-size="pageSize"
            @on-change="getData"
          />
        </div>
      </div>
    </i-card>
  </pk-layout>
</template>

<script>
import { getInstitute } from 'api/institute.js'
import { getMajor } from 'api/major.js'

export default {
  data () {
    return {
      current: 1,
      pageSize: 10,
      total: 0,
      instituteId: '',
      instituteList: [],
      data: [],
      columns: [
        {
          title: '所属学院',
          key: 'instituteName'
        },
        {
          title: '专业名称',
          key: 'majorName'
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
                      path: '/major-edit',
                      query: {
                        majorId: row.majorId
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
      ],
      loading: false
    }
  },
  methods: {
    handleAddMajor () {
      this.$router.push('/major-add')
    },
    getQueryData () {
      this.current = 1
      this.getData()
    },
    getData () {
      if (this.loading) {
        return
      }
      this.loading = true
      // 查询的条件
      let where = {
        current: this.current,
        pageSize: this.pageSize,
        instituteId: this.instituteId
      }
      getMajor(where).then(res => {
        this.data = res.data
        this.total = res.total
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    getInstitute().then(res => {
      this.instituteList = res.data
      this.getData()
    }).catch(err => {
      console.log(err)
    })
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
</style>
