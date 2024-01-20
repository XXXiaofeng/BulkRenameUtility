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

  <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black" v-if="!isMobile">
    <div
      class="mx-40 border rounded-xl my-20 px-20 flex flex-col justify-center leading-6 text-black shadow-xl">
      <div
        class="text-2xl font-bold mb-5 flex justify-center mt-10 leading-6 text-center text-black">
        1. Import File or Folder
      </div>
      <div class="flex justify-center leading-6 text-center text-black mb-2">
        <Upload></Upload>
      </div>
      <OperationWrapper>
        <FilesTable></FilesTable>
      </OperationWrapper>

      <div
        class="text-2xl font-bold mb-5 flex justify-center mt-5 leading-6 text-center text-black">
        2. Selecting renaming method
      </div>
      <div class="flex justify-center text-center text-black">
        <div class="bg-white">
          <button
            class="px-4 py-1 border border-gray-300 focus:outline-none focus:border-transparent"
            :class="{ 'bg-black text-white': mode === 'simple' }"
            @click="mode = 'simple'">
            AI Mode
          </button>
          <button
            class="px-4 py-1 border border-gray-300 focus:outline-none focus:border-transparent"
            :class="{ 'bg-black text-white': mode === 'advanced' }"
            @click="mode = 'advanced'">
            Rule Mode
          </button>
        </div>
      </div>
      <!-- 简易模式：对话界面组件 -->
      <div v-if="mode === 'simple'">
        <DialogueInterface></DialogueInterface>
      </div>

      <!-- 复杂模式：原有的操作界面 -->
      <div v-else>
        <Operations class="operation"></Operations>
      </div>

      <div
        class="text-2xl font-bold mb-5 flex justify-center mt-10 leading-6 text-center text-black">
        3. Execute file renaming
      </div>
      <ActionContainer></ActionContainer>
    </div>
  </div>
  <!-- <Faq></Faq> -->
</template>

<style scoped>
.operation {
  flex: 1 1 0%;
}
</style>
