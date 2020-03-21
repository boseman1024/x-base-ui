<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :md="6">
        <a-spin :spinning="treeLoading">
          <a-button style="width:100%;" type="dashed" @click="add">新增部门</a-button>
          <a-tree 
            v-if="treeData.length"
            defaultExpandAll
            :treeData="treeData" 
            draggable  
            :replaceFields="treeProps" 
            @select="handleSelect" 
            @drop="move">
            <a-icon type="down" slot="switcherIcon" />
          </a-tree>
        </a-spin>
      </a-col>
      <a-col :md="18">
        <a-empty v-if="!curData"/>
        <div v-else>
          <a-spin :spinning="dataLoading">
            <a-form :form="form" layout="horizontal">
              <a-form-item label="部门名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model="form.name" placeholder="请输入部门名称" :disabled="opType==0"/>
              </a-form-item>
              <a-form-item label="部门类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-radio-group v-model="form.type" :disabled="opType==0">
                  <a-radio :value="'1'">公司</a-radio>
                  <a-radio :value="'2'">部门</a-radio>
                  <a-radio :value="'3'">小组</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item v-if="opType==1" label="上级部门" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input :placeholder="curData.name" disabled/>
              </a-form-item>
              <a-form-item label="部门排序" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input-number :min="1" :max="999" v-model="form.sort" :disabled="opType==0"/>
              </a-form-item>
              <a-form-item label="资源权限" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-row :style="{ borderBottom: '1px solid #E9E9E9',marginBottom:'10px' }">
                  <a-col :md="7">菜单</a-col>
                  <a-col :md="17">功能项</a-col>
                </a-row>
                <a-checkbox-group v-model="form.menus" :disabled="opType==0">
                  <a-row :gutter="0" v-for="item in menuItem" :key="item.menuId">
                    <a-col :md="7"><a-checkbox :value="item.menuId">{{item.name}}：</a-checkbox></a-col>
                    <a-col :md="17" v-if="item.function"><a-checkbox v-for="func in item.function" :key="func.menuId" :value="func.menuId">{{func.name}}</a-checkbox></a-col>
                  </a-row>
                </a-checkbox-group>
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 14, offset: 4 }" v-if="opType!=0">
                <a-button type="primary" @click="save" :loading="saveLoading">保存</a-button>
                <a-button @click="cancel" style="margin-left: 10px;">取消</a-button>
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 14, offset: 4 }" v-if="opType==0">
                <a-button type="primary" @click="edit">修改</a-button>
                <a-button type="danger" style="margin-left: 10px;" @click="del">删除</a-button>
                <a-button style="margin-left: 10px;" @click="close">关闭</a-button>
              </a-form-item>
            </a-form>
          </a-spin>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { getDeptTree,getDept,delDept,saveDept,updateDept,getMenuCheckItem } from '@/api/system'

export default {
  name: 'DeptList',
  components: {},
  data () {
    return {
      treeLoading:false,
      dataLoading:false,
      saveLoading:false,
      treeProps:{children:'children', title:'label', key:'id'},
      treeData:[],
      curData:null,
      form:{},
      labelCol:{ span: 4 },
      wrapperCol:{ span: 14 },
      opType:0,
      menuItem:[]
    }
  },
  created () {
    this.initTree()
    getMenuCheckItem().then(res=>{
      this.menuItem = res.data
    })
  },
  methods: {
    initTree(){
      this.treeLoading = true
      getDeptTree(0).then(res => {
        this.treeData = res.data
        this.treeLoading = false
      })
    },
    handleSelect(selectedKeys, e){
      this.opType = 0
      this.getDept(e.node.value)
    },
    getDept(id){
      this.dataLoading = true
      getDept(id).then(res=>{
        this.curData = res.data
        this.form = JSON.parse(JSON.stringify(res.data))
        this.dataLoading = false
      })
    },
    move(event){
      const temp = {deptId:event.dragNode.value,pid:event.node.value}
      updateDept(temp).then(res=>{
          if(res.code==200&&res.data!=null){
            this.initTree()
            this.getDept(res.data.deptId)
            this.opType = 0
            this.$message.success('移动成功')
          }else{
            this.$message.error('移动失败，请重试')
          }
      })
    },
    add(){
      this.opType = 1
      this.form = {}
      if(!this.curData){
        this.curData = {deptId:0}
      }
    },
    edit(){
      this.opType = 2
      this.form = JSON.parse(JSON.stringify(this.curData))
    },
    cancel(){
      this.opType = 0
      if(this.curData.deptId!=0){
        this.getDept(this.curData.deptId)
      }else{
        this.close()
      }
    },
    save(){
      this.saveLoading = true
      this.form.menus = this.form.menus?this.form.menus.join(','):[]
      if(this.opType==1){
        this.form.pid = this.curData.deptId
        saveDept(this.form).then(res=>{
          if(res.code==200&&res.data!=null){
            this.initTree()
            this.getDept(res.data.deptId)
            this.opType = 0
            this.$message.success('添加成功')
          }else{
            this.$message.error('添加失败，请重试')
          }
          this.saveLoading = false
        })
      }
      if(this.opType==2){
        updateDept(this.form).then(res=>{
          if(res.code==200&&res.data!=null){
            this.initTree()
            this.getDept(res.data.deptId)
            this.opType = 0
            this.$message.success('修改成功')
          }else{
            this.$message.error('修改失败，请重试')
          }
          this.saveLoading = false
        })
      }
    },
    del(){
      const _this = this
      this.$confirm({
          title: '删除部门：'+this.curData.name,
          content: '该操作无法撤销，是否继续？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            delDept(_this.curData.deptId).then(res=>{
              if(res.code==200&&res.data){
                _this.initTree()
                _this.curData = null
                _this.$message.success('删除成功')
              }else{
                _this.$message.error('删除失败，请重试')
              }
            })
          },
          onCancel() {}
      })
    },
    close(){
      this.curData = null
    }
  }
}
</script>

<style lang="less">
.ant-checkbox-group{
    display:block;
}
</style>
