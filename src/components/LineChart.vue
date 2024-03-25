<script setup lang="ts">
import { useEcharts } from '~/hooks/use-echarts';
import {getCurrentInstance, watch} from "vue";

defineOptions({
  name: 'LineChart',
});
const props = defineProps({
  chartData: {
    type: Object,
    default: {}
  }
})

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  textStyle: {
    color: '#fff'
  },
  legend: {
    data: ['1122']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [] as string[]
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      color: '#f7931e',
      name: 'Count',
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#f7931e'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    }
  ]
}));

watch(() => props.chartData, (newVal) => {
  update(newVal);
});
const update = (d) => {
  updateOptions(opts => {
    opts.xAxis.data = Object.keys(d);
    opts.series[0].data = Object.values(d);

    return opts;
  }).then(() => {
    const App = getCurrentInstance();
    App?.proxy.$forceUpdate();
  });
}
async function init() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  update(props.chartData);
}
init();
</script>

<template>
  <div ref="domRef" class="h-360px overflow-hidden"></div>
</template>

<style scoped></style>
