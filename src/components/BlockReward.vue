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
      const config = await steem.api.getConfigAsync();
      const dgp = await steem.api.getDynamicGlobalPropertiesAsync();
      const wso = await steem.api.getWitnessScheduleAsync();
      const feed = await steem.api.getFeedHistoryAsync();
      const cwit = await steem.api.getWitnessByAccountAsync(dgp.current_witness);
      const reward = await steem.api.getRewardFundAsync('post');

      const top20 = await steem.api.getWitnessesByVoteAsync(null, 20);
      const top20arr = [];
      top20.forEach((w) => top20arr.push(w.owner));

      const {
        STEEM_INFLATION_RATE_START_PERCENT,
        STEEM_INFLATION_NARROWING_PERIOD,
        STEEM_INFLATION_RATE_STOP_PERCENT,
        STEEM_BLOCKS_PER_YEAR,
        STEEM_100_PERCENT,
        STEEM_MAX_WITNESSES,
        STEEM_TREASURY_ACCOUNT,
      } = config;

      const headBlockNumber = dgp.head_block_number;
      const virtualSupply = dgp.virtual_supply.split(' ');
      const contentRewardPercent = dgp.content_reward_percent;
      const vestingRewardPercent = dgp.vesting_reward_percent;
      const spsFundPercent = dgp.sps_fund_percent;

      const startInflationRate = STEEM_INFLATION_RATE_START_PERCENT;
      const inflationRateAdjustment = headBlockNumber / STEEM_INFLATION_NARROWING_PERIOD;
      const inflationRateFloor = STEEM_INFLATION_RATE_STOP_PERCENT;

      const currentInflationRate = Math.max(
        startInflationRate - inflationRateAdjustment, inflationRateFloor,
      );

      const newSteem = (virtualSupply[0] * currentInflationRate)
      / (STEEM_100_PERCENT * STEEM_BLOCKS_PER_YEAR);

      const contentReward = (newSteem * contentRewardPercent) / STEEM_100_PERCENT;
      const contentReward2 = this.payRewardFunds(contentReward);
      const vestingReward = (newSteem * vestingRewardPercent) / STEEM_100_PERCENT;
      const spsFund = (newSteem * spsFundPercent) / STEEM_100_PERCENT;
      const witnessReward = newSteem - contentReward2 - vestingReward - spsFund;

      let witnessReward2 = witnessReward * STEEM_MAX_WITNESSES;

      let currentWeight = 0;
      if (top20arr.indexOf(cwit.owner) === -1) {
        currentWeight = wso.timeshare_weight;
      } else {
        currentWeight = wso.elected_weight;
      }
      witnessReward2 *= currentWeight;

      witnessReward2 /= wso.witness_pay_normalization_factor;

      let newSbd = 0;

      if (spsFund) {
        const baseF = feed.current_median_history.base.split(' '); // SBD
        // const quoteF = feed.current_median_history.quote.split(' '); // STEEM
        newSbd = spsFund * baseF[0];
        // Transfer to STEEM_TREASURY_ACCOUNT of newSbd
        console.log(`transfer to ${STEEM_TREASURY_ACCOUNT} ${newSbd} SBD.`);
      }

      // the final total reward.
      const newSteem2 = contentReward2 + vestingReward + witnessReward2;

      // Display the data
      this.data = [
        {
          paramName: `STEEM_INFLATION_RATE_START_PERCENT(${STEEM_INFLATION_RATE_START_PERCENT / 100}%)`,
          value: STEEM_INFLATION_RATE_START_PERCENT,
        },
        {
          paramName: 'STEEM_INFLATION_NARROWING_PERIOD',
          value: STEEM_INFLATION_NARROWING_PERIOD,
        },
        {
          paramName: `STEEM_INFLATION_RATE_STOP_PERCENT(${STEEM_INFLATION_RATE_STOP_PERCENT / 100}%)`,
          value: STEEM_INFLATION_RATE_STOP_PERCENT,
        },
        {
          paramName: `currentInflationRate(*)(${parseInt(currentInflationRate, 10) / 100}%)`,
          tips: 'Math.max(STEEM_INFLATION_RATE_START_PERCENT - head_block_number / STEEM_INFLATION_NARROWING_PERIOD, STEEM_INFLATION_RATE_STOP_PERCENT)',
          value: currentInflationRate,
        },
        {
          paramName: 'STEEM_BLOCKS_PER_YEAR',
          value: STEEM_BLOCKS_PER_YEAR,
        },
        {
          paramName: 'STEEM_MAX_WITNESSES',
          value: STEEM_MAX_WITNESSES,
        },
        {
          paramName: 'STEEM_TREASURY_ACCOUNT',
          value: STEEM_TREASURY_ACCOUNT,
        },
        {
          paramName: 'witness_pay_normalization_factor',
          value: wso.witness_pay_normalization_factor,
        },
        {
          paramName: 'timeshare_weight',
          value: wso.timeshare_weight,
        },
        {
          paramName: 'elected_weight',
          value: wso.elected_weight,
        },
        {
          paramName: 'currentWitness',
          value: cwit.owner,
        },
        {
          paramName: 'currentWitnessWeight(*)',
          tips: 'if(current witness is not top20){timeshare_weight} else {elected_weight}',
          value: currentWeight,
        },
        {
          paramName: 'current_median_history',
          tips: 'base / quote',
          value: `${feed.current_median_history.base} / ${feed.current_median_history.quote}`,
        },
        {
          paramName: 'head_block_number',
          value: dgp.head_block_number,
        },
        {
          paramName: `contentRewardPercent(${dgp.content_reward_percent / 100}%)`,
          value: dgp.content_reward_percent,
        },
        {
          paramName: `vestingRewardPercent(${dgp.vesting_reward_percent / 100}%)`,
          value: dgp.vesting_reward_percent,
        },
        {
          paramName: `spsFundPercent(${dgp.sps_fund_percent / 100}%)`,
          value: dgp.sps_fund_percent,
        },
        {
          paramName: 'virtual_supply',
          value: dgp.virtual_supply,
        },
        {
          paramName: 'EachBlockRewardInTheory(*)',
          tips: 'virtual_supply * currentInflationRate / STEEM_BLOCKS_PER_YEAR',
          value: `${newSteem} STEEM`,
        },
        {
          paramName: 'EachBlockContentRewardInTheory(*)',
          tips: 'EachBlockRewardInTheory * contentRewardPercent',
          value: `${contentReward} STEEM`,
        },
        {
          paramName: '? EachBlockContentRewardAfterPayRewardFunds(*)',
          tips: 'After payRewardFunds()',
          value: `${contentReward2} STEEM`,
        },
        {
          paramName: 'vestingReward(*)',
          tips: 'EachBlockRewardInTheory * vestingRewardPercent',
          value: `${vestingReward} STEEM`,
        },
        {
          paramName: 'spsFund(*)',
          tips: 'EachBlockRewardInTheory * spsFundPercent',
          value: `${spsFund} STEEM`,
        },
        {
          paramName: 'spsFundBySBD(*)',
          tips: 'spsFund * current_median_history.base / current_median_history.quote\n\n(This will transfer to STEEM_TREASURY_ACCOUNT)',
          value: `${newSbd} SBD`,
        },
        {
          paramName: 'witnessRewardInTheory(*)',
          tips: 'EachBlockRewardInTheory - EachBlockContentRewardAfterPayRewardFunds - vestingReward - spsFund',
          value: `${witnessReward} STEEM`,
        },
        {
          paramName: 'theFinalWitnessReward(*)',
          tips: 'witnessRewardInTheory * STEEM_MAX_WITNESSES * currentWitnessWeight / witness_pay_normalization_factor',
          value: `${witnessReward2} STEEM`,
        },
        {
          paramName: 'theFinalBlockReward(*)',
          tips: 'EachBlockContentRewardAfterPayRewardFunds + vestingReward + theFinalWitnessReward',
          value: `${newSteem2} STEEM`,
        },
        {
          paramName: 'total_vesting_fund_steem will increase(*)',
          tips: 'vestingReward',
          value: `${vestingReward} STEEM`,
        },
        {
          paramName: 'total_reward_fund_steem will increase(*)',
          tips: 'EachBlockContentRewardAfterPayRewardFunds',
          value: `${contentReward2} STEEM`,
        },
        {
          paramName: 'current_supply will increase(*)',
          tips: 'theFinalBlockReward',
          value: `${newSteem2} STEEM`,
        },
        {
          paramName: 'current_sbd_supply will increase(*)',
          tips: 'spsFundBySBD',
          value: `${newSbd} SBD`,
        },
        {
          paramName: 'virtual_supply will increase(*)',
          tips: 'theFinalBlockReward + spsFund',
          value: `${newSteem2} STEEM`,
        },
        {
          paramName: 'sps_interval_ledger will increase(*)',
          tips: 'spsFundBySBD',
          value: `${newSbd} STEEM`,
        },
      ];
      this.loading = false;
      console.log(
        config, dgp, wso, feed, witnessReward2, cwit, newSteem2, reward,
      );
    },
    payRewardFunds(reward) {
      return reward;
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
