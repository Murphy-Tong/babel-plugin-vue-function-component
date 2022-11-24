type InnerType2 = {
  c: boolean;
  f: Function;
  fc: (a: InnerType2) => boolean;
};
type Alias = InnerType2;
type IProps = Alias;
function ComponentProps(props: Alias) {
  return function () {
    return <div></div>;
  };
}
function ComponentLocalProps(props: {
  a: string;
  A: String;
  b: boolean;
  B: Boolean;
  c: number;
  C: Number;
  d: Array<string>;
  D: string[];
  e: Map<string, any>;
  E: {
    [key: string]: any;
  };
  f: InnerTypes;
  h: typeof VAL;
  i: Partial<typeof VAL>;
  j: Symbol;
  k: () => any;
  l: Function;
  m: InnerType2;
}) {
  return function () {
    return <div></div>;
  };
}
export function Cbbbb(props: {
  a: string;
}) {
  debugger;
  return function () {
    return <view>{props.a}</view>;
  };
}
export default function (props: IProps, ctx: SetupContext) {
  return function () {
    return <div>你好啊
            {props.a}
            {ctx.slots.default?.()?.[0]}
        </div>;
  };
}t as PropType<Partial<typeof VAL>>),
    j: (Object as PropType<Symbol>),
    k: (Object as PropType<() => any>),
    l: (Object as PropType<Function>),
    m: (Object as PropType<InnerType2>)
  },
  setup: function (props) {
    return function () {
      return <div></div>;
    };
  }
});
export const Cbbbb = defineComponent({
  name: "Cbbbb",
  props: {
    a: String
  },
  setup: function (props) {
    debugger;
    return function () {
      return <view>{props.a}</view>;
    };
  }
});
export default defineComponent({
  name: "tsfile-noimport",
  props: {
    c: Boolean,
    f: (Object as PropType<Function>),
    fc: (Object as PropType<(a: InnerType2) => boolean>)
  },
  setup: function (props, ctx: SetupContext) {
    return function () {
      return <div>你好啊
            {props.a}
            {ctx.slots.default?.()?.[0]}
        </div>;
    };
  }
});