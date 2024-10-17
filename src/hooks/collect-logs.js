import { ref } from "vue"
export const useCollectLogs = () => {
  const currentTopic = ref('')
  const collectLogs = async (message, messageObj) => {
    if (messageObj) {
      message += JSON.stringify(messageObj)
    }
    await window.electron.generateLog(message)
  }
  return {
    collectLogs,
    currentTopic
  }
}