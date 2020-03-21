<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :md="4">
        <a-spin :spinning="treeLoading">
          <a-button style="width:100%;" type="dashed" @click="handleAdd">新增</a-button>
          <a-divider>字典</a-divider>
          <a-tree 
            v-if="treeData.length" 
            defaultExpandAll
            :treeData="treeData" 
            :replaceFields="treeProps" 
            draggable 
            @select="handleSelect" 
            @drop="move"></a-tree>
        </a-spin>
      </a-col>
      <a-col :md="20">
        <s-table 
          ref="table" 
          size="default" 
          rowKey="id" 
          bordered 
          :columns="columns" 
          :data="loadData">
          <p slot="expandedRowRender" slot-scope="record">{{record.description}}</p>
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称" hasFeedback>
            <a-input 
              v-decorator="[
                'label',
                {rules: [{ required: true, message: '请输入名称' }]}
              ]"
              placeholder="请输入名称"/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="编码" hasFeedback>
            <a-input 
              v-decorator="[
                'code',
                {rules: [{ required: true, validator:checkDictCode}]}
              ]"
              placeholder="请输入编码"/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="值" hasFeedback>
            <a-input 
              v-decorator="[
                'value',
                {rules: [{ required: true, message: '请输入值'}]}
              ]"
              placeholder="请输入值"/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
            <a-radio-group 
              v-decorator="[
                'type',
                {rules: [{ required: true, message: '请选择类型' }]}
              ]">
                <a-radio :value="'0'">类型1</a-radio>
                <a-radio :value="'1'">类型2</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-if="opType==1" label="上级字典" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input :placeholder="curData.label" disabled/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述" hasFeedback>
            <a-textarea 
              v-decorator="[
                'description',
                {rules: []}
              ]"
              placeholder="请输入描述" 
              :autosize="{ minRows: 2, maxRows: 6 }" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序" hasFeedback>
            <a-input-number 
              v-decorator="[
                'sort',
                {rules: []}
              ]"
              placeholder="请输入排序"/>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getDictTree,getDict,delDict,saveDict,updateDict,getDictChild ,getDictList,checkDictCode} from '@/api/system'
export default {
  name: 'DictList',
  components: {
    STable
  },
  data () {
    return {
      description: '',
      visible: false,
      loading:false,
      treeLoading:false,
      treeProps:{children:'children', title:'label', key:'id'},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      treeData:[],
      form: this.$form.createForm(this),
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'label'
        },
        {
          title: '编码',
          dataIndex: 'code'
        },
        {
          title: '值',
          dataIndex: 'value'
        },
        {
          title: '类型',
          dataIndex: 'type'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 查询参数
      queryParam: {pid:''},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getDictList(Object.assign(parameter, this.queryParam)).then(res => {
            return res.data
          })
      },
      opType:1,
      curData:{},
      editData:{}
    }
  },
  filters: {

  },
  created () {
    this.initTree()
  },
  methods: {
    initTree(){
      this.treeLoading = true
      getDictTree(0).then(res => {
        this.treeData = [{id:0,label:'根',value:0,children:res.data}]
        this.treeLoading = false
      })
    },
    move(event){
      const temp = {id:event.dragNode.eventKey,pid:event.node.eventKey}
      updateDict(temp).then(res=>{
          if(res.code==200&&res.data!=null){
            this.initTree()
            this.$refs.table.refresh(true)
            this.$message.success('移动成功')
          }else{
            this.$message.error('移动失败，请重试')
          }
      })
    },
    handleSelect(selectedKeys, e){
      this.curData = {label:e.node.label,id:e.node.eventKey}
      this.queryParam.pid = e.node.eventKey
      this.$refs.table.refresh(true)
    },
    handleAdd(){
      this.opType = 1
      if(!this.curData.id){
        this.curData = this.treeData[0]
      }
      this.$nextTick(() => {
        this.form.resetFields()
        this.form.setFieldsValue({})
      })
      this.visible = true
    },
    handleEdit (record) {
      this.opType = 2
      this.loading = true
      getDict(record.id).then(res=>{
        this.editData = {label:res.data.label,id:res.data.id,code:res.data.code,pid:res.data.pid}
        this.$nextTick(() => {
          this.form.resetFields()
          this.form.setFieldsValue({
            code:res.data.code,
            label:res.data.label,
            value:res.data.value,
            type:res.data.type,
            sort:res.data.sort,
            description:res.data.description,
          })
        })
        this.loading = false
      })
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        if(this.opType==1){
          values.pid = this.curData.pid
          saveDict(values).then(res=>{
            if(res.code==200&&res.data!=null){
              this.$refs.table.refresh(true)
              this.initTree()
              this.form.resetFields()
              this.$message.success('添加成功')
            }else{
              this.$message.error('添加失败，请重试')
            }
            this.loading = false
            this.visible = false
          })
        }
        if(this.opType==2){
          values.id = this.editData.id
          updateDict(values).then(res=>{
            if(res.code==200&&res.data!=null){
              this.$refs.table.refresh(true)
              this.initTree()
              this.form.resetFields()
              this.$message.success('修改成功')
            }else{
              this.$message.error('修改失败，请重试')
            }
            this.loading = false
            this.visible = false
          })
        }
      })
    },
    handleDel(record){
      const _this = this
      this.$confirm({
          title: '删除字典：'+record.label,
          content: '该操作无法撤销，是否继续？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            delDict(record.id).then(res=>{
              if(res.code==200&&res.data){
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
                this.initTree()
              }else{
                _this.$message.error('删除失败，请重试')
              }
            })
          },
          onCancel() {}
      })
    },
    checkDictCode(rule, value, callback){
      if(!value){
        callback(new Error('请输入字典标志'))
        return
      }
      if(value==this.editData.code){
        callback()
        return
      }
      checkDictCode(value).then(res=>{
        if(res.data){
          callback(new Error('编码已存在'))
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
