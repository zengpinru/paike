<template>
  <i-layout class="layout">
    <i-header class="header">
      <i-row>
        <i-col span="20">
          <img src="../../assets/img/pk-logo.png" alt="logo" class="logo">
          <i-icon
            type="md-menu"
            size="24"
            class="controlMenu"
            :class="{ 'rotate-icon': isCollapsed }"
            @click.native="collapsedSide"
          />
        </i-col>
        <i-col span="4">
          <i-dropdown @on-click="handleDropdown">
            <i-avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" /> {{ adminName }}({{ roleName }})
            <i-dropdown-menu slot="list">
              <i-dropdown-item name="changePassword">修改密码</i-dropdown-item>
              <i-dropdown-item name="logout" divided>退出登录</i-dropdown-item>
            </i-dropdown-menu>
          </i-dropdown>
        </i-col>
      </i-row>
    </i-header>
    <i-sider class="sider" :class="{ 'sider-hide': isCollapsed }" width="240" collapsible v-model="isCollapsed" hide-trigger>
      <i-menu theme="dark" accordion class="sider-menu" :active-name="activeName" :open-names="openNames">
        <i-submenu  v-for="(value, key) in menuData" :key="key" :name="key">
          <template slot="title">
            <i-icon :type="value[0].parent.icon" />
            {{ value[0].parent.title }}
          </template>
          <i-menu-item  v-for="item in value" :name="item.name" :to="item.path" :key="item.name">
            {{ item.meta.title }}
          </i-menu-item>
        </i-submenu>
      </i-menu>
    </i-sider>
    <i-content class="content" :class="{ 'content-expand': isCollapsed }">
      <slot></slot>
    </i-content>
    <!-- 修改密码的弹窗  -->
    <i-modal
      v-model="showModal"
      title="修改密码"
      ok-text="提交"
      @on-ok="handleOk"
      @on-cancel="handleCancel"
    >
      <i-form :label-width="80" style="width: 300px;">
        <i-form-item label="旧密码:">
          <i-input v-model="formItem.oldPwd" placeholder="请填写旧密码" type="password" style="width: 240px;"/>
        </i-form-item>
        <i-form-item label="新密码:">
          <i-input v-model="formItem.newPwd" placeholder="请填写新密码" type="password" style="width: 240px;"/>
        </i-form-item>
      </i-form>
    </i-modal>
    <!-- 修改密码的弹窗/ -->
  </i-layout>
</template>

<script>
import { setToken } from '@/libs/util.js'
import { mapState } from 'vuex'
import { changePwd } from 'api/admin.js'

export default {
  data () {
    return {
      isCollapsed: false,
      openNames: [],
      activeName: '',
      adminName: window.sessionStorage.getItem('adminName'),
      roleName: window.sessionStorage.getItem('roleName'),
      formItem: {
        oldPwd: '',
        newPwd: ''
      },
      showModal: false
    }
  },
  computed: {
    ...mapState(['menuData'])
  },
  methods: {
    handleDropdown (name) {
      if (name === 'logout') { // 退出登录
        this.logout('退出登录成功!')
      } else if (name === 'changePassword') {
        this.showModal = true
      }
    },
    collapsedSide () {
      // fasle: 打开 ture: 关闭
      if (this.isCollapsed) {
        this.isCollapsed = false
      } else {
        this.isCollapsed = true
      }
    },
    handleOk () {
      changePwd({
        oldPwd: this.formItem.oldPwd,
        newPwd: this.formItem.newPwd,
        adminName: window.sessionStorage.getItem('adminName')
      }).then(res => {
        if (res.code === 200) {
          this.$Message.success({
            content: '修改密码成功!',
            onClose: () => {
              this.logout('请重新登录!')
            }
          })
        } else if (res.code === 201) {
          this.$Message.error({
            content: '密码不正确,请重新修改!'
          })
        } else {
          this.$Message.error({
            content: '修改密码失败!'
          })
        }
        this.formItem.oldPwd = ''
        this.formItem.newPwd = ''
      })
    },
    handleCancel () {
      this.formItem.oldPwd = ''
      this.formItem.newPwd = ''
    },
    logout (tip) {
      this.$router.push({
        name: 'login'
      })
      this.$Message.success({
        content: tip,
        onClose: () => {
          setToken('') // 清空token
          window.sessionStorage.clear() // 清空本地缓存
          window.location.reload()
        }
      })
    }
  },
  created () {
    let routeName = this.$route.name
    if (routeName === 'home') {
      this.openNames = []
      this.activeName = ''
    } else {
      this.openNames = [routeName.split('-')[0]]
      this.activeName = routeName
    }
  }
}
</script>

<style lang="less">
.layout {
  height: 100%;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0,0,0,.05)
}
.controlMenu {
  margin-left: 28px;
  cursor: pointer;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.logo {
  height: 60px;
  vertical-align: top;
}
.sider {
  z-index: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.sider-menu {
  margin-top: 60px;
}
.content {
  margin-top: 60px;
  padding: 16px;
  transition: all .2s ease-in-out;
}
// .content-expand {
//   margin-left: 64px;
// }
</style>
