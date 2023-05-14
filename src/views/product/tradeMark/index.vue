<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="marginBottom: 15px"
      @click="addDialogClick"
    >添加品牌</el-button>
    <el-table
      style="width: 100%"
      border
      :data="tableData"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
      >
      </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img
            style="width: 50px; height: 50px; object-fit:contain"
            :src="scope.row.logoUrl"
            alt=""
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="240"
      >
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateDialogClick(scope.row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteDialogClick(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="prev, pager, next, jumper, -> , total, sizes"
      :total="total"
      style="text-align:center; marginTop: 15px"
    >
    </el-pagination>
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 :model属性，这个属性的作用是把表单的数据收集到那个对象身上，将来表单验证，需要用到 -->
      <el-form
        style="width: 80%"
        :model="tmForm"
        :rules="rules"
        ref="formName"
      >
        <el-form-item
          label="品牌名称"
          label-width="100px"
          prop="tmName"
        >
          <el-input
            v-model="tmForm.tmName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="品牌LOGO"
          label-width="100px"
          prop="logoUrl"
        >
          <!-- :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload" -->
          <!-- 这里收集数据，不能使用v-model， 是因为不是表单元素 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleImgSuccess"
          >
            <img
              v-if="tmForm.logoUrl"
              :src="tmForm.logoUrl"
              style="object-fit:contain"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
            <div
              slot="tip"
              class="el-upload__tip"
            >只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateTradeMark"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      page: 1,
      limit: 10,
      tableData: [],
      total: null,
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      dialogFormVisible: false,
      rules: {
        tmName: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        logoUrl: [
          { required: true, message: '请输入', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getTradeMarkData()
  },
  methods: {
    async getTradeMarkData() {
      const { page, limit } = this
      const { data } = await this.$API.trademark.reqTradeMarkList(page, limit)
      this.tableData = data.records
      this.total = data.total
    },
    handleSizeChange(val) {
      this.limit = val
      this.getTradeMarkData()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getTradeMarkData()
    },
    addDialogClick() {
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      },
        this.dialogFormVisible = true
    },
    updateDialogClick(row) {
      this.dialogFormVisible = true
      this.tmForm = { ...row }
    },
    deleteDialogClick(id) {
      this.$confirm('此操作将永久删除该品牌, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$API.trademark.reqDeleteTradeMark(id)
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          if (this.tableData.length == 1) {
            this.page = this.page - 1
          }
          this.getTradeMarkData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleImgSuccess(file) {
      this.tmForm.logoUrl = file.data
    },
    addOrUpdateTradeMark() {
      this.$refs.formName.validate(async (valid) => {
        if (!valid) return
        const res = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
        if (res.code == 200) {
          this.$message.success(this.tmForm.id ? '添加品牌成功' : '修改品牌成功')
          this.dialogFormVisible = false
          this.getTradeMarkData()
        }
      });
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>