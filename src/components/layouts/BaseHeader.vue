<script lang="ts" setup>
import { ref } from 'vue';
import { toggleDark } from "~/composables";
import { Hide, View } from '@element-plus/icons-vue'
const value = ref(true);
</script>

<template>
  <el-switch
      class="el-switch-demo"
      v-model="value"
      size="large"
      :active-action-icon="View"
      :inactive-action-icon="Hide"
      @change="() => toggleDark()"
  />
<!--  <el-menu class="el-menu-demo" mode="horizontal">-->
<!--    <el-menu-item h="full" @click="toggleDark()">-->
<!--      <button-->
<!--        class="border-none w-full bg-transparent cursor-pointer"-->
<!--        style="height: var(&#45;&#45;ep-menu-item-height)"-->
<!--      >-->
<!--        <i inline-flex i="dark:ep-moon ep-sunny" />-->
<!--      </button>-->
<!--    </el-menu-item>-->
<!--  </el-menu>-->
</template>

<style>
.el-switch-demo {
    margin-top: 24px;
  }
</style>
