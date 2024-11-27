import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import PaymentMethodView from '@/views/PaymentMethodView.vue';
import AdministrationComponent from '@/components/AdministrationComponent.vue';
import VehicleTypeView from '@/views/VehicleTypeView.vue';
import UserComponent from '@/components/UserComponent.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/payment-method',
    name: 'PaymentMethod',
    component: PaymentMethodView
  
  },
  {
    path: '/vehicle-type',
    name: 'VehicleType',
    component: VehicleTypeView
  },
  {
    path: '/user',
    name: 'User',
    component: UserComponent
  }
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
