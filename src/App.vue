<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="flex main-container">
      <BaseSide />
      <div class="main-content forest-glass">
        <router-view></router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
  background: rgba(0, 0, 0, 0.6);
}
.test {}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
  align-items: center;
  justify-content: center;
  .main-content {
    width: calc(100% - 60px - 48px - 48px - 24px);
    min-width: 1280px;
    margin: 24px;
    padding: 24px;
    color: white;
    max-height: 100%;
    height: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .ep-card {
      border-radius: 20px;
      background: none;
    }
  }
}
</style>
<script setup lang="ts">
</script>