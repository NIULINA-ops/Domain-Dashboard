<script setup lang="ts">
const props = defineProps({
  chartData: {
    type: Array,
    default: [{
      timestamp: '2018/4/12',
      text: 'Tom committed 2018/4/12 20:46'
    },{
      timestamp: '2018/4/12',
      text: 'Tom committed 2018/4/12 20:46'
    },{
      timestamp: '2018/4/12',
      text: 'Tom committed 2018/4/12 20:46'
    },{
      timestamp: '2018/4/12',
      text: 'Tom committed 2018/4/12 20:46'
    },{
      timestamp: '2018/4/12',
      text: 'Tom committed 2018/4/12 20:46'
    }]
  }
})

</script>

<template>
  <div class="event-container">
      <el-timeline style="max-width: 600px">
        <template v-for="item in chartData">
          <el-timeline-item :timestamp="item.timestamp" placement="top">
            <el-card>
              <p>{{ item.text }}</p>
            </el-card>
          </el-timeline-item>
        </template>
      </el-timeline>
  </div>
</template>

<style>
.event-container {
  .ep-timeline-item__timestamp {
    color: var(--ep-color-primary);
  }
}
</style>
<style scoped>
  .event-container {
    width: 300px;
    height: 100%;
    margin: 24px 24px;
    .ep-card {
      color: white;
    }
  }
</style>