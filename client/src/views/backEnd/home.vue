<template>
  <pk-layout>
    <i-row :gutter="20">
      <i-col span="8" style="height: 120px;padding-bottom: 10px;">
        <info-card shadow color="#2d8cf0" icon="md-person-add" :icon-size="36">
          <count-to :end="data.adminNum" style="font-size: 50px;"/>
          <p>管理员人数</p>
        </info-card>
      </i-col>
      <i-col span="8" style="height: 120px;padding-bottom: 10px;">
        <info-card shadow color="#19be6b" icon="ios-people" :icon-size="36">
          <count-to :end="data.teacherNum" style="font-size: 50px;"/>
          <p>教师人数</p>
        </info-card>
      </i-col>
      <i-col span="8" style="height: 120px;padding-bottom: 10px;">
        <info-card shadow color="#ff9900" icon="md-school" :icon-size="36">
          <count-to :end="data.instituteNum" style="font-size: 50px;"/>
          <p>学院数量</p>
        </info-card>
      </i-col>
    </i-row>
    <i-row :gutter="20">
      <i-col span="8" style="height: 120px;padding-bottom: 10px;">
        <info-card shadow color="#ed3f14" icon="md-school" :icon-size="36">
          <count-to :end="data.majorNum" style="font-size: 50px;"/>
          <p>专业数量</p>
        </info-card>
      </i-col>
      <i-col span="8" style="height: 120px;padding-bottom: 10px;">
        <info-card shadow color="#e46cbb" icon="ios-stats" :icon-size="36">
          <count-to :end="data.classNum" style="font-size: 50px;"/>
          <p>班级数量</p>
        </info-card>
      </i-col>
      <i-col span="8" style="height: 120px;padding-bottom: 10px;">
        <info-card shadow color="#9a66e4" icon="md-book" :icon-size="36">
          <count-to :end="data.coursesNum" style="font-size: 50px;"/>
          <p>课程数量</p>
        </info-card>
      </i-col>
    </i-row>
    <i-row :gutter="20">
      <i-col span="8" style="height: 120px;padding-bottom: 10px;">
        <info-card shadow color="#fa1356" icon="md-home" :icon-size="36">
          <count-to :end="data.classroomData.length" style="font-size: 50px;"/>
          <p>教室数量</p>
        </info-card>
      </i-col>
    </i-row>
    <i-row :gutter="20">
      <i-col span="12" style="padding-bottom: 10px;">
        <i-card>
          <div ref="classroom" id="classroom" style="height: 200px;width: 100%;"></div>
        </i-card>
      </i-col>
      <i-col span="12" style="height: 120px;padding-bottom: 10px;">
        <i-card>
          <div ref="teachTask" id="teachTask" style="height: 200px;width: 100%;"></div>
        </i-card>
      </i-col>
    </i-row>
  </pk-layout>
</template>

<script>
import InfoCard from '../../components/info-card/info-card'
import CountTo from '../../components/count-to'
import { statistics } from 'api/temporary.js'
import echarts from 'echarts'
export default {
  components: {
    InfoCard,
    CountTo
  },
  data () {
    return {
      data: {
        adminNum: '',
        classNum: '',
        classroomData: '',
        coursesNum: '',
        instituteNum: '',
        majorNum: '',
        teacherNum: '',
        teachTaskData: ''
      }
    }
  },
  methods: {
    drawClassroom () {
      let classroom = echarts.init(this.$refs.classroom)
      classroom.setOption({
        title: { text: '可用教室与不可用教室占比', x: 'center' },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'left',
          orient: 'vertical',
          data: ['可用', '不可用']
        },
        series: [
          {
            name: '占比情况',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {
                value: this.data.classroomData.filter(item => item.classroomStatus === 1).length,
                name: '可用'
              },
              {
                value: this.data.classroomData.filter(item => item.classroomStatus === 0).length,
                name: '不可用'
              }
            ]
          }
        ]
      })
    },
    drawTeachTask () {
      let teachTask = echarts.init(this.$refs.teachTask)
      teachTask.setOption({
        title: { text: '已排教学任务和未排教学任务占比', x: 'center' },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'left',
          orient: 'vertical',
          data: ['已排', '未排']
        },
        series: [
          {
            name: '排课情况',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {
                value: this.data.teachTaskData.filter(item => item.isArranged === 0).length,
                name: '未排'
              },
              {
                value: this.data.teachTaskData.filter(item => item.isArranged === 1).length,
                name: '已排'
              }
            ]
          }
        ]
      })
    }
  },
  mounted () {
    statistics().then(res => {
      Object.assign(this.data, res.data)
      this.drawClassroom()
      this.drawTeachTask()
    })
  }
}
</script>
