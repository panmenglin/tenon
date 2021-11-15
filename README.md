# Tenon

English | [简体中文](./README.zh-CN.md)

Tenon is an implementation of Micro Frontends, which refers to single-spa and qiankun. It aims to provide a way to share business components between projects to support the decoupling and reorganization of cross-team and large-scale projects.

---

## Core Design Philosophy Of Tenon

### Decoupling

The core goal of the micro front end is to disassemble the boulder application into several loosely coupled micro applications that can be autonomous. Tenon’s design philosophy is consistent with this. Based on this principle, the sandbox and inter-application communication are designed to ensure independent development of micro applications. Ability.

### Assembly

At the same time, it is hoped that products can be customized or reorganized based on decoupled blocks. Therefore, the design is not only limited to micro-applications, but also suitable for components with business attributes. Based on this, the implementation form of `JS Entry` was selected, and the block design was designed. Mounting scheme.


## Features

### Technology Agnostic

It supports block access of various technology stacks such as `React` and `Vue`, but the v1.0 base is built on the basis of React, so the base application only supports `React` for the time being.

### Style Isolation

Based on `Shadow Dom` to ensure that the styles of micro-applications do not interfere with each other.

### JS Sandbox

The multi-instance sandbox based on `Proxy` ensures that there is no conflict between global variables/events between micro-applications.



## How Does Tenon Works


![flow](https://user-images.githubusercontent.com/12044749/141717320-3313ce44-19da-4b20-ab9b-dbc75953ec0b.png)

**1. Get Configuration**

Tenon will obtain block information from the configuration, including: name, block method, dependencies, business attributes, etc.
You assemble this configuration through your own operating end and obtain it by providing an interface to achieve page assembly.

Load the sub-application block, import configure the entry file of the sub-application, this file can be quickly generated through [tenon-webpack-plugin](https://github.com/panmenglin/tenon-webpack-plugin) when self-application is packaged .

```javascript
blocks: [{
  name: 'Block Name',
  key: 'Todo',
  import: 'http://xxx/entry.json',
  props: {
    id: 'ID',
  },
}],
```

You can also configure in the project and import the components of this project.

```javascript
import { Todo } from '@/components';

blocks: [{
  name: 'Block Name',
  key: 'Todo',
  import: Todo,
}],
```

**2. Determine the Block Type**

If it is a component of the current project, it will be rendered directly;

If it is a sub-application block, create a `Shadow Dom` and proceed to step 3.

**3. Load JS**

Create a multi-instance JS sandbox based on `Proxy`, change the scope chain through the `with` method, execute the `JS` file associated with the block, and return to the block `mount` method.

**4. Load CSS**

Write the block style into the Shadow Dom through the Style tag, and the block content will also be rendered inside it.

There is no asynchronous loading of `CSS` by creating a `Link` tag, mainly to avoid style confusion during the one-step loading process.

**5. Mount**

Execute the `mount` method corresponding to the block `Key` in the configuration, and mount the block in the `Shadow Dom`.

**6. Render**

Render the block.


## Contrast with qiankun

Contrast with [qiankun](https://github.com/umijs/qiankun), which is also a implementation of Micro Frontends:

Mount

The main purpose of Tenon at the beginning of the design was to assemble multi-block pages, which is more efficient in the way of mounting.
You can directly assemble business components through `<TenonContainer />` markup.

Communication

Taking into account the communication between blocks and the business independence from the main application, there is no need to initialize in advance when using `globalState`. The block can update or create new state values ​​at any time through the provided `API`, and monitor `globalState` A change in a field in.


## Disadvantages

Due to the isolation of `JS` and `CSS` between blocks, resources such as third-party libraries may be loaded repeatedly when each block is loaded, which will be used as a subsequent optimization item.



## Get Started

> Base: React 16+

> Block: React 16+ / Vue 2+ / Vue 3

### Installation

Pedestal

```
yarn add tenon-maker

or

npm install -S tenon-maker
```

### Usage

#### TenonContainer

Use `<TenonContainer />` in the code of the base application to pass in the configuration information (block) of the block to realize the mounting of the block, for example:

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

| Property | Description | Type | Default | Version |
| :--- | :--- | :--- | :--- | :--- |
| `block` | Block information | `Block` | `{}` | |
| `style` | Container style | `CSSProperties` | - | |
| `history` | history  | `History` | - | |
| `data` | Component parameters | `Record<string, any>` | - | |

#### Inter-application Communication

Communication between applications is inevitable in the process of product assembly, including main-sub-application communication, communication between sub-applications, etc. The inter-application communication of the tenon-and-mortise joint is realized by subscribing to the global status of the base at the same time, for example:

Sub-application subscription status changes or query, modify the global status

```javascript

export const Demo: FC = (props: Props) => {
  const { onGlobalStateChange, setGlobalState, getGlobalState } = props;

  // Subscribe to changes in the userInfo field in the global status
  onGlobalStateChange(
    (state, prev) => {
      if (state.userInfo) {
        setUserInfo(state.userInfo);
      }
    },
    ['userInfo'],
  );

  // Get the current global state at one time
  useEffect(() => {
    const globalState = getGlobalState();
    const { userInfo } = globalState;
  }, []);

  // Update global status value
  const setState = () => {
    setGlobalState({
      title: 'Demo'
    })
  }

  return ...
}

```

##### API

| Property | Description | Type | Default | Version |
| :--- | :--- | :--- | :--- | :--- |
| `getGlobalState` | Get global status | `() => Record<string, any>` | - | |
| `setGlobalState`      | Set status | `(state: Record<string, any>) => boolean` | - | |
| `onGlobalStateChange` | Monitor state changes, changeKeys is the value to be monitored | `(callback: (state, prev) => void, changeKeys: string[]) => void` | - | |


#### Block Development

1、Add the package entry file and export the `mount` method, for example:

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

2、Packaged output `umd` format, `webpack` configuration is as follows:

```javascript
output: {
  ...
  globalObject: 'proxyWindow', // Global object, fixed proxyWindow
  library: 'Library Name', // Customize the package name and expose global variables
  libraryExport: 'default', // Corresponding to the variables exported in the entry file
  libraryTarget: 'umd', // Expose global variables
}
```

3、Install and configure [tenon-webpack-plugin](https://github.com/panmenglin/tenon-webpack-plugin), and output `entry.js` after packaging


4、Corresponding resources need to support cross-domain access.
