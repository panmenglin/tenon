
import { createApp } from 'vue'
import ChartLine from './ChartLine.vue'
import Antd from 'ant-design-vue';

import "ant-design-vue/dist/antd.css";

const mount = {
  ChartLine: el => {
    const app = createApp(ChartLine)
    app.use(Antd);
    app.mount(el)
  }
}

export default mount



