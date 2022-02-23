<template>
  <div class="home">
    <a-row type="flex" justify="start" :gutter="[16, 16]">
      <a-col :xs="24" :md="12">
        <BlockReward />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import BlockReward from '@/components/BlockReward.vue';

export default {
  name: 'BlockRewardProps',
  data() {
    return {};
  },
  components: {
    BlockReward,
  },
  methods: {},
  mounted() {
  },
};
</script>
