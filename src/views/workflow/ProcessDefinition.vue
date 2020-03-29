<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24" justify="space-between">
            <a-col :md="8" :sm="24">
              
            </a-col>
            <a-col :md="8" :sm="24">
              
            </a-col>
            <a-col :md="6" :sm="18">
              
            </a-col>
            <a-col :md="2" :sm="6">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleAdd">新增</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>


      <a-row :gutter="24">
        <a-col :md="24">
          <s-table 
            ref="table" 
            size="default" 
            rowKey="id" 
            bordered 
            :columns="columns" 
            :data="loadData">
            <span slot="action" slot-scope="text, record">
              <a @click="handleEdit(record)">设计</a>
              <a-divider type="vertical" />
              <a @click="showDiagram(record)">流程图</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">
                  更多 <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a href="javascript:;">详情</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="handleDel(record)">删除</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </s-table>
        </a-col>
      </a-row>
    </a-card>

    <a-modal 
             title="流程图"
             centered
             :width="800" 
             v-model="diagramVisible" 
             :footer="null"
             destroyOnClose>
             <BpmnViewer :id="curRecordId"></BpmnViewer>
    </a-modal>
    <a-modal 
             title="设计流程图"
             centered
             :width="1200" 
             v-model="designVisible" 
             :confirmLoading="updateLoading"
             :okButtonProps="updateBtnProps"
             :maskClosable="false"
             destroyOnClose>
             <BpmnModeler ref="updateModeler" :id="curRecordId"></BpmnModeler>
    </a-modal>
    <a-modal 
             title="新增流程图"
             centered
             :width="1200" 
             v-model="addVisible" 
             :maskClosable="false"
             :confirmLoading="createLoading"
             :okText="'创建'"
             :okButtonProps="createBtnProps"
             destroyOnClose>
             <BpmnModeler ref="createModeler" :id="curRecordId"></BpmnModeler>
    </a-modal>



  </div>
</template>

<script>
import { STable } from '@/components'
import {BpmnViewer,BpmnModeler} from '@/components/Bpmn'
import { getProcessDefinitionList,delProcessDefinitionById,createProcess } from '@/api/workflow'
export default {
  components: {
    STable,BpmnViewer,BpmnModeler
  },
  data () {
    return {
      diagramVisible:false,
      designVisible:false,
      addVisible:false,
      createLoading:false,
      updateLoading:false,
      updateBtnProps:{
        on:{
          click:this.submitUpdate
        }
      },
      createBtnProps:{
        on:{
          click:this.submitCreate
        }
      },
      columns: [
        {
          title: '流程名称',
          width: '300px',
          dataIndex: 'name'
        },
        {
          title: '流程描述',
          dataIndex: 'description'
        },{
          title: '版本',
          width: '100px',
          dataIndex: 'version'
        }, {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getProcessDefinitionList(Object.assign(parameter, {group:true})).then(res => {
            return res.data
          })
      },
      curRecordId:null
    }
  },
  mounted () {

  },
  methods: {
    handleAdd(){
      this.curRecordId = null
      this.createLoading = false
      this.addVisible = true
    },
    handleEdit(record){
      this.curRecordId = record.id
      this.designVisible = true
    },
    showDiagram(record){
      this.curRecordId = record.id
      this.diagramVisible = true
    },
    handleDel(record){
      const _this = this
      this.$confirm({
          title: '删除流程：'+record.name,
          content: '该操作无法撤销，是否继续？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            delProcessDefinitionById(record.id).then(res=>{
              _this.$message.success('删除成功')
              _this.$refs.table.refresh(true)
            })
          },
          onCancel() {}
      })
    },
    submitUpdate(){
      this.updateLoading = true
      this.$refs.updateModeler.getXML().then(xml=>{
        if(!xml){
          this.$message.error('创建失败')
          this.updateLoading = false
          return
        }
        const data = {
          deploymentName:'test',
          deploymentSource:'axisx',
          xml:xml,
          update:true
        }
        createProcess(data).then(res=>{
          this.designVisible = false
          this.updateLoading = false
          this.$refs.table.refresh(true)
        })
      })
    },
    submitCreate(){
      this.createLoading = true
      this.$refs.createModeler.getXML().then(xml=>{
        if(!xml){
          this.$message.error('创建失败')
          this.createLoading = false
          return
        }
        const data = {
          deploymentName:'test',
          deploymentSource:'axisx',
          xml:xml,
          update:false
        }
        createProcess(data).then(res=>{
          this.addVisible = false
          this.createLoading = false
          this.$refs.table.refresh(true)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
