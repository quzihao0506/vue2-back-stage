<template>
  <div>
    <el-card>
      <category-select
        @getCategory="getCategory"
        :show="!showTable"
      ></category-select>
    </el-card>

    <el-card style="marginTop: 15px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="marginBottom: 15px"
        @click="addAttr"
        :disabled="!categoryId3"
      >添加属性</el-button>
      <el-table
        :data="attrData"
        style="width: 100%"
        border
        v-if="showTable"
      >
        <el-table-column
          type="index"
          label="序号"
          width="60"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="attrName"
          label="属性名称"
          width="220"
        >
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{row}">
            <div v-if="row.attrValueList">
              <el-tag
                type="success"
                v-for="attr in row.attrValueList"
                :key="attr.id"
                style="marginRight: 5px; marginBottom: 5px"
              >{{attr.valueName}}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="220"
        >
          <template slot-scope="{row}">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateAttr(row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-else>
        <el-form
          :inline="true"
          ref="formName"
          class="demo-form-inline"
          :model="attrInfo"
        >
          <el-form-item
            prop="attrName"
            label="属性名"
            :rules="{ required: true, message: '属性名不能为空'},"
          >
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addAttrValueClick"
              :disabled="!attrInfo.attrName"
            >添加属性值</el-button>
            <el-button plain>取消</el-button>
          </div>
          <el-table
            style="width: 100%; marginTop: 15px"
            border
            :data="attrInfo.attrValueList"
          >
            <el-table-column
              label="序号"
              width="60"
              type="index"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="属性值名称"
            >
              <template slot-scope="{row, $index}">
                <el-form-item
                  v-if="row.flag"
                  style="width: 100%"
                  :prop="'attrValueList.' + $index + '.valueName'"
                  :rules="{
      required: true, message: '域名不能为空', trigger: 'blur'
    }"
                >
                  <el-input
                    size="mini"
                    v-model="row.valueName"
                    placeholder="请输入属性值名称"
                    @blur="blurAttrValue(row, $index)"
                    @keyup.native.enter="blurAttrValue(row, $index)"
                    :ref='$index'
                  ></el-input>
                </el-form-item>
                <span
                  @click="toEdit(row, $index)"
                  style="display: block"
                  v-else
                >{{row.valueName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="180"
              label="操作"
            >
              <template slot-scope="{row,$index}">
                <el-popconfirm
                  :key="row.id"
                  :title="`确认删除${row.valueName}吗？`"
                  @onConfirm="deleteAttrValue($index)"
                >
                  <el-button
                    size="mini"
                    type="danger"
                    slot="reference"
                  >删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <div style="marginTop: 15px">
            <el-button
              type="primary"
              @click="saveAttr"
              :disabled="attrInfo.attrValueList.length <= 0"
            >保存</el-button>
            <el-button plain>取消</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      categoryId1: null,
      categoryId2: null,
      categoryId3: null,
      attrData: [],
      showTable: true,
      attrInfo: {
        attrName: '',
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }
    }
  },
  methods: {
    getCategory(form) {
      const { categoryId1, categoryId2, categoryId3 } = form
      this.categoryId1 = categoryId1
      this.categoryId2 = categoryId2
      this.categoryId3 = categoryId3
      this.getAttrList()
    },
    async getAttrList() {
      const { categoryId1, categoryId2, categoryId3 } = this
      const res = await this.$API.attr.reqAttrList(categoryId1, categoryId2, categoryId3)

      if (res.code === 200) {
        this.attrData = res.data
      }
    },
    addAttr() {
      this.showTable = false
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.categoryId3,
        categoryLevel: 3
      }
    },
    updateAttr(row) {
      this.showTable = false
      // 由于数据结构中存在对象嵌套数组，数组嵌套对象
      row.attrValueList.forEach(item => {
        item.flag = false
      });
      this.attrInfo = cloneDeep(row)
      // 或者
      // this.attrInfo.attrValueList.forEach(item => {
      //   this.$set(item, 'flag', false)
      // })
    },
    saveAttr() {
      this.$refs.formName.validate(async (valid) => {
        if (!valid) return
        this.attrInfo.attrValueList.forEach(item => delete item.flag)
        try {
          await this.$API.attr.reqAddAttr(this.attrInfo)
          this.$message.success(this.attrInfo.id ? '修改成功' : '新增成功')
          this.showTable = true
          this.getAttrList()
        } catch (error) {
          this.$message.error('保存失败')
        }
      });
      // this.showTable = true
    },
    blurAttrValue(row, index) {
      if (!row.valueName.trim()) return
      const isRepeat = this.attrInfo.attrValueList.filter((item, i) => i !== index).some(item => item.valueName === row.valueName)
      if (isRepeat) return this.$message.warning('属性值不能重复')
      row.flag = false
    },
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 目前版本中的版本号2.13.x
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    addAttrValueClick() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    }
  }
}
</script>

<style>
</style>