<template>
  <div>
    <iframe class="iframe" :style="'height:'+height+'px'" :src="url" scrolling="auto"></iframe>
  </div>
</template>

<script>

export default {
  name: 'IframeView',
  data(){
  	return {
  		url:'',
  		height:(document.body.clientHeight - 64 - 122 - 30)
  	}
  },
  mounted(){
  	this.url = this.$route.meta.link
    const _this = this
    window.onresize = ()=>{
        _this.height = (document.body.clientHeight - 64 - 122 - 30)
    }
  },
  destroyed(){
      window.onresize = null
  }
}
</script>

<style scoped lang="less">
.iframe{
	width:100%;
	border:none;
}
</style>
