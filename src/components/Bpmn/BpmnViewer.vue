<template>
  <div class="container">
    <a-spin :spinning="spinning"/>
    <div id="viewer"></div>
  </div>
</template>

<script>
import BpmnViewer from 'bpmn-js'
import { getProcessDefinitionXmlById } from '@/api/workflow'
export default {
  name: 'BpmnViewer',
  props: {
    id:{
      type:String,
      default:null
    }
  },
  data () {
    return {
      spinning:false,
      viewer:null
    }
  },
  watch: {
    
  },
  mounted () {
    this.viewer = new BpmnViewer({
      container: '#viewer'
    })
    if(this.id){
      const _this = this
      this.spinning = true
      getProcessDefinitionXmlById(this.id).then(res => {
          _this.viewer.importXML(res.bpmn20Xml, function(err) {
            if (!err) {
              _this.viewer.get('canvas').zoom('fit-viewport')
            } else {
              _this.$message.error('加载失败')
            }
            _this.spinning = false
          })
      })
    }
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
.container{

}
#viewer{
  height:100%;
  width:100%;
  min-height:300px;
  /deep/ .bjs-container,/deep/ svg{
    min-height:300px;
  }
  /deep/ .bjs-powered-by{
    display:none;
  }
}
</style>
