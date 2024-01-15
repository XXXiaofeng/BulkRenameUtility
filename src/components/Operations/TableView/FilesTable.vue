<template>
  <div>
    <span>
      Total Imports: {{ total }}&nbsp;&nbsp;&nbsp&nbsp;Affected Count:
      {{ effectedFileCount }}&nbsp;&nbsp;&nbsp;&nbsp;Filter Results: {{ selectedCount }}
    </span>

    <span class="working-file-span" v-if="waitRenameCount > 0"
      >Waiting for File Renaming: {{ waitRenameCount }} ; Successful Count:
      {{ successRenameCount }} ; Failed Count: {{ failRenameCount }} ; Currently Renaming:
      {{ renameWorkingFile?.name ?? "" }}</span
    >

    <div class="filters">
      <el-checkbox v-model="isShowFolder" label="Show Folders" border />
      <el-checkbox v-model="isOnlyPreview" label="Show Previews Only" border />
      <el-checkbox v-model="isOnlyEffected" label="Show Only Affected Files" border />
    </div>
  </div>
  <div class="w-full">
    <!-- 表格组件 -->
    <vxe-table
      :data="data"
      class="table"
      max-height="500px"
      stripe
      border="inner"
      empty-text="No files loaded yet"
      @sort-change="onSortChange"
      :row-class-name="rowClass"
      ref="tableRef"
      fit>
      <!-- Index Column -->
      <vxe-column
        field="index"
        :formatter="indexFormatter"
        title="Index"
        width="60"
        align="center"></vxe-column>
      <!-- File Name Column -->
      <vxe-column
        field="name"
        class-name="text-pre"
        title="File Name"
        sortable
        align="left"></vxe-column>
      <!-- Modify Time Column -->
      <vxe-column
        :visible="!isOnlyPreview"
        field="modifyTime"
        title="Modify Time"
        sortable
        align="center"></vxe-column>
      <!-- Size Column -->
      <vxe-column
        :visible="!isOnlyPreview"
        field="size"
        :formatter="sizeFormatter"
        title="Size"
        width="100"
        sortable
        align="center"></vxe-column>
      <!-- Folder Column (if folder display is needed) -->
      <vxe-column
        :visible="isShowFolder && !isOnlyPreview"
        field="folder"
        title="Folder"
        sortable
        align="right"></vxe-column>
      <!-- Preview Column -->
      <vxe-column
        field="preview"
        title="Preview"
        align="left"
        :class-name="previewCellClass"></vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
import { formatFileSize } from "@/utils/formatter"
import { VxeColumnPropTypes } from "vxe-table"

import { useFileStore } from "@/store/files"
import { storeToRefs } from "pinia"

const fileStore = useFileStore()

const {
  total,
  selectedCount,
  waitRenameCount,
  successRenameCount,
  failRenameCount,
  renameWorkingFile
} = storeToRefs(fileStore)
const { filteredFiles } = storeToRefs(fileStore)

const effectedFileCount = computed(() => {
  const files = filteredFiles.value
  return files.filter((f) => f.name !== f.preview).length
})

const isOnlyEffected = ref(false)

// 计算属性，根据过滤条件获取数据
const data = computed(() => {
  const files = filteredFiles.value
  if (isOnlyEffected.value) {
    return files.filter((f) => f.name !== f.preview)
  } else {
    return files
  }
})

// 序号列格式化函数
const indexFormatter: VxeColumnPropTypes.Formatter<FileItem> = ({ cellValue }) => {
  return cellValue + 1
}

// 大小列格式化函数
const sizeFormatter: VxeColumnPropTypes.Formatter<FileItem> = ({ cellValue }) => {
  return formatFileSize(cellValue)
}

const isShowFolder = ref(false)
const isOnlyPreview = ref(true)

// 预览列样式函数
const previewCellClass = (args: any) => {
  const row = args.row as FileItem
  if (!row || row.isValidName === undefined) {
    return ""
  }
  return row.isValidName ? "text-pre" : "invalid-filename text-pre"
}

// 行样式函数
const rowClass = (args: any) => {
  const fileItem = args.row as FileItem
  if (!fileItem) {
    return ""
  }
  const seq = args.seq as number // 当前布局上的表格序号

  if (fileItem.name !== fileItem.preview) {
    // 相邻两行是否不同的颜色标记
    if (seq % 2 === 1) {
      return "row-name-changed-color-1"
    } else {
      return "row-name-changed-color-2"
    }
  }
  return ""
}

// 排序变化事件处理函数
const onSortChange = (args: any) => {
  const table = args.$table
  const visibleData = table.getTableData().visibleData // 排序结果

  for (let i = 0; i < visibleData.length; i++) {
    const item = visibleData[i]
    item.index = i
    fileStore.updateIndex(item)
  }

  fileStore.refresh()
}

const tableRef = ref(null)

// 显示的数据变更之后（如更新了文件过滤条件），则重新更新 index
watch(data, () => {
  const table = tableRef.value as any
  if (!table) {
    return
  }

  nextTick(() => {
    let anyChanged = false
    const visibleData = table.getTableData().visibleData
    for (let i = 0; i < visibleData.length; i++) {
      const item = visibleData[i]
      if (item.index !== i) {
        item.index = i
        fileStore.updateIndex(item)
        anyChanged = true
      }
    }
    if (!anyChanged) {
      return
    }
    fileStore.refresh()
  })
})
</script>

<style lang="less" scoped>
.table {
  min-width: 10%;
  max-width: 99%;
}

.filters {
  margin: 4px 0 8px 0;

  .el-checkbox {
    margin-right: 12px;
  }
}
</style>

<style>
.invalid-filename {
  color: #f56c6c;
}

tr.row-name-changed-color-1 {
  background-color: #d9ecff !important;
}

tr.row-name-changed-color-2 {
  background-color: #c6e2ff !important;
}

.table {
  width: 100%;
}
</style>
