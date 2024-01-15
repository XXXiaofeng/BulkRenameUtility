<script setup lang="ts">
import { ElMessageBox } from "element-plus"

// 创建响应式变量来控制当前的模式
const mode = ref("simple") // 默认为简易模式
watch(mode, (newValue) => {
  console.log("Mode changed to:", newValue)
})
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
  <!-- 如果不是移动设备，则渲染以下内容 -->

  <div
    v-if="!isMobile"
    class="fixed z-10 w-full h-12 leading-6 text-black bg-white border-t-0 border-b border-solid border-x-0 border-slate-200 bg-opacity-[0.6]"
    style="backdrop-filter: saturate(50%) contrast(2) blur(5px); border-width: 0px">
    <header
      class="flex justify-between items-center px-2 pb-0 mt-1 w-full leading-6 text-black sm:px-4">
      <div
        class="max-w-[1920px] w-full mx-auto h-16 md:h-12 flex items-center px-[180px] 2xl:px-8 sm:px-3 xl:justify-between">
        <div
          class="w-fit flex items-center my-0 mr-0 ml-3 text-2xl font-extralight tracking-tight leading-8 text-black cursor-pointer font-medium">
          <img src="/favicon.ico" alt="Logo" class="w-6 mr-2" />
          <router-link class="" to="/" title="Bulk Rename Utility"
            >Bulk Rename Utility
          </router-link>
        </div>

        <div class="flex items-center gap-x-6">
          <router-link
            class="custom-link block w-full h-full py-5"
            title="Bulk Rename Utility"
            to="/"
            >HOME</router-link
          >
          <router-link
            class="custom-link block w-full h-full py-5"
            title="Bulk Rename Utility BLOG"
            to="/blog"
            >BLOG</router-link
          >
        </div>
      </div>
    </header>
  </div>

  <!-- 如果是移动设备，则渲染以下内容 -->
  <div class="app-mobile" v-if="isMobile">
    <!-- 工具Logo和标题 -->
    <div
      class="w-fit flex items-center my-0 mr-0 ml-3 text-2xl font-extralight tracking-tight leading-8 text-black cursor-pointer font-medium">
      <img src="/favicon.ico" alt="Logo" class="w-6 mr-2" />
      <router-link class="" to="/" title="Bulk Rename Utility">Bulk Rename Utility </router-link>
    </div>
    <h1 class="p-4">Free Online File Renaming Tool with AI</h1>
    <el-text class="text"
      >This tool is not supported on mobile, please open it on your computer with the latest version
      of Chrome/Edge browser.</el-text
    >
  </div>
  <router-view />
  <Footer></Footer>
</template>

<style scoped>
.app {
  height: calc(100vh - env(safe-area-inset-bottom) - 20px);
}

.body {
  margin-right: 8px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.mode-switch {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: center;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: env(safe-area-inset-bottom);
  height: 20px;
}

.menu {
  min-width: 180px;
  margin: 0 12px 0 0;
}

.operation {
  flex: 1 1 0%;
}

.app-mobile {
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 12px;

  .text {
    margin: 8px 0;
    text-align: center;
    word-break: keep-all;
  }

  .github {
    margin-top: 64px;
  }
}

.custom-link {
  color: rgb(196, 196, 196); /* 默认颜色 */
}

.router-link-active {
  color: #000000; /* 文字颜色 */
  font: medium; /* 文字颜色 */
}
</style>
