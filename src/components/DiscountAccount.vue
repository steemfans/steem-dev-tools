<template>
  <a-card :title="$t('common.discount_account_props')" :loading="loading">
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
  name: 'DiscountAccount',
  data() {
    return {
      data: [],
      loading: false,
    };
  },
  methods: {
    async initData() {
      this.loading = true;
      const config = await steem.api.getConfigAsync();
      const dgp = await steem.api.getDynamicGlobalPropertiesAsync();
      const wso = await steem.api.getWitnessScheduleAsync();
      const w = await steem.api.getWitnessByAccountAsync(dgp.current_witness);

      // Display the data
      this.data = [
        {
          paramName: 'gpo.available_account_subsidies',
          tips: 'https://github.com/steemit/steem/blob/0.23.x/libraries/chain/steem_evaluator.cpp#L2657',
          value: dgp.available_account_subsidies,
        },
        {
          paramName: 'w.available_witness_account_subsidies',
          tips: 'https://github.com/steemit/steem/blob/0.23.x/libraries/chain/steem_evaluator.cpp#L2649',
          value: w.available_witness_account_subsidies,
        },
        {
          paramName: 'STEEM_ACCOUNT_SUBSIDY_PRECISION',
          value: config.STEEM_ACCOUNT_SUBSIDY_PRECISION,
        },
        {
          paramName: 'wso.account_subsidy_rd',
          tips: 'https://github.com/steemit/steem/blob/0.23.x/libraries/chain/database.cpp#L2508',
          value: JSON.stringify(wso.account_subsidy_rd),
        },
        {
          paramName: 'wso.account_subsidy_witness_rd',
          tips: 'https://github.com/steemit/steem/blob/0.23.x/libraries/chain/database.cpp#L2517',
          value: JSON.stringify(wso.account_subsidy_witness_rd),
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
