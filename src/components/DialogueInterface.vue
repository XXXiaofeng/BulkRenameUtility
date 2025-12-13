<template>
  <div>
    <div class="input-container">
      <textarea
        v-model="userInput"
        rows="4"
        class="py-1 px-2 my-5 mx-0 w-full whitespace-pre-wrap break-words bg-white rounded-md border border-gray-300 border-solid cursor-text resize-y"
        placeholder="For example: Add a number before the file name"
        style="box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px"></textarea>

      <!-- Metadata Options -->
      <div class="flex flex-wrap items-center gap-4 mt-2 mb-3 text-sm text-gray-600">
        <span class="font-medium text-gray-700">Include info:</span>
        <label class="flex items-center gap-1.5 cursor-pointer hover:text-black transition-colors">
          <input type="checkbox" v-model="metadataOptions.size" class="w-4 h-4 rounded border-gray-300 text-black focus:ring-black">
          <span>File Size</span>
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer hover:text-black transition-colors">
          <input type="checkbox" v-model="metadataOptions.lastModified" class="w-4 h-4 rounded border-gray-300 text-black focus:ring-black">
          <span>Modification Date</span>
        </label>
      </div>

      <!-- Usage Info -->
      <div v-if="remainingUsage !== null" class="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
        <span>Today's remaining AI renames: <span class="font-semibold" :class="remainingUsage === 0 ? 'text-red-600' : 'text-green-600'">{{ remainingUsage }}</span> / 2</span>
        <a href="https://buymeacoffee.com/xiaofeng001" target="_blank" class="text-yellow-600 hover:text-yellow-700 inline-flex items-center gap-1" title="Support Development">
          ☕ <span class="text-xs underline">Refill</span>
        </a>
      </div>

      <div v-if="!loading" class="flex justify-center mt-0">
        <button
          @click="submitToGemini"
          :disabled="remainingUsage === 0"
          class="py-1 px-8 text-center text-white normal-case bg-none rounded cursor-pointer bg-black bg-opacity-[0.8] disabled:bg-gray-400 disabled:cursor-not-allowed">
          Submit
        </button>
      </div>
      <div v-if="loading" class="flex justify-center mt-0">
        <p>AI is thinking...</p>
        <el-button @click="interruptLoading" class="stop-button">Stop</el-button>
      </div>

      <!-- Success Banner with BMC -->
      <div v-if="showSuccessBanner" class="success-banner mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">✅</span>
            <span class="text-green-800 font-medium">File rename successful!···Can confirm execution</span>
          </div>
          <button @click="showSuccessBanner = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div class="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-center justify-between gap-3">
          <span class="text-sm">☕ 喜欢这个工具？支持我们获取无限使用次数！</span>
          <a 
            href="https://buymeacoffee.com/xiaofeng001" 
            target="_blank"
            class="px-3 py-1.5 bg-yellow-400 text-black rounded font-semibold text-sm hover:bg-yellow-500 whitespace-nowrap"
          >Buy me a Coffee</a>
        </div>
      </div>

      <div v-if="remainingUsage === 0" class="limit-warning mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
        <div class="text-red-800 font-medium mb-2">⚠️ 今日使用次数已用完</div>
        <p class="text-sm text-gray-600 mb-3">
          想要更多使用次数和更高的文件上限？请 Buy Me a Coffee 并附上您的邮箱，我们将为您解锁更高配额！
        </p>
        <a 
          href="https://buymeacoffee.com/xiaofeng001" 
          target="_blank"
          class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500"
        >
          ☕ Buy me a Coffee
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineExpose, onMounted } from "vue"
import { useFileStore } from "@/store/files"
import { callGeminiAPI } from "../utils/geminiAPI"
import { checkUsage, recordUsage, getRemainingUsage } from "../utils/usage-limiter"
import { ElMessage, ElMessageBox } from "element-plus"
import { formatFileSize } from "@/utils/file-organizer"
import dayjs from "dayjs"

const props = defineProps({
  initialPrompt: {
    type: String,
    default: ''
  }
})

const fileStore = useFileStore()
const userInput = ref(props.initialPrompt || "")
const renamedFiles = ref([])
const loading = ref(false)
const showSuccessBanner = ref(false)
const remainingUsage = ref(null)
const metadataOptions = ref({
  size: false,
  lastModified: false
})
let interruptController = null
let shouldStop = false

// Expose method to set user input from parent
function setUserInput(text) {
  userInput.value = text
}
defineExpose({ setUserInput, userInput })

// Watch for prop changes
watch(() => props.initialPrompt, (val) => {
  if (val) userInput.value = val
})

watch(
  () => fileStore.$state.files,
  (newFiles) => {
    renamedFiles.value = newFiles.map((file) => ({ ...file, newName: file.name }))
  },
  { deep: true }
)

// Load remaining usage on mount
onMounted(async () => {
  const usage = await getRemainingUsage()
  remainingUsage.value = usage.rename
})

const submitToGemini = async () => {
  // Check usage limits
  const usageCheck = await checkUsage('rename', fileStore.$state.files.length)
  if (!usageCheck.allowed) {
    ElMessageBox.alert(
      usageCheck.reason + '\n\n请在 Buy Me a Coffee 中附上您的邮箱获取更高配额！',
      '使用限制',
      { 
        confirmButtonText: '去支持', 
        type: 'warning',
        callback: () => {
          window.open('https://buymeacoffee.com/xiaofeng001', '_blank')
        }
      }
    )
    return
  }
  
  loading.value = true
  showSuccessBanner.value = false
  shouldStop = false
  interruptController = new AbortController()
  
  // Prepare file names with optional metadata
  // We use a mapping to keep track of real names vs display names with metadata
  const fileNamesForAI = fileStore.$state.files.map((file) => {
    let name = file.name
    const parts = []
    
    if (metadataOptions.value.size) {
      parts.push(`Size: ${formatFileSize(file.size)}`)
    }
    if (metadataOptions.value.lastModified && file.modifyTime) {
      parts.push(`Modified: ${dayjs(file.modifyTime).format('YYYY-MM-DD')}`)
    }
    
    if (parts.length > 0) {
      // Format: "filename.ext (Size: 1MB, Modified: 2023-01-01)"
      return `${name} (${parts.join(', ')})`
    }
    return name
  })

  console.log("fileNames sent to AI:", fileNamesForAI)

  const chunks = splitIntoChunks(fileNamesForAI, 30)
  let success = false

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
      success = true
    } catch (error) {
      const match = error.message.match(/alt=sse: (.*)$/)
      const apiErrorReason = match ? match[1] : "Error processing Gemini API response"
      ElMessage.error(apiErrorReason)
      console.error(error)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  
  loading.value = false
  
  if (success) {
    // Record usage
    await recordUsage('rename', fileStore.$state.files.length)
    const usage = await getRemainingUsage()
    remainingUsage.value = usage.rename
    
    // Show success banner
    showSuccessBanner.value = true
    
    // Scroll to preview to show results (addressing user feedback)
    scrollToPreview()
  }
}

const interruptLoading = () => {
  loading.value = false
  shouldStop = true
  if (interruptController) {
    interruptController.abort()
  }
}

function splitIntoChunks(array, chunkSize) {
  let chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    let chunk = array.slice(i, i + chunkSize)
    chunks.push(chunk)
  }
  return chunks
}

function scrollToPreview() {
  // Try to find the file list container
  const table = document.querySelector('.operation-wrapper') || document.querySelector('.files-table') || document.querySelector('.import-section')
  if (table) {
    table.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    // Fallback to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style lang="less" scoped>
.el-textarea__inner {
  min-width: 300px;
  height: 200px;
  resize: none;
  overflow-y: auto;
  align-items: flex-start;
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

.success-banner {
  animation: slideIn 0.3s ease;
}

.limit-warning {
  animation: shake 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>

