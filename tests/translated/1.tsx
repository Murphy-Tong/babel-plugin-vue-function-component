import { createVNode as _createVNode, resolveComponent as _resolveComponent } from "vue";
import List from '@/components/list';
import { KEY_AGREEMENTS } from '@/constant';
import usePagination from '@/hooks/usePagination';
import { Field, Form } from '@souche-ui/vant-next';
import '@souche-ui/vant-next/lib/calendar/index.less';
import '@souche-ui/vant-next/lib/field/index.less';
import * as Vue from 'vue';
import Agreement from './components/agreement';
import styles from './index.module.less';
export default Vue.defineComponent({
  name: "1",
  setup: function () {
    const pagination = usePagination(function () {
      return Promise.resolve({
        hasMore: false
      });
    });
    return function () {
      return _createVNode(_resolveComponent("page"), {
        "class": styles.page
      }, {
        default: () => [_createVNode("div", {
          "class": styles.container
        }, [_createVNode(List, {
          "pagination": pagination,
          "class": styles.list,
          "enableRefresh": false,
          "enableLoadMore": false
        }, {
          default: (data: CreditContract) => {
            return _createVNode(_resolveComponent("Agre"), {
              "key": data.url,
              "data": data
            }, null);
          }
        })])]
      });
    };
  }
});