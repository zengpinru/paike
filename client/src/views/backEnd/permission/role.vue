<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>角色列表</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <div class="button">
          <i-button type="primary" icon="md-add" @click="toAddRole">添加</i-button>
        </div>
        <i-table
          :columns="columns"
          :data="roleData"
          :loading="loading"
          stripe
          border
        />
      </div>
    </i-card>
     <!-- 添加角色的弹窗  -->
    <i-modal
      v-model="showModal"
      title="添加角色"
      ok-text="提交"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
    >
      <i-form :label-width="80" style="width: 300px;">
        <i-form-item label="角色名称:">
          <i-input v-model="formItem.roleName" placeholder="填写角色名称" style="width: 240px;"/>
        </i-form-item>
      </i-form>
      <i-tabs>
        <i-tab-pane label="页面权限">
          <i-tree show-checkbox multiple :data="treeData" @on-check-change="handleTreeDataChange" ref="permissionTree"/>
        </i-tab-pane>
        <i-tab-pane label="组件权限">组件级权限</i-tab-pane>
      </i-tabs>
    </i-modal>
    <!-- 添加角色的弹窗/ -->
    <!-- 查看权限的弹窗 -->
    <i-modal
      v-model="showPermission"
      :title="treeTitle"
      footer-hide
      @on-cancel="closeShowPermission"
    >
    <i-tabs>
        <i-tab-pane label="页面权限">
          <i-tree :data="rolePermissionTreeData"/>
        </i-tab-pane>
        <i-tab-pane label="组件权限">组件级权限</i-tab-pane>
      </i-tabs>
    </i-modal>
    <!-- 查看权限的弹窗/ -->
  </pk-layout>
</template>

<script>
import { getPagePermission, addRole, getRole, getRolePermission } from 'api/permission'

export default {
  data () {
    return {
      formItem: {
        roleId: '',
        roleName: '',
        selectedTreeData: []
      },
      showModal: false,
      showPermission: false,
      roleData: [],
      columns: [
        {
          title: '角色名称',
          key: 'roleName'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, { row }) => {
            if (parseInt(row.roleId) !== 1) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    width: '60px',
                    height: '28px'
                  },
                  on: {
                    click: () => {
                      this.getRolePermission(row.roleId)
                      this.treeTitle = row.roleName
                      this.$nextTick(() => {
                        this.showPermission = true
                      })
                    }
                  }
                }, '查看权限'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    width: '60px',
                    height: '28px'
                  },
                  on: {
                    click: () => {
                      this.formItem.roleName = row.roleName
                      this.formItem.roleId = row.roleId
                      this.$nextTick(() => {
                        this.showModal = true
                      })
                    }
                  }
                }, '分配权限'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    width: '60px',
                    height: '28px'
                  },
                  on: {
                    click: () => {
                      //
                    }
                  }
                }, '删除')
              ])
            } else {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    width: '60px',
                    height: '28px'
                  },
                  on: {
                    click: () => {
                      this.getRolePermission(row.roleId)
                      this.treeTitle = row.roleName
                      this.$nextTick(() => {
                        this.showPermission = true
                      })
                    }
                  }
                }, '查看权限')
              ])
            }
          }
        }
      ],
      loading: false,
      pagePermissionData: [],
      treeData: [],
      rolePermissionTreeData: [],
      treeTitle: ''
    }
  },
  methods: {
    toAddRole () {
      this.showModal = true
    },
    async getData () {
      await this.getRole()
      await this.getPagePermission()
      this.treeData = this.getTreeData(this.pagePermissionData)
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
     * 获取角色列表数据
     */
    async getRole () {
      this.loading = true
      await getRole().then(res => {
        this.roleData = res.data
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 获取权限树数据
     */
    getTreeData (data) {
      let arr = []
      data.forEach(item => {
        if (item.pagePermissionParentId === 0) {
          let obj = {
            title: item.pagePermissionName,
            pagePermissionId: item.pagePermissionId,
            pagePermissionParentId: item.pagePermissionParentId,
            expand: true,
            children: []
          }
          arr.push(obj)
        }
      })
      data.forEach(item => {
        if (item.pagePermissionParentId !== 0) { // 不是顶级权限
          for (let i = 0; i < arr.length; i++) {
            if (item.pagePermissionParentId === arr[i].pagePermissionId) {
              let obj = {
                title: item.pagePermissionName,
                pagePermissionId: item.pagePermissionId
              }
              arr[i].children.push(obj)
              break
            }
          }
        }
      })
      return arr
    },
    /**
     * 获取查看权限时的数据
     */
    getRolePermission (roleId) {
      getRolePermission(roleId).then(res => {
        this.rolePermissionTreeData = this.getTreeData(res.data)
      }).catch(err => {
        console.log(err)
      })
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
    handleOk () { // 弹窗确认
      let arr = []
      this.formItem.selectedTreeData.forEach(item => {
        arr.push(item.pagePermissionId)
      })
      let data = {
        roleId: this.formItem.roleId,
        roleName: this.formItem.roleName,
        pagePermission: arr.join(',')
      }
      addRole(data).then(res => {
        if (data.roleId) { // 分配权限
          this.successTip('分配权限成功!')
        } else { // 添加
          this.successTip('添加成功!')
        }
      }).catch(err => {
        this.errorTip('操作失败!', err)
      })
    },
    handleCancel () { // 弹窗取消
      this.initFormItem()
      this.treeData = this.getTreeData(this.pagePermissionData)
    },
    handleTreeDataChange () { // 选中页面权限时触发
      this.formItem.selectedTreeData = this.$refs.permissionTree.getCheckedAndIndeterminateNodes()
    },
    closeShowPermission () {
      //
    },
    /**
     * 初始化页面的数据
     */
    initFormItem () {
      this.formItem.roleName = ''
      this.formItem.roleId = ''
      this.formItem.selectedTreeData = []
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
