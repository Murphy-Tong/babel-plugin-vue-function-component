/// <reference path="types_m.d.ts"/>
type SetupFnComponent = () => GlobalVNode
declare namespace JSX {
    type Element = GlobalVNode | SetupFnComponent
}