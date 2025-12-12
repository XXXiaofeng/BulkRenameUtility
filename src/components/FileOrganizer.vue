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

    <!-- AI 分类区域 -->
    <div v-if="organizerStore.items.length > 0" class="classification-section">
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

        <div class="flex justify-center mt-4 flex-col items-center">
          <button
            v-if="!organizerStore.isClassifying"
            @click="generateClassification"
            :disabled="!userPrompt.trim()"
            class="py-2 px-8 text-white bg-black bg-opacity-80 rounded hover:bg-opacity-100 disabled:bg-gray-400 disabled:cursor-not-allowed">
            🤖 Generate Classification Plan
          </button>
          
          <!-- Progress UI -->
          <div v-else class="w-full max-w-md mt-4">
            <div class="flex items-center justify-between mb-2">
                <span class="font-semibold text-gray-700">
                    {{ organizerStore.classificationMessage || 'Processing...' }}
                </span>
                <span class="text-sm text-gray-500" v-if="organizerStore.classificationTotal > 0">
                    {{ Math.round((organizerStore.classificationProgress / organizerStore.classificationTotal) * 100) }}%
                </span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                    class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    :style="{ width: calculateProgressWidth() }">
                </div>
            </div>

            <div class="flex justify-center">
                <button @click="stopClassifying" class="text-red-500 hover:text-red-700 underline text-sm">
                    Stop / Cancel
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Schema Review Modal -->
    <div v-if="organizerStore.showSchemaReviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <h3 class="text-xl font-bold mb-4">Review Classification Rules</h3>
            <p class="text-gray-600 mb-4">The AI has analyzed your files and proposed the following folder structure. Please review and edit if necessary.</p>
            
            <div class="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-gray-50">
                <div v-if="organizerStore.schemaForReview">
                    <div v-for="(info, category) in organizerStore.schemaForReview.categories" :key="category" class="mb-3 p-3 bg-white rounded shadow-sm border">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-bold text-lg text-blue-600">{{ category }}</h4>
                                <p class="text-sm text-gray-600">{{ info.description }}</p>
                            </div>
                            <button @click="removeSchemaCategory(category as string)" class="text-red-500 hover:text-red-700 px-2">✕</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3">
                <button @click="stopClassifying" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button @click="confirmSchema" class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold">
                    Confirm & Start Classification
                </button>
            </div>
        </div>
    </div>

    <!-- 分类预览区域 -->
    <div v-if="organizerStore.classificationPlan" class="preview-section">
      <div class="text-2xl font-bold mb-5 flex justify-center mt-10 text-center">
        3. Review and Adjust Classification
      </div>
      
      <ClassificationPreview />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOrganizerStore } from '@/store/organizer'
import { importMultipleFiles, importSingleFolder, formatFileSize, getFileIcon } from '@/utils/file-organizer'
import { callGeminiForScalableClassification } from '@/utils/geminiAPI'
import type { ClassificationSchema } from '@/types/organizer'
import ClassificationPreview from './ClassificationPreview.vue'
import { ElMessage } from 'element-plus'

const organizerStore = useOrganizerStore()
const userPrompt = ref('')
let abortController: AbortController | null = null
let schemaReviewResolve: ((schema: ClassificationSchema) => void) | null = null

async function importFiles() {
  try {
    const items = await importMultipleFiles()
    if (items.length > 0) {
      organizerStore.addItems(items)
      ElMessage.success(`Imported ${items.length} files`)
    }
  } catch (error: any) {
    console.error('Failed to import files:', error)
    ElMessage.error('Failed to import files: ' + error.message)
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
    console.error('Failed to import folder:', error)
    ElMessage.error('Failed to import folder: ' + error.message)
  }
}

function clearAll() {
  organizerStore.clearItems()
  userPrompt.value = ''
  ElMessage.info('All items cleared')
}

async function generateClassification() {
  if (!userPrompt.value.trim()) {
    ElMessage.warning('Please enter your organization requirements')
    return
  }

  organizerStore.setIsClassifying(true)
  organizerStore.updateClassificationProgress('SCANNING', 0, 0, 'Initializing...')
  abortController = new AbortController()

  try {
    const fileNames = organizerStore.fileList.map(item => item.name)
    
    const plan = await callGeminiForScalableClassification(
      fileNames,
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

    organizerStore.setClassificationPlan(plan)
    ElMessage.success('Classification plan generated! Review below.')
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

// UI Helpers
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
</script>

<style scoped>
.file-organizer-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.import-section,
.classification-section,
.preview-section {
  margin-bottom: 30px;
}

.file-list-preview {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.stats-bar {
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
  margin-bottom: 12px;
}

.file-list-scroll {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
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

.file-item:last-child {
  border-bottom: none;
}

.file-icon {
  font-size: 20px;
  margin-right: 12px;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #6b7280;
  font-size: 14px;
  margin-left: 12px;
}

.prompt-input-container {
  max-width: 800px;
  margin: 0 auto;
}

.prompt-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.prompt-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.prompt-textarea:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}
</style>
