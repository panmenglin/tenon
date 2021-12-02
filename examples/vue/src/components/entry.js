import Vue from 'vue';

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import ECharts from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';

import ChartPie from './ChartPie.vue';

Vue.use(ViewUI);

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);
Vue.component('v-chart', ECharts);

let instance = null;

const blocks = {
  PieChart: {
    mount: (el) => {
      instance = new Vue({
        render: (h) => h(ChartPie),
      }).$mount(el);
    },
    unmount: () => {
      instance.$destroy();
      instance.$el.innerHTML = '';
    }
  },
};

export default blocks;