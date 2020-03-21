<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :md="6">
        <a-spin :spinning="treeLoading">
          <a-button style="width:100%;" type="dashed" @click="add">新增资源</a-button>
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
            <a-form layout="horizontal" :form="form">
              <a-form-item label="资源名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input 
                  v-decorator="[
                    'name',
                    {rules: [{ required: true, message: '请输入资源名称' }]}
                  ]"
                  placeholder="请输入资源名称" 
                  :disabled="opType==0"/>
              </a-form-item>
              <a-form-item label="权限标志" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input 
                  v-decorator="[
                    'permission',
                    {rules: [{ required: true, validator:checkMenuCode }]}
                  ]"
                  placeholder="请输入权限标志" 
                  :disabled="opType==0"/>
              </a-form-item>
              <a-form-item label="资源类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-radio-group 
                  v-decorator="[
                    'type',
                    {rules: [{ required: true, message: '请选择资源类型' }]}
                  ]"
                  :disabled="opType==0">
                  <a-radio :value="'1'">菜单</a-radio>
                  <a-radio :value="'2'">功能项</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="资源路径" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input 
                  v-decorator="[
                    'path',
                    {rules: []}
                  ]"
                  placeholder="请输入资源路径" 
                  :disabled="opType==0"/>
              </a-form-item>
              <a-form-item v-if="opType==1" label="上级资源" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input :placeholder="curData.name" disabled/>
              </a-form-item>
              <a-form-item label="资源组件" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input 
                  v-decorator="[
                    'component',
                    {rules: []}
                  ]"
                  placeholder="请输入资源组件" 
                  :disabled="opType==0"/>
              </a-form-item>
              <a-form-item label="资源图标" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input 
                  v-decorator="[
                    'icon',
                    {rules: []}
                  ]"
                  placeholder="请输入资源图标" 
                  :disabled="opType==0"/>
              </a-form-item>
              <a-form-item label="资源排序" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input-number 
                  :min="1" 
                  :max="999" 
                  v-decorator="[
                    'sort',
                    {rules: []}
                  ]"
                  :disabled="opType==0"/>
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 14, offset: 4 }" v-if="opType!=0">
                <a-button type="primary" @click="save">保存</a-button>
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
import { getMenuTree,getMenu,delMenu,saveMenu,updateMenu,checkMenuCode } from '@/api/system'

export default {
  name: 'MenuList',
  components: {},
  data () {
    return {
      treeLoading:false,
      dataLoading:false,
      treeProps:{children:'children', title:'label', key:'id'},
      treeData:[],
      curData:null,
      form:this.$form.createForm(this),
      labelCol:{ span: 4 },
      wrapperCol:{ span: 14 },
      opType:0
    }
  },
  created () {
    this.initTree()
  },
  methods: {
    initTree(){
      this.treeLoading = true
      getMenuTree(0).then(res => {
        this.treeData = res.data
        this.treeLoading = false
      })
    },
    handleSelect(selectedKeys, e){
      this.opType = 0
      this.getMenu(e.node.value)
    },
    getMenu(id){
      this.dataLoading = true
      getMenu(id).then(res=>{
        this.curData = res.data
        this.$nextTick(() => {
            this.form.resetFields()
            this.form.setFieldsValue({
              name:res.data.name,
              permission:this.curData.permission,
              type:res.data.type,
              path:res.data.path,
              component:res.data.component,
              icon:res.data.icon,
              sort:res.data.sort
            })
        })
        this.dataLoading = false
      })
    },
    move(event){
      const temp = {menuId:event.dragNode.value,pid:event.node.value}
      updateMenu(temp).then(res=>{
          if(res.code==200&&res.data!=null){
            this.initTree()
            this.getMenu(res.data.menuId)
            this.opType = 0
            this.$message.success('移动成功')
          }else{
            this.$message.error('移动失败，请重试')
          }
      })
    },
    add(){
      this.opType = 1
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue({})
      })
      if(!this.curData){
        this.curData = {menuId:0}
      }
    },
    edit(){
      this.opType = 2
/*      this.$nextTick(() => {
          this.form.setFieldsValue({
            name:this.curData.name,
            permission:this.curData.permission,
            type:this.curData.type,
            path:this.curData.path,
            pid:this.curData.pid,
            component:this.curData.component,
            icon:this.curData.icon,
            sort:this.curData.sort
          })
      })*/
    },
    cancel(){
      this.opType = 0
      if(this.curData.menuId!=0){
        this.getMenu(this.curData.menuId)
      }else{
        this.close()
      }
    },
    save(){
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        if(this.opType==1){
          values.pid = this.curData.menuId
          saveMenu(values).then(res=>{
            if(res.code==200&&res.data!=null){
              this.initTree()
              this.getMenu(res.data.menuId)
              this.opType = 0
              this.form.resetFields()
              this.$message.success('添加成功')
            }else{
              this.$message.error('添加失败，请重试')
            }
          })
        }
        if(this.opType==2){
          values.menuId = this.curData.menuId
          updateMenu(values).then(res=>{
            if(res.code==200&&res.data!=null){
              this.initTree()
              this.getMenu(res.data.menuId)
              this.opType = 0
              this.form.resetFields()
              this.$message.success('修改成功')
            }else{
              this.$message.error('修改失败，请重试')
            }
          })
        }
      })
    },
    del(){
      const _this = this
      this.$confirm({
          title: '删除资源：'+this.curData.name,
          content: '该操作无法撤销，是否继续？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            delMenu(_this.curData.menuId).then(res=>{
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
    },
    checkMenuCode(rule, value, callback){
      if(!value){
        callback(new Error('请输入权限标志'))
        return
      }
      if(value==this.curData.permission){
        callback()
        return
      }
      checkMenuCode(value).then(res=>{
        if(res.data){
          callback(new Error('资源标志已存在'))
        }else{
          callback()
        }
      })
    }
  }
}
</script>

<style lang="less">

</style>
