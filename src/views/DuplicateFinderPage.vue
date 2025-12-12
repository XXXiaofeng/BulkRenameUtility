<template>
  <div class="flex flex-col justify-center py-0 px-4 mx-auto leading-6 text-black min-h-screen">
    <div class="px-4 pt-20 text-2xl font-bold text-center md:text-4xl lg:text-6xl">
      <h1 class="px-4">Duplicate File Finder - Find and Remove Duplicates</h1>
    </div>
    <div class="text-center text-gray-600 mt-4 mb-12 max-w-3xl mx-auto">
      <p class="text-lg">
        Quickly identify and remove duplicate files to free up disk space. Scan folders and find identical files based on content, not just names.
      </p>
    </div>

    <div class="mx-auto max-w-4xl text-center">
      <div class="coming-soon-container">
        <div class="icon-large">🔍</div>
        <h2 class="text-3xl font-bold mb-4">Coming Soon!</h2>
        <p class="text-xl text-gray-600 mb-8">
          We'reworking hard on this new feature. Duplicate File Finder will help you:
        </p>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Smart Detection</h3>
            <p>Find duplicates based on content, size, and metadata</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Fast Scanning</h3>
            <p>Quickly scan large directories for duplicate files</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Safe Removal</h3>
            <p>Preview before deletion with auto-backup options</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Space Analysis</h3>
            <p>See how much space you can reclaim</p>
          </div>
        </div>

        <div class="mt-12">
          <p class="text-gray-600 mb-4">In the meantime, check out our other tools:</p>
          <div class="flex gap-4 justify-center">
            <router-link to="/" class="cta-button">
              🏠 Home
            </router-link>
            <router-link to="/batch-rename" class="cta-button">
              📝 Batch Rename
            </router-link>
            <router-link to="/file-organizer" class="cta-button">
              📁 File Organizer
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Duplicate File Finder - Find and Remove Duplicates (Coming Soon)'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content',
      'Find and remove duplicate files effortlessly. Scan folders to identify identical files and free up disk  space. Smart detection, fast scanning, and safe removal. Coming soon!'
    )
  }
  
  const canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', 'https://bulk-rename-utility.com/duplicate-finder')
  }
})
</script>

<style scoped>
.coming-soon-container {
  padding: 60px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.icon-large {
  font-size: 120px;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin: 40px 0;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 14px;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  padding: 12px 24px;
  background: white;
  color: #667eea;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>
