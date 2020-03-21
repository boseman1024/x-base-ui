<template>
  <a-card :bordered="false">
    <result type="success" :title="title">
      <template slot="action">
        <a-button type="primary" @click="goback">返回</a-button>
      </template>
    </result>
  </a-card>
</template>

<script>
import { Result } from '@/components'

export default {
  name: 'Success',
  components: {
    Result
  },
  data () {
    return {
      title: '操作成功',
    }
  },
  methods:{
    goback(){
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
</style>