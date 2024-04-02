<script setup lang="ts">
import {Management} from '@element-plus/icons-vue'
import {getEvents} from "~/api";
import {getCurrentInstance, onMounted, ref, onUnmounted} from "vue";
import moment from "moment";
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

onMounted(async () => {
  await _getEvents();
})

let tableData = ref([]);
const _getEvents = async () => {
  const res = await getEvents({ page: '1', perPage: '10', search: '', type: '0'});
  tableData.value = res.data;

  const App = getCurrentInstance();
  App?.proxy.$forceUpdate();
}

const typeOptions = [
  {
    label: '所有',
    value: '0',
  }, {
    label: '新建站点',
    value: '1',
  }, {
    label: '变更管理员',
    value: '2',
  }, {
    label: '沟通事宜',
    value: '3',
  }, {
    label: '安全扫描',
    value: '4',
  },{
    label: '仅内网解析',
    value: '5',
  },{
    label: '上线（手动）',
    value: '6',
  }, {
    label: '下线（手动）',
    value: '7',
  }, {
    label: '上线(系统监测)',
    value: '8',
  }, {
    label: '下线(系统监测)',
    value: '9',
  }, {
    label: '域名变更',
    value: '10',
  }];

const _getType = (t) => {
  return t ? typeOptions.find(s => s.value === t).label : '';
}
</script>

<template>
  <div class="event-container">
    <p class="title"><el-icon><Management /></el-icon>New Events</p>
    <el-scrollbar height="665px">
      <el-timeline style="max-width: 600px">
        <template v-for="item in tableData">
          <el-timeline-item :timestamp="moment(item._id).format('YYYY-MM-DD')" placement="top">
            <el-card>
              <el-tag>{{ _getType(item.events) }}</el-tag>
              <p style="word-break: break-all;">{{ item.domain + '(' + item.title + ')' }}</p>
            </el-card>
          </el-timeline-item>
        </template>
      </el-timeline>
      <el-button type="primary" round @click="$router.push('/events')">Get More</el-button>
    </el-scrollbar>
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
    margin: 0 24px;
    .ep-card {
      color: white;
      width: calc(100% - 28px);
    }
    .title {
      padding-left: 40px;
      text-align: left;
      display: flex;
      align-items: center;
      i {
        margin-right: 8px;
      }
    }
  }
</style>