import dayjs from "dayjs"
import {ref} from "vue"

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
    if (status) {
      netWorkStatus.value = status
      if (status === 'yellow') {
        lastCollectYellowTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    }
    await window.electron.generateLog(message)
  }
  return {
    collectLogs,
    currentTopic,
    netWorkStatus
  }
}