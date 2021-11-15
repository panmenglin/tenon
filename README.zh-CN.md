# 榫卯 Tenon

[English](./README.md) | 简体中文

榫卯（Tenon）是一个微前端实现库，参考了 single-spa 和 qiankun，旨在提供一种项目间共享业务组件的方式，以支持跨团队、大规模项目的解耦和重组。

---

## 核心设计理念

### 解耦

微前端的核心目标是将巨石应用拆解成若干可以自治的松耦合微应用，Tenon 的设计理念与此一致，基于这一原则设计了沙箱、应用间通信等，以确保微应用具备独立开发的能力。

### 组装

同时希望能够基于解耦的区块进行产品定制化或重组，因此在设计时不仅限于微应用也适用于有业务属性的组件，基于此选择了 `JS Entry` 的实现形式，设计了区块的挂载方案。


## 特性

#### 技术栈无关

支持 `React`、`Vue` 等多种技术栈的区块接入，但 v1.0 基座是在 React 基础上建立的，因此基座应用暂时只支持 `React`。

### 样式隔离

基于 `Shadow Dom` 确保微应用之间样式互不干扰。

### JS 沙箱

基于 `Proxy` 的多实例沙箱，确保微应用之间 全局变量/事件 不冲突。


## 它是如何工作的


![flow](https://user-images.githubusercontent.com/12044749/141717320-3313ce44-19da-4b20-ab9b-dbc75953ec0b.png)


1、获取配置读取区块信息

Tenon 将从配置中获取区块信息，包括：名称、区块方法、依赖、业务属性等。
你通过自己的运营端组装这份配置，并通过提供接口获取，以实现页面组装。

加载子应用区块，import 配置子应用的入口文件，该文件可以在自应用打包时，通过 [tenon-webpack-plugin](https://github.com/panmenglin/tenon-webpack-plugin) 快捷生成。
```javascript
blocks: [{
  name: '组件名称',
  key: 'Todo',
  import: 'http://xxx/entry.json',
  props: {
    id: 'ID',
  },
}],
```

也可以在项目中进行配置，导入本项目组件。
```javascript
import { Todo } from '@/components';

blocks: [{
  name: '组件名称',
  key: 'Todo',
  import: Todo,
}],
```

2、判断区块类型

如果是当前项目的组件，则直接渲染；

如果是子应用区块则创建 `Shadow Dom` 进入步骤3。

4、加载 `JS`

基于 `Proxy` 创建多实例 JS 沙箱，通过 `with` 方法改变作用域链，执行区块关联的 `JS` 文件，并返回区块 `mount` 方法。

3、加载 `CSS`

将区块样式通过 `Style` 标签写入 `Shadow Dom`，区块内容也将在其内部渲染。

这里没有通过创建 `Link` 标签异步加载 `CSS`，主要为避免一步加载过程中的样式错乱。

5、挂载区块

执行配置中区块 `Key` 对应的 `mount` 方法，在 `Shadow Dom` 中挂载区块。

6、渲染

渲染区块。



## 对比

与同样是微前端实践方案的 [qiankun](https://github.com/umijs/qiankun) 对比：

挂载

Tenon 在设计初的主要目的就是进行多区块的页面拼装，在挂载的写法上更加高效，
你可以直接通过 `<TenonContainer />` 标齐来组装业务组件。

通信

考虑到区块间的通信以及与主应用的业务独立，在使用 `globalState` 时不需要提前初始化，区块内可以通过提供的 `API` 随时更新或创建新的状态值，以及监听 `globalState` 中某个字段的变化。


## 弊端

由于各区块间 `JS`、`CSS` 隔离，对于第三方库等资源在加载各区块时可能会重复加载，这将作为后续的优化项。



## 快速上手

> 基座：React 16+

> 区块：React 16+ / Vue 2+

### 安装

基座

```
yarn add tenon-maker

or

npm install -S tenon-maker
```

### 使用

#### TenonContainer

在基座应用的代码中使用 `<TenonContainer />` 传入区块的配置信息（block）即可实现区块的挂载，例如：

```javascript

import { TenonContainer } from 'tenon';

export const Workbenh: FC = (props: Props) => {

  return (
    <div className="container">
      <TenonContainer
        key={config.key}
        block={config.block}
        style={{
          ...config.style,
        }}
        history={props.history}
        data={{
          ...config.props,
        }}
      />
    </div>
  );
};

```

##### API

| 参数      | 说明     | 类型                  | 默认值 | 版本 |
| :-------- | :------- | :-------------------- | :----- | :--- |
| `block`   | 区块信息 | `Block`               | ''     |      |
| `style`   | 容器样式 | `CSSProperties`       | `{}`   |      |
| `history` | history  | `History`             | '-'    |      |
| `data`    | 组件参数 | `Record<string, any>` | `{}`   |      |

#### 应用间通信

产品组装的过程中应用间通信是不可避免的，其中包括主子应用通信、子应用间通信等，榫卯的应用间通信通过在子应用订阅基座的全局状态同时来实现，例如：

子应用订阅状态变化或查询、修改全局状态
```javascript

export const Demo: FC = (props: Props) => {
  const { onGlobalStateChange, setGlobalState, getGlobalState } = props;

  // 订阅全局状态中 userInfo 字段的变化
  onGlobalStateChange(
    (state, prev) => {
      if (state.userInfo) {
        setUserInfo(state.userInfo);
      }
    },
    ['userInfo'],
  );

  // 一次性获取当前的全局状态
  useEffect(() => {
    const globalState = getGlobalState();
    const { userInfo } = globalState;
  }, []);

  // 更新全局状态值
  const setState = () => {
    setGlobalState({
      title: 'Demo'
    })
  }

  return ...
}

```

##### API

| 参数                  | 说明                                  | 类型                                                              | 默认值 | 版本 |
| :-------------------- | :------------------------------------ | :---------------------------------------------------------------- | :----- | :--- |
| `getGlobalState`      | 获取全局状态                          | `() => Record<string, any>`                                       | -      |      |
| `setGlobalState`      | 设置状态                              | `(state: Record<string, any>) => boolean`                         | -      |      |
| `onGlobalStateChange` | 监听状态变化，changeKeys 为要监听的值 | `(callback: (state, prev) => void, changeKeys: string[]) => void` | -      |      |


#### 区块开发


1、增加打包入口文件，导出 `mount` 方法，例如：

```javascript
// React

import React from 'react';
import ReactDOM from 'react-dom';
import { Todo } from './todo';

const mount = {
  Todo: (module, el) => {
    ReactDOM.render(<Todo></Todo>, el);
  }
};

export default mount;
```

```javascript
// Vue

import Vue from 'vue';
import { default as Todo } from './todo';

const mount = {
  TodoList: (module, el) => {
    new Vue({
      render: (h) => h(Todo),
    }).$mount(el);
  },
};

export default mount;
```

2、打包输出 `umd` 格式, `webpack` 配置如下：

```javascript
output: {
  ...
  globalObject: 'proxyWindow', // 全局对象，固定 proxyWindow
  library: 'Library Name', // 自定义包名，暴露全局变量
  libraryExport: 'default', // 对应入口文件中导出的变量
  libraryTarget: 'umd', // 暴露全局变量
}
```

3、安装并配置 [tenon-webpack-plugin](https://github.com/panmenglin/tenon-webpack-plugin)，打包后输出 `entry.js`

```
```

4、对应资源需支持跨域访问。