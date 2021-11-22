import { version as reactVersion } from 'react/package.json';
import { version as reactDomVersion } from 'react-dom/package.json';
import { version as antdVersion } from 'antd/package.json';

export const externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  moment: 'moment',
  antd: 'antd',
}

export const cdnFiles = {
  css: [
    `http://unpkg.com/antd@${antdVersion}/dist/antd.min.css`,
  ],
  js: [
    `http://unpkg.com/react@${reactVersion}/umd/react.production.min.js`,
    `http://unpkg.com/react-dom@${reactDomVersion}/umd/react-dom.production.min.js`,
    `http://unpkg.com/moment@2.25.3/min/moment-with-locales.min.js`,
    `http://unpkg.com/antd@${antdVersion}/dist/antd.min.js`,
  ],
}