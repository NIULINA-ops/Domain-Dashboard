<script setup lang="ts">
import {Management} from '@element-plus/icons-vue'
import { collegeMap } from '~/utils/const';
defineProps<{ data: Object }>();
</script>

<template>
  <div class="briefing-container">
    <p class="title"><el-icon><Management /></el-icon>Last month's briefing</p>
    <el-scrollbar max-height="300">
      <P>Number of online websites：{{data.count}}</P>
      <el-divider />
      <P>Details：</P>
      <ul>
        <li v-for="d in data.detail">
          <p>{{ collegeMap[d.college.slice(0, 3)] }}</p>
          {{ '[' + d.title + '] ' + d.domain }}
        </li>
      </ul>
      <el-divider />
      <P>Cumulative online quantity（个）: {{data.allCount}}</P>
      <P>工学院（个）: {{data['103']}}</P>
      <P>生科院（个）: {{data['101']}}</P>
      <P>理学院（个）: {{data['102']}}</P>
      <P>医学院（个）: {{data['104']}}</P>
      <P>其他行政部门及单位（个）: {{ data.allCount - data['101'] - data['102'] - data['103'] - data['104'] }}</P>
    </el-scrollbar>
  </div>
</template>
<style scoped>
.briefing-container {
  width: 300px;
  height: 50%;
  margin: 0 24px;
  padding-left: 40px;

  p, li {
    text-align: left;
    font-size: 14px;
    margin: 5px 0;
  }

  .title {
    text-align: left;
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-bottom: 8px;
    i {
      margin-right: 8px;
    }
  }
}
</style>
<style>
  .briefing-container {
    .ep-divider {
      border-color: var(--ep-color-primary);
    }
  }
</style>