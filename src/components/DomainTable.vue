<script setup lang="ts">
import { Timer } from '@element-plus/icons-vue'
import {ref, getCurrentInstance, onMounted} from 'vue'
import {
  getRemoteDomain,
  getLocalDomain,
  addLocalDomain,
  updateLocalDomain,
  refreshIP
} from '~/api/index'
import { ElMessage, ElLoading  } from "element-plus";
import moment from "moment";
import {Edit, Refresh, Search} from '@element-plus/icons-vue'
import { collegeMap } from '~/utils/const';

interface Domain {
  _id: string
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

const App = getCurrentInstance();
onMounted(async () => {
  const { data } = await getRemoteDomain();
  const listRemote = data;

  getLocalDomain({ page: 1, perPage: 10000}).then(async response => {
    const listLocal = response.data;
    if (listLocal.length > 0) {
      const needAddList = [];
      for (let i = 0; i < listRemote.length; i++) {
        if (listLocal[0]._id < (+listRemote[i]['LSH'])) {
          needAddList.push(listRemote[i]);
        }
      }

      if (needAddList.length > 0) {
        await addLocalDomain(needAddList);
        ElMessage.success("本地数据库更新成功");
      }

      _getLocalDomain();
    }
  })
})

let tableData = ref([]);
let page = ref(1);
let perPage = ref(20);
let total = ref(0);
let showAffiliation = ref(false);
let sortByTime = ref(false);
let search = ref('');
let selectedStatus = ref('0');
let selectedType = ref('0');
const loading = ref(false);
const dialogFormVisible = ref(false);
const temp = ref({});

const statusOptions = [
  {
    label: '所有',
    value: '0',
    type: 'info'
  }, {
    label: '未解析',
    value: '1',
    type: 'info'
  }, {
    label: '上线',
    value: '2',
    type: 'success'
  }, {
    label: '未上线仅内网解析',
    value: '3',
    type: 'warning'
  }, {
    label: '异常',
    value: '4',
    type: 'danger'
  }];

const _getLocalDomain = async () => {
  const res = await getLocalDomain({ page: page.value, perPage: perPage.value, search: search.value, status: selectedStatus.value, type: selectedType.value, sort: sortByTime.value ? '1' : '0'});
  tableData.value = res.data;
  page.value = +res.page;
  perPage.value = +res.perPage;
  total.value = res.total;

  App?.proxy?.$forceUpdate();
}

const _refreshIP = () => {
  loading.value = true;
  Promise.all([refreshIP()]).then(() => {
    ElMessage.success("刷新成功");
    loading.value = false;
    _getLocalDomain();
  });
}

const isboda = (ip: string) => {
  return ['172.16.10.92', '172.16.10.93'].indexOf(ip) > -1;
}

const istuoersi = (ip: string) => {
  return ip === '172.16.10.190';
}

const statusTag = (t) => {
  return t ? statusOptions.find(s => s.value === t) : '';
}

const onEdit = (row) => {
  dialogFormVisible.value = true;
  temp.value = row;
}

const updateData = async () => {
  const data = { id: temp.value._id, remark: temp.value.remark, security_incidents: temp.value.security_incidents };
  const res = await updateLocalDomain(data);
}

const domainTypeMap = {
  "0": "所有",
  "1": "系统",
  "2": "实验室网站",
  "3": "其他网站"
}

</script>

<template>
  <div class="filter-container">
    <div>
      <el-checkbox v-model="showAffiliation" label="Show Affiliation" class="filter-item" style="color: white" />
      <el-button class="filter-item" type="primary" :icon="Refresh" @click="_refreshIP" style="margin-left: 24px;">
        Refresh IP
      </el-button>
    </div>
    <div style="display: flex; align-items: center; justify-content: center;">
      <el-checkbox v-model="sortByTime" label="Sort by website launch date" class="filter-item" style="color: white; margin-right: 8px;" />
      <el-input v-model="search" placeholder="Domain/Title" style="min-width: 200px;" class="filter-item" clearable/>
      <el-select v-model="selectedType" placeholder="Please Select" style="min-width: 200px;">
        <el-option
            v-for="item in Object.keys(domainTypeMap)"
            :key="item"
            :label="domainTypeMap[item]"
            :value="item">
        </el-option>
      </el-select>
      <el-select v-model="selectedStatus" placeholder="Please Select" style="min-width: 200px;">
        <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" :icon="Search" @click="_getLocalDomain" style="margin-left: 24px;">
          Search
      </el-button>
    </div>
  </div>
  <el-table :data="tableData" v-loading="loading" style="width: 100%; max-width: 100%; overflow: auto; height: calc(100% - 44px - 64px - 24px - 12px); margin-top: 24px;" stripe border>
    <el-table-column label="Date">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><timer /></el-icon>
          <span style="margin-left: 10px">{{ moment.unix(scope.row.apply_time).format("YYYY-MM-DD") }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="College/Unit" v-if="showAffiliation">
      <template #default="scope">
        {{ collegeMap[scope.row.college.slice(0, 3)] }}
      </template>
    </el-table-column>
    <el-table-column label="Domain">
      <template #default="scope">
        {{ scope.row.fix_domain || scope.row.domain }}
      </template>
    </el-table-column>
    <el-table-column label="Title">
      <template #default="scope">
        {{ scope.row.title }}
      </template>
    </el-table-column>
    <el-table-column label="Type">
      <template #default="scope">
        {{ domainTypeMap[scope.row.type] }}
      </template>
    </el-table-column>
    <el-table-column label="Affiliation Unit" v-if="showAffiliation">
      <template #default="scope">
        {{ scope.row.affiliation_unit }}
      </template>
    </el-table-column>
<!--    <el-table-column label="Responsible Person">-->
<!--      <template #default="scope">-->
<!--        {{ scope.row.responsible_person }}-->
<!--      </template>-->
<!--    </el-table-column>-->
    <el-table-column label="Administrator" width="200" v-if="showAffiliation">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <div>Phone Number: {{ scope.row.administrator_phone }}</div>
            <div>Email: {{ scope.row.administrator_email }}</div>
          </template>
          <template #reference>
            <el-tag>{{ scope.row.administrator }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="Apply Scope">
      <template #default="scope">
        <el-tag size="large" v-if="scope.row.apply_scope === '1'">内网</el-tag>
        <el-tag size="large" v-else type="danger">外网</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="IP" width="200px">
      <template #default="scope">
        <span v-show="scope.row.server_IP">Public：{{ scope.row.server_IP }}<br /></span>
        <span v-show="scope.row.local_server_IP">Local：{{ scope.row.local_server_IP }}<span v-show="isboda(scope.row.local_server_IP)">（博达）</span><span v-show="istuoersi(scope.row.local_server_IP)">（拓尔思）</span></span>
        <span v-show="!scope.row.server_IP && !scope.row.local_server_IP">/</span>
      </template>
    </el-table-column>
    <el-table-column label="Status">
      <template #default="scope">
        <el-tag size="large" :type="statusTag(scope.row.status).type">{{statusTag(scope.row.status).label}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Uptime">
      <template #default="scope">
        {{ scope.row.uptime ? moment(scope.row.uptime * 1000).format("YYYY-MM-DD") : '' }}
      </template>
    </el-table-column>
    <el-table-column label="Security Incidents">
      <template #default="scope">
        {{ scope.row.security_incidents ? scope.row.security_incidents : '' }}
      </template>
    </el-table-column>
    <el-table-column label="Remark">
      <template #default="scope">
        {{ scope.row.remark ? scope.row.remark : '' }}
      </template>
    </el-table-column>
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button type="primary" :icon="Edit" circle @click="() => onEdit(scope.row)"/>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination class="domain-pagination" background layout="total, prev, pager, next" :page-size="perPage" :total="total" @current-change="(p) => {page = p;  _getLocalDomain();}"/>
  <el-dialog title="Edit" v-model="dialogFormVisible">
    <el-form ref="dataForm" label-position="left" label-width="200px">
      <el-form-item label="Domain" prop="title">
        <el-input v-model="temp.domain" disabled />
      </el-form-item>
      <el-form-item label="Title" prop="title">
        <el-input v-model="temp.title" disabled />
      </el-form-item>
      <el-form-item label="Security Incidents">
        <el-input v-model="temp.security_incidents" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="Remark">
        <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">
        Cancel
      </el-button>
      <el-button type="primary" @click="updateData()">
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
.domain-pagination {
  float: right;
  margin-top: 12px;
  color: white;
  .ep-pagination__total {
    color: white;
  }
}
</style>