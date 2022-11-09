import { CreditStatus } from '@/api/krd';
import TitleBar from '@/components/title-bar';
import { KEY_REFRESH_KRD_LIST } from '@/constant';
import { openPage } from '@/utils/navigator';
import { getDefaultPool } from '@/utils/taskPool';
import Tab from '@souche-ui/vant-next/es/tab';
import Tabs from '@souche-ui/vant-next/es/tabs';
import '@souche-ui/vant-next/lib/tabs/index.less';
import { onMounted, onUnmounted, ref ,PropType} from 'vue';
import KrdList from './components/list';
import styles from './index.module.less';

const TABS = [
  {
    name: '全部',
    type: CreditStatus.ALL,
  },
  {
    name: '申请预授信',
    type: CreditStatus.ON_PREPARE,
  },
  {
    name: '申请贷款',
    type: CreditStatus.ON_LOAN,
  },
  {
    name: '已取消',
    type: CreditStatus.CANCEL,
  },
];

export default function () {
  const goSelectCar = function () {
    openPage('/krd/cars');
  };
  const activeTabRef = ref('全部');
  const refreshKey = ref(1);

  onMounted(function () {
    getDefaultPool().storeById(KEY_REFRESH_KRD_LIST, function () {
      activeTabRef.value = '全部';
      refreshKey.value = refreshKey.value + 1;
    });
  });

  onUnmounted(function () {
    getDefaultPool().remove(KEY_REFRESH_KRD_LIST);
  });

  return function () {
    return (
      <div class={styles.krd}>
        <TitleBar />
        <Tabs class={styles.tabContent} v-model={[activeTabRef.value, 'active']} key={refreshKey.value}>
          {TABS.map((t) => {
            return (
              <Tab title={t.name} key={t.name}>
                <KrdList class={styles.krdList} type={t.type} />
              </Tab>
            );
          })}
        </Tabs>
        <div class={styles.bottom}>
          <div class={styles.button} onClick={goSelectCar}>
            新增寄售车辆
          </div>
        </div>
      </div>
    );
  };
}
