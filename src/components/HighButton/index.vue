<template>
  <el-tooltip
    class="item"
    effect="dark"
    :content="title"
    placement="top"
  >
    <el-button
      v-bind="$attrs"
      v-on="$listeners"
    ></el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: "HighButton",
  props: ['title']
}
</script>

<style>
</style>