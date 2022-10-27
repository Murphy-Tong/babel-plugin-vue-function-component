## Vue Function Component

### 工作方式

通过babel插件对所有的tsx文件进行处理，
获取所有的模块顶级的方法定义和方法赋值表达式，
如果方法声明了参数，则取第一个参数的类型，从类型定义中解析出props中去要声明的字段和类型，
将以上信息整合，用defineComponent包装成vue组件，赋值给同名常量。

### 处理范围
所有在模块顶级的函数声明或函数表达式
```typescript
// file: comp-a.tsx
/**
 * 模块
 */
function CompA(){
    // fn body
}

const CompB = function(){
    // fn body
}
```

### props 类型定义的检索范围
当前模块内定义的Ts类型，***必须在props的类型定义中显示的声明出props中的字段***，这样插件才能正确的解析出props中的key和对应的类型；如下：
```typescript
function test(){

}

type IProps = {
    a:String,
    b:Object,
    c:typeof test,
    d:{
        a:typeof test
    }
}

/******************* ONE ************************/
function CompOK(props:IProps){
    // xxx
}

/**
 * 上面的将转换为
 */
const CompOK = defineComponent({
    name:"CompOK",
    props:{
        a:String,
        b:Object,
        c:Object as PropType<typeof test>,
        d:Object as PropType<{
                a:typeof test
            }>
    },
    setup:function (props:IProps){
        // xxx
    }
})

/******************* TWO ************************/
function CompOk2(props:{
    a:number
}){
    // sss
}

/**
 * 上面的将转换为
 */
const CompOk2 = defineComponent({
    name:"CompOk2",
    props:{
        a:Number
    },
    setup:function (props:{
     a:number
    }){
        // xxx
    }
})

/******************* OTHERS ************************/
export function CompC(){

}

export default function CompD(){

}
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