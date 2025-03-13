<template>
  <div class="home">
    <a-row type="flex" justify="start" :gutter="[16, 16]">
      <a-col :xs="24" :md="12">
        <SPS />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import SPS from '@/components/SPS.vue';

export default {
  name: 'SPSProps',
  data() {
    return {};
  },
  components: {
    SPS,
  },
  methods: {},
  mounted() {
  },
};
</script>
