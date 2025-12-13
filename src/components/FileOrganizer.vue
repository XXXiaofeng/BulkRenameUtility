<template>
  <div class="file-organizer-container">
    <!-- 导入文件区域 -->
    <div class="import-section">
      <div class="text-2xl font-bold mb-5 flex justify-center mt-10 text-center">
        1. Import Files and Folders
      </div>
      <div class="flex justify-center gap-4 mb-4">
        <button
          @click="importFiles"
          class="py-2 px-6 text-white bg-black bg-opacity-80 rounded hover:bg-opacity-100">
          📁 Import Files
        </button>
        <button
          @click="importFolder"
          class="py-2 px-6 text-white bg-black bg-opacity-80 rounded hover:bg-opacity-100">
          📂 Import Folder
        </button>
        <button
          v-if="organizerStore.items.length > 0"
          @click="clearAll"
          class="py-2 px-6 text-white bg-red-600 rounded hover:bg-red-700">
          🗑️ Clear All
        </button>
      </div>

      <!-- 文件列表预览 -->
      <div v-if="organizerStore.items.length > 0" class="file-list-preview">
        <div class="stats-bar">
          <span class="font-semibold">
            📊 Total: {{ organizerStore.totalFiles }} files
          </span>
          <span class="text-gray-600 ml-4">
            {{ formatTotalSize() }}
          </span>
        </div>
        
        <div class="file-list-scroll">
          <div 
            v-for="(item, index) in organizerStore.fileList.slice(0, 50)" 
            :key="index"
            class="file-item">
            <span class="file-icon">{{ getFileIcon(item.name) }}</span>
            <span class="file-name">{{ item.name }}</span>
            <span class="file-size">{{ formatFileSize(item.size) }}</span>
          </div>
          <div v-if="organizerStore.fileList.length > 50" class="text-center text-gray-500 py-2">
            ... and {{ organizerStore.fileList.length - 50 }} more files
          </div>
        </div>
      </div>
    </div>

    <!-- AI 分类区域 (Always visible, disabled if no files) -->
    <div class="classification-section" :class="{ 'opacity-50 pointer-events-none': organizerStore.items.length === 0 }">
      <div class="text-2xl font-bold mb-5 flex justify-center mt-10 text-center">
        2. Describe Your Organization Needs
      </div>
      
      <div class="prompt-input-container">
        <textarea
          v-model="userPrompt"
          rows="4"
          :disabled="organizerStore.isClassifying"
          class="prompt-textarea"
          placeholder="Example: Organize files by type - put images in 'Images' folder, documents in 'Documents' folder, and others in 'Miscellaneous' folder"></textarea>

        <!-- Metadata Options -->
        <div class="flex justify-center gap-6 mt-3 text-sm text-gray-700">
            <span class="font-medium">Provide more context to AI:</span>
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="metadataOptions.size" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                <span>File Size</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="metadataOptions.lastModified" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                <span>Modification Date</span>
            </label>
        </div>

        <div class="flex justify-center mt-4 flex-col items-center">
          <!-- Usage Info is outside the v-if/else toggle for cleaner layout or inside? -->
          <!-- Let's keep it visible always when input is present -->
          
          <div v-if="!organizerStore.isClassifying" class="w-full flex flex-col items-center">
             <!-- Usage Info -->
            <div v-if="remainingUsage !== null" class="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
                <span>Today's remaining AI organizations: <span class="font-semibold" :class="remainingUsage === 0 ? 'text-red-600' : 'text-green-600'">{{ remainingUsage }}</span> / 2</span>
                <a href="https://buymeacoffee.com/xiaofeng001" target="_blank" class="text-yellow-600 hover:text-yellow-700 inline-flex items-center gap-1" title="Support Development">
                ☕ <span class="text-xs underline">Refill</span>
                </a>
            </div>

            <button
                @click="generateClassification"
                :disabled="!userPrompt.trim() || remainingUsage === 0"
                class="py-2 px-8 text-white bg-black bg-opacity-80 rounded hover:bg-opacity-100 disabled:bg-gray-400 disabled:cursor-not-allowed">
                🤖 Generate Classification Plan
            </button>

            <!-- Limit Reached Banner (Inline) -->
            <div v-if="remainingUsage === 0" class="limit-warning mt-4 p-4 bg-red-50 rounded-xl border border-red-200 w-full max-w-xl">
              <div class="text-red-800 font-medium mb-2 text-center">⚠️ Limit Reached</div>
              <p class="text-sm text-gray-600 mb-3 text-center">
                You've reached your daily AI organization limit. Upgrade to remove limits!
              </p>
              <div class="flex justify-center">
                <a 
                  href="https://buymeacoffee.com/xiaofeng001" 
                  target="_blank"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500"
                >
                  ☕ Buy me a Coffee to Unlock
                </a>
              </div>
            </div>
          </div>
          
          <!-- Progress UI -->
          <div v-else class="w-full max-w-md mt-4">
            <div class="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <span class="loading-spinner mr-2"></span>
                <span>{{ organizerStore.classificationMessage || 'Processing...' }}</span>
                <span class="ml-auto text-gray-500" v-if="organizerStore.classificationTotal > 0">
                    {{ Math.round((organizerStore.classificationProgress / organizerStore.classificationTotal) * 100) }}%
                </span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300 relative" 
                    :style="{ width: calculateProgressWidth() }">
                    <div class="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                </div>
            </div>

            <div class="flex justify-center">
                <button @click="stopClassifying" class="text-red-500 hover:text-red-700 hover:underline text-sm">
                    Stop / Cancel
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Schema Review Modal -->
    <div v-if="organizerStore.showSchemaReviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
            <h3 class="text-xl font-bold mb-4">Review Classification Rules</h3>
            <p class="text-gray-600 mb-4">The AI has analyzed your files and proposed the following folder structure. Please review and edit if necessary.</p>
            
            <div class="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
                <div v-if="organizerStore.schemaForReview">
                    <div v-for="(info, category) in organizerStore.schemaForReview.categories" :key="category" class="mb-3 p-3 bg-white rounded shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-bold text-lg text-blue-600">{{ category }}</h4>
                                <p class="text-sm text-gray-600">{{ info.description }}</p>
                            </div>
                            <button @click="removeSchemaCategory(category as string)" class="text-gray-400 hover:text-red-500 px-2 transition-colors">✕</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button @click="stopClassifying" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
                <button @click="confirmSchema" class="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 font-bold transition-colors shadow-lg">
                    Confirm & Start Classification
                </button>
            </div>
        </div>
    </div>

    <!-- 分类预览区域 (Always visible, shows example if empty) -->
    <div class="preview-section fade-in">
      <div v-if="!organizerStore.classificationPlan" class="example-preview opacity-60 pointer-events-none relative">
        <div class="absolute inset-0 flex items-center justify-center z-10">
            <div class="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg border border-gray-200 text-center">
                <div class="text-4xl mb-2">👀</div>
                <h3 class="font-bold text-lg text-gray-800">Preview Area</h3>
                <p class="text-gray-600">Import files and run AI to see results here</p>
            </div>
        </div>
        <!-- Mock Column View for visual structure -->
        <div class="text-2xl font-bold mb-5 flex justify-center mt-10 text-center">
            3. Review and Adjust Classification
        </div>
        <div class="grid grid-cols-3 gap-4 p-4 border rounded bg-gray-50 h-64 overflow-hidden blur-sm">
            <div class="bg-white p-4 rounded shadow border">
                <h4 class="font-bold text-blue-600 mb-2">Images</h4>
                <div class="space-y-2">
                    <div class="p-2 bg-gray-50 rounded text-sm">photo1.jpg</div>
                    <div class="p-2 bg-gray-50 rounded text-sm">vacation.png</div>
                </div>
            </div>
            <div class="bg-white p-4 rounded shadow border">
                <h4 class="font-bold text-blue-600 mb-2">Documents</h4>
                <div class="space-y-2">
                    <div class="p-2 bg-gray-50 rounded text-sm">resume.pdf</div>
                    <div class="p-2 bg-gray-50 rounded text-sm">notes.txt</div>
                </div>
            </div>
             <div class="bg-white p-4 rounded shadow border">
                <h4 class="font-bold text-blue-600 mb-2">Others</h4>
                <div class="space-y-2">
                    <div class="p-2 bg-gray-50 rounded text-sm">archive.zip</div>
                </div>
            </div>
        </div>
      </div>

      <div v-else>
      <div class="text-2xl font-bold mb-5 flex justify-center mt-10 text-center">
        3. Review and Adjust Classification
      </div>
      
      <FileOrganizerColumnView />
       
      <div class="flex justify-center gap-4 mt-8">
        <button
          @click="resetPlan"
          class="py-2 px-6 text-black bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-sm">
          🔄 Start Over
        </button>
        <button
          @click="selectTargetDirectory"
          :disabled="organizerStore.isExecuting"
          class="py-3 px-8 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg shadow-md transition-transform transform active:scale-95">
          ✅ Execute Organization
        </button>
      </div>

       <!-- Execution Progress -->
      <div v-if="organizerStore.executionProgress" class="max-w-3xl mx-auto mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div class="flex justify-between mb-2">
          <span class="font-semibold text-gray-800">Moving files...</span>
          <span class="text-gray-600">{{ organizerStore.executionProgress.completed }} / {{ organizerStore.executionProgress.total }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            class="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: getExecutionProgressPercentage() + '%' }"></div>
        </div>
        <div class="text-sm text-gray-500 mt-2 truncate">
            {{ organizerStore.executionProgress.current ? `Processing: ${organizerStore.executionProgress.current}` : 'Done' }}
        </div>
        <div v-if="organizerStore.executionProgress.failed > 0" class="text-sm text-red-600 mt-1">
          Failed: {{ organizerStore.executionProgress.failed }}
        </div>
      </div>
      
      <!-- Success Banner (only when execution is complete) -->
      <div v-if="organizerStore.executionProgress && organizerStore.executionProgress.completed === organizerStore.executionProgress.total && organizerStore.executionProgress.total > 0" class="max-w-3xl mx-auto mt-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-fade-in">
        <div class="flex flex-col items-center gap-3 text-center">
            <h3 class="text-xl font-bold text-green-800">🎉 Organization Completed!</h3>
            <p class="text-gray-600">Your files have been neatly organized.</p>
            
            <div class="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex flex-col sm:flex-row items-center gap-3">
              <span class="text-sm">☕ Enjoying the tool? Support us for unlimited usage!</span>
              <a 
                href="https://buymeacoffee.com/xiaofeng001" 
                target="_blank"
                class="px-4 py-2 bg-yellow-400 text-black rounded font-semibold text-sm hover:bg-yellow-500 whitespace-nowrap shadow-sm"
              >Buy me a Coffee</a>
            </div>
        </div>
      </div>

      </div> <!-- End of v-else (real preview) -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useOrganizerStore } from '@/store/organizer'
import { importMultipleFiles, importSingleFolder, formatFileSize, getFileIcon } from '@/utils/file-organizer'
import { callGeminiForScalableClassification } from '@/utils/geminiAPI'
import type { ClassificationSchema, ClassificationPlan } from '@/types/organizer'
import FileOrganizerColumnView from './FileOrganizerColumnView.vue'
import { executeClassification, verifyDirectoryPermission } from '@/utils/file-executor'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { checkUsage, recordUsage, getRemainingUsage } from '@/utils/usage-limiter'

const organizerStore = useOrganizerStore()
const userPrompt = ref('')
const remainingUsage = ref<number | null>(null)
const metadataOptions = reactive({
    size: false,
    lastModified: false
})

let abortController: AbortController | null = null
let schemaReviewResolve: ((schema: ClassificationSchema) => void) | null = null

onMounted(async () => {
  const usage = await getRemainingUsage()
  remainingUsage.value = usage.organize
})
async function importFiles() {
  try {
    const items = await importMultipleFiles()
    if (items.length > 0) {
      organizerStore.addItems(items)
      ElMessage.success(`Imported ${items.length} files`)
    }
  } catch (error: any) {
    if (error.name !== 'AbortError') {
         console.error('Failed to import files:', error)
         ElMessage.error('Failed to import files: ' + error.message)
    }
  }
}

async function importFolder() {
  try {
    const items = await importSingleFolder()
    if (items.length > 0) {
      organizerStore.addItems(items)
      ElMessage.success(`Imported ${items.length} files from folder`)
    }
  } catch (error: any) {
    if (error.name !== 'AbortError') {
        console.error('Failed to import folder:', error)
        ElMessage.error('Failed to import folder: ' + error.message)
    }
  }
}

function clearAll() {
  organizerStore.clearItems()
  userPrompt.value = ''
  ElMessage.info('All items cleared')
}

// -- Classification Logic --
async function generateClassification() {
  if (!userPrompt.value.trim()) {
    ElMessage.warning('Please enter your organization requirements')
    return
  }

  // Check usage limits
  const usageCheck = await checkUsage('organize', organizerStore.fileList.length)
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

  organizerStore.setIsClassifying(true)
  organizerStore.updateClassificationProgress('SCANNING', 0, 0, 'Initializing...')
  abortController = new AbortController()

  try {
    // 1. Prepare Proxy Names with Metadata
    const proxyMap = new Map<string, string>() // Proxy -> Real
    const fileNamesForAI = organizerStore.fileList.map(item => {
        let name = item.name
        const parts = []
        if (metadataOptions.size) parts.push(`Size: ${formatFileSize(item.size)}`)
        if (metadataOptions.lastModified && item.lastModified) parts.push(`Modified: ${dayjs(item.lastModified).format('YYYY-MM-DD')}`)
        
        if (parts.length > 0) {
            const proxy = `${name} (${parts.join(', ')})`
            proxyMap.set(proxy, name)
            return proxy
        }
        
        proxyMap.set(name, name)
        return name
    })
    
    // 2. Call AI
    const rawPlan = await callGeminiForScalableClassification(
      fileNamesForAI,
      userPrompt.value,
      (phase, progress, total, message) => {
          organizerStore.updateClassificationProgress(phase, progress, total, message)
      },
      (schema) => {
          return new Promise((resolve) => {
              schemaReviewResolve = resolve
              organizerStore.openSchemaReview(schema)
          })
      },
      abortController.signal
    )

    // 3. Map back to Real Names
    const cleanCategories: Record<string, any> = {}
    for (const [catName, catInfo] of Object.entries((rawPlan as ClassificationPlan).categories)) {
        cleanCategories[catName] = {
            description: catInfo.description,
            files: catInfo.files.map(proxyName => {
                const realName = proxyMap.get(proxyName)
                if (!realName) {
                    console.warn(`Could not map proxy name "${proxyName}" back to real file. Using raw.`)
                    // Attempt fuzzy match (stripped)
                    const stripped = proxyName.replace(/\s*\(.*\)$/, '')
                    const found = organizerStore.fileList.find(f => f.name === stripped)
                    return found ? found.name : proxyName
                }
                return realName
            })
        }
    }

    organizerStore.setClassificationPlan({ categories: cleanCategories })
    ElMessage.success('Classification plan generated! Review below.')
    
    // Record usage here (AI Request)
    await recordUsage('organize', organizerStore.items.length)
    const usage = await getRemainingUsage()
    remainingUsage.value = usage.organize
    
  } catch (error: any) {
    console.error('Classification failed:', error)
    if (error.message !== 'Classification aborted by user') {
      ElMessage.error('Failed to generate plan: ' + error.message)
    }
  } finally {
    organizerStore.setIsClassifying(false)
    organizerStore.resetClassificationState()
    abortController = null
    schemaReviewResolve = null
  }
}

function stopClassifying() {
  if (abortController) {
    abortController.abort()
  }
  organizerStore.setIsClassifying(false)
  organizerStore.closeSchemaReview()
}

// -- Execution Logic --
async function selectTargetDirectory() {
  try {
    const dirHandle = await window.showDirectoryPicker()
    organizerStore.setRootDirHandle(dirHandle)
    
    const hasPermission = await verifyDirectoryPermission(dirHandle)
    if (!hasPermission) {
      ElMessage.error('Permission denied for the selected directory')
      return
    }
    
    ElMessageBox.confirm(
      `This will create folders and move files in "${dirHandle.name}". Continue?`,
      'Confirm Execution',
      {
        confirmButtonText: 'Execute',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    ).then(() => {
      executeOrganization(dirHandle)
    })
  } catch (error: any) {
    if (error.name !== 'AbortError') {
        ElMessage.error('Failed to select directory: ' + error.message)
    }
  }
}

async function executeOrganization(dirHandle: FileSystemDirectoryHandle) {
  if (!organizerStore.classificationPlan) return
  
  organizerStore.setIsExecuting(true)
  try {
    const result = await executeClassification(
      dirHandle,
      organizerStore.classificationPlan,
      organizerStore.items
    )
    
    organizerStore.updateExecutionProgress(result.progress)
    
    if (result.success) {
      ElMessage.success('Files organized successfully!')
      // Do not clear items automatically, let user see the result
      // But maybe disable the Execute button or change text
    } else {
        ElMessage.warning('Completed with some errors.')
    }
  } catch (error: any) {
    ElMessage.error('Execution failed: ' + error.message)
  } finally {
    organizerStore.setIsExecuting(false)
  }
}

function resetPlan() {
    ElMessageBox.confirm('Clear all files and start over?', 'Start Over', {
        type: 'warning'
    }).then(() => {
        clearAll()
    })
}

// -- Helpers --
function calculateProgressWidth() {
    if (organizerStore.classificationTotal === 0) return '0%'
    const p = (organizerStore.classificationProgress / organizerStore.classificationTotal) * 100
    return `${Math.min(100, Math.max(0, p))}%`
}

function confirmSchema() {
    if (schemaReviewResolve && organizerStore.schemaForReview) {
        schemaReviewResolve(organizerStore.schemaForReview)
        organizerStore.closeSchemaReview()
        schemaReviewResolve = null
    }
}

function removeSchemaCategory(category: string) {
    if (organizerStore.schemaForReview && organizerStore.schemaForReview.categories[category]) {
        delete organizerStore.schemaForReview.categories[category]
    }
}

function formatTotalSize(): string {
  const total = organizerStore.fileList.reduce((sum, item) => sum + item.size, 0)
  return formatFileSize(total)
}

function getExecutionProgressPercentage(): number {
  const progress = organizerStore.executionProgress
  if (!progress || progress.total === 0) return 0
  return Math.round((progress.completed / progress.total) * 100)
}
</script>

<style scoped>
.file-organizer-container {
  width: 100%;
  max-width: 1400px; /* Wider for Column View */
  margin: 0 auto;
  padding: 20px;
}

.import-section,
.classification-section,
.preview-section {
  margin-bottom: 40px;
}

.file-list-preview {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
}

.stats-bar {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 12px;
  border: 1px solid #f3f4f6;
}

.file-list-scroll {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;
}

.file-item:hover {
  background: #f9fafb;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.file-icon {
    margin-right: 10px;
}

.file-size {
    color: #9ca3af;
    font-size: 12px;
}

.prompt-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 15px;
  resize: vertical;
  min-height: 120px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #e5e7eb;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.fade-in {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
