<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="flex main-container">
      <BaseSide />
      <div class="main-content forest-glass" v-if="isShow">
          <router-view></router-view>
      </div>
    </div>
  </el-config-provider>
</template>
<script setup lang="ts">
import {addLocalDomain, getLocalDomain, getRemoteDomain} from "~/api";
import {ElMessage} from "element-plus";
import {ref} from 'vue'

const isShow = ref(false);
const refreshData =  async (): Promise<void> => {
  const { data } = await getRemoteDomain();
  const listRemote = data;

  const response = await getLocalDomain({ page: 1, perPage: 10000});
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

    isShow.value = true;
  }
}

refreshData();
</script>
<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
  background: rgba(0, 0, 0, 0.6);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
  align-items: center;
  justify-content: center;
  .main-content {
    width: calc(100% - 60px - 48px - 48px - 24px);
    min-width: 1280px;
    margin: 24px;
    padding: 24px;
    color: white;
    max-height: 100%;
    height: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .ep-card {
      border-radius: 20px;
      background: none;
    }
  }
}
</style>
<script setup lang="ts">
</script>