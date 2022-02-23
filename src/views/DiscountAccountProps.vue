<template>
  <div class="home">
    <a-row type="flex" justify="start" :gutter="[16, 16]">
      <a-col :xs="24" :md="12">
        <DiscountAccount />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import DiscountAccount from '@/components/DiscountAccount.vue';

export default {
  name: 'Home',
  data() {
    return {};
  },
  components: {
    DiscountAccount,
  },
  methods: {},
  mounted() {
  },
};
</script>
