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

const collegeMap = {
  "912": "WIOE 西湖大学光电研究院",
  "911": "WLLSB 西湖实验室",
  "524": "OYC 云栖校区办公室",
  "523": "WFP 西湖卓越学者办公室",
  "522": "WLC 西湖语言中心",
  "521": "OSA 学生事务部",
  "520": "OSS 安全保障部",
  "519": "Qiu Shi Office 求是办公室",
  "518": "OEEP 湖心讲堂办公室",
  "517": "CGE 通识教育中心",
  "516": "OA 档案工作办公室",
  "515": "OALA 审计与法务办公室",
  "514": "OTTD 成果转化办公室",
  "513": "OPR 政策研究室",
  "512": "OIA 国际合作部（港澳台事务办公室）",
  "511": "OPA 公共事务部",
  "509": "OIC 基本建设部",
  "508": "OP 采购工作办公室",
  "507": "DO 发展联络部",
  "506": "OAA 教学事务部",
  "505": "OREC 科技合作部",
  "504": "OGS 总务部",
  "503": "OF 财务部",
  "502": "OHR 人力资源部",
  "501": "OP 校长办公室",
  "404": "ODIS 纪检监察办公室",
  "403": "DOUC 党委组织部",
  "402": "OUC 党委办公室 党委统战部",
  "401": "OPM&ODIS 党群工作部（纪检监察办公室）",
  "301": "OIT 信息技术中心",
  "213": "交叉科学中心",
  "212": "WCGEA 西湖基因编辑及应用中心",
  "211": "CSBIB 合成生物学与生物智造中心",
  "210": "RCIF 未来产业研究中心",
  "208": "iBio Labs 智能生物医学技术中心",
  "207": "ITS 理论科学研究院",
  "206": "WUMJRI 牧原集团联合院",
  "205": "CIDR 应急医学研究中心",
  "204": "CAPSF 人工光合作用与太阳能燃料中心",
  "203": "RCII 智能技术研究中心",
  "202": "WUBDJIIR 西湖大学-博智林智能机器人联合研究院",
  "201": "OLRE 实验室与科研设施部",
  "104": "医学院",
  "103": "SE 工学院",
  "102": "SS 理学院",
  "101": "SLS 生命科学学院",
  "1": "BO 董事会办公室",
  "999": "未知"
}

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
  <el-pagination style="float: right; margin-top: 12px; color: white" background layout="total, prev, pager, next" :page-size="perPage" :total="total" @current-change="(p) => {page = p;  _getLocalDomain();}"/>
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