<template>
  <div v-if="hasFiles" class="flex justify-center mb-20 text-center text-black">
    <button
      class="py-1 px-4 text-center text-white rounded cursor-pointer bg-black"
      @click="onExecute">
      Execute
    </button>

    <!-- 使用 margin 添加水平间距 -->
    <button
      class="py-1 px-4 ml-4 text-center text-white rounded cursor-pointer bg-black"
      @click="onClean">
      Clear Files
    </button>

    <!-- 使用 margin 添加水平间距 -->
    <button
      class="py-1 px-4 ml-4 text-center text-white rounded cursor-pointer bg-black"
      @click="onRefresh">
      Refresh
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useFileStore } from "@/store/files"

// Computed property to check if there are files in the store
const hasFiles = computed(() => fileStore.$state.files.length > 0)

const fileStore = useFileStore()

const onExecute = async () => {
  try {
    const [success, fail] = await fileStore.renameExecute()
    if (success > 0) {
      ElMessage.success(`Successfully modified the names of ${success} files`)
      console.log(`Successfully modified the names of ${success} files`)
    }
    if (fail > 0) {
      ElMessage.error(`Failed to rename ${fail} files`)
      console.log(`Failed to rename ${fail} files`)
    }
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

const onClean = () => {
  fileStore.clear()
  ElMessage({
    showClose: true,
    message: "Clearing completed",
    type: "success"
  })
}

const onRefresh = async () => {
  if (fileStore.$state.files.length === 0) {
    ElMessage({
      showClose: true,
      message: "No files to refresh",
      type: "warning"
    })
    return
  }

  await fileStore.reload()
  ElMessage.success("Refresh completed")
}
</script>

<style lang="less" scoped></style>
