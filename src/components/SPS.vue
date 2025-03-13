<template>
  <a-card :title="$t('common.block_reward_props')" :loading="loading">
    <a-list item-layout="horizontal" :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta
          :description="item.value"
        >
          <template v-if="item.tips" slot="title">
            <a-tooltip>
              <template slot="title">
                {{ item.tips }}
              </template>
              {{ item.paramName }}
            </a-tooltip>
          </template>
          <template v-else slot="title">{{ item.paramName }}</template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
import steem from '@steemit/steem-js';

steem.api.setOptions({ url: 'https://api.steemit.com' });

export default {
  name: 'BlockReward',
  data() {
    return {
      data: [],
      loading: false,
    };
  },
  methods: {
    async initData() {
      this.loading = true;
      const dgp = await steem.api.getDynamicGlobalPropertiesAsync();
      const [account, err] = await steem.api.getAccountsAsync(['steem.dao']);
      if (err) {
        console.error('Error fetching account data:', err);
        return;
      }
      // Display the data
      this.data = [
        {
          paramName: '每小时发放资金理论值',
          tips: 'steem.dao余额 / 100 / 24 + SBD通胀 (其中 SBD 通胀目前为 0)',
          value: `${(account.sbd_balance / 100 / 24).toFixed(3)} SBD`,
        },
        {
          paramName: 'sps_interval_ledger',
          tips: '待存入 steem.dao 的资金量，每小时一清算',
          value: dgp.sps_interval_ledger,
        },
        {
          paramName: 'current_sbd_supply',
          tips: 'SBD 总供应量',
          value: dgp.current_sbd_supply,
        },
        {
          paramName: 'last_budget_time',
          tips: '上次 SPS 资金发放时间',
          value: dgp.last_budget_time,
        },
        {
          paramName: 'next_maintenance_time',
          tips: '下次 SPS 资金发放时间',
          value: dgp.next_maintenance_time,
        },
        {
          paramName: 'sps_fund_percent',
          tips: '每个区块发放 SPS 资金的百分比',
          value: dgp.sps_fund_percent,
        },
        {
          paramName: 'sbd_interest_rate',
          tips: 'SBD 利率(用于文章收益中的 SBD 计算)',
          value: `${dgp.sbd_interest_rate}`,
        },
        {
          paramName: 'sbd_start_percent',
          tips: 'SBD 起始百分比(用于文章收益中的 SBD 计算)',
          value: dgp.sbd_start_percent,
        },
        {
          paramName: 'sbd_stop_percent',
          tips: 'SBD 停止百分比(用于文章收益中的 SBD 计算)',
          value: dgp.sbd_stop_percent,
        },
        {
          paramName: 'head_block_number',
          tips: '区块当前块高度',
          value: dgp.head_block_number,
        },
        {
          paramName: 'time',
          tips: '区块当前块时间戳',
          value: dgp.time,
        },
      ];
      this.loading = false;
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
