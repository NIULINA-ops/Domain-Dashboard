<script setup lang="ts">
import {onBeforeMount, ref, getCurrentInstance, onMounted} from 'vue'
import {CaretTop, ArrowRight} from '@element-plus/icons-vue'
import Events from '~/components/Events.vue';
import LineChart from '~/components/LineChart.vue';
import PieChart from "~/components/PieChart.vue";
import {getLocalDomain} from "~/api";
import moment from "moment";

const editableTabs = [{
  name: 'domain',
  title: 'Domain'
}, {
  name: 'sites',
  title: 'Sites'
}];

let editableTabsValue = 'domain';
let activeCard = ref('week');
let dashboardData = ref({
  'domain': {
    week: 0,
    weekString: 'Number of domain name applications this week',
    weekCompared: 0,
    weekCount: {'Monday': 0,'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0},
    weekCollegeCount: {},
    month: 0,
    monthString: 'Number of domain name applications this month',
    monthCompared: 0,
    monthCount: {'First week': 0, 'Second week': 0, 'Third week': 0, 'Fourth week': 0},
    monthCollegeCount: {},
    total: 0,
    totalString: 'Total number of domain name application',
    allCount: {'2022': 0, '2023': 0, '2024': 0},
    allCollegeCount: {}
  },
  'sites': {
    week: 0,
    weekString: 'Number of websites launched this week',
    weekCompared: 0,
    weekCount: {'Monday': 0,'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0},
    weekCollegeCount: {},
    month: 0,
    monthString: 'Number of websites launched this month',
    monthCompared: 0,
    monthCount: {'First week': 0, 'Second week': 0, 'Third week': 0, 'Fourth week': 0},
    monthCollegeCount: {},
    total: 0,
    totalString: 'Total number of online websites',
    allCount: {'2022': 0, '2023': 0, '2024': 0},
    allCollegeCount: {}
  },
});
const updateActiveCard = (t) => {
  activeCard.value = t;
}
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
}
const _getLocalDomain = async () => {
  const res = await getLocalDomain({ page: '1', perPage: '1000'});
  // 先获取总体数据
  const domainData = dashboardData.value['domain'];
  domainData.total = res.total;

  const siteData = dashboardData.value['sites'];
  for (let i = 0; i < res.data.length; i++) {
    const l = res.data[i];
    let college = collegeMap[l.college.slice(0, 3)];

    if (!college) college = l.college;
    const applyTime = moment.unix(l.apply_time);
    const year = applyTime.year();
    const now = moment();

    // 处理本周数据
    if (now.diff(applyTime, 'weeks') < 1) {
      domainData.week = domainData.week + 1;
      const week = applyTime.format('dddd');
      domainData.weekCount[week] = !domainData.weekCount[week] ? 1 : domainData.weekCount[week] + 1;
      domainData.weekCollegeCount[college] = !domainData.weekCollegeCount[college] ? 1 : domainData.weekCollegeCount[college] + 1;
    }

    // 处理本月数据
    if (now.diff(applyTime, 'months') < 1) {
      domainData.month = domainData.month + 1;
      const week = applyTime.week() % 4;
      domainData.monthCount[week] = !domainData.monthCount[week] ? 1 : domainData.monthCount[week] + 1;
      domainData.monthCollegeCount[college] = !domainData.monthCollegeCount[college] ? 1 : domainData.monthCollegeCount[college] + 1;
    }

    domainData.allCount[year] = !domainData.allCount[year] ? 1 : domainData.allCount[year] + 1;
    domainData.allCollegeCount[college] = !domainData.allCollegeCount[college] ? 1 : domainData.allCollegeCount[college] + 1;

    if (l.status === '2' || l.status === '4') {
      // 处理本周数据
      const upTime = moment.unix(l.uptime);
      const upYear = upTime.year();
      if (now.diff(upTime, 'weeks') < 1) {
        siteData.week = siteData.week + 1;
        const week = upTime.format('dddd');
        siteData.weekCount[week] = !siteData.weekCount[week] ? 1 : siteData.weekCount[week] + 1;
        siteData.weekCollegeCount[college] = !siteData.weekCollegeCount[college] ? 1 : siteData.weekCollegeCount[college] + 1;
      }

      // 处理本月数据
      if (now.diff(upTime, 'months') < 1) {
        siteData.month = siteData.month + 1;
        const week = upTime.week() % 4;
        siteData.monthCount[week] = !siteData.monthCount[week] ? 1 : siteData.monthCount[week] + 1;
        siteData.monthCollegeCount[college] = !siteData.monthCollegeCount[college] ? 1 : siteData.monthCollegeCount[college] + 1;
      }

      siteData.allCount[upYear] = !siteData.allCount[upYear] ? 1 : siteData.allCount[upYear] + 1;
      siteData.allCollegeCount[college] = !siteData.allCollegeCount[college] ? 1 : siteData.allCollegeCount[college] + 1;

      siteData.total = siteData.total + 1;
    }
  }

  const App = getCurrentInstance();
  App?.proxy.$forceUpdate();
}

onMounted(() => {
  _getLocalDomain();
});
</script>

<template>
  <div style="display: flex;">
    <el-tabs
        v-model="editableTabsValue"
        type="card"
        class="demo-tabs"
    >
      <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
      >
        <div class="card-container">
          <el-card class="first" @click="updateActiveCard('week');">
            <div class="statistic-card">
              <el-statistic :value="dashboardData[item.name].week" title="Number of domain name applications this week">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    {{dashboardData[item.name].weekString}}
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>Compared to last week</span>
                  <span class="green">
              {{dashboardData[item.name].weekCompared}}
              <el-icon>
                <CaretTop />
              </el-icon>
            </span>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="second" @click="updateActiveCard('month');">
            <div class="statistic-card">
              <el-statistic :value="dashboardData[item.name].month" title="Number of domain name applications this month">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    {{dashboardData[item.name].monthString}}
                  </div>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <div class="footer-item">
                  <span>Compared to last month</span>
                  <span class="green">
              {{dashboardData[item.name].monthCompared}}
              <el-icon>
                <CaretTop />
              </el-icon>
            </span>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="third" @click="updateActiveCard('all');">
            <div class="statistic-card">
              <el-statistic :value="dashboardData[item.name].total" title="Total number of domain name applications">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    {{dashboardData[item.name].totalString}}
                  </div>
                </template>
              </el-statistic>
            </div>
          </el-card>
        </div>
        <div style="display: flex;">
          <el-card style="width: calc(100% - 50% - 20px); margin-right: 20px;" shadow="always">
            <pie-chart :chart-data="dashboardData[item.name][activeCard + 'CollegeCount']"/>
          </el-card>
          <el-card style="width: 50%;" shadow="always">
            <line-chart :chart-data="dashboardData[item.name][activeCard + 'Count']"/>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
    <events />
  </div>
</template>

<style scoped>
.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  font-size: 24px;
  background-color: var(--el-bg-color-overlay);
}
.statistic-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}
.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: green;
}
.card-container {
  display: flex;
  justify-content: space-around;
  margin: 50px 0;
  .ep-card {
    width: 480px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    :hover {
      cursor: pointer;
    }
    &:last-child {
      margin-right: 0;
    }
    &.first {
    }
    &.second {
    }
    &.third {
    }
  }
}
</style>