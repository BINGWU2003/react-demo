<template>
  <div class="print-page">
    <div style="width: 100%">
      <div class="header">
        <img src="http://cdn.iipcloud.com/20191216117714588.png" alt="" class="user-img"/>
        <div>
          <div>{{ userInfo.user_name }} <a @click="loginOut">退出登录</a></div>
          <div>{{ userInfo.phone }}</div>
        </div>
      </div>
      <div style="text-align: left;font-size: 18px;">{{ userInfo.cid }}</div>
      <div class="select-device" style="padding-bottom:10px">
        <div class="tips">选择打印机</div>
        <select name="device" id="device" v-model="selectValue"
                :style="{ color: statusColor, borderColor: statusColor }" @change="handleSelectChange">

          <option v-for="(item) in printDeviceList" :value="item" :style="{ color: statusColor }">{{
              item
            }}
          </option>
          <option value="" :style="{ color: statusColor }" v-show="!selectValue">请选择打印机</option>
        </select>
      </div>
      <div class="select-device">
        <div class="tips">打印机状态</div>
        <select name="deviceOnLine" id="deviceOnLine" v-model="deviceOnLineState">
          <option value="在线">在线</option>
          <option value="离线">离线</option>
        </select>
      </div>
    </div>
    <img src="@/assets/qrcode.png" alt="" class="main-img"/>
    <div style="font-weight: 600;color: #828282;">可以通过智衣通小程序发起打印</div>
  </div>

  <Loading :showLoading="showLoading"></Loading>
</template>

<script setup>

import {onMounted, ref, computed, watch, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {getUserDetail} from '@/axios/api/login'
import MqttPlugin from '@/utils/mqttPlugin'
import generateHtml from '@/utils/generateHtml'
import Loading from '@/components/loading/index.vue'
import {registerPrint, getMqttConfig, pushClientStatus, getPrintData, printCallback} from '@/axios/api/print'
import {showToast} from '@/utils/common'
import dayjs from 'dayjs'
import {user, client, printer} from "@/utils/store";

const router = useRouter()
const selectValue = ref('')
const printDeviceList = ref([])
const showLoading = ref(false)
const printState = ''
const userInfo = ref({
  cid: '',
  phone: '',
  user_name: ''
})
var deviceOnLineState = ref('在线');
const statusColor = computed(() => {
  return selectValue.value ? '' : '#d9001b'
})
let timer = null
watch(selectValue, async (printerName, oldValue) => {
  printer.name = printerName;
  // 首次赋值时取上次的状态
  if (oldValue) {
    await setPrinterAttribute();
  }
})
watch(deviceOnLineState, async (state) => {
  await setPrinterAttribute();
})

async function setPrinterAttribute() {
  const printStatus = await window.electron.getPrinterStatus(printer.name);
  printer.currAttribute = printStatus.attributes;
  if (deviceOnLineState._value === '在线') {
    printer.onlineAttribute = printStatus.attributes;
    printer.offlineAttribute = '';
  } else {
    printer.onlineAttribute = '';
    printer.offlineAttribute = printStatus.attributes;
  }
  console.log('打印机信息', printer);
  console.log('打印机是否在线', printer.isOnline);
}

const mqttConfig = {
  host: '',
  port: '',
  username: '',
  password: '',
}
let newMqtt;
// 客户端信息

const loginOut = () => {
  user.token = '';
  // 断开mqtt连接诶
  if (newMqtt) {
    newMqtt.disconnect();
  }
  router.replace('/login')
}
const handleSelectChange = async (e) => {
  await registerPrint({
    printerName: e.target.value,
    clientId: client.id
  })
  client.printerName = e.target.value;
}

const updateClientStatus = async (e) => {
  let para = {
    clientId: client.id,
    isPrint: true,
    noPrintCause: '',
  }
  let printStatus;
  if(printer.name){
    printStatus = await window.electron.getPrinterStatus(printer.name);
    printer.currAttribute = printStatus.attributes;
  }
  if (!printer.name) {
    para.noPrintCause = '未选择打印机';
  } else if (!printer.isOnline) {
    para.noPrintCause = '打印机离线';
  } else if (printStatus.isBusy) {
    para.noPrintCause = '打印机正在打印中';
  } else if (printStatus.isError) {
    para.noPrintCause = '打印机状态异常,请检查';
  }
  para.isPrint = !para.noPrintCause;
  await pushClientStatus(para)
}

const handlePrint = (htmlData, width = 40, height = 60) => {
  return new Promise(async (resolve, reject) => {
    const deviceName = selectValue.value
    if (!deviceName) {
      reject('请选择打印机')
      return
    }
    const printStatus = await window.electron.getPrinterStatus(deviceName);
    printer.onlineAttribute = printStatus.attributes
    if (!printer.isOnline) {
      reject('打印机离线，请检查');
      return;
    }
    if (printStatus.isBusy) {
      reject('打印机正在打印中');
      return;
    }
    if (printStatus.isError) {
      reject('打印机状态异常,请检查');
      return;
    }
    const options = {
      deviceName, // 替换为你的打印机名称
      pageSize: {
        width: width * 1000,
        height: height * 1000
      }
    }
    try {
      const result = await window.electron.print(htmlData, options)
      if (result.success) {
        resolve('打印成功')
      } else {
        reject('打印失败')
      }
    } catch (error) {
      console.log('打印失败', error);
      reject(error.message);
    }
  })
}

async function doPrint(taskId) {
  try {
    const resData = await getPrintData({taskId})
    if (resData.data.msg) {
      showToast(resData.data.msg);
      return;
    }
    resData.data.workOrderTicketPrintVOS = resData.data.workOrderTicketPrintVOS.map((item) => {
      item.printTime = dayjs().format('YYYY-MM-DD HH:mm');
      return item;
    });
    const [htmlData, width, height] = await generateHtml(resData.data.printTemplate.template_json, resData.data.workOrderTicketPrintVOS)
    let errorInfo = '';
    try {
      await handlePrint(htmlData, width, height)
      // 获取打印机状态，回调状态有问题，会一直为成功状态
      let printStatus = await window.electron.getPrinterStatus(printer.name);
      printer.currAttribute = printStatus.attributes;
      if (!printer.isOnline) {
        errorInfo = '打印机离线';
      } else if (printStatus.isPrinting) {
        // 再次获取打印状态
        await window.electron.getPrinterStatus(printer.name);
      } else if (printStatus.isError) {
        errorInfo = '打印机状态异常,请检查';
      } else if (printStatus.isBusy) {
        errorInfo = '打印机正在打印中';
      }
    } catch (error) {
      errorInfo = error.message;
      showToast(error.message);
    }
    await printCallback({
      taskId,
      clientId: client.id,
      isSuccess: errorInfo === '',
      errorInfo
    });
    updateClientStatus();
  } catch (error) {
    showToast(error.msg)
  }
}

const connectMqtt = () => {
  newMqtt = MqttPlugin()
  newMqtt.init(mqttConfig)
  const topic = `/device/print/${client.id}/${user.cid}`
  newMqtt.sub(topic, async (res) => {
    console.log('message', res);
    if (res?.push) {
      try {
        await updateClientStatus();
      } catch (error) {
        console.log('error', error)
      }
      return;
    }
    if (res.taskId) {
      // 打印任务
      doPrint(res.taskId);
    }
  })
}
const getPrintDevice = async () => {
  const printers = await window.electron.getPrinters()
  return printers.map((item) => item.name)
}


onMounted(async () => {
  selectValue.value = printer.name || '';
  try {
    const res = await getUserDetail()
    userInfo.value = res.data;
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
  updateClientStatus();
  timer = setInterval(() => {
    getPrintDevice().then((res) => {
      printDeviceList.value = res
    })
  },10000)
})
onUnmounted(() => {
  clearInterval(timer)
  if (newMqtt) {
    newMqtt.disconnect();
  }
})
</script>

<style sass scoped>
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

.user-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.main-img {
  margin: 10px 0;
  width: 42%;
}

.select-device {
  display: flex;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f2f2f2;
}

select {
  background: white;
  border-color: #d7d7d7;
  color: black;
  height: 30px;
  width: calc(100% - 100px);
  border-radius: 4px;
  font-weight: 700;
  padding-left: 10px;
}

.tips {
  font-size: 13px;
  margin-right: 4px;
}

option {
  color: black;
  font-weight: 700;
}
</style>