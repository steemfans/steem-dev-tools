<template>
  <div class="home">
    <a-row type="flex" justify="start" :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="8" :lg="6">
        <a-card :title="$t('home.block_reward.title')" :loading="blockInfoLoading">
          <BlockInfo :updateLoadingStatus="updateBlockInfoLoading" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import BlockInfo from '@/components/BlockInfo.vue';

export default {
  name: 'Home',
  data() {
    return {
      blockInfoLoading: false,
    };
  },
  components: {
    BlockInfo,
  },
  methods: {
    updateBlockInfoLoading(status) {
      console.log(status);
      this.blockInfoLoading = status;
    },
  },
};
</script>
