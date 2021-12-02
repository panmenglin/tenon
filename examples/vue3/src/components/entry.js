import { createApp } from 'vue';
import LineChart from './LineChart.vue';
import Antd from 'ant-design-vue';

import 'ant-design-vue/dist/antd.css';

let instance = null;

const mount = {
  LineChart: {
    mount: async (el) => {
      instance = createApp(LineChart);
      instance.use(Antd);
      instance.mount(el);
    },
    unmount: async (el) => {
      instance.unmount();
      instance._container.innerHTML = '';
    },
  },
};

export default mount;
