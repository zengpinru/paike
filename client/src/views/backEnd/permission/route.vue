<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>页面级权限列表</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <div class="button">
          <i-button type="primary" icon="md-add" @click="toAddPagePermisson">添加</i-button>
        </div>
        <i-table
          :columns="columns"
          :data="tableData"
          :loading="loading"
          stripe
          border
        />
      </div>
    </i-card>
     <!-- 添加、编辑角色的弹窗  -->
    <i-modal
      v-model="showModal"
      title="添加页面权限"
      ok-text="提交"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
    >
      <i-form :label-width="80" style="width: 300px;">
        <i-form-item label="父级:">
          <i-select v-model="formItem.pagePermissionParentId" placeholder="请选择所属父级">
            <i-option :value="0">顶级权限</i-option>
            <i-option v-for="item in pagePermissionParentData" :value="item.pagePermissionId" :key="item.pagePermissionId">
              {{ item.pagePermissionName }}
            </i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="名称:">
          <i-input v-model="formItem.pagePermissionName" placeholder="填写名称"/>
        </i-form-item>
        <i-form-item label="路由:">
          <i-input v-model="formItem.pagePermissionRoute" placeholder="填写路由"/>
        </i-form-item>
      </i-form>
    </i-modal>
    <!-- 添加、编辑角色的弹窗/ -->
  </pk-layout>
</template>

<script>
import { getPagePermission, addPagePermission, getPagePermissionById } from 'api/permission'

export default {
  data () {
    return {
      pagePermissionData: [],
      formItem: {
        pagePermissionName: '',
        pagePermissionRoute: '',
        pagePermissionParentId: '',
        pagePermissionId: ''
      },
      showModal: false,
      tableData: [],
      columns: [
        {
          title: '名称',
          key: 'pagePermissionName'
        },
        {
          title: '路由',
          key: 'pagePermissionRoute'
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
                    this.editPagePermission(row.pagePermissionId)
                    this.showModal = true
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
                    this.deleteConfirm()
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
  computed: {
    pagePermissionParentData () {
      return this.pagePermissionData.filter(item => {
        return item.pagePermissionParentId === 0
      })
    }
  },
  methods: {
    /**
     * 点击添加按钮触发
     */
    toAddPagePermisson () {
      this.showModal = true
    },
    /**
     * 加载页面的数据
     */
    async getData () {
      this.loading = true
      await this.getPagePermission()
      await this.getTableData()
      this.loading = false
    },
    /**
     * 获取页面权限列表数据
     */
    async getPagePermission () {
      await getPagePermission().then(res => {
        this.pagePermissionData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 获取表格数据
     */
    getTableData () {
      let parentData = this.pagePermissionData.filter(item => {
        return item.pagePermissionParentId === 0
      })
      let childData = this.pagePermissionData.filter(item => {
        return item.pagePermissionParentId !== 0
      })
      let arr = []
      for (let i = 0; i < parentData.length; i++) {
        arr.push(parentData[i])
        for (let j = 0; j < childData.length; j++) {
          if (childData[j].pagePermissionParentId === parentData[i].pagePermissionId) {
            childData[j].pagePermissionName = '|------ ' + childData[j].pagePermissionName
            arr.push(childData[j])
          }
        }
      }
      this.tableData = arr
    },
    /**
     * 点击编辑按钮触发
     */
    editPagePermission (pagePermissionId) {
      getPagePermissionById(pagePermissionId).then(res => {
        this.formItem.pagePermissionParentId = res.data.pagePermissionParentId
        this.formItem.pagePermissionName = res.data.pagePermissionName
        this.formItem.pagePermissionRoute = res.data.pagePermissionRoute
        this.formItem.pagePermissionId = res.data.pagePermissionId
      }).catch(err => {
        console.log(err)
      })
    },
    handleOk () { // 弹窗确认
      let data = {
        pagePermissionParentId: parseInt(this.formItem.pagePermissionParentId),
        pagePermissionName: this.formItem.pagePermissionName,
        pagePermissionRoute: this.formItem.pagePermissionRoute,
        pagePermissionId: this.formItem.pagePermissionId
      }
      addPagePermission(data).then(res => {
        if (data.pagePermissionId) { // 编辑
          this.successTip('修改成功!')
        } else { // 添加
          this.successTip('添加成功!')
        }
      }).catch(err => {
        this.errorTip('操作失败!', err)
      })
    },
    handleCancel () { // 弹窗取消
      this.initFormItem()
    },
    /**
     * 操作成功的提示
     */
    successTip (tip) {
      this.$Message.success({
        content: tip,
        duration: 0.5,
        onClose: () => {
          this.initFormItem()
          this.getData()
        }
      })
    },
    /**
     * 操作失败的提示
     */
    errorTip (tip, err) {
      this.$Message.error({
        content: tip
      })
      console.log(err)
    },
    deleteConfirm () {
      this.$Modal.confirm({
        title: '老铁,你确定要删除该条记录吗???',
        onOk: () => {
          this.$Message.info('ok')
        },
        onCancel: () => {
          this.$Message.info('cancel')
        }
      })
    },
    /**
     * 初始化表单的数据
     */
    initFormItem () {
      this.formItem.pagePermissionParentId = ''
      this.formItem.pagePermissionName = ''
      this.formItem.pagePermissionRoute = ''
      this.formItem.pagePermissionId = ''
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
</style>
