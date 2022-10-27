# Vue Function Component
## write vue like React

```typescript
function AComponent(props:{msg:string}){
    return function(){
        return <div>{props.msg}</div>
    }
}
```


### 工作方式

通过 babel 插件对所有的 tsx 文件进行处理，
获取所有的模块顶级的方法定义和方法赋值表达式，
如果方法声明了参数，则取第一个参数的类型，从类型定义中解析出 props 中去要声明的字段和类型，
将以上信息整合，用 defineComponent 包装成 vue 组件，赋值给同名常量。

### 处理范围

所有在模块顶级的函数声明或函数表达式

```typescript
// file: comp-a.tsx
/**
 * 模块
 */
function CompA() {
  // fn body
}

const CompB = function () {
  // fn body
};
```

### props 类型定义的检索范围

当前模块内定义的 Ts 类型，**_必须在 props 的类型定义中显示的声明出 props 中的字段_**，这样插件才能正确的解析出 props 中的 key 和对应的类型；如下：

```typescript
function test() {}

type IProps = {
  a: String;
  b: Object;
  c: typeof test;
  d: {
    a: typeof test;
  };
};

/******************* ONE ************************/
function CompOK(props: IProps) {
  // xxx
}

/**
 * 上面的将转换为
 */
const CompOK = defineComponent({
  name: "CompOK",
  props: {
    a: String,
    b: Object,
    c: Object as PropType<typeof test>,
    d: Object as PropType<{
      a: typeof test;
    }>,
  },
  setup: function (props: IProps) {
    // xxx
  },
});

/******************* TWO ************************/
function CompOk2(props: { a: number }) {
  // sss
}

/**
 * 上面的将转换为
 */
const CompOk2 = defineComponent({
  name: "CompOk2",
  props: {
    a: Number,
  },
  setup: function (props: { a: number }) {
    // xxx
  },
});

/******************* OTHERS ************************/
export function CompC() {}

export default function CompD() {}
```

下面的写法是无法解析的

```typescript
import type IProps from 'xxx'
const Obj = {
    a:1,
    b:2
}

// 暂不支持TS内置关键字推导
function CompOK(props:typeof Obj){
    // xxx
}

// 无法解析，不支持从别的文件导入类型 或 全局声明的类型
function CompOk2(props:IProps){
    // sss
}

// 不支持非顶级的方法定义
const InnerComponent = {
    fnRender:function(){

    }
}

// 同上
export default {
    fn:function(){}
    ...,
}
```

### 用法

#### 1. install it

```shell
yarn add -D babel-plugin-vue-function-component
```

#### 2. enable it

##### 2.1 如果你用 babel，那么在 babel 里面添加配置

```javascript
{
  "plugins": ["babel-plugin-vue-function-component", ["@babel/plugin-syntax-typescript",{ isTSX:true }]]
}
```

##### 2.2 如果你用的是 vite，那么添加一个插件

```javascript
//file: vite.config.js


import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { vitePlugin } from 'babel-plugin-vue-function-component'

export default defineConfig({
   / ****** ****** ****** *** 必须放在vueJsx plugin之前 *** ****** ****** ******/
  plugins: [vue(), vitePlugin() as Plugin, vueJsx()],
})

```

#### 3. config types

为了告诉编译器 setup function 也是合法的 function compomnent，创建文件 src/xxx.d.ts （放在哪里，叫什么都不重要，重要的是这恶搞文件要在 tsconfig 的 include 范围内）

file: src/xxx.d.ts

```javascript
/// <reference types="babel-plugin-vue-function-component/types"/>
// 上面的内容必须在第一行
```
