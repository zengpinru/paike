<template>
  <div class="index">
    <i-tabs value="name1">
      <i-tab-pane label="按班级查询" name="name1"><pk-class/></i-tab-pane>
      <i-tab-pane label="按教师查询" name="name2">标签二的内容</i-tab-pane>
      <i-tab-pane label="按教室查询" name="name3">标签三的内容</i-tab-pane>
    </i-tabs>
  </div>
</template>

<script>
import PkClass from '_c/timeTable/PkClass.vue'

export default {
  components: {
    PkClass
  }
}
</script>

<style lang="less">
.index {
  min-height: 100%;
  background: #fff;
  .ivu-tabs-nav-scroll {
    .ivu-tabs-nav {
      float: none;
      width: 354px;
      margin: auto;
    }
  }
}
</style>
