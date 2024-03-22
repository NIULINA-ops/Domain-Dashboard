import { createRouter,createWebHashHistory } from "vue-router";
import Dashboard from '../components/Dashboard.vue';
import DomainTable from '../components/DomainTable.vue';

const routes = [
    {
        path:'/dashboard',
        name: Dashboard,
        component: Dashboard
    },
    {
        path:'/table',
        component: DomainTable
    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router;
