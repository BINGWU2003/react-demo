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
      <a style="color: #fff;" @click="updateVersion">更新版本</a>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const version = ref('14.15.8')

function updateVersion(){
  router.push('/login')
}
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
  padding: 50px 20px 0;
  box-sizing: border-box;
  background-image: url("@/assets/background.svg");
  background-size:  100vw auto;
}

.main {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  min-height: calc(100vh - 160px);
}

</style>
