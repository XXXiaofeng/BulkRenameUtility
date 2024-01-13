<template>
  <!-- 包含操作的根组件 -->
  <div>
    <!-- Operation wrapper that can be collapsed, titled "File Filtering" -->
    <OperationWrapper :canFold="true" title="File Filtering (optional)">
      <!-- File filter component for filtering files -->
      <FileFilter></FileFilter>
    </OperationWrapper>

    <!-- Display the operation wrapper if there is a current handler (currentHandler is not empty) -->
    <OperationWrapper :canFold="true" title="Select Rename Rules (Drag to Change Execution Order)">
      <HandlerMenu class="menu"></HandlerMenu>

      <!-- Handler container component that displays different content based on the current handler -->
      <HandlerContainer :currentHandler="currentHandler"></HandlerContainer>
    </OperationWrapper>
  </div>
</template>

<script lang="ts" setup>
import HandlerFactory from "@/lib/handler/HandlerFactory"
const handlers = HandlerFactory.handlers

// 创建一个响应式变量currentHandler，用于存储当前处理器
const currentHandler = ref<IRenameHandler>()

// 监听handlers数组的变化
watch(handlers, () => {
  // 找到当前激活的处理器
  const current = handlers.find((h) => h.active)
  // 更新currentHandler的值
  currentHandler.value = current
})

// 在组件挂载后执行的生命周期钩子函数
onMounted(() => {
  // 默认将currentHandler设置为第一个处理器
  currentHandler.value = handlers[0]
})
</script>

<style lang="less" scoped>
.button-container {
  margin-top: 15px;
}
</style>
