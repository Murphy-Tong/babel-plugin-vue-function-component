import { SetupContext } from "vue"

const VAL = { i: false, g: 1 }
type InnerTypes = typeof VAL

type InnerType2 = {
    c: boolean,
    f: Function,
    fc: (a: InnerType2) => boolean
}
export interface IProps {
    a: string,
    b: InnerTypes,
    c: InnerType2,
    e: boolean,
    f: number,
    g: Symbol,
    h: Array<string>,
    j: Map<String, Array<String>>,
    aa: String,
    bb: Boolean,
    ff: Number,
}

export default function (props: IProps, ctx: SetupContext) {
    return function () {
        return <div>你好啊
            {props.a}
            {ctx.slots.default?.()?.[0]}
        </div>
    }
}