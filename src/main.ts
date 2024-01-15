import { createApp } from "vue"
import "./style.css"
import "element-plus/dist/index.css"

import VXETable from "vxe-table"
import "vxe-table/lib/style.css"
import router from "./router/index.js" // Import the router configuration

import { createPinia } from "pinia"
import { createI18n } from "vue-i18n"
// 导入语言文件
import en from "./locales/en.json"
import zh from "./locales/zh.json"

// 创建i18n实例并配置语言环境和字典
const i18n = createI18n({
  legacy: false,

  locale: "en", // 设置默认语言
  messages: {
    en,
    zh
  }
})
import App from "./App.vue"

const pinia = createPinia()

createApp(App).use(pinia).use(i18n).use(VXETable).use(router).mount("#app") // Use the router
