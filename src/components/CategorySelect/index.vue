<template>
  <div>
    <el-form
      :inline="true"
      :model="form"
      class="demo-form-inline"
    >
      <el-form-item label="一级分类">
        <el-select
          v-model="form.categoryId1"
          placeholder="请选择"
          @change="getCategory2ListData"
          :disabled="show"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in list1"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="form.categoryId2"
          placeholder="请选择"
          @change="getCategory3ListData"
          :disabled="show"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in list2"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="form.categoryId3"
          placeholder="请选择"
          @change="getCategory"
          :disabled="show"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in list3"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      form: {
        categoryId1: '',
        categoryId2: '',
        categoryId3: ''
      }
    }
  },
  created() {
    this.getCategory1ListData()
  },
  methods: {
    async getCategory1ListData() {
      const res = await this.$API.attr.reqCategory1List()
      if (res.code === 200) {
        this.list1 = res.data
      }
    },
    async getCategory2ListData() {
      this.list2 = []
      this.list3 = []
      this.form.categoryId2 = ''
      this.form.categoryId3 = ''
      const { categoryId1 } = this.form
      const res = await this.$API.attr.reqCategory2List(categoryId1)
      if (res.code === 200) {
        this.list2 = res.data
      }
    },
    async getCategory3ListData() {
      this.list3 = []
      this.form.categoryId3 = ''
      const { categoryId2 } = this.form
      const res = await this.$API.attr.reqCategory3List(categoryId2)
      if (res.code === 200) {
        this.list3 = res.data
      }
    },
    getCategory() {
      this.$emit('getCategory', this.form)
    }
  }
}
</script>

<style>
</style>