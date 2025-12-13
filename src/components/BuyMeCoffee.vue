<template>
  <div class="buy-me-coffee-card" :class="variant">
    <div class="bmc-content">
      <div class="bmc-icon">☕</div>
      <div class="bmc-text">
        <h4 v-if="variant === 'banner'" class="bmc-title">{{ title }}</h4>
        <p class="bmc-description">{{ description }}</p>
        <p v-if="showEmail" class="bmc-email-hint">
        </p>
      </div>
    </div>
    <a 
      :href="bmcUrl" 
      target="_blank" 
      rel="noopener noreferrer"
      class="bmc-button"
    >
      <span class="bmc-button-icon">☕</span>
      <span>Buy me a Coffee</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'card' | 'banner' | 'compact'
  title?: string
  showEmail?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'card',
  title: 'Need More Usage?',
  showEmail: true
})

const bmcUrl = 'https://buymeacoffee.com/xiaofeng001'

const description = computed(() => {
  if (props.variant === 'compact') {
    return 'Support for unlimited access'
  }
  return 'Want more daily uses and higher file limits? Support our development!'
})
</script>

<style scoped>
.buy-me-coffee-card {
  background: linear-gradient(135deg, #FFDD00 0%, #FFE066 100%);
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(255, 221, 0, 0.3);
}

.buy-me-coffee-card.banner {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
}

.buy-me-coffee-card.compact {
  padding: 12px 16px;
  border-radius: 8px;
}

.bmc-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bmc-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.compact .bmc-icon {
  font-size: 24px;
}

.bmc-text {
  flex: 1;
}

.bmc-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.banner .bmc-title {
  color: white;
}

.bmc-description {
  font-size: 14px;
  color: #333;
  margin: 0;
}

.banner .bmc-description {
  color: rgba(255,255,255,0.9);
}

.compact .bmc-description {
  font-size: 12px;
}

.bmc-email-hint {
  font-size: 12px;
  color: #666;
  margin: 4px 0 0 0;
  font-style: italic;
}

.banner .bmc-email-hint {
  color: rgba(255,255,255,0.8);
}

.bmc-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #000;
  color: #FFDD00;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.bmc-button:hover {
  background: #222;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.compact .bmc-button {
  padding: 8px 14px;
  font-size: 12px;
}

.bmc-button-icon {
  font-size: 16px;
}

/* Responsive */
@media (max-width: 640px) {
  .buy-me-coffee-card {
    flex-direction: column;
    text-align: center;
  }
  
  .bmc-content {
    flex-direction: column;
  }
}
</style>
