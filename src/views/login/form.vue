<template>
  <div class="form">
    <div style="margin-bottom: 20px">密码登录</div>
    <div class="form-item">
      <input type="text" class="form-item-input" v-model="form.userAccount" placeholder="请输入邮箱或手机号"/>
    </div>
    <div class="form-item">
      <input type="password" class="form-item-input" v-model="form.userPassword" placeholder="请输入密码"/>
      <span class="password-icon" :class="showPassword?'cuIcon-attention':'cuIcon-attentionfill'"
            @click="showPassword = !showPassword"></span>
    </div>

    <button class="login-btn" @click="confirmLogin">登录</button>

    <iip-toast ref="toast"></iip-toast>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {phoneLogin} from '@/axios/api/login'
import {useRouter} from 'vue-router'

const router = useRouter()

let showPassword = ref(false)

const toast = ref(null)
const form = ref({
  userAccount: '',
  userPassword: ''
})

function confirmLogin() {
  console.log(11)
  if (!form.value.userAccount) {
    toast.value.showToast('请输入密码')
    return
  }
  if (!form.value.userPassword) {
    toast.value.showToast('请输入邮箱或手机号')
    return
  }
  phoneLogin(form.value).then(res => {
    router.push('/company')
  }, error => {
    console.log(error)
    toast.value.showToast(error.msg || error.message)
  })
}
</script>

<style scoped>

.form-item {
  position: relative;
  margin-bottom: 20px;
}

.form-item-input {
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.password-icon {

  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 20px;
}

.login-btn {
  background-color: #2878FF;
  width: 100%;
  color: #fff;
}
</style>