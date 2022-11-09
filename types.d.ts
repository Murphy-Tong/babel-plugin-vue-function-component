/// <reference path="types_m.d.ts"/>
type VNode = GlobalVNode
type NullVNode = null | undefined
type SetupFnComponent = () => VNode | VNode[] | NullVNode | NullVNode[] | SetupFnComponent | SetupFnComponent[]
declare namespace JSX {
    type Element = VNode | SetupFnComponent
    interface IntrinsicAttributes {
        class?: string
    }
}