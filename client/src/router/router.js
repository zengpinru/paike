import Home from '_v/backEnd/home.vue'
import Login from '_v/backEnd/login.vue'
import Pk404 from '_v/404.vue'
import Index from '_v/frontEnd/index.vue'

export const routesMap = [
  {
    path: '/admin-list',
    name: 'admin-list',
    meta: {
      title: '管理员列表'
    },
    parent: {
      icon: 'ios-person',
      title: '管理员管理'
    },
    component: () => import('_v/backEnd/admin/list.vue')
  },
  {
    path: '/permission-route',
    name: 'permission-route',
    meta: {
      title: '页面权限管理'
    },
    parent: {
      icon: 'ios-key',
      title: '权限管理'
    },
    component: () => import('_v/backEnd/permission/route.vue')
  },
  {
    path: '/permission-role',
    name: 'permission-role',
    meta: {
      title: '角色管理'
    },
    parent: {
      icon: 'ios-key',
      title: '权限管理'
    },
    component: () => import('_v/backEnd/permission/role.vue')
  },
  {
    path: '/classroom-add',
    name: 'classroom-add',
    meta: {
      title: '教室添加'
    },
    parent: {
      icon: 'md-stats',
      title: '教室管理'
    },
    component: () => import('_v/backEnd/classroom/add.vue')
  },
  {
    path: '/classroom-list',
    name: 'classroom-list',
    meta: {
      title: '教室列表'
    },
    parent: {
      icon: 'md-stats',
      title: '教室管理'
    },
    component: () => import('_v/backEnd/classroom/list.vue')
  },
  {
    path: '/classroom-edit',
    name: 'classroom-edit',
    meta: {
      title: '教室编辑'
    },
    parent: {
      icon: 'md-stats',
      title: '教室管理'
    },
    component: () => import('_v/backEnd/classroom/edit.vue')
  },
  {
    path: '/institute-add',
    name: 'institute-add',
    meta: {
      title: '学院添加'
    },
    parent: {
      icon: 'md-school',
      title: '学院管理'
    },
    component: () => import('_v/backEnd/institute/add.vue')
  },
  {
    path: '/institute-list',
    name: 'institute-list',
    meta: {
      title: '学院列表'
    },
    parent: {
      icon: 'md-school',
      title: '学院管理'
    },
    component: () => import('_v/backEnd/institute/list.vue')
  },
  {
    path: '/institute-edit',
    name: 'institute-edit',
    meta: {
      title: '学院编辑'
    },
    parent: {
      icon: 'md-school',
      title: '学院管理'
    },
    component: () => import('_v/backEnd/institute/edit.vue')
  },
  {
    path: '/major-add',
    name: 'major-add',
    meta: {
      title: '专业添加'
    },
    parent: {
      icon: 'md-medical',
      title: '专业管理'
    },
    component: () => import('_v/backEnd/major/add.vue')
  },
  {
    path: '/major-list',
    name: 'major-list',
    meta: {
      title: '专业列表'
    },
    parent: {
      icon: 'md-medical',
      title: '专业管理'
    },
    component: () => import('_v/backEnd/major/list.vue')
  },
  {
    path: '/major-edit',
    name: 'major-edit',
    meta: {
      title: '专业编辑'
    },
    parent: {
      icon: 'md-medical',
      title: '专业管理'
    },
    component: () => import('_v/backEnd/major/edit.vue')
  },
  {
    path: '/teacher-add',
    name: 'teacher-add',
    meta: {
      title: '教师添加'
    },
    parent: {
      icon: 'ios-people',
      title: '教师管理'
    },
    component: () => import('_v/backEnd/teacher/add.vue')
  },
  {
    path: '/teacher-list',
    name: 'teacher-list',
    meta: {
      title: '教师列表'
    },
    parent: {
      icon: 'ios-people',
      title: '教师管理'
    },
    component: () => import('_v/backEnd/teacher/list.vue')
  },
  {
    path: '/teacher-edit',
    name: 'teacher-edit',
    meta: {
      title: '教师编辑'
    },
    parent: {
      icon: 'ios-people',
      title: '教师管理'
    },
    component: () => import('_v/backEnd/teacher/edit.vue')
  },
  {
    path: '/class-add',
    name: 'class-add',
    meta: {
      title: '班级添加'
    },
    parent: {
      icon: 'md-contacts',
      title: '班级管理'
    },
    component: () => import('_v/backEnd/class/add.vue')
  },
  {
    path: '/class-list',
    name: 'class-list',
    meta: {
      title: '班级列表'
    },
    parent: {
      icon: 'md-contacts',
      title: '班级管理'
    },
    component: () => import('_v/backEnd/class/list.vue')
  },
  {
    path: '/class-edit',
    name: 'class-edit',
    meta: {
      title: '班级编辑'
    },
    parent: {
      icon: 'md-contacts',
      title: '班级管理'
    },
    component: () => import('_v/backEnd/class/edit.vue')
  },
  {
    path: '/courses-add',
    name: 'courses-add',
    meta: {
      title: '课程添加'
    },
    parent: {
      icon: 'ios-book',
      title: '课程管理'
    },
    component: () => import('_v/backEnd/courses/add.vue')
  },
  {
    path: '/courses-list',
    name: 'courses-list',
    meta: {
      title: '课程列表'
    },
    parent: {
      icon: 'ios-book',
      title: '课程管理'
    },
    component: () => import('_v/backEnd/courses/list.vue')
  },
  {
    path: '/courses-edit',
    name: 'courses-edit',
    meta: {
      title: '课程编辑'
    },
    parent: {
      icon: 'ios-book',
      title: '课程管理'
    },
    component: () => import('_v/backEnd/courses/edit.vue')
  },
  {
    path: '/teachTask-add',
    name: 'teachTask-add',
    meta: {
      title: '教学任务添加'
    },
    parent: {
      icon: 'md-calendar',
      title: '教学任务管理'
    },
    component: () => import('_v/backEnd/teachTask/add.vue')
  },
  {
    path: '/teachTask-list',
    name: 'teachTask-list',
    meta: {
      title: '教学任务列表'
    },
    parent: {
      icon: 'md-calendar',
      title: '教学任务管理'
    },
    component: () => import('_v/backEnd/teachTask/list.vue')
  },
  {
    path: '/teachTask-setTerm',
    name: 'teachTask-setTerm',
    meta: {
      title: '设置学期'
    },
    parent: {
      icon: 'md-calendar',
      title: '教学任务管理'
    },
    component: () => import('_v/backEnd/teachTask/setTerm.vue')
  },
  {
    path: '/timetable-hand',
    name: 'timetable-hand',
    meta: {
      title: '手动排课'
    },
    parent: {
      icon: 'md-grid',
      title: '排课管理'
    },
    component: () => import('_v/backEnd/timetable/hand.vue')
  },
  {
    path: '/timetable-panel',
    name: 'timetable-panel',
    meta: {
      title: '自动排课'
    },
    parent: {
      icon: 'md-grid',
      title: '排课管理'
    },
    component: () => import('_v/backEnd/timetable/panel.vue')
  },
  {
    path: '/timetable-preview',
    name: 'timetable-preview',
    meta: {
      title: '课表预览'
    },
    parent: {
      icon: 'md-grid',
      title: '排课管理'
    },
    component: () => import('_v/backEnd/timetable/preview.vue')
  }
]

// 所有用户都拥有的路由列表
export const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '大学排课系统首页'
    },
    component: Home
  },
  {
    path: '/index',
    name: 'index',
    meta: {
      title: '首页'
    },
    component: Index
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: Login
  }
]

export const R404 = [
  {
    path: '*',
    meta: {
      title: '404'
    },
    component: Pk404
  }
]
