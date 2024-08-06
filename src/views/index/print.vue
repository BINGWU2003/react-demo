<template>
  <div class="print-page">
    <div style="width: 100%">
      <div class="header">
        <img src="http://cdn.iipcloud.com/20191216117714588.png" alt="" />
        <div>
          <div>{{ userInfo.user_name }} <a @click="loginOut">退出登录</a></div>
          <div>{{ userInfo.phone }}</div>
        </div>
      </div>
      <div style="text-align: left;font-size: 18px;">{{ userInfo.cid }}</div>
      <div class="select-device">
        <div class="tips">选择打印机</div>
        <select name="device" id="device" v-model="selectValue"
          :style="{ color: statusColor, borderColor: statusColor }">
         
          <option v-for="(item) in printDeviceList" :value="item" :style="{ color: statusColor }">{{ item
            }}
          </option>
          <option value="" :style="{ color: statusColor }" v-show="!selectValue">请选择打印机</option>
        </select>
      </div>
    </div>
    <img src="@/assets/logo.png" alt="" class="main-img" />
    <div style="font-weight: 600;color: #828282;">可以通过智衣通小程序发起打印</div>
  </div>

  <div class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
    <div class="cu-dialog">
      <div class="cu-bar bg-white justify-end">
        <div class="content">提示</div>
        <div class="action" @click="hideModal">
          <span class="cuIcon-close text-red"></span>
        </div>
      </div>
      <div class="padding-xl" v-html="msg">
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref ,computed} from 'vue'
import { useRouter } from 'vue-router'
import { getUserDetail } from '@/axios/api/login'
import { printerStatusReport } from '@/axios/api/print'
import { loadCLodop, getLodop } from '@/utils/LodopFuncs'
import MqttPlugin from '@/utils/mqttPlugin'

const router = useRouter()
const selectValue = ref('')
const printDeviceList = ref(['打印机1', '打印机2', '打印机3', '打印机4', '打印机5'])
const userInfo = ref({
  cid: '',
  phone: '',
  user_name: ''
})
const statusColor = computed(()=>{
  return selectValue.value ? '' : '#d9001b'
})
function loginOut() {
  window.localStorage.setItem('token', '')
  router.replace('/login')
}

const timeouter = setInterval(() => {
  printerStatusReport({
    clientId: '',
    status: '',
    id: ''
  })
}, 30000)

function getUseInfo() {
  getUserDetail().then(res => {
    userInfo.value = res.data
    console.log(res.data)

    connectMqtt()
  })
}

const modalName = ref('')
const msg = ref('')
function errCallback(newMag) {
  modalName.value = 'Modal'
  msg.value = newMag
}

function hideModal() {
  modalName.value = null
}

function connectMqtt() {
  const newMqtt = MqttPlugin()
  newMqtt.init({
    host: '192.168.0.188',
    port: '8083',
    username: 'iipmes',
    password: 'iipmes',
  })
  // const topic = '/mqtt_backend/'
  const topic1 = `/device/print/${window.localStorage.getItem('uuid')}`
  newMqtt.sub(topic1, (res) => {
    if (!res.contentUrl) return
    let LODOP = getLodop(null, null, errCallback)
    LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_按网址打印", res.contentUrl)
    LODOP.ADD_PRINT_URL(30, 20, 746, "95%",)
    LODOP.SET_PRINT_STYLEA(0, "HOrient", 3)
    LODOP.SET_PRINT_STYLEA(0, "VOrient", 3)
    LODOP.PRINT()
  })
}

onMounted(() => {
  loadCLodop()
  getUseInfo()
})
</script>

<style sass scoped>
.print-page {
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    text-align: left;

    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
  }

  .main-img {
    width: 50%;
  }

  .select-device {
    display: flex;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid #f2f2f2;

    .tips {
      font-size: 13px;
      margin-right: 4px;
    }

    select {
      background: white;
      border-color: #d7d7d7;
      color: black;
      height: 30px;
      width: 200px;
      border-radius: 4px;
      font-weight: 700;
      padding-left: 10px;

      option {
        color: black;
        font-weight: 700;
      }
    }
  }
}
</style>