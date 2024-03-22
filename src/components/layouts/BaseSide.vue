<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="1" @click="router.push('/dashboard')">
      <el-icon><icon-menu /></el-icon>
      <template #title>Dashboard</template>
    </el-menu-item>
    <el-menu-item index="2" @click="router.push('/table')">
      <el-icon><DataBoard /></el-icon>
      <template #title>Tables</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  DataBoard,
  Menu as IconMenu,
} from "@element-plus/icons-vue";
import { useRouter } from 'vue-router';

const router = useRouter()
const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>
<style>
.el-menu-vertical-demo {
  min-width: 60px;
}
</style>
