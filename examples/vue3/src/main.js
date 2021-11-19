import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import * as echarts from 'echarts';

import "ant-design-vue/dist/antd.css";

const app = createApp(App)

app.use(Antd);
// app.config.globalProperties.echarts = echarts;

app.mount('#app')


