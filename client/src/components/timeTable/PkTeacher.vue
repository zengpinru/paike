<template>
  <div>
    <div class="my-form">
      <i-form :model="formItem" inline :label-width="50">
        <i-form-item label="学院：">
          <i-select v-model="formItem.instituteId" placeholder="请选择学院" @on-change="handleInstituteChange" style="width: 200px;">
            <i-option v-for="item in instituteList" :key="item.instituteId" :value="item.instituteId">
              {{ item.instituteName }}
            </i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="教师：">
          <i-select v-model="formItem.teacherNum" placeholder="请选择教师" @on-change="handleTeacherChange" style="width: 200px;">
            <i-option v-for="item in teacherList" :key="item.teacherId" :value="item.teacherNum">
              {{ item.teacherName }}
            </i-option>
          </i-select>
        </i-form-item>
        <i-form-item class="export-btn">
          <i-button type="primary" @click="confirmExportCsv">导出</i-button>
        </i-form-item>
      </i-form>
    </div>
    <i-row :gutter="16">
      <i-col span="24">
        <i-table
          ref="timeTable"
          :data="data"
          :columns="columns"
          border
        >
          <template slot="c1" slot-scope="{ row }">
            <div>{{ row.c1.coursesName }}</div>
            <div>{{ row.c1.className }}</div>
            <div>{{ row.c1.classroomNum }}</div>
            <div>{{ row.c1.weekTimes }}</div>
          </template>
          <template slot="c2" slot-scope="{ row }">
            <div>{{ row.c2.coursesName }}</div>
            <div>{{ row.c2.className }}</div>
            <div>{{ row.c2.classroomNum }}</div>
            <div>{{ row.c2.weekTimes }}</div>
          </template>
          <template slot="c3" slot-scope="{ row }">
            <div>{{ row.c3.coursesName }}</div>
            <div>{{ row.c3.className }}</div>
            <div>{{ row.c3.classroomNum }}</div>
            <div>{{ row.c3.weekTimes }}</div>
          </template>
          <template slot="c4" slot-scope="{ row }">
            <div>{{ row.c4.coursesName }}</div>
            <div>{{ row.c4.className }}</div>
            <div>{{ row.c4.classroomNum }}</div>
            <div>{{ row.c4.weekTimes }}</div>
          </template>
          <template slot="c5" slot-scope="{ row }">
            <div>{{ row.c5.coursesName }}</div>
            <div>{{ row.c5.className }}</div>
            <div>{{ row.c5.classroomNum }}</div>
            <div>{{ row.c5.weekTimes }}</div>
          </template>
        </i-table>
      </i-col>
    </i-row>
  </div>
</template>

<script>
import timeTableData from './timeTableDataTeacher.js'
import { getInstitute } from 'api/institute.js'
import { getTeacherByInstituteId } from 'api/teacher.js'
import { getTemporaryByTeacherNum } from 'api/temporary.js'

export default {
  data () {
    return {
      formItem: {
        instituteId: '',
        teacherNum: ''
      },
      instituteList: [],
      teacherList: [],
      data: [],
      columns: [
        {
          title: '星期',
          key: 'week'
        },
        {
          title: '上午1-2节',
          slot: 'c1'
        },
        {
          title: '上午3-4节',
          slot: 'c2'
        },
        {
          title: '中午5-6节',
          key: 'noon'
        },
        {
          title: '下午7-8节',
          slot: 'c3'
        },
        {
          title: '下午9-10节',
          slot: 'c4'
        },
        {
          title: '晚上11-13节',
          slot: 'c5'
        }
      ]
    }
  },
  methods: {
    handleInstituteChange (val) {
      if (val) {
        getTeacherByInstituteId(val).then(res => {
          this.teacherList = res.data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleTeacherChange (val) {
      if (val) {
        getTemporaryByTeacherNum(val).then(res => {
          this.initTimeTableData()
          let data = res.data
          data.forEach(item => {
            let week = parseInt(item.classTime.charAt(0)) - 1
            let section = parseInt(item.classTime.charAt(1))
            Object.assign(this.data[week]['c' + section], item)
            let str = ``
            if (item.weekClassHours === 3) {
              str += `(3节)`
            }
            this.data[week]['c' + section].weekTimes = '(1-' + item.coursesClassHours / item.weekClassHours + '周)' + str
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    initTimeTableData () {
      for (let i = 0; i < this.data.length; i++) {
        for (let k in this.data[i]) {
          if (typeof this.data[i][k] === 'object') {
            this.data[i][k].coursesName = ''
            this.data[i][k].classroomNum = ''
            this.data[i][k].weekTimes = ''
            this.data[i][k].className = ''
          }
        }
      }
    },
    confirmExportCsv () {
      this.$Modal.confirm({
        title: '信息',
        content: '确定要导出课表吗',
        onOk: () => {
          this.exportCsv()
        }
      })
    },
    exportCsv () {
      this.$refs.timeTable.exportCsv({
        filename: 'table.csv',
        columns: [
          {
            title: '星期',
            key: 'week'
          },
          {
            title: '上午1-2节',
            key: 'c1'
          },
          {
            title: '上午3-4节',
            key: 'c2'
          },
          {
            title: '中午5-6节',
            key: 'noon'
          },
          {
            title: '下午7-8节',
            key: 'c3'
          },
          {
            title: '下午9-10节',
            key: 'c4'
          },
          {
            title: '晚上11-13节',
            key: 'c5'
          }
        ],
        data: this.setCsvData()
      })
    },
    setCsvData () {
      let arr = []
      let week, c1, c2, c3, c4, c5
      for (let i = 0; i < this.data.length; i++) {
        week = this.data[i].week
        c1 = '"' + this.data[i].c1.coursesName + '\n' + this.data[i].c1.className + '\n' + this.data[i].c1.classroomNum + '\n' + this.data[i].c1.weekTimes + '"'
        c2 = '"' + this.data[i].c2.coursesName + '\n' + this.data[i].c2.className + '\n' + this.data[i].c2.classroomNum + '\n' + this.data[i].c2.weekTimes + '"'
        c3 = '"' + this.data[i].c3.coursesName + '\n' + this.data[i].c3.className + '\n' + this.data[i].c3.classroomNum + '\n' + this.data[i].c3.weekTimes + '"'
        c4 = '"' + this.data[i].c4.coursesName + '\n' + this.data[i].c4.className + '\n' + this.data[i].c4.classroomNum + '\n' + this.data[i].c4.weekTimes + '"'
        c5 = '"' + this.data[i].c5.coursesName + '\n' + this.data[i].c5.className + '\n' + this.data[i].c5.classroomNum + '\n' + this.data[i].c5.weekTimes + '"'
        arr.push({
          week,
          c1,
          c2,
          c3,
          c4,
          c5,
          noon: ''
        })
      }
      return arr
    },
    getData () {
      getInstitute().then(res => {
        this.instituteList = res.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created () {
    this.getData()
    this.data = timeTableData
  }
}
</script>

<style lang="less">
.form-item {
  width: 240px;
}
.export-btn {
  width: 80px;
  .ivu-form-item-content {
    margin-left: 0 !important;
  }
}
.my-form {
  display: flex;
  justify-content: center;
}
</style>
