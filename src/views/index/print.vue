<template>
  <div class="print-page">
    <div style="width: 100%">
      <div class="header">
        <div style="display: flex;align-items: center;">
          <img src="http://cdn.iipcloud.com/20191216117714588.png" alt="" class="user-img" />
          <div style="margin-top: 3px;">
            <div>{{ userInfo.user_name }} <a @click="logout">退出登录</a></div>
            <div>{{ userInfo.phone }}</div>
          </div>
        </div>
        <div>
          <div>
            打印机状态：{{ printStatusShow }}
          </div>
          <div style="display: flex;align-items: center;">
            网络状态：<div style="height: 16px;width: 16px;border-radius: 50%;" :style="{ backgroundColor: netWorkStatus }">
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: left;font-size: 18px;">{{ userInfo.cid }}</div>
      <div class="select-device" style="padding-bottom:10px">
        <div class="tips">选择打印机</div>
        <select name="device" id="device" v-model="printerName"
          :style="{ color: statusColor, borderColor: statusColor }" @change="handleSelectChange">

          <option class="option" v-for="(item) in printDeviceList" :value="item" :style="{ color: statusColor }">{{
            item
            }}
          </option>
          <option value="" :style="{ color: statusColor }" v-show="!printerName" class="option">请选择打印机</option>
        </select>
      </div>
    </div>
    <img src="@/assets/qrcode.png" alt="" class="main-img" />
    <div style="font-weight: 600;color: #828282;">可以通过智衣通小程序发起打印</div>
    <div v-if="printerName" style="color: red">若出现打印机状态识别错误，请确保打印机在线(可正常打印)的情况下，点击下方"清除缓存"后重新登录选择打印设备
    </div>
  </div>

  <Loading :showLoading="showLoading"></Loading>
</template>

<script setup>

import {onMounted, ref, computed, watch, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {getUserDetail} from '@/axios/api/login'
import mqttClient from '@/utils/mqttPlugin'
import generateHtml from '@/utils/generateHtml'
import Loading from '@/components/loading/index.vue'
import {registerPrint, getMqttConfig, pushClientStatus, getPrintData, printCallback} from '@/axios/api/print'
import {showToast} from '@/utils/common'
import dayjs from 'dayjs'
import {user, client, printer} from "@/utils/store";
import { useCollectLogs } from '@/hooks/collect-logs'
const { collectLogs, currentTopic, netWorkStatus } = useCollectLogs()
const router = useRouter()
const printerName = ref(printer.name || '');
const printDeviceList = ref([])
const showLoading = ref(false)
const userInfo = ref({
  cid: '',
  phone: '',
  user_name: ''
})
const printStatus = ref({
  // 在线和脱机时，返回的值不一样，且在线时的值会比脱机时的值要小，在不同电脑上，这个值会不一样
  attributes: '',
  isError: false,
  isBusy: false,
});
const statusColor = computed(() => {
  return printerName.value ? '' : '#d9001b'
})
let timer = null
const printStatusShow = computed(() => {
  if (!printerName.value) {
    return '请选择打印机';
  }
  if (printStatus.value.attributes !== '') {
    return printer.isOnline ? '在线' : '离线';
  }
  return '未知';
})
watch(printerName, async (newValue) => {
  if (printer.name !== newValue) {
    printer.name = newValue;
    await registerPrint({
      printName: newValue,
      clientId: client.id
    })
  }
  await updatePrintStatus();
})

async function updatePrintStatus() {
  if (!printer.name) {
    // 未选择打印机
    await updateClientStatus();
    return printStatus.value;
  }
  const printStatusValue = await window.electron.getPrinterStatus(printer.name);
  let statusChanged = printer.currAttribute !== printStatusValue.attributes;
  printer.currAttribute = printStatusValue.attributes;
  // 更新打印状态值
  if (!printer.onlineAttribute && !printer.offlineAttribute) {
    // 默认为在线状态
    printer.onlineAttribute = printStatusValue.attributes;
  } else if (printer.onlineAttribute) {
    // onlineAttribute 为最小值
    if (Number(printer.onlineAttribute) > Number(printer.currAttribute)) {
      printer.offlineAttribute = printer.onlineAttribute;
      printer.onlineAttribute = printer.currAttribute;
    } else if (Number(printer.onlineAttribute) < Number(printer.currAttribute)) {
      printer.offlineAttribute = printer.currAttribute;
    }
  } else if (printer.offlineAttribute) {
    // offlineAttribute 为最大值
    if (Number(printer.offlineAttribute) < Number(printer.currAttribute)) {
      printer.onlineAttribute = printer.offlineAttribute;
      printer.offlineAttribute = printer.currAttribute;
    }
  }
  printStatus.value = printStatusValue;
  if (statusChanged) {
    // 上报状态
    await updateClientStatus(printStatusValue);
  }
  return printStatus.value;
}


const logout = () => {
  user.token = '';
  // 断开mqtt连接
  mqttClient.disconnect({
    msg: '用户退出登录',
    clientId: client.id,
    topic: currentTopic.value,
    ...user
  });
  router.replace('/login')
}
const handleSelectChange = async (e) => {
  await registerPrint({
    printName: e.target.value,
    clientId: client.id
  })
  printer.name = e.target.value;
}

const updateClientStatus = async (printStatus) => {
  let para = {
    clientId: client.id,
    isPrint: true,
    noPrintCause: '',
  }
  if (printer.name && !printStatus) {
    printStatus = await window.electron.getPrinterStatus(printer.name);
    printer.currAttribute = printStatus.attributes;
  }
  if (!printer.name) {
    para.noPrintCause = '未选择打印机';
  } else if (!printer.isOnline) {
    para.noPrintCause = '打印机离线';
  } else if (printStatus.isBusy) {
    para.noPrintCause = '打印机正在打印中，如未打印，请检查';
  } else if (printStatus.isError) {
    para.noPrintCause = '打印机状态异常,请检查';
  }
  para.isPrint = !para.noPrintCause;
  try {
    await pushClientStatus(para)
    collectLogs(`设备:${client.id}上报状态成功,请求参数`, para)
  } catch (error) {
    collectLogs(`设备:${client.id}上报状态失败,原因:请求响应失败,请求参数`,para)
    console.log('error', error)
  }
}

const handlePrint = (htmlData, width = 40, height = 60) => {
  return new Promise(async (resolve, reject) => {
    const deviceName = printerName.value
    if (!deviceName) {
      reject('请选择打印机')
      return
    }
    const printStatus = await window.electron.getPrinterStatus(deviceName);
    printer.currAttribute = printStatus.attributes
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
  // 获取打印数据
  const resData = await getPrintData({taskId})
  if (resData.data.msg) {
    collectLogs(`打印失败,clientId:${client.id},taskId:${taskId},printerName:${printerName.value},msg:${resData.data.msg}`)
    showToast(resData.data.msg)
    return
  }
  resData.data.workOrderTicketPrintVOS = resData.data.workOrderTicketPrintVOS.map((item) => {
    item.printTime = dayjs().format('YYYY-MM-DD HH:mm');
    return item;
  });
  const [htmlData, width, height] = await generateHtml(resData.data.printTemplate.template_json, resData.data.workOrderTicketPrintVOS)
  let errorInfo = '';
  try {
    // 检查打印机状态
    errorInfo = await checkPrintStatus();
    if (!errorInfo) {
      await handlePrint(htmlData, width, height)
      let printStatus = await updatePrintStatus();
      if (!printer.isOnline) {
        errorInfo = '打印机离线';
      } else if (printStatus.isPrinting || printStatus.isBusy) {
        // 再次获取打印状态
        await window.electron.getPrinterStatus(printer.name);
      } else if (printStatus.isError) {
        errorInfo = '打印机状态异常,请检查';
      }
    } else {
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

}

const checkPrintStatus = async () => {
  let errorInfo = '';
  let printStatus = await updatePrintStatus();
  if (!printer.name) {
    return '未选择打印机';
  }
  if (!printer.isOnline) {
    errorInfo = '打印机离线';
  } else if (printStatus.isPrinting) {
    errorInfo = '打印机正在打印中';
  } else if (printStatus.isError) {
    errorInfo = '打印机状态异常,请检查';
  } else if (printStatus.isBusy) {
    errorInfo = '打印机正在繁忙';
  }
  return errorInfo;
}

const connectMqtt = async () => {
  mqttClient.disconnect({
    msg: '断开之前的连接',
    clientId: client.id,
    topic: currentTopic.value
  });
  const res = await getMqttConfig();
  const topic = `/device/print/${client.id}/${user.cid}`;
  currentTopic.value = topic;
  mqttClient.init({
    host: res.data.host,
    port: res.data.port,
    username: res.data.user_name,
    password: res.data.password,
  }, () => {
    // 订阅消息
    mqttClient.sub(topic, onMessage);
  })

  async function onMessage(message) {
    console.log('message', message);
    if (message?.push) {
      //带push参数待表为心跳消息
      try {
        await updateClientStatus();
      } catch (error) {
        console.log('error', error)
      }
      return;
    }
    if (message.taskId) {
      // 打印任务
      try {
        await doPrint(message.taskId);
        collectLogs(`打印成功,clientId:${client.id},taskId:${message.taskId},printerName:${printerName.value}`)
      } catch (error) {
        console.error("打印失败", error);
        showToast(error.msg)
        collectLogs(`打印失败,clientId:${client.id},taskId:${message.taskId},printerName:${printerName.value},errorInfo:${error.msg}`, '', 'red')
      }
    }
  }
}
const getPrintDevice = async () => {
  const printers = await window.electron.getPrinters()
  return printers.map((item) => item.name)
}


onMounted(async () => {
  try {
    const res = await getUserDetail();
    userInfo.value = res.data;
    printDeviceList.value = await getPrintDevice();
    await connectMqtt()
    updatePrintStatus();
  } catch (error) {
    showToast(error.msg || error)
  }
  timer = setInterval(() => {
    getPrintDevice().then((res) => {
      printDeviceList.value = res
    })
    updatePrintStatus();
  }, 30000)
})
onUnmounted(() => {
  clearInterval(timer)
  mqttClient.disconnect({
    msg: '页面卸载',
    clientId: client.id,
    topic: currentTopic.value
  });
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
  justify-content: space-between;
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
  width: 52%;
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

.option {
  color: black;
  font-weight: 700;
}
</style>