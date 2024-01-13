<template>
  <div class="container">
    <el-input
      v-model="pattern"
      placeholder="Enter a completely new naming rule, use <> to reference variables, e.g., <name>. Click Help for assistance →→→→"></el-input>
    <el-button type="primary" @click="onHelpClick">Help</el-button>
  </div>

  <Teleport to="body">
    <Transition name="help">
      <div class="help-container" v-if="isHelpContentShow">
        <div class="help-content">
          <h3 class="title">Variable Definitions</h3>
          <div class="content">
            <span class="content-line">
              <span class="variable">&lt;name&gt;</span> Original file name (excluding extension);
              <span class="variable">&lt;ext&gt;</span> Original file extension; can use :upper or
              :lower to change case
            </span>
            <span class="content-line">
              <span class="variable">&lt;#:1&gt;</span> Number, with a base of 1 (default); for
              fixed width, use multiple #, e.g., <span class="variable">&lt;####&gt;</span>
            </span>
            <span class="content-line">
              <span class="variable">&lt;date&gt;</span>/<span class="variable"
                >&lt;date.now&gt;</span
              >
              Current date; <span class="variable">&lt;date.modify&gt;</span> Last modification date
              of the file
            </span>
            <span class="content-line">
              <span class="variable">&lt;time&gt;</span>/<span class="variable"
                >&lt;time.now&gt;</span
              >
              Current time; <span class="variable">&lt;time.modify&gt;</span> Last modification time
              of the file
            </span>
            <span class="content-line">
              Dates and times can use formatting strings, e.g.,
              <span class="variable">&lt;date.modify:YYYY-MM-DD&gt;</span> /
              <span class="variable">&lt;time:HH-mm-ss&gt;</span>
              <a
                href="https://day.js.org/docs/en/display/format"
                target="_blank"
                referrerpolicy="no-referrer"
                >Documentation Reference</a
              >
            </span>

            <span class="content-line">
              <span class="variable">&lt;uuid:8:upper&gt;</span> Random string; specify length with
              :8, up to a maximum of 32; add :upper to convert to uppercase
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const pattern = ref("")
const isHelpContentShow = ref(false)

const emits = defineEmits(["submit"])

watchEffect(() => {
  const options = {
    pattern: pattern.value
  }
  emits("submit", options)
})

const onHelpClick = () => {
  isHelpContentShow.value = !isHelpContentShow.value
}

onDeactivated(() => {
  isHelpContentShow.value = false
})
</script>

<style lang="less" scoped>
.container {
  display: flex;

  button {
    margin: 0 4px 0 12px;
  }
}

.content {
  display: flex;
  flex-direction: column;
}

.content-line {
  font-size: 14px;
  line-height: 22px;

  .variable {
    color: #337ecc;
  }
}

.help-content {
  margin: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.help-container {
  background-color: white;
  position: fixed;
  top: 500px;
  left: 100px;
  right: 100px;
  z-index: 999;
  border: 2px solid #eee;
  height: 170px;
  max-height: 20vh;
  border-radius: 10px;
  width: 50%;
  left: 50%;
  transform: translateX(-50%);
}

.help-enter-active,
.help-leave-active {
  transition: all 0.3s ease;
}

.help-enter-from,
.help-leave-to {
  opacity: 0;
  height: 0;
}
</style>
