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
        <button @click="handleClick">click</button>
        <div class="tips">选择打印机</div>
        <select name="device" id="device" v-model="selectValue"
          :style="{ color: statusColor, borderColor: statusColor }" @change="handleSelectChange">

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

  <Loading :showLoading="showLoading"> </Loading>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getUserDetail } from '@/axios/api/login'
import MqttPlugin from '@/utils/mqttPlugin'
import generateHtml from '@/utils/generateHtml'
import Loading from '@/components/loading/index.vue'
import { io } from "socket.io-client"
import { registerPrint, getMqttConfig, pushClientStatus, getPrintData, printCallback } from '@/axios/api/print'
let socket = null
const router = useRouter()
const selectValue = ref('')
const printDeviceList = ref([])
const showLoading = ref(false)
const userInfo = ref({
  cid: '',
  phone: '',
  user_name: ''
})
const statusColor = computed(() => {
  return selectValue.value ? '' : '#d9001b'
})
const mqttConfig = {
  host: '',
  port: '',
  username: '',
  password: '',
}
const modalName = ref('')
const msg = ref('')
const globalPrintData = {
  clientInfo: {},
  printerList: [],
  connectStatus: false
}
const errCallback = (newMag) => {
  modalName.value = 'Modal'
  msg.value = newMag
}

const handleClick = () => {
  console.log('click')
  console.log('globalPrintData', globalPrintData)

}
const loginOut = () => {
  window.localStorage.setItem('token', '')
  router.replace('/login')
}
const handleSelectChange = async (e) => {
  await registerPrint({
    printerName: e.target.value,
    clientId: window.localStorage.getItem('mac-address')
  })
}
const handlePrint = (htmlData) => {
  return new Promise(async (resolve, reject) => {
    const printDeviceName = selectValue.value
    if (!printDeviceName) {
      reject('请选择打印机')
      return
    }
    if (globalPrintData.connectStatus) {
      const pageSize = {
        width: 45 * 1000,
        height: 80 * 1000
      }
      const printer = selectValue.value
      const templateId = 'templateId'
      socket.emit("news", { html: htmlData, templateId, printer, pageSize, landscape: true })
    } else {
      errCallback('打印服务未连接')
    }
  })
}

const hideModal = () => {
  modalName.value = null
}

const connectMqtt = () => {
  const newMqtt = MqttPlugin()
  newMqtt.init(mqttConfig)
  const topic1 = `/device/print/${window.localStorage.getItem('mac-address')}/${window.localStorage.getItem('cid')}`
  newMqtt.sub(topic1, async (res) => {
    console.log('message', res)
    try {
      if (res?.push) {
        await pushClientStatus({
          clientId: window.localStorage.getItem('mac-address'),
          isPrint: res.push
        })
      }
      if (res?.taskId) {
        setTimeout(async () => {
          try {
            const resData = await getPrintData({
              taskId: res.taskId
            })

            const [htmlData] = await generateHtml(resData.data.printTemplate.template_json, resData.data.workOrderTicketPrintVOS)
            await handlePrint(htmlData)
            printCallback({
              taskId: res.taskId,
              clientId: window.localStorage.getItem('mac-address'),
              isSuccess: true,
            })
          } catch (error) {
            const msg = error.msg || error
            errCallback(msg)
            printCallback({
              taskId: res.taskId,
              clientId: window.localStorage.getItem('mac-address'),
              isSuccess: false,
            })
          }
        }, 1000)
      }
    } catch (error) {
      const msg = error.msg || error
      errCallback(msg)
    }
  })
}


const getPrintDevice = () => {
  return globalPrintData.printerList.map((item) => item.displayName)
}

onMounted(async () => {
  try {
    const res = await getUserDetail()
    userInfo.value = res.data
  } catch (error) {
    errCallback('获取用户数据失败')
  }

  const res = await getMqttConfig()
  mqttConfig.host = res.data.host
  mqttConfig.port = res.data.port
  mqttConfig.username = res.data.user_name
  mqttConfig.password = res.data.password
  connectMqtt()
  socket = io("http://localhost:17521", {
    transports: ["websocket"]
  })
  socket.on("connect", () => {
    globalPrintData.connectStatus = true
  })
  socket.on("clientInfo", (clientInfo) => {
    globalPrintData.clientInfo = clientInfo
  })

  socket.on("printerList", (printerList) => {
    globalPrintData.printerList = printerList
    printDeviceList.value = getPrintDevice()
  })
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