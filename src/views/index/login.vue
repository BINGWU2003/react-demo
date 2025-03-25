<template>
  <div class="form">
    <div style="margin-bottom: 20px" @click="showSwitch++">密码登录</div>
    <div class="form-item">
      <input type="text" class="form-item-input" v-model="form.userAccount" placeholder="请输入邮箱或手机号"/>
    </div>
    <div class="form-item">
      <input :type="showPassword ? '' : 'password'" class="form-item-input" v-model="form.userPassword"
             placeholder="请输入密码" @keyup.enter="confirmLogin"/>
      <span class="password-icon" :class="showPassword ? 'cuIcon-attention' : 'cuIcon-attentionfill'"
            @click="showPassword = !showPassword"></span>
    </div>
    <div class="form-item">
      <input type="text" class="form-item-input" v-model="baseUrl" placeholder="请输入服务地址,回车生效"
             @keyup.enter="setBaseUrl"
             v-if="showBaseUrl || showSwitch > 10"/>
    </div>
    <button class="login-btn" @click="confirmLogin">登录</button>
    <div class="click-area" @click="switchTestEnv">
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {phoneLogin} from '@/axios/api/login'
import {useRouter} from 'vue-router'
import {showToast} from '@/utils/common'
import devConfig from '@/common/devConfig.js'
import {user, client} from "@/utils/store";
import { useCollectLogs } from '@/hooks/collect-logs'
const router = useRouter()
const clickCount = ref(0)
const {collectLogs} = useCollectLogs()
let showPassword = ref(false)

const form = ref({
  userAccount: '',
  userPassword: '',
})
let showSwitch = ref(0);

let baseUrl = ref('')
baseUrl.value = client.baseUrl
const showBaseUrl = computed(() => {
  return baseUrl.value && baseUrl.value !== devConfig.baseUrl;
});

function setBaseUrl() {
  let urlValue = baseUrl.value;
  if (!urlValue) {
    return
  }
  if (!urlValue.startsWith('http')) {
    // 前缀自动补充 ip为http://  域名为https://
    let reg = /^[0-9]+.?[0-9]*$/
    if (reg.test(urlValue.substring(0, 1))) {
      baseUrl.value = 'http://' + urlValue
    } else {
      baseUrl.value = 'https://' + urlValue
    }
  }
  if (client.baseUrl !== urlValue) {
    client.baseUrl = urlValue;
    location.reload();
  }
}

async function confirmLogin() {
  if (!form.value.userAccount) {
    showToast('请输入账号')
    return
  }
  if (!form.value.userPassword) {
    showToast('请输入密码')
    return
  }
  try {
    const res = await phoneLogin(form.value)
    user.token = res.headerToken;
    collectLogs('登录成功', res.data.data)
    router.push('/company')
  } catch (error) {
    console.log(error)
    showToast("用户名或密码错误");
  }
}

const switchTestEnv = () => {
  clickCount.value++
  if (clickCount.value === 10) {
    showToast('再点击5次切换到测试环境');
  }
  if (clickCount.value === 15) {
    baseUrl.value = 'https://zyw.iipcloud.com';
    setBaseUrl();
  }
}

onMounted(async () => {
  //唯一标识
  if (!client.id) {
    client.id = await window.electron.getMacAddress()
  }
  if (!client.computerName) {
    client.computerName = await window.electron.getComputerName();
  }
  window.electron.showMainWindow();
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