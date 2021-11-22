export const Config = {
  col: [
    {
      key: '用户信息',
      span: 24,
      blocks: [{
        name: '用户信息',
        key: 'UserInfo',
        import: 'http://localhost:7001/react17/entry.json',
      }],
    },
    {
      key: '折线图',
      span: 24,
      blocks: [{
        name: 'react17/antd/@ant-design/charts',
        key: 'ChartLine',
        import: 'http://localhost:7001/react17/entry.json',
      }],
    },
    {
      key: '折线图vue3',
      span: 12,
      blocks: [{
        name: 'vue3/ant-design-vue/echarts',
        key: 'LineChart',
        import: 'http://localhost:7001/vue3/entry.json',
      }],
    },
    {
      key: '饼图 vue',
      span: 12,
      blocks: [{
        name: 'vue/iview/vue-echarts',
        key: 'PieChart',
        import: 'http://localhost:7001/vue/entry.json',
      }],
    },
  ],
}