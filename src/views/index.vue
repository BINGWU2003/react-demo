<!--
 * @Author: BINGWU
 * @Date: 2024-07-23 10:28:06
 * @LastEditors: hujiacheng hujiacheng@iipcloud.com
 * @LastEditTime: 2024-08-14 17:25:38
 * @FilePath: \print_client_service\src\views\index.vue
 * @Describe: 
 * @Mark: ૮(˶ᵔ ᵕ ᵔ˶)ა
-->
<template>
  <div class="login-page">
    <div class="window-header">
      <div class="main-title">智衣通</div>
      <div class="tip-title">欢迎使用</div>
    </div>

    <div class="main">
      <router-view></router-view>
    </div>

    <div style="font-size: 12px">
      <span style="color: #aaa;margin-right: 20px">v{{ version }}</span>
       <a style="color: #fff;" @click="clearCache">清除缓存</a>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import mqttClient from '@/utils/mqttPlugin'

const version = ref('1.0.0');

function clearCache() {
  localStorage.clear();
  mqttClient.disconnect();
  location.reload();
}

onMounted(async () => {
  version.value = await window.electron.getAppVersion();
})
</script>

<style scoped>
.window-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  color: #fff;
  font-size: 16px;
}

.window-header .main-title {
  font-size: 22px;
  padding-left: 20px;
}

.window-header .tip-title {
  color: #fff;
  background-color: #347DF9;
  padding: 6px 40px 6px 10px;
  font-size: 14px;
  font-weight: bold;
}

.login-page {
  min-height: 100%;
  text-align: center;
  padding: 26px 20px 0;
  box-sizing: border-box;
  background-image: url("@/assets/background.svg");
  background-size: 100vw auto;
}

.main {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  min-height: calc(100vh - 180px);
}

</style>
