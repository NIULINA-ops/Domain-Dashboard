import { createRouter,createWebHashHistory } from "vue-router";
import Dashboard from '../components/Dashboard.vue';
import DomainTable from '../components/DomainTable.vue';
import EventsTable from "~/components/EventsTable.vue";
import DoubleNon from "~/components/DoubleNon.vue";
import QATable from "~/components/QATable.vue";

const routes = [
    { path: '/', redirect: '/dashboard' },
    {
        path:'/dashboard',
        name: Dashboard,
        component: Dashboard
    },
    {
        path:'/table',
        component: DomainTable
    },
    {
        path:'/events',
        component: EventsTable
    },
    {
        path:'/doubleNon',
        component: DoubleNon
    },
    {
        path:'/q&a',
        component: QATable
    }
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router;
