<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24" justify="space-between">
          <a-col :md="8" :sm="24">
            <a-form-item label="昵称">
              <a-input v-model="queryParam.nickname" placeholder="请输入昵称"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="queryParam.state" placeholder="请选择" allowClear>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="1">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="18">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="queryParam={}">重置</a-button>
            </span>
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
      <a-col :md="4">
        <a-spin :spinning="treeLoading">
          <a-tree 
            v-if="treeData.length" 
            :treeData="treeData" 
            defaultExpandAll 
            :replaceFields="treeProps" 
            @select="handleSelect"></a-tree>
        </a-spin>
      </a-col>
      <a-col :md="20">
        <s-table 
          ref="table" 
          size="default" 
          rowKey="userId" 
          bordered 
          :columns="columns" 
          :data="loadData">
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>
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

    <a-modal 
             title="操作"
             style="top: 20px;" 
             :width="800" 
             v-model="visible" 
             @ok="handleOk" 
             destroyOnClose
             :confirmLoading="loading">
      <a-spin :spinning="loading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号" hasFeedback >
            <a-input 
              v-decorator="[
                'username',
                {rules: [{ required: opType==1, message: '请输入账号' },{validator:checkUsername}], validateTrigger: ['blur']}
              ]"
              placeholder="请输入账号" 
              :disabled="opType==2" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="昵称" hasFeedback >
            <a-input 
              v-decorator="[
                'nickname',
                {rules: [{ required: true, message: '请输入昵称' }]}
              ]"
             placeholder="请输入昵称"/>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="密码" hasFeedback >
            <a-input-password 
              v-decorator="[
                'password',
                {rules: [{ required: (opType==1||isResetPwd), message: '请输入密码' }]}
              ]"
              placeholder="请输入密码" 
              :disabled="opType==2&&!isResetPwd"/>
            <div v-if="opType==2"><span>修改密码？</span><a-switch :defaultChecked="isResetPwd" @change="isResetPwd=!isResetPwd" /></div>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系方式" hasFeedback >
            <a-input 
              v-decorator="[
                'phone',
                {rules: []}
              ]"
              placeholder="请输入联系方式"/>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="部门" hasFeedback >
            <a-tree-select 
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" 
              :treeData="treeData" 
              placeholder="请选择部门" 
              treeDefaultExpandAll
              v-decorator="[
                'deptId',
                {rules: [{ required: true, message: '请选择部门' }]}
              ]"
              @change="changeDept"></a-tree-select>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色" hasFeedback >
            <a-select 
              v-decorator="[
                  'roles',
                  {rules: []}
              ]"
              mode="multiple" 
              placeholder="请选择角色">
              <a-select-option v-for="role in roleOpt" :key="role.roleId" :value="role.roleId">{{role.name}}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
            <a-radio-group 
              v-decorator="[
                  'state',
                  {rules: [{ required: true, message: '请选择状态' }]}
              ]">
              <a-radio :value="'0'">正常</a-radio>
              <a-radio :value="'1'">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getUserList,getUserDetail, getUser,saveUser,delUser,updateUser,getDeptTree,getRoleList,checkUsername} from '@/api/system'

export default {
  name: 'UserList',
  components: {STable},
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      visible: false,
      loading:false,
      treeLoading:false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      roleOpt:[],
      treeProps:{children:'children', title:'label', key:'id'},
      treeData:[],
      // 表头
      columns: [
        {
          title: '账号',
          dataIndex: 'username'
        },
        {
          title: '昵称',
          dataIndex: 'nickname'
        },
        {
          title: '联系方式',
          dataIndex: 'phone'
        },
        {
          title: '状态',
          dataIndex: 'state'
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 查询参数
      queryParam: {deptId:''},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      },
      opType:1,
      isResetPwd:false,
      curUserId:''
    }
  },
  created () {
    this.treeLoading = true
    getDeptTree(0).then(res => {
        this.treeData = res.data
        this.treeLoading = false
    })
  },
  methods: {
    handleSelect(selectedKeys, e){
      this.queryParam.deptId = e.node.value
      this.$refs.table.refresh(true)
    },
    search(){
      this.$refs.table.refresh(true)
    },
    changeDept(value, label, extra){
      this.$set(this.form,'roles',[])
      this.form.setFieldsValue({
         roles: []
      })
      this.getRoleList(value)
    },
    getRoleList(deptId){
      getRoleList({deptId:deptId}).then(res=>{
        this.roleOpt = res.data
      })
    },
    handleAdd(){
      this.opType = 1
      this.visible = true
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue({deptId:this.queryParam.deptId,state:'0'})
      })
      this.getRoleList(this.queryParam.deptId)
      
    },
    handleEdit (record) {
      this.opType = 2
      this.isResetPwd = false
      this.loading = true
      this.visible = true
      getUserDetail(record.username).then(res=>{
        this.getRoleList(res.data.dept.deptId)
        this.$nextTick(() => {
          this.form.resetFields()
          this.form.setFieldsValue({
            username:res.data.sysUser.username,
            nickname:res.data.sysUser.nickname,
            phone:res.data.phone,
            roles:res.data.roles,
            deptId:res.data.dept.deptId+'',
            state:res.data.sysUser.state
          })
        })
        this.curUserId = res.data.sysUser.userId
        this.loading = false
      })
      
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        values.roles = values.roles?values.roles.join(','):''
        if(this.opType==1){
          saveUser(values).then(res=>{
            if(res.code==200&&res.data!=null){
              this.$refs.table.refresh(true)
              this.$message.success('添加成功')
            }else{
              this.$message.error('添加失败，请重试')
            }
            this.loading = false
            this.visible = false
            this.form.resetFields()
          })
        }
        if(this.opType==2){
          values.userId = this.curUserId
          values.password = this.isResetPwd?values.password:null
          updateUser(values).then(res=>{
            if(res.code==200&&res.data!=null){
              this.$refs.table.refresh(true)
              this.$message.success('修改成功')
            }else{
              this.$message.error('修改失败，请重试')
            }
            this.loading = false
            this.visible = false
            this.form.resetFields()
          })
        }
      })
    },
    handleDel(record){
      const _this = this
      this.$confirm({
          title: '删除用户：'+record.nickname,
          content: '该操作无法撤销，是否继续？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            delUser(record.userId).then(res=>{
              if(res.code==200&&res.data){
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
              }else{
                _this.$message.error('删除失败，请重试')
              }
            })
          },
          onCancel() {}
      })
    },
    checkUsername(rule, value, callback){
      checkUsername(value).then(res=>{
        if(res.data){
          callback(new Error('账号已存在'))
        }else{
          callback()
        }
      })
    }
  },
  watch: {
    
  }
}
</script>
<style lang="less">

</style>
