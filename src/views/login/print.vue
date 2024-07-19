<template>
  <div class="print-page">
    <div style="width: 100%">
      <div class="header">
        <img src="@/assets/vue.svg" alt=""/>
        <div>
          <div>{{ userInfo.cid }} <a @click="loginOut">退出登录</a></div>
          <div>{{ userInfo.phone }}</div>
        </div>
      </div>
      <div style="text-align: left">{{ userInfo.company }}</div>
    </div>
    <img src="@/assets/vue.svg" alt="" class="main-img"/>
    <div style="font-weight: 600;color: #828282;">可以通过智衣通小程序发起打印</div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {getUserDetail} from '@/axios/api/login';
import {loadCLodop, getLodop} from '@/utils/LodopFuncs';
import MqttPlugin from '@/utils/mqttPlugin';

const router = useRouter()

const userInfo = ref({
  cid: '好多鱼',
  phone: '1231435435',
  company: '株洲衣如服饰有限公司'
})

function loginOut() {
  window.localStorage.setItem('token', '')
  router.go(-2)
}

function getUseInfo() {
  getUserDetail().then(res => {
    userInfo.value = res.data
    connectMqtt()
  })
}

function connectMqtt() {
  const newMqtt = MqttPlugin()
  newMqtt.init({
    host: '192.168.0.188',
    port: '8083',
    username: 'iipmes',
    password: 'iipmes',
  })
  newMqtt.sub('/mqtt_backend', (res) => {
    console.log(res)
    if (!res.contentUrl) return
    let LODOP = getLodop();
    LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_按网址打印", res.contentUrl);
    LODOP.ADD_PRINT_URL(30, 20, 746, "95%",);
    LODOP.SET_PRINT_STYLEA(0, "HOrient", 3);
    LODOP.SET_PRINT_STYLEA(0, "VOrient", 3);
    LODOP.PREVIEW();
  })
}

onMounted(() => {
  loadCLodop()
  getUseInfo()
})
</script>

<style scoped>
.print-page {
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  text-align: left;
}

.header img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.main-img {
  width: 50%;
}
</style>