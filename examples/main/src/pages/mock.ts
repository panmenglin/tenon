export const Config = {
  col: [
    {
      key: '用户信息',
      span: 24,
      blocks: [{
        name: '用户信息',
        domain: '中台',
        key: 'UserInfo',
        import: 'http://localhost:7001/react17/entry.json',
      }],
    },
    // {
    //   key: '折线图',
    //   span: 24,
    //   blocks: [{
    //     name: '用户信息',
    //     domain: '中台',
    //     key: 'ChartLine',
    //     import: 'http://localhost:7001/react17/entry.json',
    //   }],
    // },
    {
      key: '折线图vue3',
      span: 24,
      blocks: [{
        name: '用户信息',
        domain: '中台',
        key: 'ChartLine',
        import: 'http://localhost:7001/vue3/entry.json',
      }],
    },
  ],
}