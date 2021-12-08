const { NODE_ENV } = process.env;

const HOST = NODE_ENV === 'development' ? 'http://localhost:7001' : '/tenon-examples'

export const Config = {
  col: [
    {
      key: 'UserInfo',
      span: 24,
      blocks: [{
        name: 'react17,antd',
        key: 'UserInfo',
        import: `${HOST}/react17/entry.json`
      }]
    },
    {
      key: 'LineChart - React17',
      span: 12,
      blocks: [{
        name: 'react17,antd,@ant-design/charts',
        key: 'LineChart',
        import: `${HOST}/react17/entry.json`
      }]
    },
    {
      key: 'LineChart - React16',
      span: 12,
      blocks: [{
        name: 'react16,antd,@ant-design/charts',
        key: 'LineChart',
        import: `${HOST}/react16/entry.json`
      }]
    },
    {
      key: 'LineChart - Vue3',
      span: 12,
      blocks: [{
        name: 'vue3,ant-design-vue,echarts',
        key: 'LineChart',
        import: `${HOST}/vue3/entry.json`
      }]
    },
    {
      key: 'PieChart - Vue',
      span: 12,
      blocks: [{
        name: 'vue,iview,vue-echarts',
        key: 'PieChart',
        import: `${HOST}/vue/entry.json`
      }]
    }
  ]
}