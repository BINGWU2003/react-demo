
export const useCollectLogs = () => {
  const collectLogs = async (message) => {
    await window.electron.generateLog(message)
  }
  return {
    collectLogs
  }
}