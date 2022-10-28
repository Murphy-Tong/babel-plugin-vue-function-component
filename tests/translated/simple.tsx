import { SetupContext } from "vue";
const VAL = {
  i: false,
  g: 1
};
type InnerTypes = typeof VAL;
type InnerType2 = {
  c: boolean;
  f: Function;
  fc: (a: InnerType2) => boolean;
};
export interface IProps {
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
}

/******************************* NO TRANSLATE **********************************/
function component() {
  return function () {
    return <div></div>;
  };
}
const componentVal = function () {
  return function () {
    return <div></div>;
  };
};
const componentValNamed = function ComponentValNamed() {
  return function () {
    return <div></div>;
  };
};

/******************************* TRANSLATE **********************************/
function Component() {
  return function () {
    return <div></div>;
  };
}
function ComponentProps(props: IProps) {
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
function ComponentWithin(props: any) {
  function Inner() {
    return 1;
  }
  return function () {
    return <div></div>;
  };
}
const ComponentValDefine = function () {
  return function () {
    return <div></div>;
  };
};
const ComponentValDefineWithName = function ComponentValDefineWithNameOfFn(props: {}) {
  return function () {
    return <div></div>;
  };
};
export default function (props: IProps, ctx: SetupContext) {
  return function () {
    return <div>你好啊
            {props.a}
            {ctx.slots.default?.()?.[0]}
        </div>;
  };
}v>;
  };
}
const ComponentValDefine = function () {
  return function () {
    return <div></div>;
  };
};
const ComponentValDefineWithName = function ComponentValDefineWithNameOfFn(props: {}) {
  return function () {
    return <div></div>;
  };
};
export default function (props: IProps, ctx: SetupContext) {
  return function () {
    return <div>你好啊
            {props.a}
            {ctx.slots.default?.()?.[0]}
        </div>;
  };
}),
    D: (Object as PropType<string[]>),
    e: (Object as PropType<Map<string, any>>),
    E: (Object as PropType<{
      [key: string]: any;
    }>),
    f: (Object as PropType<InnerTypes>),
    h: (Object as PropType<typeof VAL>),
    i: (Object as PropType<Partial<typeof VAL>>),
    j: (Object as PropType<Symbol>),
    k: (Object as PropType<() => any>),
    l: (Object as PropType<Function>),
    m: (Object as PropType<InnerType2>)
  },
  setup: function (props, ctx: SetupContext) {
    return function () {
      return <div>你好啊
            {props.a}
            {ctx.slots.default?.()?.[0]}
        </div>;
    };
  }
});<div></div>;
    };
  }
});
export default function (props: IProps, ctx: SetupContext) {
  return function () {
    return <div>你好啊
            {props.a}
            {ctx.slots.default?.()?.[0]}
        </div>;
  };
}