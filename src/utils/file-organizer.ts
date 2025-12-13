import type { OrganizerItem } from '@/types/organizer'

/**
 * 导入多个文件（支持多选）
 */
export async function importMultipleFiles(): Promise<OrganizerItem[]> {
    try {
        const handles = await globalThis.showOpenFilePicker({
            multiple: true
        })

        const items: OrganizerItem[] = []

        for (const handle of handles) {
            // Filter hidden files
            if (handle.name.startsWith('.')) {
                continue
            }

            const file = await handle.getFile()
            items.push({
                type: 'file',
                name: file.name,
                path: file.name,
                fullPath: file.name,
                size: file.size,
                lastModified: file.lastModified,
                handle: handle
            })
        }

        return items
    } catch (error: any) {
        if (isUserCancel(error)) {
            return []
        }
        console.error('导入文件失败:', error)
        throw error
    }
}

/**
 * 导入单个文件夹（包含所有子文件）
 */
export async function importSingleFolder(): Promise<OrganizerItem[]> {
    try {
        const dirHandle = await window.showDirectoryPicker()
        return await handleDirectoryEntry(dirHandle, '', '')
    } catch (error: any) {
        if (isUserCancel(error)) {
            return []
        }
        console.error('导入文件夹失败:', error)
        throw error
    }
}

/**
 * 递归处理文件夹及其子项
 */
async function handleDirectoryEntry(
    dirHandle: FileSystemDirectoryHandle,
    parentPath: string,
    displayPath: string
): Promise<OrganizerItem[]> {
    const items: OrganizerItem[] = []

    const currentPath = parentPath ? `${parentPath}/${dirHandle.name}` : dirHandle.name
    const currentDisplayPath = displayPath ? `${displayPath}/${dirHandle.name}` : dirHandle.name

    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
            // Filter hidden files
            if (entry.name.startsWith('.')) {
                continue
            }
            const fileHandle = entry as FileSystemFileHandle
            const file = await fileHandle.getFile()

            items.push({
                type: 'file',
                name: file.name,
                path: currentPath ? `${currentPath}/${file.name}` : file.name,
                fullPath: currentDisplayPath ? `${currentDisplayPath}/${file.name}` : file.name,
                size: file.size,
                lastModified: file.lastModified,
                handle: fileHandle,
                parent: currentPath
            })
        } else if (entry.kind === 'directory') {
            const subDirHandle = entry as FileSystemDirectoryHandle
            const subItems = await handleDirectoryEntry(subDirHandle, currentPath, currentDisplayPath)
            items.push(...subItems)
        }
    }

    return items
}

/**
 * 扁平化显示所有文件（用于列表展示）
 */
export function flattenItems(items: OrganizerItem[]): OrganizerItem[] {
    const result: OrganizerItem[] = []

    for (const item of items) {
        if (item.type === 'file') {
            result.push(item)
        }
        if (item.children && item.children.length > 0) {
            result.push(...flattenItems(item.children))
        }
    }

    return result
}

/**
 * 格式化文件大小显示
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 检查是否为用户取消操作
 */
function isUserCancel(error: Error): boolean {
    return error instanceof DOMException && error.code === 20 && error.name === 'AbortError'
}

/**
 * 获取文件类型图标
 */
export function getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || ''

    const iconMap: Record<string, string> = {
        // 图片
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'svg': '🖼️',
        'webp': '🖼️',

        // 文档
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'txt': '📝',
        'md': '📝',

        // 表格
        'xls': '📊',
        'xlsx': '📊',
        'csv': '📊',

        // 演示
        'ppt': '📽️',
        'pptx': '📽️',

        // 压缩
        'zip': '📦',
        'rar': '📦',
        '7z': '📦',

        // 代码
        'js': '💻',
        'ts': '💻',
        'py': '💻',
        'java': '💻',
        'cpp': '💻',
        'html': '💻',
        'css': '💻',

        // 音频
        'mp3': '🎵',
        'wav': '🎵',
        'flac': '🎵',

        // 视频
        'mp4': '🎬',
        'avi': '🎬',
        'mov': '🎬',
        'mkv': '🎬'
    }

    return iconMap[ext] || '📄'
}
