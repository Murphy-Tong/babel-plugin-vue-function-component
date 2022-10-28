import * as Vue from "@vue";
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
const Component = Vue.defineComponent({
  name: "Component",
  props: {},
  setup: function () {
    return function () {
      return <div></div>;
    };
  }
});
const ComponentProps = Vue.defineComponent({
  name: "ComponentProps",
  props: {
    a: String,
    A: String,
    b: Boolean,
    B: Boolean,
    c: Number,
    C: Number,
    d: (Object as Vue.PropType<Array<string>>),
    D: (Object as Vue.PropType<string[]>),
    e: (Object as Vue.PropType<Map<string, any>>),
    E: (Object as Vue.PropType<{
      [key: string]: any;
    }>),
    f: (Object as Vue.PropType<InnerTypes>),
    h: (Object as Vue.PropType<typeof VAL>),
    i: (Object as Vue.PropType<Partial<typeof VAL>>),
    j: (Object as Vue.PropType<Symbol>),
    k: (Object as Vue.PropType<() => any>),
    l: (Object as Vue.PropType<Function>),
    m: (Object as Vue.PropType<InnerType2>)
  },
  setup: function (props) {
    return function () {
      return <div></div>;
    };
  }
});
const ComponentLocalProps = Vue.defineComponent({
  name: "ComponentLocalProps",
  props: {
    a: String,
    A: String,
    b: Boolean,
    B: Boolean,
    c: Number,
    C: Number,
    d: (Object as Vue.PropType<Array<string>>),
    D: (Object as Vue.PropType<string[]>),
    e: (Object as Vue.PropType<Map<string, any>>),
    E: (Object as Vue.PropType<{
      [key: string]: any;
    }>),
    f: (Object as Vue.PropType<InnerTypes>),
    h: (Object as Vue.PropType<typeof VAL>),
    i: (Object as Vue.PropType<Partial<typeof VAL>>),
    j: (Object as Vue.PropType<Symbol>),
    k: (Object as Vue.PropType<() => any>),
    l: (Object as Vue.PropType<Function>),
    m: (Object as Vue.PropType<InnerType2>)
  },
  setup: function (props) {
    return function () {
      return <div></div>;
    };
  }
});
const ComponentWithin = Vue.defineComponent({
  name: "ComponentWithin",
  props: {},
  setup: function () {
    function Inner() {
      return 1;
    }
    return function () {
      return <div></div>;
    };
  }
});
const ComponentValDefine = Vue.defineComponent({
  name: "ComponentValDefine",
  props: {},
  setup: function () {
    return function () {
      return <div></div>;
    };
  }
});
const ComponentValDefineWithName = Vue.defineComponent({
  name: "ComponentValDefineWithName",
  props: {},
  setup: function () {
    return function () {
      return <div></div>;
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