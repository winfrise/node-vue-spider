<template>
  <div class="app-container">
    <div><el-button type="primary" @click="showAddGalleryDialog">添加相册</el-button></div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->

      <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="相册名称">
        <template slot-scope="scope">
          <span>{{ scope.row.galleryName || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="URL">
        <template slot-scope="scope">
          <span><a :href="scope.row.galleryURL" target="blank">{{ scope.row.galleryURL }}</a></span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" width="500px">
        <template slot-scope="scope">

          <router-link :to="'/spider/gallery-detail/'+scope.row.id" class="control-btn">
            <el-button type="primary" size="small" icon="el-icon-document">
              查看
            </el-button>
          </router-link>

          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleEditGallery(scope.row)"
          >
            修改
          </el-button>

          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="spiderGalleryPhoto(scope.row.id)"
          >
            采集图片
          </el-button>

          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            class="control-btn"
            @click="showDeleteGalleryDialog(scope.row.id)"
          >
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchGalleryList" />
    <!-- 删除相册弹窗 -->
    <el-dialog
      title="删除相册"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <span>确定删除相册</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDeleteGallery">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加相册弹窗 -->
    <el-dialog title="添加相册" :visible.sync="addGalleryDialogVisible">
      <el-form :model="form">
        <el-form-item label="相册地址" :label-width="formLabelWidth">
          <el-input v-model="form.galleryURL" autocomplete="off" required @change="galleryNameChange" />
        </el-form-item>
        <el-form-item label="相册名称" :label-width="formLabelWidth">
          <el-input v-model="form.galleryName" areadonly="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGalleryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGallery">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchGalleryList, deleteGallery, editGallery, spiderGalleryPhoto } from '@/api/spider'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      deleteDialogVisible: false,
      addGalleryDialogVisible: false,
      formLabelWidth: '100px',
      form: {
        id: '',
        galleryURL: '',
        galleryName: ''
      }
    }
  },
  created() {
    this.fetchGalleryList()
  },
  methods: {
    handleEditGallery(row) {
      this.form.id = row.id
      this.form.galleryURL = row.galleryURL
      this.form.galleryName = row.galleryName
      this.addGalleryDialogVisible = true
    },
    /**
     * 获取相册列表
     */
    fetchGalleryList() {
      this.listLoading = true
      fetchGalleryList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /**
     * 显示删除确定弹窗
     */
    showDeleteGalleryDialog(id) {
      this.selectGalleryId = id
      this.deleteDialogVisible = true
    },
    /**
     * 删除相册
     */
    handleDeleteGallery() {
      const id = this.selectGalleryId
      this.deleteDialogVisible = false
      deleteGallery(id)
        .then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchGalleryList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 添国相册
     */
    editGallery() {
      editGallery(this.form)
        .then(res => {
          this.addGalleryDialogVisible = false
          this.fetchGalleryList()
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    /**
     * 显示添加相册弹窗
     */
    showAddGalleryDialog() {
      this.addGalleryDialogVisible = true
    },
    /**
     * 相册url改变后自动生成相册名
     */
    galleryNameChange() {
      // https://xhamster.com/photos/gallery/pretty-chinese-girl-in-public-4651348
      const url = this.form.galleryURL
      const arr = url.split('/')
      const lastPath = arr[arr.length - 1]
      const arr2 = lastPath.split('-')
      arr2.pop()
      const galleryName = arr2.join(' ')
      this.form.galleryName = galleryName
    },
    /**
     * 采集图片
     */
    spiderGalleryPhoto(id) {
      spiderGalleryPhoto(id)
        .then(res => {
          this.$message({
            message: '成功',
            type: 'success'
          })
        })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.control-btn {
  margin: 0 10px;
}
</style>
