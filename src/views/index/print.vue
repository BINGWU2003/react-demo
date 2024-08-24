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
          :style="{ color: statusColor, borderColor: statusColor }" @change="handleSelectChange">

          <option v-for="(item) in printDeviceList" :value="item" :style="{ color: statusColor }">{{ item
            }}
          </option>
          <option value="" :style="{ color: statusColor }" v-show="!selectValue">请选择打印机</option>
        </select>
      </div>
    </div>
    <img src="@/assets/qrcode.png" alt="" class="main-img" />
    <div style="font-weight: 600;color: #828282;">可以通过智衣通小程序发起打印</div>
  </div>

  <Loading :showLoading="showLoading"> </Loading>
</template>

<script setup>

import { onMounted, ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserDetail } from '@/axios/api/login'
import MqttPlugin from '@/utils/mqttPlugin'
import generateHtml from '@/utils/generateHtml'
import Loading from '@/components/loading/index.vue'
import { registerPrint, getMqttConfig, pushClientStatus, getPrintData, printCallback } from '@/axios/api/print'
import db from '@/utils/db'
import { showToast } from '@/utils/common'
const router = useRouter()
const selectValue = ref('')
const printDeviceList = ref([])
const showLoading = ref(false)
const userInfo = ref({
  cid: '',
  phone: '',
  user_name: ''
})
let taskId = ''
const statusColor = computed(() => {
  return selectValue.value ? '' : '#d9001b'
})
let timer = null
watch(selectValue, (printerName) => {
  window.localStorage.setItem('printerName', printerName)
})
const mqttConfig = {
  host: '',
  port: '',
  username: '',
  password: '',
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
const handlePrint = (htmlData, width = 40, height = 60) => {
  return new Promise(async (resolve, reject) => {
    const deviceName = selectValue.value
    if (!deviceName) {
      reject('请选择打印机')
      return
    }
    const status = await window.electron.getPrinterStatus(selectValue.value)
    if (status === '打印机为空闲状态' || status === '打印机为打印状态' || status === '其他') {
      const options = {
        deviceName, // 替换为你的打印机名称
        pageSize: {
          width: (width + 10) * 1000,
          height: height * 1000
        }
      }
      const result = await window.electron.print(htmlData, options)
      if (result.success) {
        resolve('打印成功')
      } else {
        reject('打印失败')
      }
      return
    } else {
      reject(status)
    }
  })
}
const connectMqtt = () => {
  const newMqtt = MqttPlugin()
  newMqtt.init(mqttConfig)
  const topic = `/device/print/${window.localStorage.getItem('mac-address')}/${window.localStorage.getItem('cid')}`
  newMqtt.sub(topic, async (res) => {
    console.log('message', res)
    if (res?.push) {
      try {
        await pushClientStatus({
          clientId: window.localStorage.getItem('mac-address'),
          isPrint: res.push
        })
      } catch (error) {
        console.log('error', error)
      }
    }

    if (res.taskId) {
      setTimeout(async () => {
        try {
          const resData = await getPrintData({
            taskId: res.taskId
          })
          taskId = res.taskId
          if (resData.data.msg === '找不到对应的打印模版') {
            showToast(resData.data.msg)
          } else {
            resData.data.workOrderTicketPrintVOS = resData.data.workOrderTicketPrintVOS.map((item) => {
              const now = new Date()
              item.printTime = now.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              }) + ' ' + now.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
              })
              return item
            })
            const [htmlData, width, height] = await generateHtml(resData.data.printTemplate.template_json, resData.data.workOrderTicketPrintVOS)
            let isSuccess = false
            let msg = ''
            try {
              await handlePrint(htmlData, width, height)
              isSuccess = true
            } catch (error) {
              isSuccess = false
              msg = error
              showToast(error)
            }
            await printCallback({
              taskId,
              isSuccess,
              clientId: window.localStorage.getItem('mac-address')
            })
            await pushClientStatus({
              clientId: window.localStorage.getItem('mac-address'),
              isPrint: isSuccess,
              noPrintCause: msg
            })
          }
        } catch (error) {
          await pushClientStatus({
            clientId: window.localStorage.getItem('mac-address'),
            isPrint: res.push
          })
          showToast(error.msg)
        }
      }, 1000)
    }
  })
}
const getPrintDevice = async () => {
  const printers = await window.electron.getPrinters()
  return printers.map((item) => item.name)
}



onMounted(async () => {
  selectValue.value = window.localStorage.getItem('printerName') || ''
  try {
    const res = await getUserDetail()
    userInfo.value = res.data
    printDeviceList.value = await getPrintDevice()
    const mqttConfigData = await getMqttConfig()
    mqttConfig.host = mqttConfigData.data.host
    mqttConfig.port = mqttConfigData.data.port
    mqttConfig.username = mqttConfigData.data.user_name
    mqttConfig.password = mqttConfigData.data.password
    connectMqtt()
  } catch (error) {
    showToast(error.msg || error)
  }
  timer = setInterval(() => {
    getPrintDevice().then((res) => {
      printDeviceList.value = res
    })
  }, 3000)
})
onUnmounted(() => {
  clearInterval(timer)
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
    margin-top: 30px;
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