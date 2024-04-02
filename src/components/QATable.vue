<script setup lang="ts">
import {onBeforeMount, ref, getCurrentInstance, onMounted} from 'vue'
import {addQAItems, deleteQAItems, getQAItems, updateQAItems} from "~/api";
import {Plus, Edit, Delete} from '@element-plus/icons-vue'
import moment from "moment";
import {ElMessage, ElMessageBox} from "element-plus";

interface QAITEM {
  _id: number,
  title: string,
  description: string
}

const activeNames = ref(['1'])
const collapseItems = ref<QAITEM[]>([])
const dialogFormVisible = ref(false)
const temp = ref<QAITEM>({
  _id: +moment(),
  title: '',
  description: ''
});
const mode = ref('add');

onBeforeMount(() => {
  _getQAItem();
});

const _getQAItem = async () => {
  const res = await getQAItems({ page: '1', perPage: '1000', search: '', status: '0'});
  collapseItems.value = res.data;
}

const _openAddQAItemDialog = () => {
  mode.value = 'add';
  temp.value.title = '';
  temp.value.description = '';
  dialogFormVisible.value = true;
}

const _addQAItem = async () => {
  const data = { id: +moment(), title: temp.value.title, description: temp.value.description };
  const res = await addQAItems(data);
  if (res.data) {
    ElMessage.success("Success!");
    dialogFormVisible.value = false;
    await _getQAItem();
  }
}

const _openUpdateQAItemDialog = (id: number, title: string, description: string) => {
  mode.value = 'update';
  temp.value._id = id;
  temp.value.title = title;
  temp.value.description = description;
  dialogFormVisible.value = true;
}
const _updateQAItem = async () => {
  const data = { id: temp.value._id, title: temp.value.title, description: temp.value.description };
  const res = await updateQAItems(data);
  if (res.data) {
    ElMessage.success("Success!");
    dialogFormVisible.value = false;
    await _getQAItem();
  }
}

const _deleteQAItem = async (id: number) => {
  const res = await deleteQAItems(id);
  if (res.data) {
    ElMessage.success("Success!");
    await _getQAItem();
  }
}

const _openDeleteQAItemDialog = async (id: number) => {
  await _deleteQAItem(id);
  await _getQAItem();
}

</script>

<template>
  <el-button type="primary" :icon="Plus" @click="_openAddQAItemDialog" style="width: 145px; margin-bottom: 24px;">
    Add
  </el-button>
  <el-collapse v-model="activeNames" class="collapse-container">
    <el-collapse-item v-for="item in collapseItems" :title="item.title" :name="item._id">
      <div >
        {{ item.description }}
      </div>
      <div style="text-align: right; padding-right: 24px;">
        <el-button :icon="Edit" circle @click="_openUpdateQAItemDialog(item._id, item.title, item.description)"/>
        <el-popconfirm title="Are you sure to delete this?" @confirm="_openDeleteQAItemDialog(item._id)">
          <template #reference>
            <el-button :icon="Delete" circle/>
          </template>
        </el-popconfirm>
      </div>
    </el-collapse-item>
  </el-collapse>
  <el-dialog title="Add" v-model="dialogFormVisible" append-to-body>
    <el-form ref="dataForm" label-position="left" label-width="200px">
      <el-form-item label="Title">
        <el-input v-model="temp.title" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" :maxlength="128" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" :maxlength="256" placeholder="Please input" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="dialogFormVisible = false">
        Cancel
      </el-button>
      <el-button type="primary" @click="mode === 'add' ? _addQAItem() : _updateQAItem()">
        Confirm
      </el-button>
    </div>
  </el-dialog>
</template>

<style>
.collapse-container {
  .ep-collapse-item__header {
    padding: 24px;
    font-weight: 600;
    color: var(--ep-color-primary);
  }
  .ep-collapse-item__wrap {
    padding-left: 24px;
    text-align: left;
  }
}
</style>