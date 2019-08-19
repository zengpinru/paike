<template>
  <div class="login">
    <div class="form">
      <div class="form-header">大学排课系统</div>
      <i-form :model="formItem" :rules="rules" ref="formLogin">
        <i-form-item prop="user">
          <i-input type="text" v-model="formItem.user" placeholder="管理员名称">
            <i-icon type="ios-person-outline" slot="prepend"/>
          </i-input>
        </i-form-item>
        <i-form-item prop="password">
          <i-input type="password" v-model="formItem.password" placeholder="管理员密码">
            <i-icon type="ios-lock-outline" slot="prepend"/>
          </i-input>
        </i-form-item>
        <i-form-item>
          <i-button type="primary" @click="handleLogin('formLogin')" class="button">登录</i-button>
        </i-form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
import { login } from 'api/admin.js'
import { setToken } from '@/libs/util.js'

export default {
  data () {
    return {
      formItem: {
        user: '',
        password: ''
      },
      rules: {
        user: [
          { required: true, message: '管理名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin (name) {
      this.$refs[name].validate(valid => {
        if (valid) { // 前端表单验证
          login({ // 请求登录api
            username: this.formItem.user,
            password: this.formItem.password
          }).then(res => {
            if (res.code === 200 && res.data.token) { // 成功设置token并跳转到首页
              setToken(res.data.token)
              window.sessionStorage.setItem('adminName', res.data.adminName)
              window.sessionStorage.setItem('roleName', res.data.roleName)
              this.$router.push({
                path: '/'
              })
            } else {
              this.$Message.error({
                content: '用户名或者密码不正确!'
              })
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$Message.error('失败!')
        }
      })
    }
  }
}
</script>

<style lang="less">
.login {
  height: 100%;
  position: relative;
}
div.form {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 300px;
  height: 195px;
}
.form-header {
  height: 50px;
  line-height: 50px;
  font-size: 25px;
  text-align: center;
}
.button {
  width: 100%;
}
</style>
