<script setup lang="ts">
import { useEcharts } from '~/hooks/use-echarts';
import {getCurrentInstance, watch} from "vue";

defineOptions({
  name: 'PieChart'
});
const props = defineProps({
  chartData: {
    type: Object,
    default: () => {
      return []
    }
  }
})
function generatePurpleColor() {
  const min = 0xFF00FF;
  const max = 0x8e9dff;
  const randomColor = Math.floor(Math.random() * (max - min + 1)) + min;
  return '#' + randomColor.toString(16).padStart(6, '0');
}

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: "vertical",
    top: '5%',
    left: 'left',
    marginBottom: '10',
    itemStyle: {
      borderWidth: 0,
    },
    textStyle: {
      color: '#fff'
    }
  },
  textStyle: {
    color: '#fff'
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
      name: '',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ["80%", "50%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
        color: '#fff'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12',
          color: '#fff'
        }
      },
      labelLine: {
        show: false
      },
      data: [] as { name: string; value: number }[]
    }
  ]
}));

const fixData = (chartData) => {
  return Object.keys(chartData).map(c => {
    return {
      name: c,
      value: chartData[c]
    }
  })
}

watch(() => props.chartData, (newVal) => {
  update(fixData(newVal));
});

const update = (d) => {
  updateOptions(opts => {
    opts.series[0].data = d;
    // const colors = [];
    // for(let i = 0; i < d.length; i++ ) {
    //   colors.push(generatePurpleColor())
    // }
    // opts.series[0].color = colors;
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
  update(fixData(props.chartData));
}

init();
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
