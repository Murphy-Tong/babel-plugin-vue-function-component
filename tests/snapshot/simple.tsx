import { SetupContext, PropType, defineComponent } from "vue";
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
  b: InnerTypes;
  c: InnerType2;
  e: boolean;
  f: number;
  g: Symbol;
  h: Array<string>;
  j: Map<String, Array<String>>;
  aa: String;
  bb: Boolean;
  ff: Number;
}
export default defineComponent({
  name: "simple",
  props: {
    a: String,
    b: (Object as PropType<InnerTypes>),
    c: (Object as PropType<InnerType2>),
    e: Boolean,
    f: Number,
    g: (Object as PropType<Symbol>),
    h: (Object as PropType<Array<string>>),
    j: (Object as PropType<Map<String, Array<String>>>),
    aa: String,
    bb: Boolean,
    ff: Number
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