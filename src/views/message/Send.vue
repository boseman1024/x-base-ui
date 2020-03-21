<template>
  <div>
    <a-card :bordered="false">
      <a-form :form="form">
        <a-form-item label="标题" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
          <a-input
            v-decorator="[
                  'title',
                  {rules: [{ required: true, message: '请输入标题' }]}
            ]"
            placeholder="标题"></a-input>
        </a-form-item>
        <a-form-item label="内容" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
          <wang-editor
            v-decorator="[
                  'content',
                  {rules: []}
            ]"
            @change="changeContent"></wang-editor>
        </a-form-item>
        <a-form-item label="发送至" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
          <a-radio-group 
            v-decorator="[
              'type',
              {rules: [{ required: true, message: '请选择发送至类型' }]}
            ]">
              <a-radio :value="'0'">当前在线用户</a-radio>
              <a-radio :value="'1'">所有用户</a-radio>
              <a-radio :value="'2'">指定用户</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="状态" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
          <a-radio-group 
            v-decorator="[
              'state',
              {rules: [{ required: true, message: '请选择状态' }]}
            ]">
              <a-radio :value="'0'">草稿</a-radio>
              <a-radio :value="'1'">发布</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 22, offset: 2 }">
          <a-button type="primary" @click="save" :loading="saveLoading">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import WangEditor from '@/components/Editor/WangEditor'
import { saveMsg } from '@/api/msg'
import { mapGetters } from 'vuex'
export default {
  components: {
    WangEditor
  },
  data () {
    return {
      form:this.$form.createForm(this),
      saveLoading:false
    }
  },
  computed: {
    ...mapGetters(['username'])
  },
  mounted () {
    
  },
  methods: {
    changeContent(val){
      this.form.setFieldsValue({
         content: val
      })
    },
    save(){
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.saveLoading = true
        values.sender = this.username
        saveMsg(values).then((res)=>{
          if(res.code==200&&res.data){
              this.$message.success('保存成功')
              this.$router.push({name:'MessageSuccess'})
          }else{
              this.$message.error('保存失败，请重试')
          }
          this.saveLoading = false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
