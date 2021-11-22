<template>
  <div class="container">
    <div class="filter">
      <a-space>
        <a-date-picker v-model="value1" />
        <a-button type="primary" @click="info">提示</a-button>
      </a-space>
    </div>

    <div id="myEcharts" :style="{ width: 'auto', height: '300px' }"></div>
  </div>
</template>

<script lang="js">
import { onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import { message } from 'ant-design-vue';

export default {
  name: "echartsBox",
  setup() {
    onMounted(() => {
      initChart();
    });

    onUnmounted(() => {
      echarts.dispose;
    });

    // 基础配置一下Echarts
    function initChart() {
      let chart = echarts.init(document.getElementById("myEcharts"));
      // 把配置和数据放这里
      chart.setOption({
        xAxis: {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月"
          ]
        },
        tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [
              820,
              932,
              901,
              934,
              1290,
              1330,
              1320,
              801,
              102,
              230,
              4321,
              4129
            ],
            type: "line",
            smooth: true
          }
        ]
      });
      // window.onresize = function() {
      //   //自适应大小
      //   chart.resize();
      //   console.log(1212121)
      // };

      window.addEventListener('resize', () => {
        chart.resize();
      })
    }

    const info = () => {
      message.info('This is a normal message');
    };

    return {
      value1: '',
      initChart,
      info
    };
  }
};
</script>

<style scoped>
.container {
  text-align: left;
  padding: 16px;
}

.filter {
  margin-bottom: 16px;
}
</style>
