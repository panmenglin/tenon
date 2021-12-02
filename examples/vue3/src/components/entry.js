import { createApp } from 'vue';
import LineChart from './LineChart.vue';
import Antd from 'ant-design-vue';

import 'ant-design-vue/dist/antd.css';

let instance = null;

const mount = {
  LineChart: {
    mount: async (el) => {
      console.log('vue3 mount')
      instance = createApp(LineChart);
      instance.use(Antd);
      instance.mount(el);
    },
    unmount: async (el) => {
      console.log('vue3 unmount')
      instance.unmount();
      instance._container.innerHTML = '';
    },
  },
};

export default mount;
