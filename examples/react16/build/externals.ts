import { version as reactVersion } from 'react/package.json';
import { version as reactDomVersion } from 'react-dom/package.json';
import { version as antdVersion } from 'antd/package.json';
import { version as momentVersion } from '../node_modules/moment/package.json';


const publicExternals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  moment: 'moment',
  antd: 'antd',
}

export const externals = {
  development: {
    ...publicExternals,
  },
  production: {
    ...publicExternals,
  },
}

export const cdnFiles = {
  development: {
    css: [
      `http://unpkg.com/antd@${antdVersion}/dist/antd.min.css`,
    ],
    js: [
      `http://unpkg.com/react@${reactVersion}/umd/react.production.min.js`,
      `http://unpkg.com/react-dom@${reactDomVersion}/umd/react-dom.production.min.js`,
      `http://unpkg.com/moment@${momentVersion}/min/moment-with-locales.min.js`,
      `http://unpkg.com/antd@${antdVersion}/dist/antd.min.js`,
    ],
  },
  production: {
    css: [
      `http://unpkg.com/antd@${antdVersion}/dist/antd.min.css`,
    ],
    js: [
      `https://unpkg.com/react@${reactVersion}/umd/react.production.min.js`,
      `https://unpkg.com/react-dom@${reactDomVersion}/umd/react-dom.production.min.js`,
      `http://unpkg.com/moment@${momentVersion}/min/moment-with-locales.min.js`,
      `https://unpkg.com/antd@${antdVersion}/dist/antd.js`,
    ],
  },
}