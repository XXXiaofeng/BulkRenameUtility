// 文件整理器相关类型定义

export interface OrganizerItem {
    type: 'file' | 'folder'
    name: string
    path: string // 相对路径
    fullPath: string // 完整路径（用于显示）
    size: number
    handle: FileSystemFileHandle | FileSystemDirectoryHandle
    children?: OrganizerItem[] // 如果是文件夹，包含子项
    parent?: string // 父文件夹路径
    lastModified?: number // 上次修改时间
}

export interface CategoryInfo {
    files: string[] // 文件路径列表
    description?: string // AI 生成的分类说明
}

export interface ClassificationPlan {
    categories: {
        [categoryName: string]: CategoryInfo
    }
}

export interface ExecutionProgress {
    total: number
    completed: number
    failed: number
    current?: string // 当前正在处理的文件
    errors: Array<{
        file: string
        error: string
    }>
}

export interface ExecutionResult {
    success: boolean
    progress: ExecutionProgress
    message?: string
}

// Phase 2 Output: The Schema (Constitution)
export interface ClassificationSchema {
    categories: {
        [categoryName: string]: {
            description: string
        }
    }
}

// Phase 3 Output: Strict Assignment
export interface BatchClassificationResult {
    fileAssignments: {
        [filename: string]: string // filename -> categoryName
    }
}
