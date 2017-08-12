import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('../components/landingPage/LandingPage.vue')
    },
    {
      path: '/tellHow',
      name: 'tellHow',
      component: require('../components/tellHowBuilding.vue')
    },
    {
      path: '/historyRecord',
      name: 'historyRecord',
      component: require('../components/historyRecord.vue')
    }
  ]
})
