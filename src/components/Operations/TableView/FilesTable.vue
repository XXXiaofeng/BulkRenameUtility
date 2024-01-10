<template>
  <div>
    <div class="filters">
      <el-checkbox v-model="isShowFolder" label="显示目录" border />
      <el-checkbox v-model="isOnlyPreview" label="仅显示预览" border />
      <el-checkbox v-model="isOnlyEffected" label="仅显示受影响的文件" border />
    </div>

    <!-- 表格组件 -->
    <vxe-table
      :data="data"
      class="table"
      max-height="300%"
      stripe
      border="inner"
      empty-text="尚未加载任何文件"
      @sort-change="onSortChange"
      :row-class-name="rowClass"
      ref="tableRef">
      <!-- 序号列 -->
      <vxe-column
        field="index"
        :formatter="indexFormatter"
        title="序号"
        width="60"
        align="center"></vxe-column>
      <!-- 文件名列 -->
      <vxe-column
        field="name"
        class-name="text-pre"
        title="文件名"
        sortable
        align="left"></vxe-column>
      <!-- 修改时间列 -->
      <vxe-column
        :visible="!isOnlyPreview"
        field="modifyTime"
        :formatter="timeFormater"
        title="修改时间"
        width="180"
        sortable
        align="center"></vxe-column>
      <!-- 大小列 -->
      <vxe-column
        :visible="!isOnlyPreview"
        field="size"
        :formatter="sizeFormatter"
        title="大小"
        width="100"
        sortable
        align="center"></vxe-column>
      <!-- 目录列（如果需要显示目录的话） -->
      <vxe-column
        :visible="isShowFolder && !isOnlyPreview"
        field="folder"
        title="目录"
        sortable
        align="right"></vxe-column>
      <!-- 预览列 -->
      <vxe-column
        field="preview"
        title="预览"
        align="left"
        :class-name="previewCellClass"></vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
import { formatFileSize, formatDate } from "@/utils/formatter"
import { VxeColumnPropTypes } from "vxe-table"

import { useFileStore } from "@/store/files"
import { storeToRefs } from "pinia"

const fileStore = useFileStore()
const { filteredFiles } = storeToRefs(fileStore)

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

// 时间列格式化函数
const timeFormater: VxeColumnPropTypes.Formatter<FileItem> = ({ cellValue }) => {
  if (!cellValue) {
    return "UNKNOWN"
  }
  return formatDate(cellValue)
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

.text-pre {
  .vxe-cell--label {
    white-space: pre;
  }
}

tr.row-name-changed-color-1 {
  background-color: #d9ecff !important;
}

tr.row-name-changed-color-2 {
  background-color: #c6e2ff !important;
}
</style>
