<script setup lang="ts">
import { Timer } from '@element-plus/icons-vue'
import {ref, getCurrentInstance, onMounted} from 'vue'
import {
  getLocalDomain,
  addEvents,
  getEvents
} from '~/api/index'
import moment from "moment";
import {Plus, Filter} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

interface Domain {
  _id: number
  title: string
  domain: string
  affiliation_unit: string
  responsible_person: string
  administrator: string
  administrator_phone: string
  administrator_identity_type: string
  apply_scope: string
  college: string
  apply_time: string
  remark: string
  server_IP: string
  type: string
  administrator_email: string
  status: string
  security_incidents: string
  local_server_IP: string
}

interface EVENT {
  _id: number
  domainId: number
  domain: string
  title: string
  events: string
  remark: string
  detection_type: string
  fixDomain: string
}

const App = getCurrentInstance();
onMounted(async () => {
  await _getEvents();
})

let tableData = ref<EVENT[]>([]);
let domainData = ref<Domain[]>([]);
let page = ref(1);
let perPage = ref(20);
let total = ref(0);
let search = ref('');
let selectedType = ref('0');
const loading = ref(false);
const dialogFormVisible = ref(false);
const temp = ref<EVENT>({
  _id: 0,
  domainId: 0,
  domain: '',
  title: '',
  events: '',
  remark: '',
  detection_type: '1'
});

const filterType = () => {
  return typeOptions.filter(t => ['0', '6', '8', '10', '12'].indexOf(t.value) === -1 );
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
  }, {
    label: '仅内网解析(系统监测)',
    value: '6',
  }, {
    label: '上线（手动）',
    value: '7',
  }, {
    label: '上线（系统监测）',
    value: '8',
  }, {
    label: '下线（手动）',
    value: '9',
  }, {
    label: '下线（系统监测）',
    value: '10',
  }, {
    label: '外网转内网（手动）',
    value: '11',
  }, {
    label: '外网转内网（系统监测）',
    value: '12',
  }, {
    label: '域名变更',
    value: '13',
  }];

const _getLocalDomain = async () => {
  const res = await getLocalDomain({ page: 1, perPage: 10000, search: '', status: '0'});
  domainData.value = res.data;
}

const _getEvents = async () => {
  const res = await getEvents({ page: page.value, perPage: perPage.value, search: search.value, type: selectedType.value});
  tableData.value = res.data;
  page.value = +res.page;
  perPage.value = +res.perPage;
  total.value = res.total;

  App?.proxy?.$forceUpdate();
}

const _addEvents = async () => {
  const obj = domainData.value.find(d => d._id === temp.value.domainId);
  if (obj) {
    const data = { id: +moment(temp.value._id) + '_' + temp.value.domainId, domain: obj.domain, title: obj.title, domainId: temp.value.domainId, remark: temp.value.remark, events: temp.value.events, detectionType: '1', fixDomain: temp.value.fixDomain};
    const res = await addEvents(data);
    if (res) {
      ElMessage.success("Success!");
      temp.value = {
        _id: 0,
        domainId: 0,
        domain: '',
        title: '',
        events: '',
        remark: '',
        detection_type: '1',
        fixDomain: ''
      };
      dialogFormVisible.value = false;
      await _getEvents();
    }
  }
}

const _openAddEventsDialog = async () => {
  await _getLocalDomain();
  temp.value.domainId = domainData.value[0]._id;
  temp.value._id = +moment();
  dialogFormVisible.value = true;
}

const _getType = (t: string) => {
  return t ? typeOptions.find(s => s.value === t)?.label : '';
}

</script>

<template>
  <div class="filter-container">
    <div style="display: flex; align-items: center; justify-content: center;">
      <el-input v-model="search" placeholder="Domain/Title" style="min-width: 200px;" class="filter-item" clearable/>
      <el-select v-model="selectedType" placeholder="Please Select" style="min-width: 200px;">
        <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" :icon="Filter" @click="_getEvents" style="margin-left: 24px;">
        Filter
      </el-button>
      <el-button class="filter-item" type="primary" :icon="Plus" @click="_openAddEventsDialog" style="margin-left: 24px; float: right;">
        Add
      </el-button>
    </div>
  </div>
  <el-table :data="tableData" v-loading="loading" style="width: 100%; max-width: 100%; overflow: auto; height: calc(100% - 44px - 64px - 24px - 12px); margin-top: 24px;" stripe border>
    <el-table-column label="Date">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><timer /></el-icon>
          <span style="margin-left: 10px">{{ moment(+scope.row._id.split('_')[0]).format("YYYY-MM-DD")}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Domain">
      <template #default="scope">
        {{ scope.row.domain }}
      </template>
    </el-table-column>
    <el-table-column label="Title">
      <template #default="scope">
        {{ scope.row.title }}
      </template>
    </el-table-column>
    <el-table-column label="Events">
      <template #default="scope">
        {{ _getType(scope.row.events) }}
      </template>
    </el-table-column>
    <el-table-column label="Remark">
      <template #default="scope">
        {{ scope.row.remark }}
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="events-pagination" background layout="total, prev, pager, next" :page-size="perPage" :total="total" @current-change="(p) => {page = p;  _getEvents();}"/>
  <el-dialog append-to-body title="Add" v-model="dialogFormVisible">
    <el-form ref="dataForm" label-position="left" label-width="200px">
      <el-form-item label="Domain">
        <el-select v-model="temp.domainId" placeholder="Please Select" style="min-width: 200px;" filterable>
          <el-option
              v-for="item in domainData"
              :key="item._id"
              :label="item.domain + '(' + item.title+ ')'"
              :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Events Type">
        <el-select v-model="temp.events" placeholder="Please Select" style="min-width: 200px;">
          <el-option
              v-for="item in filterType()"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="fixed Domain" v-if="temp.events === '13'">
        <el-input v-model="temp.fixDomain" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="Remark">
        <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="Time">
        <el-date-picker
            v-model="temp._id"
            type="datetime"
            placeholder="Select date and time"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="dialogFormVisible = false">
        Cancel
      </el-button>
      <el-button type="primary" @click="_addEvents()">
        Confirm
      </el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.filter-container {
  height: 40px;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
<style>
.events-pagination {
  float: right;
  margin-top: 12px;
  color: white;
  .ep-pagination__total {
    color: white;
  }
}
</style>