<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-tabs>
          <a-tab-pane tab="消息" key="1">
            <a-list>
              <a-list-item v-for="item in msg" :key="item.id">
                <a-list-item-meta :title="item.title" :description="item.updateTime">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="待办" key="2">
            <a-list>
              <a-list-item v-for="item in wait" :key="item.id">
                <a-list-item-meta :title="item.title" :description="item.updateTime">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge :count="msg.length">
        <a-icon style="font-size: 16px; padding: 4px" :type="isConnect?'bell':'disconnect'" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'HeaderNotice',
  data () {
    return {
      isConnect:false,
      loading: false,
      visible: false,
      ws:{},
      msg:[],
      wait:[]
    }
  },
  computed: {
    ...mapGetters(['username'])
  },
  mounted(){
    this.connect()
  },
  destroyed(){
    this.ws.close()
  },
  methods: {
    connect(){
      this.ws = new WebSocket('ws://localhost:8090/msg/socket/'+this.username)
      const _this = this
      this.ws.onmessage = function(event){
        const data = JSON.parse(event.data)
        data.updateTime = moment().format('YYYY-MM-DD HH:mm:ss')
        _this.msg.unshift(data)
      }
      this.ws.onopen = function(){
        console.log('建立连接')
        _this.isConnect = true
      }
      this.ws.onclose = function(){
        console.log('断开连接')
        _this.isConnect = false
      }
    },
    fetchNotice () {
      if(!this.isConnect){
        this.connect()
      }
      if (!this.visible) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 1000)
      } else {
        this.loading = false
      }
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
