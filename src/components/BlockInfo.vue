<template>
  <div></div>
</template>

<script>
import steem from '@steemit/steem-js';

steem.api.setOptions({ url: 'https://api.steem.fans' });

export default {
  name: 'BlockInfo',
  data() {
    return {
    };
  },
  props: {
    updateLoadingStatus: Function,
  },
  methods: {
    async initData() {
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

      let contentReward = (newSteem * contentRewardPercent) / STEEM_100_PERCENT;
      console.log('contentReward:', contentReward);
      contentReward = this.payRewardFunds(contentReward);
      const vestingReward = (newSteem * vestingRewardPercent) / STEEM_100_PERCENT;
      const spsFund = (newSteem * spsFundPercent) / STEEM_100_PERCENT;
      let witnessReward = newSteem - contentReward - vestingReward - spsFund;

      witnessReward *= STEEM_MAX_WITNESSES;

      if (top20arr.indexOf(cwit.owner) !== -1) {
        witnessReward *= wso.timeshare_weight;
      } else {
        witnessReward *= wso.elected_weight;
      }

      witnessReward /= wso.witness_pay_normalization_factor;

      let newSbd = 0;

      if (spsFund) {
        const baseF = feed.current_median_history.base.split(' '); // SBD
        // const quoteF = feed.current_median_history.quote.split(' '); // STEEM
        newSbd = spsFund * baseF[0];
        // Transfer to STEEM_TREASURY_ACCOUNT of newSbd
        console.log(`transfer to ${STEEM_TREASURY_ACCOUNT} ${newSbd} SBD.`);
      }

      // the final total reward.
      const newSteem2 = contentReward + vestingReward + witnessReward;

      console.log(`total_vesting_fund_steem will increase ${vestingReward} STEEM.`);
      console.log(`total_reward_fund_steem will increase ${contentReward} STEEM.`);
      console.log(`current_supply will increase ${newSteem2} STEEM.`);
      console.log(`current_sbd_supply will increase ${newSbd} SBD.`);
      console.log(`virtual_supply will increase ${newSteem2} + ${spsFund} STEEM.`);
      console.log(`sps_interval_ledger will increase ${newSbd} SBD.`);
      console.log(
        config, dgp, wso, feed, witnessReward, cwit, newSteem2, reward,
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
