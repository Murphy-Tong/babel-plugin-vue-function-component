/// <reference path="types_m.d.ts"/>
type SetupFnComponent = () => JSX.Element
declare namespace JSX {
    type Element = GLOBAL_VNODE | SetupFnComponent
}