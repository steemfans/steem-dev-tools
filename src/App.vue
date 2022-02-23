<template>
  <a-layout id="main">
    <a-layout-sider
      breakpoint="lg"
      collapsed-width="0"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
    >
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :default-selected-keys="['home']">
        <a-menu-item key="home">
          <a-icon type="home" />
          <router-link to="/">
            <span class="nav-text">{{ $t("common.home") }}</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="block_reward_props">
          <a-icon type="account-book" />
          <router-link to="/block_reward_props">
            <span class="nav-text">{{ $t("common.block_reward_props") }}</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="discount_account_props">
          <a-icon type="contact" />
          <router-link to="/discount_account_props">
            <span class="nav-text">{{ $t("common.discount_account_props") }}</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="about">
          <a-icon type="bulb" />
          <router-link to="/about">
            <span class="nav-text">{{ $t("common.about") }}</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: '0 16px' }">
        <h1>Steem Dev Tools</h1>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0' }">
        <div class="main-viewer">
          <router-view/>
        </div>
      </a-layout-content>
      <a-layout-footer style="textAlign: center">
        Steem Dev Tools ©2020 Created by <a href="https://steemit/@ety001">@ety001</a>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  methods: {
    onCollapse(collapsed, type) {
      console.log(collapsed, type);
    },
    onBreakpoint(broken) {
      console.log(broken);
    },
  },
};
</script>

<style lang="less">
#main {
  height: 100%;
  .ant-menu-item {
    a {
      display: inline-block;
    }
  }
  .main-viewer {
    padding: 24px;
    background: #fff;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}
</style>
