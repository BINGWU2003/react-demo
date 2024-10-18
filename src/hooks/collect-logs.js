import dayjs from "dayjs"
import { ref, onMounted, onUnmounted } from "vue"
const currentTopic = ref('')
// red yellow green(默认green)
const netWorkStatus = ref('green')
const lastCollectYellowTime = ref('')
let timer = null
export const useCollectLogs = () => {
  const collectLogs = async (message, messageObj, status) => {
    if (messageObj) {
      if (typeof messageObj === 'object') {
        message += JSON.stringify(messageObj)
      } else if (typeof messageObj === 'string') {
        message += messageObj
      }
    }
    if (status) {
      netWorkStatus.value = status
      if (status === 'yellow') {
        lastCollectYellowTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    }
    await window.electron.generateLog(message)
  }
  const checkYellowTime = () => {
    if (lastCollectYellowTime.value) {
      const now = dayjs()
      const lastYellow = dayjs(lastCollectYellowTime.value)
      if (now.diff(lastYellow, 'minute') > 1) {
        netWorkStatus.value = 'green'
      }
    }
  }
  onMounted(() => {
    timer = setInterval(checkYellowTime, 1000)
  })
  onUnmounted(() => {
    lastCollectYellowTime.value = ''
    netWorkStatus.value = 'green'
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  })
  return {
    collectLogs,
    currentTopic,
    netWorkStatus
  }
}