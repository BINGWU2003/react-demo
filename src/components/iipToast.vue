<template>
  <div class="toast-box" v-show="isShowToast">{{ msg }}</div>
</template>

<script setup>
import {ref, defineExpose} from 'vue'

let isShowToast = ref(false)
let msg = ref('')

function showToast(newMsg, timeout = 1000) {
  msg.value = newMsg
  isShowToast.value = true
  setTimeout(() => {
    isShowToast.value = false
  }, timeout)
}

defineExpose({
  showToast
})
</script>

<style scoped>
.toast-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1111;
  font-size: 12px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 8px;
}
</style>