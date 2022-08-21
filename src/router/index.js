import Vue from 'vue';
import VueRouter from 'vue-router';

import AssetOverview from "@/pages/AssetOverview";
import BloodShip from "@/pages/BloodShip";
import SlotRelationGraph from "@/SlotRelationGraph";

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: "/asset-preview",
            component: AssetOverview
        },
        {
            path: "/blood-ship",
            component: BloodShip
        },
        {
            path: "/test",
            component: SlotRelationGraph
        }
    ]
})
