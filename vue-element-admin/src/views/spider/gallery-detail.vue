<template>
  <div>
    <div class="info">
      <span>相册名称：{{ info.galleryName }}</span>
      <span>作者：{{ info.author }}</span>
      <span>url：{{ info.galleryURL }}</span>
      <span>photoCount：{{ info.photoCount }}</span>
    </div>
    <div>Total: {{ list.length }}</div>
    <ul class="list">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="item"
      ><img :src="item.img"></li>

    </ul>
  </div>
</template>

<script>
import { fetchGalleryDetail } from '../../api/spider'
export default {
  name: 'GalleryDetail',
  data() {
    return {
      list: [],
      info: {}
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  methods: {
    fetchData(id) {
      fetchGalleryDetail(id)
        .then(res => {
          this.list = res.data.photoList
          this.info = res.data.galleryInfo
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .info {
    margin: 20px;
    span {
      margin: 0 10px;
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
  }
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 300px;
    background: #ccc;
    margin: 20px;
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>

