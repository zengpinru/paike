drop table if exists pk_classroom;

/*==============================================================*/
/* Table: pk_classroom                                          */
/*==============================================================*/
create table pk_classroom
(
   classroomId         int not null auto_increment comment '教室系统ID',
   classroomNum        varchar(255) not null comment '教室编号',
   classroomCapacity   int default 100 comment '教室容纳的人数',
   classroomStatus     tinyint(1) default 1 comment '教室是否可用',
   primary key (classroomId),
   unique key AK_Key_2 (classroomNum)
);

alter table pk_classroom comment '教室表';

drop table if exists pk_institute;

/*==============================================================*/
/* Table: pk_institute                                          */
/*==============================================================*/
create table pk_institute
(
   instituteId          int not null auto_increment comment '系统ID',
   instituteName        varchar(255) not null comment '学院名称',
   primary key (instituteId)
);

alter table pk_institute comment '学院表';

drop table if exists pk_major;

/*==============================================================*/
/* Table: pk_major                                              */
/*==============================================================*/
create table pk_major
(
   majorId              int not null auto_increment comment '系统ID',
   instituteId          int comment '学院ID',
   majorName            varchar(255) not null comment '专业名称',
   primary key (majorId)
);

alter table pk_major comment '专业表';

alter table pk_major add constraint FK_institute_major foreign key (instituteId)
      references pk_institute (instituteId) on delete restrict on update restrict;

drop table if exists pk_teacher;

/*==============================================================*/
/* Table: pk_teacher                                            */
/*==============================================================*/
create table pk_teacher
(
   teacherId            int not null auto_increment comment '系统Id',
   instituteId          int comment '学院ID',
   teacherNum           varchar(255) comment '教师编号',
   teacherName          varchar(255) comment '教师姓名',
   primary key (teacherId),
   unique key AK_Key_2 (teacherNum)
);

alter table pk_teacher comment '教师表';

alter table pk_teacher add constraint FK_institute_teacher foreign key (instituteId)
      references pk_institute (instituteId) on delete restrict on update restrict;

drop table if exists pk_class;

/*==============================================================*/
/* Table: pk_class                                              */
/*==============================================================*/
create table pk_class
(
   classId              int not null auto_increment comment '系统ID',
   instituteId          int comment '学院ID',
   majorId              int comment '专业ID',
   className            varchar(255) comment '班级名称',
   classYear            varchar(255) comment '入学年份',
   classStuNum          int comment '学生人数',
   primary key (classId)
);

alter table pk_class comment '班级表';

alter table pk_class add constraint FK_institute_class foreign key (instituteId)
      references pk_institute (instituteId) on delete restrict on update restrict;

alter table pk_class add constraint FK_major_class foreign key (majorId)
      references pk_major (majorId) on delete restrict on update restrict;

drop table if exists pk_courses;

/*==============================================================*/
/* Table: courses                                               */
/*==============================================================*/
create table pk_courses
(
   coursesId            int not null auto_increment comment '系统ID',
   coursesNum           varchar(255) comment '编号',
   coursesName          varchar(255) comment '名称',
   coursesClassHours    int comment '总学时',
   coursesProperty      tinyint(1) default 1 comment '性质,1:公共课,2:专业课',
   primary key (coursesId),
   unique key AK_Key_2 (coursesNum)
);

alter table pk_courses comment '课程库表';

drop table if exists pk_teachTask;

/*==============================================================*/
/* Table: pk_teachTask                                          */
/*==============================================================*/
create table pk_teachTask
(
   teachTaskId          int not null auto_increment comment '系统ID',
   classId              int comment '班级ID',
   coursesNum           varchar(255) comment '课程编号',
   teacherNum           varchar(255) comment '教师编号',
   termName                 varchar(255) comment '学期',
   weekClassHours       int comment '周学时',
   coursesClassHours      int comment '总学时',
   primary key (teachTaskId)
);

alter table pk_teachTask add constraint FK_class_teachTask foreign key (classId)
      references pk_class (classId) on delete restrict on update restrict;

alter table pk_teachTask add constraint FK_courses_teachTask foreign key (coursesNum)
      references pk_courses (coursesNum) on delete restrict on update restrict;

alter table pk_teachTask add constraint FK_teacher_teachTask foreign key (teacherNum)
      references pk_teacher (teacherNum) on delete restrict on update restrict;

drop table if exists pk_term;

/*==============================================================*/
/* Table: pk_term                                               */
/*==============================================================*/
create table pk_term
(
   termId               int not null auto_increment comment '系统ID',
   termName             varchar(255) not null comment '学期',
   primary key (termId)
);

alter table pk_term comment '学期表';

create table pk_temporary
(
   temporaryId          int not null auto_increment comment '系统id',
   classroomNum         varchar(255) comment '教室编号',
   classId              int comment '班级id',
   coursesClassHours    int comment '总学时',
   coursesNum           varchar(255) comment '课程编号',
   teacherNum           varchar(255) comment '教师编号',
   termName             varchar(255) comment '学期',
   classTime            varchar(255) comment '上课时间',
   weekClassHours       int comment '周学时',
   primary key (temporaryId)
);

create table pk_checkList
(
   checkListId          int not null auto_increment comment '系统id',
   classTime            varchar(255) comment '上课时间',
   classId              text comment '班级Id',
   teacherNum           text comment '教师编号',
   classroomId          text comment '教室id',
   checkListIndex       int comment '标志索引',
   primary key (checkListId)
);
