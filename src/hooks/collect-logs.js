import { ref } from "vue"
export const useCollectLogs = () => {
  const currentTopic = ref('')
  // red yellow green
  const netWorkStatus = ref('green')
  const collectLogs = async (message, messageObj,status) => {
    if (messageObj) {
      message += JSON.stringify(messageObj)
    }
    if (status){
      netWorkStatus.value = status
    }
    await window.electron.generateLog(message)
  }
  return {
    collectLogs,
    currentTopic,
    netWorkStatus
  }
}