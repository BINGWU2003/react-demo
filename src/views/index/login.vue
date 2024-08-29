<template>
  <div class="form">
    <div style="margin-bottom: 20px">密码登录</div>
    <div class="form-item">
      <input type="text" class="form-item-input" v-model="form.userAccount" placeholder="请输入邮箱或手机号" />
    </div>
    <div class="form-item">
      <input :type="showPassword ? '' : 'password'" class="form-item-input" v-model="form.userPassword"
        placeholder="请输入密码" @keyup.enter="confirmLogin"/>
      <span class="password-icon" :class="showPassword ? 'cuIcon-attention' : 'cuIcon-attentionfill'"
        @click="showPassword = !showPassword"></span>
    </div>
    <div class="form-item">
      <input type="text" class="form-item-input" v-model="baseUrl" placeholder="请输入服务地址" v-if="props.showSwitch > 5" />
    </div>
    <button class="login-btn" @click="confirmLogin">登录</button>
    <div class="click-area" @click="handleClick">

    </div>
    <div class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
    <div class="cu-dialog">
      <div class="cu-bar bg-white justify-end">
        <div class="content">提示</div>
        <div class="action" @click="hideModal">
        </div>
      </div>
      <div class="padding-xl" v-html="'切换到测试环境'">
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { phoneLogin } from '@/axios/api/login'
import { useRouter } from 'vue-router'
import { showToast } from '@/utils/common'
import devConfig from '@/common/devConfig.js'

const router = useRouter()
const clickCount = ref(0)
const props = defineProps(['showSwitch'])
const modalName = ref('')
let showPassword = ref(false)

const form = ref({
  userAccount: '',
  userPassword: '',
})

let baseUrl = ref('')
baseUrl.value = window.localStorage.getItem('baseUrl') || devConfig.baseUrl

function setBaseUrl(baseUrlVal) {
  if (!baseUrlVal) {
    return
  }
  let baseUrl = baseUrlVal
  if (!baseUrl.startsWith('http')) {
    // 前缀自动补充 ip为http://  域名为https://
    let reg = /^[0-9]+.?[0-9]*$/
    if (reg.test(baseUrl.substring(0, 1))) {
      baseUrl = 'http://' + baseUrl
    } else {
      baseUrl = 'https://' + baseUrl
    }
  }
  window.localStorage.setItem('baseUrl', baseUrl)
}

async function confirmLogin() {
  if (!form.value.userAccount) {
    showToast('请输入密码')
    return
  }
  if (!form.value.userPassword) {
    showToast('请输入邮箱或手机号')
    return
  }
  setBaseUrl(baseUrl.value)
  try {
    const res = await phoneLogin(form.value)
    window.localStorage.setItem('token', res.headerToken)
    router.push('/company')
  } catch (error) {
    console.log(error)
  }
}
const handleClick = () => {
  clickCount.value++
  if (clickCount.value === 10) {
    window.localStorage.setItem('baseUrl', 'https://zyw.iipcloud.com')
    modalName.value = 'Modal'
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
}
onMounted(async () => {
  //唯一标识
  if (!window.localStorage.getItem('mac-address')) {
    const macAddress = await window.electron.getMacAddress()
    window.localStorage.setItem('mac-address', macAddress)
  }
  if (!window.localStorage.getItem('computer-name')) {
    const computerName = await window.electron.getComputerName()
    window.localStorage.setItem('computer-name', computerName)
  }
})
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
  outline: none;
}

.click-area {
  height: 100px;
  width: 100px;
  margin: 0 auto;
  margin-top: 20px;
}
</style>