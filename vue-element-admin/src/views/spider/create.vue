<template>
  <div>
    <el-input v-model="url" placeholder="请输入地址" />
    <el-button type="primary" @click="submitUrl">主要按钮</el-button>
  </div>
</template>

<script>

export default {
  name: 'CreateArticle',
  components: { },
  data() {
    return {
      url: ''
    }
  },
  methods: {
    submitUrl() {
      if (!this.url) {
        this.$message({
          message: 'url 不能为空',
          type: 'warning'
        })
        return
      }
      alert(this.url)
    }
  }
}
</script>

