<script setup lang="ts">
import { Timer } from '@element-plus/icons-vue'
import {onBeforeMount, ref, getCurrentInstance, onMounted} from 'vue'
import {
  refreshDoubleDomainsIp,
  updateLocalDomain,
  getDoubleNonDomain
} from '~/api/index'
import { ElMessage, ElLoading  } from "element-plus";
import moment from "moment";
import {Edit, Search} from '@element-plus/icons-vue'
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
  _getDoubleNonDomain();
})

let tableData = ref([]);
let page = ref(1);
let perPage = ref(20);
let total = ref(0);
let showAffiliation = ref(false);
let search = ref('');
let selectedStatus = ref('0');
const loading = ref(false);
const dialogFormVisible = ref(false);
const temp = ref({});



const _getDoubleNonDomain = async () => {
  const res = await getDoubleNonDomain({ page: page.value, perPage: perPage.value, search: search.value, status: selectedStatus.value});
  tableData.value = res.data;
  page.value = +res.page;
  perPage.value = +res.perPage;
  total.value = res.total;

  App?.proxy?.$forceUpdate();
}

const _refreshPublicIP = () => {
  loading.value = true;
  refreshDoubleDomainsIp().then(() => {
    ElMessage.success("刷新成功");
    loading.value = false;
    _getDoubleNonDomain();
  });
}
const onEdit = (row) => {
  dialogFormVisible.value = true;
  temp.value = row;
}

const updateData = async () => {
  const data = { id: temp.value._id, remark: temp.value.remark, security_incidents: temp.value.security_incidents };
  const res = await updateLocalDomain(data);
}

</script>

<template>
  <div class="filter-container">
    <div>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="_refreshPublicIP">
        更新公网ip信息
      </el-button>
    </div>
    <div style="display: flex; align-items: center; justify-content: center;">
      <el-input v-model="search" placeholder="域名/名称" clearable style="min-width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" :icon="Search" @click="_getDoubleNonDomain" style="margin-left: 24px;">
        Search
      </el-button>
    </div>
  </div>
  <el-table :data="tableData" v-loading="loading" style="width: 100%; max-width: 100%; overflow: auto; height: calc(100% - 44px - 64px - 24px - 12px); margin-top: 24px;" stripe border>
    <el-table-column label="College/Unit">
      <template #default="scope">
        {{ collegeMap[scope.row.college.slice(0, 3)] }}
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
    <el-table-column label="Affiliation Unit">
      <template #default="scope">
        {{ scope.row.affiliation_unit }}
      </template>
    </el-table-column>
    <el-table-column label="Administrator" width="200">
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
    <el-table-column label="IP" width="200px">
      <template #default="scope">
        <span v-show="scope.row.server_IP">{{ scope.row.server_IP }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Security Incidents">
      <template #default="scope">
        {{ scope.row.security_incidents ? scope.row.security_incidents : '/' }}
      </template>
    </el-table-column>
    <el-table-column label="Remark">
      <template #default="scope">
        {{ scope.row.remark ? scope.row.remark : '/' }}
      </template>
    </el-table-column>
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button type="primary" :icon="Edit" circle @click="() => onEdit(scope.row)"/>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination style="float: right; margin-top: 12px; color: white" background layout="total, prev, pager, next" :page-size="perPage" :total="total" @current-change="(p) => {page = p;  _getDoubleNonDomain();}"/>
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