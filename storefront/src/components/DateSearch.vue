<template>
    <div style="display:inline-block;">
      <el-date-picker
        size="small"
        v-model="date"
        type="datetimerange"
        :picker-options="pickerShortcut"
        range-separator="至"
        @change="pickerChange"
        :default-time="['00:00:00', '23:59:59']"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button size="small" class="search" type="primary" icon="el-icon-search"  @click="search">搜索</el-button>
    </div>
</template>

<script>
  import dateformat from '@/utils/dateformat'
    export default {
        name: "DateSearch",
      data(){
          return{
            date:"",
            startTime:null,
            endTime:null,
            //时间选择器快键键
            pickerShortcut:{
              shortcuts:[{
                text: '当日',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setHours(0);
                  start.setMinutes(0);
                  start.setSeconds(0);
                  picker.$emit('pick', [start, end]);
                }
              },{
                text: '昨日',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24);
                  start.setHours(0);
                  start.setMinutes(0);
                  start.setSeconds(0);
                  end.setTime(end.getTime() - 3600 * 1000 * 24);
                  end.setHours(23);
                  end.setMinutes(59);
                  end.setSeconds(59);
                  picker.$emit('pick', [start, end]);
                }
              },{
                text: '最近一周',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', [start, end]);
                }
              },{
                text: '最近一个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                  picker.$emit('pick', [start, end]);
                }
              },{
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
              }]
            }
          }
      },
      methods:{
        pickerChange(time){
          //console.log("改变时间",time)
          if (time == null || time ==""){
            this.startTime = null;
            this.endTime = null;
          } else {
            this.startTime = dateformat.format(time[0], 'yyyy-MM-dd hh:mm:ss');
            this.endTime = dateformat.format(time[1], 'yyyy-MM-dd hh:mm:ss');
          }
        },
        search(){
          this.$emit('getDateTime', this.startTime,this.endTime);
        }
      }
    }
</script>

<style scoped>

  .search{
    margin: 0 0 0 10px;
  }
</style>
