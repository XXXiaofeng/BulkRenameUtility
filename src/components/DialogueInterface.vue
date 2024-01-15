<template>
  <div>
    <div class="input-container">
      <textarea
        v-model="userInput"
        rows="4"
        class="py-1 px-2 my-5 mx-0 w-full whitespace-pre-wrap break-words bg-white rounded-md border border-gray-300 border-solid cursor-text resize-y"
        placeholder="For example: Add a number before the file name"
        style="box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px"></textarea>

      <div v-if="!loading" class="flex justify-center mt-0">
        <button
          @click="submitToGemini"
          class="py-1 px-8 text-center text-white normal-case bg-none rounded cursor-pointer bg-black bg-opacity-[0.8]">
          Submit
        </button>
      </div>
      <div v-if="loading" class="flex justify-center mt-0">
        <p>AI is thinking...</p>
        <el-button @click="interruptLoading" class="stop-button">Stop</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useFileStore } from "@/store/files"
import { callGeminiAPI } from "../utils/geminiAPI"
import { useRenameHandler } from "./Operations/Handlers/handler.flow"

const fileStore = useFileStore()
const userInput = ref("")
const renamedFiles = ref([])
const loading = ref(false)
let interruptController = null
let shouldStop = false

watch(
  () => fileStore.$state.files,
  (newFiles) => {
    renamedFiles.value = newFiles.map((file) => ({ ...file, newName: file.name }))
  },
  { deep: true }
)

const submitToGemini = async () => {
  loading.value = true
  const fileNames = fileStore.$state.files.map((file) => file.name)
  console.log("fileNames:", fileNames)
  shouldStop = false // Reset the interruption flag
  interruptController = new AbortController()

  const chunks = splitIntoChunks(fileNames, 30)

  for (let chunk of chunks) {
    if (shouldStop) {
      console.log("Stopping due to interrupt request")
      break
    }

    const combinedInput = {
      userInput: userInput.value,
      fileNames: chunk
    }

    try {
      await callGeminiAPI(combinedInput, interruptController.signal)
      // No need to apply renaming rules here, as it will be done in callGeminiAPI
    } catch (error) {
      const match = error.message.match(/alt=sse: (.*)$/)
      const apiErrorReason = match ? match[1] : "Error processing Gemini API response"

      // ElMessage.error(error.message || `Error processing Gemini API response`)
      ElMessage.error(apiErrorReason)
      ElMessage.error(error.message)
      console.error(error)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  loading.value = false
}

const interruptLoading = () => {
  loading.value = false
  shouldStop = true
  if (interruptController) {
    interruptController.abort()
  }
}
function mapRenamingRulesToOptions(rules) {
  // Transform renaming rules into the expected options format
  return Object.entries(rules).map(([originalName, newName]) => ({
    pattern: newName
  }))
}
function extractReasonFromError(error) {
  try {
    // 尝试将错误消息解析为 JSON
    const errorObj = JSON.parse(error.message)

    // 检查是否存在 "reason" 字段
    if (errorObj.reason) {
      return errorObj.reason
    }
  } catch (e) {
    // 如果解析失败，或者没有 "reason" 字段，则返回默认消息
  }

  return "Unknown reason" // 默认消息
}
function splitIntoChunks(array, chunkSize) {
  let chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize)
    chunks.push(chunk)
  }
  return chunks
}
</script>
<style lang="less" scoped>
.el-textarea__inner {
  min-width: 300px;
  height: 200px; /* 设置文本区域的高度 */
  resize: none; /* 禁止用户调整文本区域的大小 */
  overflow-y: auto; /* 滚动条自动出现 */
  align-items: flex-start; /* 垂直顶部对齐 */
}

.input-container {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  padding-right: 20px;
}

.button-container {
  margin-top: 15px;
}

.ai-thinking-container {
  display: flex;
  align-items: center;
  justify-content: left;
  margin-top: 10px;
}

.stop-button {
  margin-left: 10px;
}
</style>
