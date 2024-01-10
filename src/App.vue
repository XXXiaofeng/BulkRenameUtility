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

// 当Github图标被点击时，打开Github链接
const onGithubClick = () => {
  globalThis.open("https://github.com/JasonGrass/rename", "_self", "noreferrer")
}
</script>

<template>
  <!-- 如果不是移动设备，则渲染以下内容 -->
  <div class="app" v-if="!isMobile">
    <Header></Header>

    <!-- 模式切换控件 -->
    <div class="mode-switch">
      <el-radio-group v-model="mode">
        <el-radio-button label="simple">简易模式</el-radio-button>
        <el-radio-button label="advanced">复杂模式</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 简易模式：对话界面组件 -->
    <DialogueInterface v-if="mode === 'simple'"></DialogueInterface>

    <!-- 复杂模式：原有的操作界面 -->
    <div class="body" v-else>
      <HandlerMenu class="menu"></HandlerMenu>
      <Operations class="operation"></Operations>
    </div>

    <!-- 底部内容 -->
    <Footer class="footer"></Footer>
  </div>

  <!-- 如果是移动设备，则渲染以下内容 -->
  <div class="app-mobile" v-if="isMobile">
    <!-- 工具Logo和标题 -->
    <img class="logo" src="@/assets/icon256.ico" alt="logo" width="128" height="128" />
    <el-text class="text">文件批量重命名工具</el-text>
    <el-text class="text"
      >此工具不支持移动端，请在电脑上使用最新版本的 Chrome/Edge 浏览器打开</el-text
    >

    <!-- Github图标，点击可打开Github链接 -->
    <img class="github" src="@/assets/github.svg" alt="github" width="32" @click="onGithubClick" />
  </div>
</template>

<style scoped>
.app {
  height: calc(100vh - env(safe-area-inset-bottom) - 20px);
}

.body {
  display: flex;
  margin-right: 8px;
  padding-bottom: 20px;
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
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 12px;

  .logo {
    margin: -64px 0 64px 0;
  }

  .text {
    margin: 8px 0;
    text-align: center;
    word-break: keep-all;
  }

  .github {
    margin-top: 64px;
  }
}
</style>
