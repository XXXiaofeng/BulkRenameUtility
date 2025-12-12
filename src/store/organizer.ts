import { defineStore } from 'pinia'
import type { OrganizerItem, ClassificationPlan, ExecutionProgress, ClassificationSchema } from '@/types/organizer'
import type { ClassificationPhase } from '@/utils/geminiAPI'

export const useOrganizerStore = defineStore('organizer', () => {
    // 状态
    const items = ref<OrganizerItem[]>([])
    const classificationPlan = ref<ClassificationPlan | null>(null)
    const executionProgress = ref<ExecutionProgress | null>(null)
    const isClassifying = ref(false)
    const isExecuting = ref(false)
    const rootDirHandle = ref<FileSystemDirectoryHandle | null>(null)

    // Scalable Classification State
    const classificationPhase = ref<ClassificationPhase>('COMPLETED')
    const classificationProgress = ref(0) // 0-100 or count
    const classificationTotal = ref(0)
    const classificationMessage = ref('')
    const schemaForReview = ref<ClassificationSchema | null>(null)
    const showSchemaReviewModal = ref(false)

    // 计算属性
    const totalFiles = computed(() => {
        return items.value.filter(item => item.type === 'file').length
    })

    const totalFolders = computed(() => {
        return items.value.filter(item => item.type === 'folder').length
    })

    const fileList = computed(() => {
        return items.value.filter(item => item.type === 'file')
    })

    // Actions
    function addItems(newItems: OrganizerItem[]) {
        items.value.push(...newItems)
    }

    function clearItems() {
        items.value = []
        classificationPlan.value = null
        executionProgress.value = null
        rootDirHandle.value = null
        resetClassificationState()
    }

    function resetClassificationState() {
        classificationPhase.value = 'COMPLETED'
        classificationProgress.value = 0
        classificationTotal.value = 0
        classificationMessage.value = ''
        schemaForReview.value = null
        showSchemaReviewModal.value = false
    }

    function setClassificationPlan(plan: ClassificationPlan) {
        classificationPlan.value = plan
    }

    function setIsClassifying(value: boolean) {
        isClassifying.value = value
    }

    function setIsExecuting(value: boolean) {
        isExecuting.value = value
    }

    function setRootDirHandle(handle: FileSystemDirectoryHandle) {
        rootDirHandle.value = handle
    }

    function updateExecutionProgress(progress: ExecutionProgress) {
        executionProgress.value = progress
    }

    // Scalable Actions
    function updateClassificationProgress(phase: ClassificationPhase, progress: number, total: number, message: string = '') {
        classificationPhase.value = phase
        classificationProgress.value = progress
        classificationTotal.value = total
        classificationMessage.value = message
    }

    function openSchemaReview(schema: ClassificationSchema) {
        schemaForReview.value = schema
        showSchemaReviewModal.value = true
        classificationMessage.value = "Waiting for user review..."
    }

    function closeSchemaReview() {
        showSchemaReviewModal.value = false
    }

    function updateSchemaForReview(newSchema: ClassificationSchema) {
        schemaForReview.value = newSchema
    }

    function moveFileToCategory(filePath: string, fromCategory: string, toCategory: string) {
        if (!classificationPlan.value) return

        // 1. Try to remove from the expected 'fromCategory'
        let sourceCategory = fromCategory
        let fromFiles = classificationPlan.value.categories[sourceCategory]?.files || []
        let fileIndex = fromFiles.indexOf(filePath)

        // 2. Fallback: If not found, search in all categories (Robustness)
        if (fileIndex === -1) {
            console.warn(`File "${filePath}" not found in category "${fromCategory}", searching globally...`)
            for (const [catName, catInfo] of Object.entries(classificationPlan.value.categories)) {
                const idx = catInfo.files.indexOf(filePath)
                if (idx > -1) {
                    sourceCategory = catName
                    fromFiles = catInfo.files
                    fileIndex = idx
                    break
                }
            }
        }

        // 3. Remove if found
        if (fileIndex > -1) {
            fromFiles.splice(fileIndex, 1)
        } else {
            console.error(`Failed to move "${filePath}": File not found in any category.`)
            return // Stop if we can't find the source, to prevent phantom addition
        }

        // 4. Add to new category (Prevent Duplicates)
        if (!classificationPlan.value.categories[toCategory]) {
            classificationPlan.value.categories[toCategory] = {
                files: [],
                description: ''
            }
        }

        const targetFiles = classificationPlan.value.categories[toCategory].files
        if (!targetFiles.includes(filePath)) {
            targetFiles.push(filePath)
        }
    }

    function renameCategory(oldName: string, newName: string) {
        if (!classificationPlan.value) return
        if (oldName === newName) return

        const category = classificationPlan.value.categories[oldName]
        if (category) {
            classificationPlan.value.categories[newName] = category
            delete classificationPlan.value.categories[oldName]
        }
    }

    function removeCategory(categoryName: string) {
        if (!classificationPlan.value) return

        // 将该分类的文件移到 "Uncategorized"
        const files = classificationPlan.value.categories[categoryName]?.files || []
        if (files.length > 0) {
            if (!classificationPlan.value.categories['Uncategorized']) {
                classificationPlan.value.categories['Uncategorized'] = {
                    files: [],
                    description: 'Files without specific category'
                }
            }
            classificationPlan.value.categories['Uncategorized'].files.push(...files)
        }

        delete classificationPlan.value.categories[categoryName]
    }

    return {
        // State
        items,
        classificationPlan,
        executionProgress,
        isClassifying,
        isExecuting,
        rootDirHandle,

        classificationPhase,
        classificationProgress,
        classificationTotal,
        classificationMessage,
        schemaForReview,
        showSchemaReviewModal,

        // Computed
        totalFiles,
        totalFolders,
        fileList,

        // Actions
        addItems,
        clearItems,
        resetClassificationState,
        setClassificationPlan,
        setIsClassifying,
        setIsExecuting,
        setRootDirHandle,
        updateExecutionProgress,

        updateClassificationProgress,
        openSchemaReview,
        closeSchemaReview,
        updateSchemaForReview,

        moveFileToCategory,
        renameCategory,
        removeCategory
    }
})
