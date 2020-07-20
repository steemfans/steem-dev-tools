<template>
  <div class="home">
    <a-row type="flex" justify="start" :gutter="[16, 16]">
      <a-col :xs="24" :md="12">
        <BlockInfo />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import BlockInfo from '@/components/BlockInfo.vue';

export default {
  name: 'Home',
  data() {
    return {};
  },
  components: {
    BlockInfo,
  },
  methods: {},
  mounted() {
  },
};
</script>
