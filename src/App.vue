<script setup lang="ts">
import { onMounted, ref } from "vue"
import { ElMessageBox } from "element-plus"
import AppHeader from "@/components/AppHeader.vue"
import AppFooter from "@/components/AppFooter.vue"

// 使用ref来创建一个响应式变量isMobile，并初始化为false
const isMobile = ref(false)

// 在组件被挂载后执行的生命周期钩子函数
onMounted(() => {
  // 检测设备是否为移动设备，并将结果赋值给isMobile
  isMobile.value = checkIsMobile()

  // 如果是移动设备，直接返回，不执行以下代码
  if (isMobile.value) {
    return
  }

  // 检查是否使用HTTP协议访问页面，如果是，则弹出提示
  if (globalThis.location.protocol === "http:" && !globalThis.location.host.includes("localhost")) {
    ElMessageBox.alert(
      "文件加载相关 API 不支持 HTTP 协议，请使用 HTTPS 协议部署",
      "http 协议不兼容",
      {
        confirmButtonText: "OK"
      }
    )
    return
  }

  // 检查是否支持showOpenFilePicker函数，如果不支持，弹出提示
  const f = globalThis.showOpenFilePicker
  if (typeof f !== "function") {
    ElMessageBox.alert(
      "当前浏览器尚未支持相关 API，请使用最新版本的 Edge 或 Chrome 浏览器",
      "浏览器不兼容",
      {
        confirmButtonText: "OK"
      }
    )
  }
})

// 检查用户设备是否为移动设备的函数
const checkIsMobile = () => {
  let flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  return Boolean(flag)
}
</script>

<template>
  <div class="app-container min-h-screen flex flex-col">
    <!-- 如果是移动设备，则渲染以下内容 -->
    <div class="app-mobile" v-if="isMobile">
      <p class="p-4 mb-20 text-center">
        This tool is not supported on mobile, please open it on your computer with the latest version
        of Chrome/Edge browser.
      </p>
    </div>
    
    <template v-else>
      <AppHeader />
      <main class="flex-grow">
        <router-view />
      </main>
      <AppFooter />
    </template>
  </div>
</template>

<style scoped>
.app-mobile {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 12px;
}
</style>
