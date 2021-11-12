# 榫卯 SUNMAO

榫卯（SUNMAO）是一个微前端实现库，旨在提供一种项目间共享业务组件的方式，以支持跨团队、大规模项目的解耦和重组。

---
## 核心设计理念

### 解耦

微前端的核心目标是将巨石应用拆解成若干可以自治的松耦合微应用，榫卯的设计理念与此一致，基于这一原则设计了沙箱、应用间通信等，以确保微应用具备独立开发的能力。

### 组装

同时希望能够基于解耦的区块进行产品定制化或重组，因此在设计时不仅限于微应用也适用于有业务属性的组件，基于此选择了 JS entry 的实现形式，设计了区块的挂载方案。


## 特性

#### 技术栈无关

支持 React、Vue 等多种技术栈的区块接入，但是基座暂时只支持 React。

### 样式隔离

确保微应用之间样式互相不干扰。

### JS 沙箱

确保微应用之间 全局变量/事件 不冲突。


## 它是如何工作的

### 1、通过配置读取区块信息，加载依赖

榫卯从将从配置中获取区块信息，名称、依赖、业务属性等。

### 2、创建 CSS 沙箱（样式隔离）

通过 `shadow dom` 创建样式的隔离环境，并将区块样式通过 `style` 标签写入 `shadow dom`，区块内容也将在其内部渲染。

### 3、创建 JS 沙箱

通过 `Proxy` 创建多实例的 JS 沙箱，通过 with 改变作用域链，执行区块关联的 JS 文件，并返回区块 mount 方法。

### 4、挂载区块

执行返回的 `mount` 方法，在 `shadow dom` 中挂载区块。


## 对比

对比 qiankun


挂载


通信


## 弊端


...

资源加载






## 快速上手

### 安装

待补充


### 使用

#### BlockContainer

在基座应用的代码中使用 `<BlockContainer />` 传入区块的配置信息（block）即可实现区块的挂载，例如：

```javascript

import { BlockContainer } from '@/utils/summao/container';

export const Workbenh: FC = (props: Props) => {

  return (
    <div className="container">
      <BlockContainer
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

主应用初始化全局状态
```javascript

import { initGlobalState } from '@/utils/summao/global-state'

// 全局状态初始化
export const globalState = initGlobalState()
```

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


1、增加打包入口文件，导出 mount 方法，例如：

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

2、打包输出 umd 格式, webpack 配置如下：

```javascript
output: {
  ...
  globalObject: 'proxyWindow', // 全局对象，固定 proxyWindow
  library: 'TBBlocks', // 自定义包名，暴露全局变量
  libraryExport: 'default', // 对应入口文件中导出的变量
  libraryTarget: 'umd', // 暴露全局变量
}
```

3、安装并配置 SunMaoWebpackPlugin，打包后输出 entry.js


对应资源需支持跨域访问。