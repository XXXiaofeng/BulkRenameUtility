<template>
  <div>
    <div class="position-select">
      <el-select v-model="position" placeholder="Position for Inserting Characters">
        <el-option
          v-for="item in positionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      <el-input-number
        v-show="position === 'afterIndexN' || position === 'beforeIndexN'"
        style="width: 220px"
        v-model="positionIndex"
        :min="0"
        placeholder="Set the value of N"></el-input-number>
      <el-input
        v-show="position === 'afterStr' || position === 'beforeStr'"
        style="width: 360px"
        v-model="positionStr"
        placeholder="Set the value of string XX"></el-input>
    </div>

    <div style="margin: 12px 0">
      <el-radio-group v-model="insertContentType">
        <el-radio-button label="text">Text</el-radio-button>
        <el-radio-button label="index">Index</el-radio-button>
      </el-radio-group>
    </div>

    <el-input
      style="max-width: 800px"
      v-show="insertContentType === 'text'"
      v-model="insertText"
      placeholder="Inserted Text Content"></el-input>

    <div class="insert-index-wrapper" v-show="insertContentType === 'index'">
      <el-input
        style="max-width: 240px"
        v-model="insertIndexPreText"
        placeholder="Text Before Index"></el-input>
      <span class="insert-index-type-wrapper">
        <el-tooltip content="Start Index" placement="top">
          <el-input-number
            v-model="insertIndexBaseNumber"
            controls-position="right"
            placeholder="Start Index" />
        </el-tooltip>

        <el-select v-model="insertIndexNumberType" placeholder="Index Type">
          <el-option
            v-for="item in insertContentTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>

        <el-tooltip content="Fixed Length" placement="right">
          <el-input-number
            v-model="insertIndexDigitPadding"
            :min="1"
            :max="10"
            controls-position="right"
            placeholder="Fixed Length"
            v-show="insertIndexNumberType === 'digit'" />
        </el-tooltip>
      </span>
      <el-input
        style="max-width: 240px"
        v-model="insertIndexAfterText"
        placeholder="Text After Index"></el-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
const positionOptions = [
  {
    label: "Beginning Position",
    value: "begin"
  },
  {
    label: "End Position",
    value: "end"
  },
  {
    label: "After Nth Character",
    value: "afterIndexN"
  },
  {
    label: "Before Nth Character from the End",
    value: "beforeIndexN"
  },
  {
    label: "After String XX",
    value: "afterStr"
  },
  {
    label: "Before String XX",
    value: "beforeStr"
  }
]

const insertContentTypeOptions = [
  {
    label: "Arabic Numerals",
    value: "digit"
  },
  {
    label: "Lowercase Chinese Numerals",
    value: "lowerChinese"
  },
  {
    label: "Uppercase Chinese Numerals",
    value: "upperChinese"
  },
  {
    label: "Lowercase English Letters",
    value: "lowerChar"
  },
  {
    label: "Uppercase English Letters",
    value: "upperChar"
  }
]

const position = ref("")
const postionIndex = ref()
const postionStr = ref("")

const intertContentType = ref("text")

const insertText = ref("")
const insertIndexPreText = ref("")
const insertIndexAfterText = ref("")
const insertIndexBaseNumber = ref()
const insertIndexNumberType = ref("digit")
const insertIndexDigitPadding = ref()

const emits = defineEmits(["submit"])

watchEffect(() => {
  const options = {
    position: position.value,
    n: postionIndex.value,
    from: postionStr.value,
    toType: intertContentType.value,
    toStr: insertText.value,
    toPreStr: insertIndexPreText.value,
    toAfterStr: insertIndexAfterText.value,
    toBaseNumber: insertIndexBaseNumber.value,
    toNumberType: insertIndexNumberType.value,
    toDigitPadding: insertIndexDigitPadding.value
  }
  emits("submit", options)
})
</script>

<style lang="less" scoped>
.postion-select {
  display: flex;
  align-items: center;

  & > * {
    margin-right: 12px;
  }
}

.insert-index-wrapper {
  display: flex;
  align-items: center;

  & > * {
    margin-right: 12px;
  }
}

.insert-index-type-wrapper {
  display: flex;
  flex-direction: column;

  padding: 8px 6px;

  border: 1px solid #eee;
  border-radius: 4px;

  & > * {
    width: 160px;
  }

  & > *:nth-child(n + 2) {
    margin-top: 6px;
  }
}
</style>
