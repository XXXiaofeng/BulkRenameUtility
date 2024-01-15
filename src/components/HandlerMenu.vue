<template>
  <!-- Vue组件的根部分 -->
  <div>
    <!-- Element-Plus的菜单组件，用于显示可拖拽的操作处理器列表 -->
    <el-menu :default-active="defaultActiveItemId" @select="onMenuSelected" mode="horizontal">
      <!-- Vue3 Smooth DnD的容器组件，用于包裹可拖拽的元素 -->
      <Container @drop="onDrop" :orientation="'horizontal'">
        <!-- 使用v-for循环渲染handlers数组中的处理器列表 -->
        <Draggable v-for="handler of handlers" :key="handler.id">
          <!-- Element-Plus的菜单项，每个对应一个处理器 -->
          <el-menu-item :index="handler.id">
            <!-- Element-Plus的图标组件，显示"SetUp"图标 -->
            <el-icon>
              <SetUp />
            </el-icon>
            <!-- 处理器的标题 -->
            <span>{{ handler.title }}</span>
            <!-- 如果处理器启用（enable为true），显示一个小圆点 -->
            <span class="dot" v-show="handler.enable"></span>
          </el-menu-item>
        </Draggable>
      </Container>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { Container, Draggable } from "vue3-smooth-dnd" // 导入Vue3 Smooth DnD的容器和可拖拽元素组件

import { SetUp } from "@element-plus/icons-vue" // 导入Element-Plus的图标组件
import HandlerFactory from "@/lib/handler/HandlerFactory" // 导入处理器工厂
import { useRenameHandler } from "./Operations/Handlers/handler.flow" // 导入处理器相关的自定义逻辑

const { debounceRename } = useRenameHandler() // 使用自定义逻辑中的函数

const handlers = ref<IRenameHandler[]>(HandlerFactory.handlers) // 创建响应式变量，存储处理器列表
const defaultActiveItemId = ref("") // 创建响应式变量，存储默认选中的菜单项ID

// 当菜单项被选中时执行的函数
const onMenuSelected = (index: string) => {
  const current = handlers.value.find((h) => h.id === index)
  if (!current) {
    return
  }
  // 设置当前选中的处理器，并取消其他处理器的选中状态
  handlers.value.forEach((h) => (h.active = false))
  current.active = true
}

// Vue组件挂载后执行的生命周期函数
onMounted(() => {
  const list = handlers.value
  if (list.length < 1) {
    return
  }
  // 默认选中第一个处理器，并设置defaultActiveItemId
  list[0].active = true
  defaultActiveItemId.value = list[0].id
})

// 当元素被拖拽时执行的函数
const onDrop = (dropResult: any) => {
  // 重新排列处理器的顺序
  handlers.value = applyDrag(handlers.value, dropResult)
}

// 重新排列数组元素的函数
const applyDrag = (arr: IRenameHandler[], dragResult: any) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr
  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }
  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  let sortHint = 1
  for (const handler of result) {
    handler.sortHint = sortHint++
  }

  // 修改排序之后，使用nextTick执行一次重命名预览
  nextTick(() => {
    debounceRename(undefined)
  })

  return result
}
</script>

<style lang="less" scoped>
.dot {
  position: relative;
  top: -5px;
  left: 3px;

  width: 6px;
  height: 6px;
  border-radius: 8px;
  background-color: #67c23a;
}
</style>
