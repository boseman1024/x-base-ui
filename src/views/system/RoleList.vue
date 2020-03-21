<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :md="4">
        <a-spin :spinning="treeLoading">
          <a-tree 
            v-if="treeData.length"
            defaultExpandAll
            :treeData="treeData" 
            :replaceFields="treeProps" 
            @select="handleSelect" ></a-tree>
        </a-spin>
      </a-col>
      <a-col :md="4">
        <a-spin :spinning="roleLoading">
          <a-button style="width:100%;" type="dashed" @click="add">新增角色</a-button>
          <a-divider>角色</a-divider>
          <a-list itemLayout="vertical" :dataSource="roles">
            <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
              <a-list-item-meta>
                <span slot="description" style="text-align: center; display: block">{{ item.description }}</span>
                <a slot="title" style="text-align: center; display: block" @click="getRole(item.roleId)">
                  {{ item.name }}
                  <a-dropdown>
                    <a href="#"><a-icon type="down" /></a>
                    <a-menu slot="overlay">
                      <a-menu-item key="1" @click="edit(item)">编辑</a-menu-item>
                      <a-menu-item key="2" @click="del(item)">删除</a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-spin>
      </a-col>
      <a-col :md="16">
        <a-empty v-if="!curData"/>
        <div v-else>
          <a-form :form="form" layout="horizontal">
            <a-form-item label="角色名称" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input 
                v-decorator="[
                  'name',
                  {rules: [{ required: true, message: '请输入角色名称' }]}
                ]"
                placeholder="请填写角色名称"  
                :disabled="opType==0"/>
            </a-form-item>
            <a-form-item label="角色标志" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input 
                v-decorator="[
                  'code',
                  {rules: [{ required: true, validator:checkRoleCode}]}
                ]"
                placeholder="请输入角色标志"  
                :disabled="opType==0"/>
            </a-form-item>
            <a-form-item label="备注说明" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-textarea 
                v-decorator="[
                  'description',
                  {rules: []}
                ]"
                :row="3"
                placeholder="请输入备注说明" 
                :disabled="opType==0"/>
            </a-form-item>
            <a-form-item label="资源权限" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-row :style="{ borderBottom: '1px solid #E9E9E9',marginBottom:'10px' }">
                  <a-col :md="8">菜单</a-col>
                  <a-col :md="16">功能项</a-col>
                </a-row>
                <a-checkbox-group 
                  v-decorator="[
                    'menus',
                    {rules: []}
                  ]"
                 :disabled="opType==0">
                  <a-row :gutter="0" v-for="item in menuItem" :key="item.menuId">
                    <a-col :md="8"><a-checkbox :value="item.menuId">{{item.name}}：</a-checkbox></a-col>
                    <a-col :md="16" v-if="item.function"><a-checkbox v-for="func in item.function" :key="func.menuId" :value="func.menuId">{{func.name}}</a-checkbox></a-col>
                  </a-row>
                </a-checkbox-group>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }" v-if="opType!=0">
                <a-button type="primary" @click="save" :loading="saveLoading">保存</a-button>
                <a-button @click="cancel" style="margin-left: 10px;">取消</a-button>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 14, offset: 4 }" v-if="opType==0">
                <a-button style="margin-left: 10px;" @click="close">关闭</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { getDeptTree,getRoleList,getRole,getMenuCheckItem,updateRole,saveRole,delRole,checkRoleCode} from '@/api/system'

export default {
  name: 'RoleList',
  components: {},
  data () {
    return {
      treeLoading:false,
      roleLoading:false,
      dataLoading:false,
      saveLoading:false,
      treeProps:{children:'children', title:'label', key:'id'},
      treeData:[],
      permissions: [],
      roles: [],
      curData:null,
      menuItem:[],
      form: this.$form.createForm(this),
      labelCol:{ span: 4 },
      wrapperCol:{ span: 14 },
      opType:0,
      curDeptId:0
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
      this.curDeptId = e.node.value
      this.getRoleList(e.node.value)
    },
    getRoleList(deptId){
      this.opType = 0
      this.roleLoading = true
      getRoleList({deptId:deptId}).then(res=>{
        this.roles = res.data
        this.roleLoading = false
      })
    },
    getRole(id){
      this.opType = 0
      this.dataLoading = true
      getRole(id).then(res=>{
        this.curData = res.data
        this.$nextTick(() => {
          this.form.resetFields()
          this.form.setFieldsValue({
            name:res.data.name,
            code:res.data.code,
            description:res.data.description,
            menus:res.data.menus
          })
        })
        this.dataLoading = false
      })
    },
    cancel(){
      this.opType = 0
      if(this.curData.roleId){
        this.getRole(this.curData.roleId)
      }else{
        this.close()
      }
    },
    add(){
      this.opType = 1
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue({})
      })
      this.curData = {}
    },
    edit(item){
      this.getRole(item.roleId)
      this.opType = 2
    },
    save(){
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.saveLoading = true
        values.menus = values.menus?values.menus.join(','):''
        if(this.opType==1){
          values.deptId = this.curDeptId
          saveRole(values).then(res=>{
            if(res.code==200&&res.data!=null){
              this.getRoleList(this.curDeptId)
              this.getRole(res.data.roleId)
              this.opType = 0
              this.form.resetFields()
              this.$message.success('添加成功')
            }else{
              this.$message.error('添加失败，请重试')
            }
            this.saveLoading = false
          })
        }
        if(this.opType==2){
          values.roleId = this.curData.roleId
          updateRole(values).then(res=>{
            if(res.code==200&&res.data!=null){
              this.getRoleList(this.curDeptId)
              this.getRole(res.data.roleId)
              this.opType = 0
              this.form.resetFields()
              this.$message.success('修改成功')
            }else{
              this.$message.error('修改失败，请重试')
            }
            this.saveLoading = false
          })
        }
      })
    },
    del(item){
      const _this = this
      this.$confirm({
          title: '删除角色：'+ item.name,
          content: '该操作无法撤销，是否继续？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            delRole(item.roleId).then(res=>{
              if(res.code==200&&res.data){
                _this.getRoleList(_this.curDeptId)
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
    checkRoleCode(rule, value, callback){
      if(!value){
        callback(new Error('请输入角色标志'))
        return
      }
      if(value==this.curData.code){
        callback()
        return
      }
      checkRoleCode(value).then(res=>{
        if(res.data){
          callback(new Error('角色标志已存在'))
        }else{
          callback()
        }
      })
    }
  }
}
</script>

<style lang="less">
.ant-checkbox-group{
    display:block;
}
</style>
