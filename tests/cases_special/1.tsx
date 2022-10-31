import List from '@/components/list';
import { KEY_AGREEMENTS } from '@/constant';
import usePagination from '@/hooks/usePagination';
import { Field, Form } from '@souche-ui/vant-next';
import '@souche-ui/vant-next/lib/calendar/index.less';
import '@souche-ui/vant-next/lib/field/index.less';
import * as Vue from 'vue';
import Agreement from './components/agreement';
import styles from './index.module.less';

export default function () {
  const pagination = usePagination(function () {
    return Promise.resolve({
      hasMore: false,
    });
  });

  return function () {
    return (
      <page class={styles.page}>
        <div class={styles.container}>
          <List pagination={pagination} class={styles.list} enableRefresh={false} enableLoadMore={false}>
            {(data: CreditContract) => {
              return <Agre key={data.url} data={data} />;
            }}
          </List>
        </div>
        {/* <div class={styles.buttonWrapper} >
          <div class={styles.button} onClick={goSign}>
            提交
          </div>
        </div> */}
      </page>
    );
  };
}