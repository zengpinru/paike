<template>
  <pk-layout>
    <!-- 排课面板 -->
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>排课面板</i-breadcrumb-item>
      </i-breadcrumb>
      <div class="panel">
        <i-form :label-width="165">
          <i-form-item label="周学时为4出现的时间段：">
            <i-select v-model="fourTime" multiple>
              <i-option v-for="t in time" :value="t" :key="t">{{ t }}</i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="周学时为3出现的时间段：">
            <i-select v-model="threeTime" multiple>
              <i-option v-for="t in time" :value="t" :key="t">{{ t }}</i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="周学时为2不出现的时间段：">
            <i-select v-model="towTime" multiple>
              <i-option v-for="t in time" :value="t" :key="t">{{ t }}</i-option>
            </i-select>
          </i-form-item>
        </i-form>
        <div ref="pieChart" id="pieChart"></div>
        <div ref="myChart" id="myChart"></div>
        <i-button type="warning" @click="resetData" class="paikeBtn">重置数据</i-button>
        <i-button type="primary" @click="handleClick" class="paikeBtn">自动排课</i-button>
        <i-button type="success" @click="save" class="saveBtn">将数据同步到总表</i-button>
        <Spin fix v-if="showSpin">
          <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
          <div>排课中...</div>
        </Spin>
      </div>
    </i-card>
  </pk-layout>
</template>

<script>
import { getAllClassroom } from 'api/classroom.js'
import { getTeachTaskByTerm } from 'api/teachTask.js'
import { addTemporary, getCheckList, resetData } from 'api/temporary.js'
import echarts from 'echarts'

export default {
  data () {
    return {
      classroomData: [],
      teachTaskData: [],
      teachTaskDataed: [],
      checkList: [],
      result: [],
      time: [
        '11', '12', '13', '14', '15',
        '21', '22', '23', '24', '25',
        '31', '32', '33', '34', '35',
        '41', '42', '43', '44', '45',
        '51', '52', '53', '54', '55'
      ],
      fourTime: [
        '11', '21', '31', '41', '51',
        '12', '22', '32', '42', '52',
        '13', '23', '33', '43', '53'
      ],
      threeTime: [
        '13', '23', '33', '43', '53',
        '15', '25', '35', '45', '55'
      ],
      towTime: [],
      showSpin: false
    }
  },
  computed: {
    twoClassHours () {
      return this.teachTaskData.filter(item => {
        return item.weekClassHours === 2
      })
    },
    threeClassHours () {
      return this.teachTaskData.filter(item => {
        return item.weekClassHours === 3
      })
    },
    fourClassHours () {
      return this.teachTaskData.filter(item => {
        return item.weekClassHours === 4
      })
    }
  },
  methods: {
    resetData () {
      this.$Modal.confirm({
        title: '提示信息',
        content: '确定要重置数据吗?',
        onOk: () => {
          resetData().then(res => {
            this.$Message.success({ content: '重置数据成功!' })
            this.getData()
          }).catch(err => {
            console.log(err)
            this.$Message.error({ content: '重置数据失败!' })
          })
        }
      })
    },
    drawPieChart () {
      let pieChart = echarts.init(this.$refs.pieChart)
      pieChart.setOption({
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
              { value: this.teachTaskData.length, name: '未排' },
              { value: this.teachTaskDataed.length, name: '已排' }
            ]
          }
        ]
      })
    },
    drawChart (seriesData) {
      let myChart = echarts.init(this.$refs.myChart)
      myChart.setOption({
        title: { text: '排课资源使用情况(x轴: 时间;y轴: 教室)' },
        tooltip: {},
        xAxis: {
          data: this.time
        },
        yAxis: {
          max: this.classroomData.length
        },
        series: [{
          name: '比例',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#2d8cf0'
            }
          },
          data: this.setSeriesData(seriesData)
        }]
      })
    },
    setSeriesData (data) {
      return data.map(item => {
        return item.classroomId.length
      })
    },
    /**
     * 对周学时为2的课程进行排课
     */
    handleTwoClassHours () {
      let checkListAtDay = this.checkList.filter(item => { // 排除掉晚上的时间段
        return !this.towTime.includes(item.time)
      })
      for (let i = 0; i < this.twoClassHours.length; i++) { // 遍历教学任务
        // 刷选出能容纳班级人数的教室
        let classroom = this.classroomData.filter(item => {
          return item.classroomCapacity >= this.twoClassHours[i].classStuNum
        })
        let freeClassroom = null
        let checkList = [...checkListAtDay]
        while (true) {
          let j = Math.round(Math.random() * (checkList.length - 1)) // 随机挑一个时间段
          // 判断该时间段该班级该老师是否有课
          if (!checkList[j].classId.includes(this.twoClassHours[i].classId) && !checkList[j].teacherNum.includes(this.twoClassHours[i].teacherNum)) {
            // 刷选出该时间段空闲的教室
            freeClassroom = classroom.filter(item => {
              return !checkList[j].classroomId.includes(item.classroomId)
            })
            if (freeClassroom.length !== 0) { // 该时间段有空闲的教室
              let freeClassroomIndex = Math.round(Math.random() * (freeClassroom.length - 1)) // 在空闲教室中随机获取一个
              checkList[j].classId.push(this.twoClassHours[i].classId)
              checkList[j].teacherNum.push(this.twoClassHours[i].teacherNum)
              checkList[j].classroomId.push(freeClassroom[freeClassroomIndex].classroomId)
              this.twoClassHours[i].time = checkList[j].time // 分配时间
              this.twoClassHours[i].classroomNum = freeClassroom[freeClassroomIndex].classroomNum // 分配教室
              this.result.push(this.twoClassHours[i])
              break
            } else {
              checkList.splice(j, 1)
            }
          } else {
            checkList.splice(j, 1)
          }
        }
      }
    },
    /**
     * 对周学时为4的课程进行排课
     */
    handleFourClassHours () {
      let checkListAtDay = this.checkList.filter(item => { // 排除掉晚上的时间段
        return this.fourTime.includes(item.time)
      })
      for (let i = 0; i < this.fourClassHours.length; i++) {
        // 刷选出能容纳班级人数的教室
        let classroom = this.classroomData.filter(item => {
          return item.classroomCapacity >= this.fourClassHours[i].classStuNum
        })
        let freeClassroom = null
        let checkList = [...checkListAtDay]
        while (true) {
          let j = Math.round(Math.random() * (checkList.length - 1)) // 随机挑一个时间段
          let k = checkListAtDay.findIndex(item => { // 这里还可以改善来,利用index索引
            let time = parseInt(checkList[j].time) + 20
            time = time > 60 ? time - 50 : time
            return parseInt(item.time) === time
          })
          if (!checkList[j].classId.includes(this.fourClassHours[i].classId) && !checkList[j].teacherNum.includes(this.fourClassHours[i].teacherNum)) {
            if (!checkListAtDay[k].classId.includes(this.fourClassHours[i].classId) && !checkListAtDay[k].teacherNum.includes(this.fourClassHours[i].teacherNum)) {
              // 筛选出两个时间段都空闲的教室
              freeClassroom = classroom.filter(item => {
                return !checkList[j].classroomId.includes(item.classroomId) && !checkListAtDay[k].classroomId.includes(item.classroomId)
              })
              if (freeClassroom.length !== 0) {
                let freeClassroomIndex = Math.round(Math.random() * (freeClassroom.length - 1)) // 在空闲教室中随机获取一个
                let obj = null

                checkList[j].classId.push(this.fourClassHours[i].classId)
                checkList[j].teacherNum.push(this.fourClassHours[i].teacherNum)
                checkList[j].classroomId.push(freeClassroom[freeClassroomIndex].classroomId)

                checkListAtDay[k].classId.push(this.fourClassHours[i].classId)
                checkListAtDay[k].teacherNum.push(this.fourClassHours[i].teacherNum)
                checkListAtDay[k].classroomId.push(freeClassroom[freeClassroomIndex].classroomId)

                this.fourClassHours[i].time = checkList[j].time // 分配时间
                this.fourClassHours[i].classroomNum = freeClassroom[freeClassroomIndex].classroomNum // 分配教室
                this.result.push(this.fourClassHours[i])

                obj = { ...this.fourClassHours[i] }
                obj.time = checkListAtDay[k].time
                obj.classroomNum = freeClassroom[freeClassroomIndex].classroomNum
                this.result.push(obj)
                break
              } else {
                checkList.splice(j, 1)
              }
            } else {
              checkList.splice(j, 1)
            }
          } else {
            checkList.splice(j, 1)
          }
        }
      }
    },
    /**
     * 对3个学时的课程进行排课
     */
    handleThreeClassHours () {
      let checkListAtDay = this.checkList.filter(item => { // 筛选出上3节课的时间段
        return this.threeTime.includes(item.time)
      })
      for (let i = 0; i < this.threeClassHours.length; i++) {
        // 筛选出能容纳该班级人数的教室
        let classroom = this.classroomData.filter(item => {
          return item.classroomCapacity >= this.threeClassHours[i].classStuNum
        })
        let freeClassroom = null
        let checkList = [...checkListAtDay]
        while (true) {
          let j = Math.round(Math.random() * (checkList.length - 1)) // 随机挑一个时间段
          if (!checkList[j].classId.includes(this.threeClassHours[i].classId) && !checkList[j].teacherNum.includes(this.threeClassHours[i].teacherNum)) {
            if (checkList[j].time.charAt(1) === '5') { // 判断是否选到晚上的时间段
              // 刷选出该时间段空闲的教室
              freeClassroom = classroom.filter(item => {
                return !checkList[j].classroomId.includes(item.classroomId)
              })
              if (freeClassroom.length !== 0) { // 该时间段有空闲的教室
                let freeClassroomIndex = Math.round(Math.random() * (freeClassroom.length - 1)) // 在空闲教室中随机获取一个
                checkList[j].classId.push(this.threeClassHours[i].classId)
                checkList[j].teacherNum.push(this.threeClassHours[i].teacherNum)
                checkList[j].classroomId.push(freeClassroom[freeClassroomIndex].classroomId)
                this.threeClassHours[i].time = checkList[j].time // 分配时间
                this.threeClassHours[i].classroomNum = freeClassroom[freeClassroomIndex].classroomNum // 分配教室
                this.result.push(this.threeClassHours[i])
                break
              } else {
                checkList.splice(j, 1)
              }
            } else { // 选到下午的1-2节
              let k = checkList[j].index + 1 // 下午的3-4节
              // 筛选出下午空闲的教室
              freeClassroom = classroom.filter(item => {
                return !checkList[j].classroomId.includes(item.classroomId) && !this.checkList[k].classroomId.includes(item.classroomId)
              })
              if (freeClassroom.length !== 0) {
                let freeClassroomIndex = Math.round(Math.random() * (freeClassroom.length - 1)) // 在空闲教室中随机获取一个
                checkList[j].classId.push(this.threeClassHours[i].classId)
                checkList[j].teacherNum.push(this.threeClassHours[i].teacherNum)
                checkList[j].classroomId.push(freeClassroom[freeClassroomIndex].classroomId)
                this.checkList[k].classId.push(this.threeClassHours[i].classId)
                this.checkList[k].teacherNum.push(this.threeClassHours[i].teacherNum)
                this.checkList[k].classroomId.push(freeClassroom[freeClassroomIndex].classroomId)
                this.threeClassHours[i].time = checkList[j].time // 分配时间
                this.threeClassHours[i].classroomNum = freeClassroom[freeClassroomIndex].classroomNum // 分配教室
                this.result.push(this.threeClassHours[i])
                break
              } else {
                checkList.splice(j, 1)
              }
            }
          } else {
            checkList.splice(j, 1)
          }
        }
      }
    },
    handleClick () {
      this.$Modal.confirm({
        title: '提示',
        content: '老铁!确定要开始自动排课吗?',
        onOk: () => {
          this.showSpin = true
          if (this.teachTaskData.length !== 0) {
            this.paike().then(() => {
              this.showSpin = false
              this.$Message.success({ content: '排课成功' })
              // this.drawChart(this.checkList)
              this.getData()
            }).catch(err => {
              this.$Message.error({ content: err.message })
            })
          } else {
            this.showSpin = false
            this.$Message.success({ content: '没有课排的教学任务了!' })
          }
        }
      })
    },
    paike () {
      return new Promise((resolve, reject) => {
        try {
          this.result = []
          this.handleThreeClassHours()
          this.handleFourClassHours()
          this.handleTwoClassHours()
          addTemporary({ temporaryData: this.result, checkListData: this.checkList }).then(res => {
            resolve()
          }).catch(err => {
            reject(err)
          })
        } catch (err) {
          reject(err)
        }
      })
    },
    // initCheckList () {
    //   for (let i = 0; i < 25; i++) {
    //     this.checkList.push({
    //       time: this.time[i], // 时间段
    //       classId: [], // 这个时间段已经有课的班级
    //       teacherNum: [], // 这个时间段已经有课的教师
    //       classroomId: [], // 这个时间段已经用掉的教室
    //       index: i
    //     })
    //   }
    // },
    async getData () {
      await getAllClassroom().then(res => {
        this.classroomData = res.data
      }).catch(err => {
        console.log(err)
      })
      await getTeachTaskByTerm().then(res => {
        let data = res.data
        this.teachTaskData = data.filter(item => item.isArranged === 0)
        this.teachTaskDataed = data.filter(item => item.isArranged === 1)
      }).catch(err => {
        console.log(err)
      })
      await getCheckList().then(res => {
        this.checkList = res.data
        this.drawPieChart()
        this.drawChart(res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    save () {
      window.localStorage.data = JSON.stringify(this.result.filter(item => {
        return item.classId === 1
      }))
    }
  },
  mounted () {
    this.getData()
    // this.initCheckList()
  }
}
</script>

<style lang="less">
#myChart {
  height: 200px;
  width: 80%;
}
#pieChart {
  height: 200px;
  width: 80%;
}
.panel {
  min-height: 480px;
  .paikeBtn {
    margin-right: 10px;
  }
  .spin-icon-load{
    animation: ani-spin 1s linear infinite;
  }
  @keyframes ani-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
