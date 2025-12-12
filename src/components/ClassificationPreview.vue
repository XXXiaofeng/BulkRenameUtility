<template>
  <div class="classification-preview-container">
    <div class="preview-header">
      <h3 class="preview-title">📋 Classification Preview</h3>
      <div class="preview-stats">
        <span>{{ Object.keys(organizerStore.classificationPlan?.categories || {}).length }} folders</span>
        <span class="mx-2">•</span>
        <span>{{ getTotalAssignedFiles() }} files</span>
      </div>
    </div>

    <!-- 分类文件夹列表 -->
    <div class="categories-list">
      <div 
        v-for="(categoryInfo, categoryName) in organizerStore.classificationPlan?.categories" 
        :key="categoryName"
        class="category-card">
        <div class="category-header">
          <div class="category-title-row">
            <span class="folder-icon">📁</span>
            <input
              v-if="editingCategory === categoryName"
              v-model="newCategoryName"
              @blur="finishRenaming"
              @keyup.enter="finishRenaming"
              @keyup.esc="cancelRenaming"
              class="category-name-input"
              autofocus
            />
            <h4 v-else class="category-name">
              {{ categoryName }}
            </h4>
            <span class="file-count">({{ categoryInfo.files.length }} files)</span>
          </div>
          <div class="category-actions">
            <button 
              @click="startRenaming(categoryName)"
              class="action-btn"
              title="Rename folder">
              ✏️
            </button>
            <button 
              @click="confirmDeleteCategory(categoryName)"
              class="action-btn delete-btn"
              title="Delete folder">
              🗑️
            </button>
          </div>
        </div>

        <p v-if="categoryInfo.description" class="category-description">
          {{ categoryInfo.description }}
        </p>

        <!-- 文件列表 -->
        <div class="files-list">
          <Container
            @drop="onDrop(categoryName, $event)"
            group-name="files"
            :get-child-payload="getChildPayload(categoryName)">
            <Draggable 
              v-for="(fileName, index) in categoryInfo.files" 
              :key="index">
              <div class="file-item-draggable">
                <span class="drag-handle">⋮⋮</span>
                <span class="file-icon">{{ getFileIcon(fileName) }}</span>
                <span class="file-name">{{ fileName }}</span>
              </div>
            </Draggable>
          </Container>
        </div>
      </div>
    </div>

    <!-- 执行按钮区 -->
    <div class="actions-section">
      <div class="validation-info" v-if="validationErrors.length > 0">
        <div class="text-red-600 font-semibold mb-2">⚠️ Validation Errors:</div>
        <ul class="text-sm text-red-500">
          <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
        </ul>
      </div>

      <div class="flex justify-center gap-4 mt-6">
        <button
          @click="regenerate"
          class="py-2 px-6 text-black bg-gray-200 rounded hover:bg-gray-300">
          🔄 Regenerate
        </button>
        <button
          @click="selectTargetDirectory"
          :disabled="validationErrors.length > 0 || organizerStore.isExecuting"
          class="py-2 px-8 text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          ✅ Execute Organization
        </button>
      </div>

      <!-- 执行进度 -->
      <div v-if="organizerStore.executionProgress" class="execution-progress">
        <div class="progress-header">
          <span class="font-semibold">⚙️ Organizing files...</span>
          <span>{{ organizerStore.executionProgress.completed }} / {{ organizerStore.executionProgress.total }}</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: getProgressPercentage() + '%' }"></div>
        </div>
        <div v-if="organizerStore.executionProgress.current" class="text-sm text-gray-600 mt-2">
          Current: {{ organizerStore.executionProgress.current }}
        </div>
        <div v-if="organizerStore.executionProgress.failed > 0" class="text-sm text-red-600 mt-2">
          Failed: {{ organizerStore.executionProgress.failed }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOrganizerStore } from '@/store/organizer'
import { getFileIcon } from '@/utils/file-organizer'
import { validateClassificationPlan, executeClassification, verifyDirectoryPermission } from '@/utils/file-executor'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { ElMessage, ElMessageBox } from 'element-plus'

const organizerStore = useOrganizerStore()
const editingCategory = ref<string | null>(null)
const newCategoryName = ref('')

const validationErrors = computed(() => {
  if (!organizerStore.classificationPlan) return []
  
  const result = validateClassificationPlan(
    organizerStore.classificationPlan,
    organizerStore.items
  )
  
  return result.errors
})

function getTotalAssignedFiles(): number {
  if (!organizerStore.classificationPlan) return 0
  
  return Object.values(organizerStore.classificationPlan.categories)
    .reduce((sum, category) => sum + category.files.length, 0)
}

function startRenaming(categoryName: string) {
  editingCategory.value = categoryName
  newCategoryName.value = categoryName
}

function finishRenaming() {
  if (editingCategory.value && newCategoryName.value.trim() && newCategoryName.value !== editingCategory.value) {
    // 验证新名称
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g
    if (invalidChars.test(newCategoryName.value)) {
      ElMessage.error('Folder name contains invalid characters')
      return
    }
    
    organizerStore.renameCategory(editingCategory.value, newCategoryName.value.trim())
    ElMessage.success(`Renamed to "${newCategoryName.value}"`)
  }
  
  editingCategory.value = null
  newCategoryName.value = ''
}

function cancelRenaming() {
  editingCategory.value = null
  newCategoryName.value = ''
}

function confirmDeleteCategory(categoryName: string) {
  ElMessageBox.confirm(
    `Delete folder "${categoryName}"? Files will be moved to "Uncategorized".`,
    'Confirm Delete',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    organizerStore.removeCategory(categoryName)
    ElMessage.success(`Deleted "${categoryName}"`)
  }).catch(() => {
    // Cancelled
  })
}

function getChildPayload(categoryName: string) {
  return (index: number) => {
    const categoryInfo = organizerStore.classificationPlan?.categories[categoryName]
    return {
      categoryName,
      fileName: categoryInfo?.files[index]
    }
  }
}

function onDrop(targetCategory: string, dropResult: any) {
  const { removedIndex, addedIndex, payload } = dropResult
  
  if (payload) {
    // Only process if the item is being added to this container (dropped here)
    if (addedIndex !== null) {
      const { categoryName: sourceCategory, fileName } = payload
      
      // If moving between categories
      if (sourceCategory !== targetCategory) {
        organizerStore.moveFileToCategory(fileName, sourceCategory, targetCategory)
        ElMessage.success(`Moved "${fileName}" to "${targetCategory}"`)
      } else if (removedIndex !== null && removedIndex !== addedIndex) {
        // Reordering within same category (optional, requires store support)
        // organizerStore.reorderFile(targetCategory, removedIndex, addedIndex)
      }
    }
  }
}

function regenerate() {
  ElMessageBox.confirm(
    'This will discard the current classification plan. Continue?',
    'Regenerate Plan',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    organizerStore.setClassificationPlan(null)
    ElMessage.info('Click "Generate Classification Plan" to create a new one')
  }).catch(() => {
    // Cancelled
  })
}

async function selectTargetDirectory() {
  try {
    // 让用户选择目标目录
    const dirHandle = await window.showDirectoryPicker()
    
    organizerStore.setRootDirHandle(dirHandle)
    
    // 验证权限
    const hasPermission = await verifyDirectoryPermission(dirHandle)
    if (!hasPermission) {
      ElMessage.error('Permission denied for the selected directory')
      return
    }
    
    // 确认执行
    ElMessageBox.confirm(
      `This will create folders and move files in "${dirHandle.name}". Continue?`,
      'Confirm Execution',
      {
        confirmButtonText: 'Execute',
        cancelButtonText: 'Cancel',
        type: 'warning',
        distinguishCancelAndClose: true
      }
    ).then(() => {
      executeOrganization(dirHandle)
    }).catch(() => {
      // Cancelled
    })
  } catch (error: any) {
    console.error('Failed to select directory:', error)
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
      ElMessageBox.alert(
        result.message || 'Files organized successfully!',
        'Success',
        {
          confirmButtonText: 'OK',
          type: 'success'
        }
      ).then(() => {
        // 清空所有数据
        organizerStore.clearItems()
      })
    } else {
      ElMessageBox.alert(
        result.message + '\n\nCheck console for details.',
        'Execution Completed with Errors',
        {
          confirmButtonText: 'OK',
          type: 'warning'
        }
      )
    }
  } catch (error: any) {
    console.error('Execution failed:', error)
    ElMessage.error('Execution failed: ' + error.message)
  } finally {
    organizerStore.setIsExecuting(false)
  }
}

function getProgressPercentage(): number {
  const progress = organizerStore.executionProgress
  if (!progress || progress.total === 0) return 0
  
  return Math.round((progress.completed / progress.total) * 100)
}
</script>

<style scoped>
.classification-preview-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.preview-title {
  font-size: 20px;
  font-weight: 600;
}

.preview-stats {
  color: #6b7280;
  font-size: 14px;
}

.categories-list {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.category-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #f9fafb;
  transition: box-shadow 0.2s;
}

.category-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.category-title-row {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
}

.folder-icon {
  font-size: 20px;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.category-name-input {
  padding: 4px 8px;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  outline: none;
}

.file-count {
  color: #6b7280;
  font-size: 14px;
}

.category-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.delete-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.category-description {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 12px 28px;
  font-style: italic;
}

.files-list {
  margin-left: 28px;
}

.file-item-draggable {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: move;
  transition: all 0.2s;
}

.file-item-draggable:hover {
  background: #f3f4f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.drag-handle {
  color: #9ca3af;
  margin-right: 8px;
  cursor: grab;
}

.file-item-draggable .file-icon {
  font-size: 18px;
  margin-right: 8px;
}

.file-item-draggable .file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions-section {
  border-top: 2px solid #e5e7eb;
  padding-top: 20px;
}

.validation-info {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
}

.execution-progress {
  margin-top: 20px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  transition: width 0.3s;
}
</style>
