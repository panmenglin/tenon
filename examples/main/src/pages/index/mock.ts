export const Config = {
  col: [
    {
      key: 'UserInfo',
      span: 24,
      blocks: [{
        name: 'react17,antd',
        key: 'UserInfo',
        import: 'http://localhost:7001/react17/entry.json',
      }],
    },
    {
      key: 'LineChart - React17',
      span: 12,
      blocks: [{
        name: 'react17,antd,@ant-design/charts',
        key: 'LineChart',
        import: 'http://localhost:7001/react17/entry.json',
      }],
    },
    {
      key: 'LineChart - React16',
      span: 12,
      blocks: [{
        name: 'react16,antd,@ant-design/charts',
        key: 'LineChart',
        import: 'http://localhost:7001/react16/entry.json',
      }],
    },
    {
      key: 'LineChart - Vue3',
      span: 12,
      blocks: [{
        name: 'vue3,ant-design-vue,echarts',
        key: 'LineChart',
        import: 'http://localhost:7001/vue3/entry.json',
      }],
    },
    {
      key: 'PieChart - Vue',
      span: 12,
      blocks: [{
        name: 'vue,iview,vue-echarts',
        key: 'PieChart',
        import: 'http://localhost:7001/vue/entry.json',
      }],
    },
  ],
}