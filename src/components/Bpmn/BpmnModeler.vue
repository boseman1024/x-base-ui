<template>
  <div class="containers">
    <a-spin :spinning="spinning"/>
    <div id="modeler"></div>
    <div id="properties"></div>
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
/*左边工具栏以及编辑节点的样式*/
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
/*右边工具栏样式*/
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import { getProcessDefinitionXmlById } from '@/api/workflow'
export default {
  name: 'BpmnModeler',
  props: {
    id:{
      type:String,
      default:null
    }
  },
  data () {
    const defaultTemplate = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_17dnfkk" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="3.7.1">\n' +
        '  <bpmn:process id="Process_1" isExecutable="true">\n' +
        '    <bpmn:startEvent id="StartEvent_1"/>\n' +
        '  </bpmn:process>\n' +
        '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
        '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
        '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
        '        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n' +
        '      </bpmndi:BPMNShape>\n' +
        '    </bpmndi:BPMNPlane>\n' +
        '  </bpmndi:BPMNDiagram>\n' +
        '</bpmn:definitions>'
    return {
      defaultTemplate,
      spinning:false,
      modeler:null
    }
  },
  watch: {
    
  },
  mounted () {
    this.modeler = new BpmnModeler({
      container: '#modeler',
      propertiesPanel: {
        parent: '#properties'
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule
      ],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    })
    const _this = this
    this.spinning = true
    if(this.id){
      getProcessDefinitionXmlById(this.id).then(res => {
          _this.modeler.importXML(res.bpmn20Xml, function(err) {
            if (!err) {
              _this.modeler.get('canvas').zoom('fit-viewport')
            } else {
              _this.$message.error('加载失败')
            }
            _this.spinning = false
          })
      })
    }else{
      _this.modeler.importXML(this.defaultTemplate, function(err) {
          if (!err) {
            _this.modeler.get('canvas').zoom('fit-viewport')
          } else {
            _this.$message.error('加载失败')
          }
           _this.spinning = false
      })
    }
  },
  methods: {
    getXML(){
      return new Promise(resolve=>
        this.modeler.saveXML({format:false},function(err,xml){
          console.log(xml)
          if (err) {
            console.error('保存失败', err)
            reject(err)
          }
          resolve(xml)
        })
      )
    }
  }
}
</script>

<style lang="less" scoped>
#modeler{
  width: 100%;
  height: 100%;
  min-height:600px;
  /deep/ .bjs-container,/deep/ svg{
    height: 100%;
    min-height:600px;
  }
  /deep/ .bjs-powered-by{
    display:none;
  }
}
#properties{
  position: absolute;
  right: 0;
  top: 55px;
  width: 300px;
  height:calc(100% - 108px);
  overflow-y:auto;
}
</style>
