<template>
  <!-- 包含操作的根组件 -->
  <div>
    <!-- 操作包装器，可以折叠，标题为"文件过滤" -->
    <OperationWrapper :canFold="true" title="文件过滤">
      <!-- 文件过滤组件，用于筛选文件 -->
      <FileFilter></FileFilter>
    </OperationWrapper>

    <!-- 如果当前存在处理器（currentHandler不为空），则显示操作包装器 -->
    <OperationWrapper v-if="Boolean(currentHandler)" :canFold="true" :title="currentHandler?.title">
      <!-- 处理器容器组件，根据当前处理器显示不同内容 -->
      <HandlerContainer :currentHandler="currentHandler"></HandlerContainer>
    </OperationWrapper>

    <!-- 操作包装器，用于包含操作按钮等 -->
    <OperationWrapper>
      <!-- 操作容器组件，包含各种操作按钮 -->
      <ActionContainer></ActionContainer>
    </OperationWrapper>

    <!-- 操作包装器，标题为"文件列表/结果预览" -->
    <OperationWrapper title="文件列表/结果预览">
      <!-- 文件表格组件，用于显示文件列表或结果预览 -->
      <FilesTable></FilesTable>
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

<style lang="less" scoped></style>
