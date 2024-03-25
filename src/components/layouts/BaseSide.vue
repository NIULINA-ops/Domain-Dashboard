<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo forest-glass"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    router
  >
    <el-menu-item index="/dashboard">
      <el-icon><icon-menu /></el-icon>
      <template #title>Dashboard</template>
    </el-menu-item>
    <el-menu-item index="/table">
      <el-icon><DataBoard /></el-icon>
      <template #title>Tables</template>
    </el-menu-item>
    <el-menu-item index="/events">
      <el-icon><Operation /></el-icon>
      <template #title>Events</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Operation,
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
  width: 64px;
  background: none;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 24px;
  li {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    color: white;
    margin-bottom: 8px;
    &:hover {
      background-color: var(--ep-color-primary);
      color: white;
    }
    div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
