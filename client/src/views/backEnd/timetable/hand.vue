<template>
  <pk-layout>
    <i-card>
      <i-breadcrumb slot="title">
        <i-breadcrumb-item to="/">首页</i-breadcrumb-item>
        <i-breadcrumb-item>手动排课</i-breadcrumb-item>
      </i-breadcrumb>
      <div>
        <i-form inline :label-width="60">
          <i-form-item label="学院：">
            <i-select v-model="formItem.instituteId" placeholder="请选择学院" @on-change="handleInstituteChange" style="width: 200px;">
              <i-option v-for="item in instituteList" :key="item.instituteId" :value="item.instituteId">
                {{ item.instituteName }}
              </i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="年级：">
            <i-select v-model="formItem.classYear" placeholder="请选择年级" style="width: 200px;" @on-change="handleClassYearChange">
              <i-option v-for="item in classYearList" :key="item.classYear" :value="item.classYear">
               {{ item.classYear }}
              </i-option>
            </i-select>
          </i-form-item>
          <i-form-item label="班级：">
            <i-select v-model="formItem.classId" placeholder="请选择班级" style="width: 200px;" @on-change="handleClassChange">
              <i-option v-for="item in classList" :key="item.classId" :value="item.classId">
               {{ item.className }}
              </i-option>
            </i-select>
          </i-form-item>
        </i-form>
        <i-table
          :columns="columns"
          :data="data"
          :loading="loading"
          stripe
          border
        >
          <template slot-scope="{ row, index }" slot="action">
            <i-button v-if="row.isArranged === 0" type="primary" size="small" @click="paike(row, index)">排课</i-button>
            <i-button v-else type="info" size="small" @click="changePaike(row)">更改</i-button>
          </template>
        </i-table>
        <div class="page">
          <i-page
            :total="total"
            :current.sync="current"
            :page-size="pageSize"
            :page-size-opts="pageSizeOpts"
            show-sizer
            @on-change="getTeachTask"
            @on-page-size-change="handleChangePageSize"
          />
        </div>
      </div>
    </i-card>
    <i-modal :closable="false" @on-ok="onPaikeOk" @on-cancel="onPaikeCancel" v-model="showPaike">
      <i-form :label-width="90">
        <i-form-item label="周次1时间：">
          <i-select v-model="paikeTime1">
            <i-option v-for="item in availableTime" :value="item" :key="item">{{ item }}</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="周次1教室：">
          <i-select v-model="paikeClassroom1" :label-in-value="true" @on-change="paikeClassroom1Change">
            <i-option v-for="item in availablePaikeClassroom1" :value="item.classroomId" :key="item.classroomId">{{ item.classroomNum }}</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="周次2时间：" v-if="weekClassHours === 4">
          <i-select v-model="paikeTime2">
            <i-option v-for="item in availableTime" :value="item" :key="item">{{ item }}</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="周次2教室：" v-if="weekClassHours === 4">
          <i-select v-model="paikeClassroom2" :label-in-value="true" @on-change="paikeClassroom2Change">
            <i-option v-for="item in availablePaikeClassroom2" :value="item.classroomId" :key="item.classroomId">{{ item.classroomNum }}</i-option>
          </i-select>
        </i-form-item>
      </i-form>
    </i-modal>
    <i-modal v-model="changePaikeModal" :closable="false" @on-ok="onOk" @on-cancel="onCancel">
      <i-card v-for="(item, index) in currentArrangeData" :key="item.temporaryId">
        <div slot="title">原来的安排{{ index + 1 }}</div>
        <div>
          <div class="before"><span>时间：</span><span>{{ item.classTime }}</span></div>
          <div class="before"><span>地点：</span><span>{{ item.classroomNum }}</span></div>
        </div>
      </i-card>
      <i-form :label-width="90" style="margin-top: 10px;">
        <i-form-item label="周次1时间：">
          <i-select v-model="time1">
            <i-option v-for="item in availableTime" :value="item" :key="item">{{ item }}</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="周次1教室：">
          <i-select v-model="classroom1" :label-in-value="true" @on-change="classroom1Change">
            <i-option v-for="item in availableClassroom" :value="item.classroomId" :key="item.classroomId">{{ item.classroomNum }}</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="周次2时间：" v-if="weekClassHours === 4">
          <i-select v-model="time2">
            <i-option v-for="item in availableTime" :value="item" :key="item">{{ item }}</i-option>
          </i-select>
        </i-form-item>
        <i-form-item label="周次2教室：" v-if="weekClassHours === 4">
          <i-select v-model="classroom2" :label-in-value="true" @on-change="classroom2Change">
            <i-option v-for="item in availableClassroom" :value="item.classroomId" :key="item.classroomId">{{ item.classroomNum }}</i-option>
          </i-select>
        </i-form-item>
      </i-form>
    </i-modal>
  </pk-layout>
</template>

<script>
import { getInstitute } from 'api/institute.js'
import { getClassYearByInstituteId, getClassForTeachTask } from 'api/class.js'
import { getTeachTask } from 'api/teachTask.js'
import { getCheckList, getTemporaryByTeachTaskId, handPaike, updatePaike } from 'api/temporary.js'
import { getAllClassroom } from 'api/classroom.js'

export default {
  data () {
    return {
      showPaike: false,
      paikeTime1: '',
      paikeClassroom1: '',
      paikeClassroom1Obj: '',
      paikeTime2: '',
      paikeClassroom2: '',
      paikeClassroom2Obj: '',
      row: '',
      rowIndex: '',

      weekClassHours: '',
      checkList: [],
      classroomData: [],
      time: [
        '11', '12', '13', '14', '15',
        '21', '22', '23', '24', '25',
        '31', '32', '33', '34', '35',
        '41', '42', '43', '44', '45',
        '51', '52', '53', '54', '55'
      ],
      currentArrangeData: [],
      availableTime: [],
      time1: '',
      classroom1: '',
      classroom1Obj: '',
      time2: '',
      classroom2: '',
      classroom2Obj: '',
      formItem: {
        instituteId: '',
        classYear: '',
        classId: ''
      },
      instituteList: [],
      classYearList: [],
      classList: [],
      data: [],
      columns: [
        {
          title: '班级',
          key: 'className'
        },
        {
          title: '课程',
          key: 'coursesName'
        },
        {
          title: '任课教师',
          key: 'teacherName'
        },
        {
          title: '总学时',
          key: 'coursesClassHours'
        },
        {
          title: '周学时',
          key: 'weekClassHours'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'action'
        }
      ],
      loading: false,
      total: 0,
      current: 1,
      pageSize: 10,
      pageSizeOpts: [10, 20, 30, 40],
      changePaikeModal: false
    }
  },
  computed: {
    availableClassroom () {
      let data = []
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.time1 === this.checkList[i].time) {
          data = this.classroomData.filter(item => {
            return !this.checkList[i].classroomId.includes(item.classroomId)
          })
          break
        }
      }
      return data
    },
    availablePaikeClassroom1 () {
      let data = []
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.paikeTime1 === this.checkList[i].time) {
          data = this.classroomData.filter(item => {
            return !this.checkList[i].classroomId.includes(item.classroomId)
          })
          break
        }
      }
      return data
    },
    availablePaikeClassroom2 () {
      let data = []
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.paikeTime2 === this.checkList[i].time) {
          data = this.classroomData.filter(item => {
            return !this.checkList[i].classroomId.includes(item.classroomId)
          })
          break
        }
      }
      return data
    }
  },
  methods: {
    initPaikeData () {
      this.paikeTime1 = ''
      this.paikeClassroom1 = ''
      this.paikeClassroom1Obj = ''
      this.row = ''
      this.weekClassHours = ''
    },
    paikeClassroom1Change (val) {
      this.paikeClassroom1Obj = val
    },
    paikeClassroom2Change (val) {
      this.paikeClassroom2Obj = val
    },
    // 手动排课
    onPaikeOk () {
      // 更新checkList
      for (let i = 0; i < this.checkList.length; i++) {
        if (this.paikeTime1 === this.checkList[i].time) {
          this.checkList[i].classId.push(this.row.classId)
          this.checkList[i].teacherNum.push(this.row.teacherNum)
          this.checkList[i].classroomId.push(this.paikeClassroom1)
          if (this.row.weekClassHours === 3) {
            this.checkList[i + 1].classId.push(this.row.classId)
            this.checkList[i + 1].teacherNum.push(this.row.teacherNum)
            this.checkList[i + 1].classroomId.push(this.paikeClassroom1)
          }
          if (this.row.weekClassHours === 4) {
            let index = this.checkList.findIndex(item => item.time === this.paikeTime2)
            this.checkList[index].classId.push(this.row.classId)
            this.checkList[index].teacherNum.push(this.row.teacherNum)
            this.checkList[index].classroomId.push(this.paikeClassroom2)
          }
          break
        }
      }
      let temporaryData = []
      if (this.row.weekClassHours !== 4) {
        temporaryData = [
          {
            classroomNum: this.paikeClassroom1Obj.label,
            classId: this.row.classId,
            coursesClassHours: this.row.coursesClassHours,
            coursesNum: this.row.coursesNum,
            teacherNum: this.row.teacherNum,
            termName: this.row.termName,
            classTime: this.paikeTime1,
            weekClassHours: this.row.weekClassHours,
            teachTaskId: this.row.teachTaskId
          }
        ]
      } else {
        temporaryData = [
          {
            classroomNum: this.paikeClassroom1Obj.label,
            classId: this.row.classId,
            coursesClassHours: this.row.coursesClassHours,
            coursesNum: this.row.coursesNum,
            teacherNum: this.row.teacherNum,
            termName: this.row.termName,
            classTime: this.paikeTime1,
            weekClassHours: this.row.weekClassHours,
            teachTaskId: this.row.teachTaskId
          },
          {
            classroomNum: this.paikeClassroom2Obj.label,
            classId: this.row.classId,
            coursesClassHours: this.row.coursesClassHours,
            coursesNum: this.row.coursesNum,
            teacherNum: this.row.teacherNum,
            termName: this.row.termName,
            classTime: this.paikeTime2,
            weekClassHours: this.row.weekClassHours,
            teachTaskId: this.row.teachTaskId
          }
        ]
      }
      handPaike({ checkList: this.checkList, teachTaskId: this.row.teachTaskId, temporaryData }).then(res => {
        this.getCheckList()
        this.data[this.rowIndex].isArranged = 1
        this.$Message.success({ content: '排课成功!' })
      }).catch(err => {
        console.log(err)
      })
      this.initPaikeData()
    },
    onPaikeCancel () {
      this.initPaikeData()
    },
    paike (row, index) {
      this.getAvailableTime(row.classId, row.teacherNum)
      this.row = row
      this.rowIndex = index
      this.weekClassHours = this.row.weekClassHours
      this.showPaike = true
    },
    changePaike (row) {
      getTemporaryByTeachTaskId(row.teachTaskId).then(res => {
        this.changePaikeModal = true
        this.currentArrangeData = res.data
        this.weekClassHours = this.currentArrangeData[0].weekClassHours
        this.getAvailableTime(row.classId, row.teacherNum)
      }).catch(err => {
        console.log(err)
      })
    },
    getAvailableTime (classId, teacherNum) {
      let data = []
      this.checkList.forEach(item => {
        if (!item.classId.includes(classId) && !item.teacherNum.includes(teacherNum)) {
          data.push(item.time)
        }
      })
      this.availableTime = data
    },
    onOk () {
      if (this.weekClassHours === 4) {
        // copyData[0].classroomNum = this.classroom1Obj.label
        // copyData[0].classTime = this.time1
        // copyData[1].classroomNum = this.classroom2Obj.label
        // copyData[1].classTime = this.time2
      } else {
        let copyData = [{ ...this.currentArrangeData[0] }]
        copyData[0].classroomNum = this.classroom1Obj.label
        copyData[0].classroomId = this.classroom1Obj.value
        copyData[0].classTime = this.time1
        this.updateCheckList(this.currentArrangeData, copyData)
        updatePaike({
          checkList: this.checkList,
          updateData: {
            classroomNum: copyData[0].classroomNum,
            classTime: copyData[0].classTime
          },
          temporaryId: copyData[0].temporaryId
        }).then(res => {
          this.getCheckList()
          this.$Message.success({ content: '更新成功!' })
        })
      }
      this.initModalData()
    },
    onCancel () {
      this.initModalData()
    },
    classroom1Change (val) {
      this.classroom1Obj = val
    },
    classroom2Change (val) {
      this.classroom2Obj = val
    },
    initModalData () {
      this.time1 = ''
      this.classroom1 = ''
      this.classroom1Obj = ''
      this.time2 = ''
      this.classroom2 = ''
      this.classroom2Obj = ''
    },
    updateCheckList (data, newData) {
      // 删除班级id,删除教师编号,删除所用教室
      // console.log(data)
      // console.log(newData)
      if (data.length === 1) {
        let flag = 0
        for (let i = 0; i < this.checkList.length; i++) {
          if (data[0].classTime === this.checkList[i].time) {
            let classroomId = this.classroomData.find(item => item.classroomNum === data[0].classroomNum).classroomId
            let classId = data[0].classId
            let teacherNum = data[0].teacherNum
            let index1 = this.checkList[i].classId.findIndex(item => item === classId)
            this.checkList[i].classId.splice(index1, 1)
            let index2 = this.checkList[i].teacherNum.findIndex(item => item === teacherNum)
            this.checkList[i].teacherNum.splice(index2, 1)
            let index3 = this.checkList[i].classroomId.findIndex(item => item === classroomId)
            this.checkList[i].classroomId.splice(index3, 1)
            flag++
            if (flag === 2) break
          }
          if (newData[0].classTime === this.checkList[i].time) {
            this.checkList[i].classId.push(newData[0].classId)
            this.checkList[i].teacherNum.push(newData[0].teacherNum)
            this.checkList[i].classroomId.push(newData[0].classroomId)
            flag++
            if (flag === 2) break
          }
        }
      } else {
        // let data1 = data[0]
        // let data2 = data[1]
      }
    },
    async getData () {
      await this.getInstitute()
      await this.getTeachTask()
      await this.getCheckList()
      await this.getAllClassroom()
    },
    getAllClassroom () {
      getAllClassroom().then(res => {
        this.classroomData = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getCheckList () {
      getCheckList().then(res => {
        this.checkList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getInstitute () {
      getInstitute().then(res => {
        this.instituteList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getClassYear (instituteId) {
      getClassYearByInstituteId(instituteId).then(res => {
        this.classYearList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getClass ({ instituteId, classYear }) {
      getClassForTeachTask({ instituteId, classYear }).then(res => {
        this.classList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getTeachTask () {
      if (this.loading) {
        return
      }
      this.loading = true
      let where = {
        classId: this.formItem.classId,
        current: this.current,
        pageSize: this.pageSize
      }
      getTeachTask(where).then(res => {
        this.data = res.data
        this.total = res.total
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    handleInstituteChange (val) {
      this.classYearList = []
      this.formItem.classYear = ''
      this.getClassYear(val)
    },
    handleClassYearChange (val) {
      this.classList = []
      this.formItem.classId = ''
      if (val) {
        let where = {
          instituteId: this.formItem.instituteId,
          classYear: val
        }
        this.getClass(where)
      }
    },
    handleClassChange (val) {
      if (val) {
        this.current = 1
        this.getTeachTask()
      }
    },
    handleChangePageSize (val) {
      this.current = 1
      this.pageSize = val
      this.getTeachTask()
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="less">
.button {
  margin-bottom: 3px;
}
.delete {
  margin-left: 5px;
}
.page {
  margin-top: 20px;
  text-align: center;
}
.before {
  display: flex;
}
</style>
