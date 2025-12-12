import type {
    OrganizerItem,
    ClassificationPlan,
    ExecutionProgress,
    ExecutionResult
} from '@/types/organizer'

/**
 * 执行文件分类方案
 * 在指定目录下创建文件夹并移动文件
 */
export async function executeClassification(
    rootDirHandle: FileSystemDirectoryHandle,
    plan: ClassificationPlan,
    items: OrganizerItem[]
): Promise<ExecutionResult> {
    const progress: ExecutionProgress = {
        total: 0,
        completed: 0,
        failed: 0,
        errors: []
    }

    // 计算总文件数
    for (const category of Object.values(plan.categories)) {
        progress.total += category.files.length
    }

    try {
        // 第一步：创建所有文件夹
        const categoryHandles = new Map<string, FileSystemDirectoryHandle>()

        for (const categoryName of Object.keys(plan.categories)) {
            try {
                const dirHandle = await rootDirHandle.getDirectoryHandle(categoryName, {
                    create: true
                })
                categoryHandles.set(categoryName, dirHandle)
                console.log(`[Executor] Created folder: ${categoryName}`)
            } catch (error: any) {
                console.error(`[Executor] Failed to create folder ${categoryName}:`, error)
                throw new Error(`Failed to create folder "${categoryName}": ${error.message}`)
            }
        }

        // 第二步：移动文件到对应文件夹
        for (const [categoryName, categoryInfo] of Object.entries(plan.categories)) {
            const targetDirHandle = categoryHandles.get(categoryName)
            if (!targetDirHandle) {
                console.error(`[Executor] Folder handle not found: ${categoryName}`)
                continue
            }

            for (const filePath of categoryInfo.files) {
                progress.current = filePath

                // 找到对应的文件 item
                const fileItem = items.find(item =>
                    item.type === 'file' &&
                    (item.path === filePath || item.name === filePath || item.fullPath === filePath)
                )

                if (!fileItem) {
                    console.warn(`[Executor] File not found in items: ${filePath}`)
                    progress.failed++
                    progress.errors.push({
                        file: filePath,
                        error: 'File not found in imported items'
                    })
                    continue
                }

                try {
                    const fileHandle = fileItem.handle as FileSystemFileHandle

                    // 移动文件到目标文件夹
                    // Note: runtime API expects (dirHandle, newName), but TS definition might be outdated
                    await (fileHandle as any).move(targetDirHandle, fileItem.name)

                    progress.completed++
                    console.log(`[Executor] Moved ${fileItem.name} to ${categoryName}`)
                } catch (error: any) {
                    console.error(`[Executor] Failed to move ${filePath}:`, error)
                    progress.failed++
                    progress.errors.push({
                        file: filePath,
                        error: error.message || 'Unknown error'
                    })
                }
            }
        }

        const success = progress.failed === 0
        return {
            success,
            progress,
            message: success
                ? `Successfully organized ${progress.completed} files into ${Object.keys(plan.categories).length} folders`
                : `Organized ${progress.completed} files, ${progress.failed} failed`
        }
    } catch (error: any) {
        console.error('[Executor] Fatal error:', error)
        return {
            success: false,
            progress,
            message: `Fatal error: ${error.message}`
        }
    }
}

/**
 * 验证文件系统权限
 */
export async function verifyDirectoryPermission(
    dirHandle: FileSystemDirectoryHandle
): Promise<boolean> {
    try {
        const permission = await dirHandle.queryPermission({ mode: 'readwrite' })

        if (permission === 'granted') {
            return true
        }

        // 请求权限
        const granted = await dirHandle.requestPermission({ mode: 'readwrite' })
        return granted === 'granted'
    } catch (error) {
        console.error('[Permission] Error:', error)
        return false
    }
}

/**
 * 预检查：验证分类方案的有效性
 */
export function validateClassificationPlan(
    plan: ClassificationPlan,
    items: OrganizerItem[]
): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const fileNames = items
        .filter(item => item.type === 'file')
        .map(item => item.name)

    const allAssignedFiles = new Set<string>()

    // 检查每个分类
    for (const [categoryName, categoryInfo] of Object.entries(plan.categories)) {
        // 检查文件夹名称合法性
        const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g
        if (invalidChars.test(categoryName)) {
            errors.push(`Invalid folder name: "${categoryName}" contains illegal characters`)
        }

        // 检查文件是否存在
        for (const filePath of categoryInfo.files) {
            const fileName = filePath.split('/').pop() || filePath

            if (!fileNames.includes(fileName)) {
                errors.push(`File "${fileName}" in category "${categoryName}" not found in imported files`)
            }

            // 检查重复分配
            if (allAssignedFiles.has(fileName)) {
                errors.push(`File "${fileName}" is assigned to multiple categories`)
            }
            allAssignedFiles.add(fileName)
        }
    }

    // 检查是否有未分配的文件
    const unassignedFiles = fileNames.filter(name => !allAssignedFiles.has(name))
    if (unassignedFiles.length > 0) {
        errors.push(`Unassigned files: ${unassignedFiles.join(', ')}`)
    }

    return {
        valid: errors.length === 0,
        errors
    }
}
