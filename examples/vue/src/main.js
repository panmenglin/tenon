import Vue from 'vue';
import App from './App.vue';

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import ECharts from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';

Vue.use(ViewUI);

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);
Vue.component('v-chart', ECharts);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
