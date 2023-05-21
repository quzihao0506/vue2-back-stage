<template>
  <div>
    <el-card>
      <category-select @getCategory="getCategory"></category-select>
    </el-card>
    <el-card style="marginTop: 15px">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="marginBottom: 15px"
          @click="addSpu"
        >添加SPU</el-button>
        <el-table
          :data="spuList"
          style="width: 100%"
          border
        >
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="260"
          >
            <template>
              <high-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加"
              >
              </high-button>
              <high-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="updateSpu"
              >
              </high-button>
              <high-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看"
              >
              </high-button>
              <high-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
              >
              </high-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <spu-form v-show="scene === 1"></spu-form>
      <sku-form v-show="scene === 2"></sku-form>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './comps/SpuForm.vue'
import SkuForm from './comps/SkuForm.vue'
export default {
  name: 'Spu',
  data() {
    return {
      categoryId3: 0,
      page: 1,
      limit: 10,
      spuList: [],
      scene: 0
    }
  },
  components: {
    SpuForm,
    SkuForm
  },
  methods: {
    getCategory({ categoryId3 }) {
      this.categoryId3 = categoryId3
      this.getSpuList()
    },
    async getSpuList() {
      const { page, limit, categoryId3 } = this
      const res = await this.$API.spu.reqSpuList(page, limit, categoryId3)
      if (res.code === 200) {
        this.spuList = res?.data?.records
      }
    },
    addSpu() {
      this.scene = 1
    },
    updateSpu() {
      this.scene = 1
    }
  }
}
</script>

<style>
</style>