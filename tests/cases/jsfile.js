import { SetupContext } from "vue"

/******************************* NO TRANSLATE **********************************/
function component() {
    return function () {
        return <div></div>
    }
}

const componentVal = function () {
    return function () {
        return <div></div>
    }
}

const componentValNamed = function ComponentValNamed() {
    return function () {
        return <div></div>
    }
}

function Component() {
    return function () {
        return <div></div>
    }
}

function ComponentProps(props) {
    return function () {
        return <div></div>
    }
}

function ComponentLocalProps(props) {
    return function () {
        return <div></div>
    }
}

function ComponentWithin() {
    function Inner() {
        return 1
    }
    return function () {
        return <div></div>
    }
}

const ComponentValDefine = function () {
    return function () {
        return <div></div>
    }
}

const ComponentValDefineWithName = function ComponentValDefineWithNameOfFn() {
    return function () {
        return <div></div>
    }
}

export default function (props, ctx) {
    return function () {
        return <div>你好啊
            {props.a}
            {ctx.slots.default?.()?.[0]}
        </div>
    }
}