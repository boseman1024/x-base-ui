<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <a-avatar :size="104" :src="avatar()?avatar():''" :icon="avatar()?'':'user'" />
            </div>
            <div class="username">{{ nickname() }}</div>
            <div class="bio">海纳百川，有容乃大</div>
          </div>
          <div class="account-center-detail">
            <p>
              <a-icon type="user" />
              <a-tooltip placement="bottom" v-for="role in roles()" :key="role.roleId" :title="role.description">
                <a-tag color="orange">{{role.name}}</a-tag>
              </a-tooltip>
            </p>
            <p>
              <a-icon type="cluster" />
              <a-tag color="blue">{{dept().name}}</a-tag>
            </p>
          </div>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card
          style="width:100%"
          :bordered="false"
          :tabList="tabList"
          :activeTabKey="curTap"
          @tabChange="key => {curTap=key}"
        >
          <msg v-if="curTap==='msg'"></msg>
          <wait v-else-if="curTap==='wait'"></wait>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Msg from './page/Msg'
import Wait from './page/Wait'

export default {
  components: {
    Msg,Wait
  },
  data () {
    return {
      tabList: [
        {
          key: 'wait',
          tab: '待办'
        },
        {
          key: 'msg',
          tab: '消息'
        }
      ],
      curTap: 'wait'
    }
  },
  mounted () {
    
  },
  methods: {
    ...mapGetters(['nickname', 'avatar','roles','dept']),

  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
    }
  }

}
</style>
