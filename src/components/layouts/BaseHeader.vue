<script lang="ts" setup>
import { ref } from 'vue';
import { toggleDark } from "~/composables";
import { Sunny, Moon } from '@element-plus/icons-vue'
const value = ref(true);
</script>

<template>
  <el-switch
      class="el-switch-demo"
      v-model="value"
      size="large"
      :active-action-icon="Sunny"
      :inactive-action-icon="Moon"
      @change="() => toggleDark()"
  />
</template>

<style>
.el-switch-demo {
    margin-top: 24px;
  }
</style>
