<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>管理员列表</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <div class="button">
          <i-button type="primary" icon="md-add" @click="toAddAdmin">添加</i-button>
        </div>
        <i-table
          :columns="columns"
          :data="adminData"
          :loading="loading"
          stripe
          border
        />
      </div>
    </i-card>
    <!-- 添加角色的弹窗  -->
    <i-modal
      v-model="showModal"
      :title="modalTitle"
      ok-text="提交"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
    >
      <i-form :label-width="80" style="width: 300px;">
        <i-form-item label="管理员名称:">
          <i-input v-model="formItem.adminName" placeholder="填写管理员名称" style="width: 240px;"/>
        </i-form-item>
        <i-form-item label="初始密码:">
          <i-input v-model="formItem.adminPwd" placeholder="填写初始密码" style="width: 240px;"/>
        </i-form-item>
        <i-form-item label="所属角色:">
          <i-select v-model="formItem.roleId" placeholder="请选择所属角色" style="width: 240px">
            <i-option v-for="item in roleData" :key="item.roleId" :value="item.roleId">{{ item.roleName }}</i-option>
          </i-select>
        </i-form-item>
      </i-form>
    </i-modal>
    <!-- 添加角色的弹窗/ -->
  </pk-layout>
</template>

<script>
import { getRole } from 'api/permission.js'
import { getAdmin, addAdmin } from 'api/admin.js'

export default {
  data () {
    return {
      roleData: [],
      adminData: [],
      columns: [
        {
          title: '管理员名称',
          key: 'adminName'
        },
        {
          title: '所属角色',
          key: 'roleName'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, { row }) => {
            if (parseInt(row.adminId) !== 1) {
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
                      this.formItem.adminName = row.adminName
                      this.formItem.roleId = row.roleId
                      this.formItem.adminPwd = '123456'
                      this.formItem.adminId = row.adminId
                      this.$nextTick(() => {
                        this.showModal = true
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
            } else {
              return h('div', '不能操作')
            }
          }
        }
      ],
      loading: false,
      showModal: false,
      modalTitle: '添加管理员',
      formItem: {
        adminName: '',
        adminPwd: '123456',
        roleId: '',
        adminId: ''
      }
    }
  },
  methods: {
    /**
     * 点击添加按钮触发
     */
    toAddAdmin () {
      this.showModal = true
    },
    /**
     * 弹窗确定
     */
    handleOk () {
      let data = {
        adminName: this.formItem.adminName,
        adminPwd: this.formItem.adminPwd,
        roleId: this.formItem.roleId,
        adminId: this.formItem.adminId
      }
      addAdmin(data).then(res => {
        if (data.adminId) { // 编辑
          this.successTip('修改管理员成功!')
        } else { // 添加
          this.successTip('添加管理员成功!')
        }
      }).catch(err => {
        this.errorTip('操作失败!', err)
      })
    },
    /**
     * 弹窗取消
     */
    handleCancel () {
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
          this.getAdmin()
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
    /**
     * 获取页面所需的数据
     */
    getData () {
      this.getAdmin()
      this.getRole()
    },
    /**
     * 获取管理员数据
     */
    getAdmin () {
      this.loading = true
      getAdmin().then(res => {
        this.adminData = res.data
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 获取角色数据
     */
    getRole () {
      getRole().then(res => {
        this.roleData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 初始化表单数据
     */
    initFormItem () {
      this.formItem.adminName = ''
      this.formItem.adminPwd = '123456'
      this.formItem.roleId = ''
      this.formItem.adminId = ''
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
