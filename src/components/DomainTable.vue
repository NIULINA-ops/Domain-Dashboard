<script setup lang="ts">
import { Timer } from '@element-plus/icons-vue'
import { onBeforeMount, onUpdated, onUnmounted } from 'vue'
import { getRemoteDomain, getLocalDomain, addLocalDomain } from '~/api/index'

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

onBeforeMount(() => {
  getRemoteDomain().then(res => {
    const listRemote = res;
    getLocalDomain({
      page: 1,
      perPage: 10000
    }).then(response => {
      const listLocal = response.data;
      const domainsLocal = listLocal.map(d => d.domain);
      const needAddList = [];
      for (let i = 0; i< listRemote.length; i++) {
        if (domainsLocal.indexOf(listRemote[i].SQYM) === -1) {
          needAddList.push(listRemote[i]);
        }
      }
      if (needAddList.length > 0) {
        addLocalDomain(needAddList).then(() => {
          // $message({
          //   message: '更新成功',
          //   type: 'success'
          // });
        });
      }
    })
  });
})

const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}


const tableData: Domain[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="Date">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><timer /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="College/Unit">
      <template #default="scope">
        {{ scope.row.college }}
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
    <el-table-column label="Responsible Person">
      <template #default="scope">
        {{ scope.row.responsible_person }}
      </template>
    </el-table-column>
    <el-table-column label="Administrator">
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
        {{ scope.row.apply_scope }}
      </template>
    </el-table-column>
    <el-table-column label="IP">
      <template #default="scope">
        <p>Public: {{ scope.row.server_IP }}</p>
        <p>Local: {{ scope.row.local_server_IP }}</p>
      </template>
    </el-table-column>
    <el-table-column label="Status">
      <template #default="scope">
        {{ scope.row.status }}
      </template>
    </el-table-column>
    <el-table-column label="Security Incidents">
      <template #default="scope">
        {{ scope.row.security_incidents }}
      </template>
    </el-table-column>
    <el-table-column label="Remark">
      <template #default="scope">
        {{ scope.row.remark }}
      </template>
    </el-table-column>
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
        >Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>