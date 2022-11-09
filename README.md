# Vue Function Component
## write Vue3 like React
[Online Demo](https://codesandbox.io/p/github/Murphy-Tong/babel-plugin-vue-function-component-demo/draft/charming-mestorf?file=%2Fsrc%2FApp.tsx&workspace=%257B%2522activeFileId%2522%253A%2522cl9qwbmqe000clrfsgxg42wfb%2522%252C%2522openFiles%2522%253A%255B%2522%252FREADME.md%2522%255D%252C%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522gitSidebarPanel%2522%253A%2522COMMIT%2522%252C%2522sidekickItems%2522%253A%255B%257B%2522type%2522%253A%2522PREVIEW%2522%252C%2522taskId%2522%253A%2522dev%2522%252C%2522port%2522%253A5173%252C%2522key%2522%253A%2522cl9qwqpzm000q3d6ijlsxq1dr%2522%252C%2522isMinimized%2522%253Afalse%257D%255D%257D)

### 工作方式

通过 babel 插件默认对所有的 tsx 文件进行处理，
获取所有的**模块顶级**的**方法定义**和**方法赋值表达式**，
如果方法声明了参数，则取第一个参数的类型，从类型定义中解析出 props 中去要声明的字段和类型，
将以上信息整合，用 defineComponent 包装成 vue 组件，赋值给同名常量。

### 文件、方法的处理范围

默认在所有**tsx文件中**，在**模块顶级**的，名称以**大写字母开头**的函数声明或函数表达式

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

### props 类型定义的检索、处理范围

1. 必须与组件在同一文件中
2. vue props中的字段必须直接声明在props**类型**中，不可以使用联合类型，不支持类型推断 

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

/******************* EXAMPLE ONE ************************/
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

/******************* EXAMPLE TWO ************************/
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
  "plugins": ["babel-plugin-vue-function-component","@vue/babel-plugin-jsx"]
}
```

##### 2.2 如果你用 webpack，那么配置一个loader在tsloader之后（ts-loader执行之前）

```javascript

rules: [
        {
          test: /.tsx$/,
          use: [
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                happyPackMode: false,
                appendTsxSuffixTo: [
                  '\\.vue$'
                ]
              }
            },
            {
              loader: path.resolve(__dirname,'./node_modules/babel-plugin-vue-function-component/lib/webpack-loader.js')
            }
          ],
        },
      ],

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

为了告诉编译器 setup function 也是合法的 function compomnent，创建文件 src/xxx.d.ts （放在哪里，叫什么都不重要，重要的是这个文件要在 tsconfig 的 include 范围内）

file: src/xxx.d.ts

```javascript
/// <reference types="babel-plugin-vue-function-component/types"/>
// 上面的内容必须在第一行
```

### 插件配置
参考：[micromatch]()

```typescript
export interface PluginOption {

    /**
     * @see micromatch 
     * 一个micromatch支持的参数 
     * 或者 一个函数 (filename)=>boolean
     * 默认：[**/*.tsx] //所有的tsx文件
     */
    includeFiles?: IncludeFileCB,

    /**
     * @see micromatch 
     * 一个micromatch支持的参数 
     * 或者 一个函数 (functionName,filename)=>boolean
     * ⚠️: 默认导出的匿名方法名将为default
     * 默认：['[_A-Z]*'] //大写开头的方法名
     */
    includeFns?: IncludeFnCB,

    /**
     * vue 在模块中导入时使用的别名 默认： vue
     */
    vue?: string
}
```

### 注意
1. 此插件不会处理js、jsx文件