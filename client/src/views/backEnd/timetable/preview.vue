<template>
  <pk-layout>
    <!-- 课表预览 -->
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>课表预览</i-breadcrumb-item>
      </i-breadcrumb>
      <i-tabs value="name1">
        <i-tab-pane label="按班级查询" name="name1"><pk-class/></i-tab-pane>
        <i-tab-pane label="按教师查询" name="name2"><pk-teacher/></i-tab-pane>
        <i-tab-pane label="按教室查询" name="name3"><pk-classroom/></i-tab-pane>
      </i-tabs>
    </i-card>
  </pk-layout>
</template>

<script>
import PkClass from '_c/timeTable/PkClass.vue'
import PkTeacher from '_c/timeTable/PkTeacher.vue'
import PkClassroom from '_c/timeTable/PkClassroom.vue'
export default {
  components: {
    PkClass,
    PkTeacher,
    PkClassroom
  }
}
</script>
