import dayjs from "dayjs"
import {ref} from "vue"
let isDev = process.env.NODE_ENV === 'development';
const currentTopic = ref('')
// red yellow green(默认green)
const netWorkStatus = ref('green')
const lastCollectYellowTime = ref('')
export const useCollectLogs = () => {
  const collectLogs = async (message, messageObj, status = 'green') => {
    if (messageObj) {
      if (typeof messageObj === 'object') {
        message += JSON.stringify(messageObj)
      } else if (typeof messageObj === 'string') {
        message += messageObj
      }
    }
    if (isDev) {
      console.log(message)
    }
    if (status) {
      netWorkStatus.value = status
      if (status === 'yellow') {
        lastCollectYellowTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    }
    await window.electron.generateLog(message)
  }

  const logInfo = (message) => {
    collectLogs(message, null, '')
  }
  const logSuccess = (message) => {
    collectLogs(message, null, 'green')
  }
  const logError = (message) => {
    collectLogs(message, null, 'red')
  }
  return {
    logError,
    logInfo,
    logSuccess,
    collectLogs,
    currentTopic,
    netWorkStatus
  }
}