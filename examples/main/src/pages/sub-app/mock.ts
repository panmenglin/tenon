const { NODE_ENV } = process.env;

const HOST = NODE_ENV === 'development' ? 'http://localhost:7001' : '/tenon-examples'

export const Config = {
  col: [
    {
      key: 'React17App',
      span: 24,
      blocks: [{
        name: 'react17,react-router-dom,antd,@ant-design/charts',
        key: 'React17App',
        import: `${HOST}/react17App/entry.json`,
      }],
    },
  ],
}