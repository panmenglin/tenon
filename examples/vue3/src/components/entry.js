
import { createApp } from 'vue'
import LineChart from './LineChart.vue'
import Antd from 'ant-design-vue';

import "ant-design-vue/dist/antd.css";

const mount = {
  LineChart: el => {
    const app = createApp(LineChart)
    app.use(Antd);
    app.mount(el)
  }
}

export default mount



