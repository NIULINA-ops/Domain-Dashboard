<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="1">
      <el-icon><icon-menu /></el-icon>
      <template #title>Dashboard</template>
    </el-menu-item>
    <el-menu-item index="2">
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

const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>
