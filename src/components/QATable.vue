<script setup lang="ts">
import {onBeforeMount, ref, getCurrentInstance, onMounted} from 'vue'
import {addQAItems, deleteQAItems, getQAItems, updateQAItems} from "~/api";
import {Plus, Edit, Delete} from '@element-plus/icons-vue'
import moment from "moment";
import {ElMessage, ElMessageBox} from "element-plus";

interface QAITEM {
  [propName: string]: {
    _id: number,
    title: string,
    description: string,
    tag: string
  }[]
}

const activeNames = ref(['1'])
const collapseItems = ref<QAITEM>({})
const dialogFormVisible = ref(false)
const temp = ref({
    _id: +moment(),
    title: '',
    description: '',
    tag: '1'
});
const mode = ref('add');
const TAGMAP = {
  '1': '基础',
  '2': '域名申请',
  '3': '服务器申请',
  '4': '网站建设',
  '5': '安全扫描',
  '6': '博达站群相关资料',
  '7': '其他变更',
}


onBeforeMount(() => {
  _getQAItem();
});

const _getQAItem = async () => {
  const res = await getQAItems({ page: '1', perPage: '1000', search: '', status: '0'});
  const result: QAITEM = {};
  for (let r in res.data) {
    const i = res.data[r];
    if (!result[i.tag]) result[i.tag] = [];
    result[i.tag].push(i);
  }
  collapseItems.value = result;
}

const _openAddQAItemDialog = () => {
  mode.value = 'add';
  temp.value.title = '';
  temp.value.description = '';
  temp.value.tag = '1';
  dialogFormVisible.value = true;
}

const _addQAItem = async () => {
  const data = { id: +moment(), title: temp.value.title, description: temp.value.description, tag: temp.value.tag };
  const res = await addQAItems(data);
  if (res.data) {
    ElMessage.success("Success!");
    dialogFormVisible.value = false;
    await _getQAItem();
  }
}

const _openUpdateQAItemDialog = (id: number, title: string, description: string, tag: string) => {
  mode.value = 'update';
  temp.value._id = id;
  temp.value.title = title;
  temp.value.description = description;
  temp.value.tag = tag;
  dialogFormVisible.value = true;
}
const _updateQAItem = async () => {
  const data = { id: temp.value._id, title: temp.value.title, description: temp.value.description, tag: temp.value.tag };
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
    <el-scrollbar max-height="800">
      <template v-for="tag in Object.keys(collapseItems)">
        <p class="qa-tag">{{ TAGMAP[tag] }}</p>
        <el-collapse-item v-for="item in collapseItems[tag]" :title="item.title" :name="item._id">
          <div v-html="item.description"></div>
          <div style="text-align: right; padding-right: 24px;">
            <el-button :icon="Edit" circle @click="_openUpdateQAItemDialog(item._id, item.title, item.description, item.tag)"/>
            <el-popconfirm title="Are you sure to delete this?" @confirm="_openDeleteQAItemDialog(item._id)">
              <template #reference>
                <el-button :icon="Delete" circle/>
              </template>
            </el-popconfirm>
          </div>
        </el-collapse-item>
      </template>
    </el-scrollbar>
  </el-collapse>
  <el-dialog title="Add" v-model="dialogFormVisible" append-to-body>
    <el-form ref="dataForm" label-position="left" label-width="200px">
      <el-form-item label="Title">
        <el-input v-model="temp.title" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" :maxlength="128" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="temp.description" :autosize="{ minRows: 2, maxRows: 8}" type="textarea" :maxlength="1024" placeholder="Please input" />
      </el-form-item>
      <el-form-item label="Tag">
        <el-select v-model="temp.tag" placeholder="Please Select" style="min-width: 200px;">
          <el-option
              v-for="(item, index) in TAGMAP"
              :key="index"
              :label="TAGMAP[index]"
              :value="index">
          </el-option>
        </el-select>
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
  .qa-tag {
    color: white;
    text-align: left;
    font-weight: 600;
  }
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