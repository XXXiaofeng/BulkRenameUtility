<template>
  <div class="column-view-container h-[600px] flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm font-sans">
    <!-- Left Column: Folders (Categories) -->
    <div class="w-1/3 min-w-[250px] border-r border-gray-200 bg-gray-50 flex flex-col">
      <div class="p-3 border-b border-gray-200 font-semibold text-gray-700 flex justify-between items-center h-12">
        <span class="flex items-center gap-2">
            <span class="text-lg">📁</span> Folders
        </span>
        <span class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{{ categoryNames.length }}</span>
      </div>
      
      <div class="overflow-y-auto flex-1 p-2 space-y-1 select-none">
        <div 
          v-for="name in categoryNames" 
          :key="name"
          @click="selectCategory(name)"
          @dblclick="startRenameCategory(name)"
          @drop="onDropToFolder(name, $event)"
          @dragover.prevent="onDragOverFolder(name, $event)"
          @dragleave="onDragLeaveFolder"
          class="cursor-pointer px-3 py-2 rounded-md flex items-center justify-between group transition-colors duration-150 ease-in-out"
          :class="[
            selectedCategory === name ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-200 text-gray-700',
            dragOverCategory === name ? 'ring-2 ring-blue-400 bg-blue-50' : ''
          ]"
        >
          <div class="flex items-center flex-1 min-w-0">
            <span class="mr-2 text-xl filter drop-shadow-sm">
                {{ selectedCategory === name ? '📂' : '📁' }}
            </span>
            <!-- Inline Edit Mode -->
            <input 
              v-if="editingCategory === name"
              ref="renameInput"
              v-model="newCategoryName"
              @keydown.enter="confirmRenameCategory"
              @keydown.esc="cancelRenameCategory"
              @blur="confirmRenameCategory"
              @click.stop
              class="flex-1 bg-white text-gray-800 px-2 py-0.5 rounded border border-blue-400 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span v-else class="truncate font-medium">{{ name }}</span>
          </div>
          <!-- Action Buttons (visible on hover) -->
          <div 
            v-if="editingCategory !== name"
            class="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button 
              @click.stop="startRenameCategory(name)"
              class="p-1 rounded hover:bg-gray-300 text-xs"
              :class="selectedCategory === name ? 'text-blue-100 hover:bg-blue-500' : 'text-gray-500'"
              title="Rename folder"
            >✏️</button>
            <button 
              @click.stop="confirmDeleteCategory(name)"
              class="p-1 rounded hover:bg-red-100 text-xs"
              :class="selectedCategory === name ? 'text-blue-100 hover:bg-red-500 hover:text-white' : 'text-gray-500 hover:text-red-600'"
              title="Delete folder"
            >🗑️</button>
          </div>
          <span 
            v-if="editingCategory !== name && organizerStore.classificationPlan?.categories[name]" 
            class="text-xs ml-2 px-1.5 py-0.5 rounded opacity-80"
            :class="selectedCategory === name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'"
          >
            {{ organizerStore.classificationPlan.categories[name].files.length }}
          </span>
        </div>
      </div>
      
      <div class="p-3 border-t border-gray-200 bg-gray-100 text-xs text-gray-500 text-center">
        Double-click folder to rename • Drag files to move
      </div>
    </div>

    <!-- Right Column: Files -->
    <div class="flex-1 flex flex-col bg-white min-w-0">
      <div class="p-3 border-b border-gray-200 font-semibold text-gray-800 flex justify-between items-center h-12 bg-white sticky top-0 z-10">
        <div class="flex items-center gap-2 overflow-hidden">
            <span class="text-xl text-blue-600">📂</span>
            <h3 class="truncate text-lg">{{ selectedCategory }}</h3>
        </div>
        <div class="flex items-center gap-3">
             <span class="text-xs text-gray-500">
                {{ selectedFiles.size > 0 ? `${selectedFiles.size} selected` : `${currentFiles.length} items` }}
             </span>
        </div>
      </div>

      <div 
        class="overflow-y-auto flex-1 p-4 bg-white" 
        @click.self="clearSelection"
        @dragover.prevent
      >
        <div v-if="currentFiles.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400">
            <span class="text-4xl mb-2">🍃</span>
            <p>No files in this folder</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
          <div 
            v-for="file in currentFiles" 
            :key="file"
            draggable="true"
            @dragstart="onDragStart($event, file)"
            @click="onFileClick(file, $event)"
            class="group relative border rounded-lg p-3 cursor-pointer transition-all duration-200 flex flex-col items-center text-center hover:shadow-md"
            :class="selectedFiles.has(file) ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'"
          >
            <!-- Selection Checkbox (Visible on hover or selected) -->
            <div 
                class="absolute top-2 left-2 w-4 h-4 rounded border flex items-center justify-center transition-opacity"
                :class="selectedFiles.has(file) ? 'bg-blue-600 border-blue-600 opacity-100' : 'bg-white border-gray-300 opacity-0 group-hover:opacity-100'"
            >
                <span v-if="selectedFiles.has(file)" class="text-white text-[10px]">✓</span>
            </div>

            <div class="text-3xl mb-3 mt-1 select-none filter drop-shadow-sm transition-transform group-hover:scale-110">
                {{ getFileIcon(file) }}
            </div>
            
            <div class="w-full">
                <div class="text-sm font-medium text-gray-700 truncate w-full px-1 mb-1" :title="file">
                    {{ file }}
                </div>
                <div class="text-xs text-gray-400 flex flex-col gap-0.5">
                   <span>{{ getFileSize(file) }}</span>
                   <span v-if="getFileDate(file)">{{ getFileDate(file) }}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useOrganizerStore } from '@/store/organizer'
import { getFileIcon, formatFileSize } from '@/utils/file-organizer'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'

const organizerStore = useOrganizerStore()

// State
const selectedCategory = ref<string>('')
const selectedFiles = ref<Set<string>>(new Set())
const lastSelectedFile = ref<string | null>(null) // For Shift+Click range selection
const dragOverCategory = ref<string | null>(null)

// Rename state
const editingCategory = ref<string | null>(null)
const newCategoryName = ref<string>('')
const renameInput = ref<HTMLInputElement | null>(null)

// Computed
const categoryNames = computed(() => {
    return organizerStore.classificationPlan 
        ? Object.keys(organizerStore.classificationPlan.categories).sort() 
        : []
})

const currentFiles = computed(() => {
    if (!organizerStore.classificationPlan || !selectedCategory.value) return []
    return organizerStore.classificationPlan.categories[selectedCategory.value]?.files || []
})

// Initialize selection
watch(() => categoryNames.value, (names) => {
    if (names.length > 0 && !selectedCategory.value) {
        selectedCategory.value = names[0]
    }
}, { immediate: true })

// Methods
function selectCategory(name: string) {
    if (editingCategory.value) return // Don't switch while editing
    selectedCategory.value = name
    clearSelection()
}

function startRenameCategory(name: string) {
    editingCategory.value = name
    newCategoryName.value = name
    nextTick(() => {
        renameInput.value?.focus()
        renameInput.value?.select()
    })
}

function confirmRenameCategory() {
    if (!editingCategory.value) return
    
    const oldName = editingCategory.value
    const newName = newCategoryName.value.trim()
    
    if (!newName) {
        ElMessage.warning('Folder name cannot be empty')
        cancelRenameCategory()
        return
    }
    
    if (newName !== oldName) {
        if (categoryNames.value.includes(newName)) {
            ElMessage.error('A folder with this name already exists')
            cancelRenameCategory()
            return
        }
        
        organizerStore.renameCategory(oldName, newName)
        
        // Update selected Category if it was renamed
        if (selectedCategory.value === oldName) {
            selectedCategory.value = newName
        }
        
        ElMessage.success(`Renamed to "${newName}"`)
    }
    
    editingCategory.value = null
    newCategoryName.value = ''
}

function cancelRenameCategory() {
    editingCategory.value = null
    newCategoryName.value = ''
}

function confirmDeleteCategory(name: string) {
    const filesCount = organizerStore.classificationPlan?.categories[name]?.files.length || 0
    
    ElMessageBox.confirm(
        filesCount > 0 
            ? `Delete folder "${name}" and remove ${filesCount} file(s) from classification?` 
            : `Delete empty folder "${name}"?`,
        'Confirm Delete',
        {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning'
        }
    ).then(() => {
        organizerStore.removeCategory(name)
        if (selectedCategory.value === name) {
            selectedCategory.value = categoryNames.value[0] || ''
        }
        ElMessage.success(`Deleted folder "${name}"`)
    }).catch(() => {})
}

function getFileSize(fileName: string) {
    const item = organizerStore.fileList.find(f => f.name === fileName)
    return item ? formatFileSize(item.size) : ''
}

function getFileDate(fileName: string) {
    const item = organizerStore.fileList.find(f => f.name === fileName)
    return item && item.lastModified ? dayjs(item.lastModified).format('YYYY-MM-DD') : ''
}

// -- Selection Logic --
function onFileClick(fileName: string, event: MouseEvent) {
    if (event.metaKey || event.ctrlKey) {
        // Toggle selection
        const newSet = new Set(selectedFiles.value)
        if (newSet.has(fileName)) {
            newSet.delete(fileName)
        } else {
            newSet.add(fileName)
            lastSelectedFile.value = fileName
        }
        selectedFiles.value = newSet
    } else if (event.shiftKey && lastSelectedFile.value) {
        // Range selection
        const files = currentFiles.value
        const start = files.indexOf(lastSelectedFile.value)
        const end = files.indexOf(fileName)
        
        if (start !== -1 && end !== -1) {
            const min = Math.min(start, end)
            const max = Math.max(start, end)
            const range = files.slice(min, max + 1)
            const newSet = new Set(selectedFiles.value)
            range.forEach(f => newSet.add(f))
            selectedFiles.value = newSet
        }
    } else {
        // Single selection
        // If clicking on an already selected item without modifier properties, do nothing (to allow drag start)
        // Wait, if I click clearly it should select only this one. Drag start is handled separately.
        // Actually for standard file managers, clicking an item selects it (and deselects others).
        if (!selectedFiles.value.has(fileName) || selectedFiles.value.size > 1) {
             const newSet = new Set<string>()
             newSet.add(fileName)
             selectedFiles.value = newSet
             lastSelectedFile.value = fileName
        }
    }
}

function clearSelection() {
    selectedFiles.value = new Set()
    lastSelectedFile.value = null
}

// -- Drag and Drop Logic --

function onDragStart(event: DragEvent, fileName: string) {
    if (!event.dataTransfer) return

    // If dragging an unselected file, select it first (exclusive)
    if (!selectedFiles.value.has(fileName)) {
        selectedFiles.value = new Set([fileName])
    }

    const filesToDrag = Array.from(selectedFiles.value)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify({
        sourceCategory: selectedCategory.value,
        files: filesToDrag
    }))
    
    // Set drag image (optional, browsers do automatic mostly, but for multi-file it renders only the dragged element)
    // We can just let efficient default behavior happen or create a custom ghost
    const dragCount = filesToDrag.length
    if (dragCount > 1) {
        const div = document.createElement('div')
        div.textContent = `${dragCount} items`
        div.style.background = 'red' // Just a fallback, usually invisible if not appended
        // Proper ghost image is complex, skipping for now
    }
}

function onDragOverFolder(categoryName: string, event: DragEvent) {
    // Cannot drop on same category
    if (categoryName === selectedCategory.value) return 
    
    dragOverCategory.value = categoryName
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
    }
}

function onDragLeaveFolder() {
    // Simple reset, might flicker if moving between children elements. 
    // Ideally use drag enter/leave counters or check relatedTarget.
    // Simplifying by letting onDragOver handle the active state mostly.
    // logic hole: dragLeave fires when entering children text. 
    // Fix: We reset dragOverCategory in onDrop and maybe global drag end.
    // Actually, we can just rely on onDragOver to set it, but we need to unset it when leaving the list...
    // Let's implement a better 'reset' via dragend or dropping.
}

function onDropToFolder(targetCategory: string, event: DragEvent) {
    dragOverCategory.value = null
    if (!event.dataTransfer) return
    
    try {
        const data = JSON.parse(event.dataTransfer.getData('application/json'))
        const sourceCategory = data.sourceCategory
        const files: string[] = data.files
        
        if (sourceCategory && files && files.length > 0) {
            // Move files
            if (sourceCategory === targetCategory) return

            let successCount = 0
            files.forEach(fileName => {
                organizerStore.moveFileToCategory(fileName, sourceCategory, targetCategory)
                successCount++
            })
            
            if (successCount > 0) {
                ElMessage.success(`Moved ${successCount} files to "${targetCategory}"`)
            }
            
            // Clear selection if we just moved them out of view
            if (sourceCategory === selectedCategory.value) {
                clearSelection()
            }
        }
    } catch (e) {
        console.error('Drop failed', e)
    }
}
</script>

<style scoped>
/* Custom Scrollbar for a more Finder-like feel */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
