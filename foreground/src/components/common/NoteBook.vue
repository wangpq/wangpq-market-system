<template>
  <div class="note-book">
    <h4>{{title}}</h4>
    <ul v-if="hasList && noteList.length>0">
      <li v-for="(item,index) in noteList" :key="index">{{item}}</li>
    </ul>
    <ul v-if="hasList && noteList.length==0">
      <li style="color:#888">没有留言哦！</li>
    </ul>
    <div class="textarea" v-if="hasTextarea">
      <Input 
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入内容"
        autocomplete="off"
        v-model="textarea"
        @on-change="onChange"
      />
    </div>
  </div>
</template>

<script>

export default {
  data(){
    return{
      textarea : ""
    }
  },
  props: {
    title :{
      type : String,
      default : "内部沟通:"
    },
    noteList : {
      type : Array,
      default : []
    },
    hasList : {
      type : Boolean,
      default : false
    },
    hasTextarea: {
      type : Boolean,
      default : true
    }
  },
  mounted () {
    this.textarea="";
  },
  methods: {
    onChange(){  
      this.$emit("onChange",this.textarea)
    }
  },
}
</script>

<style scoped>
.note-book{
  margin-top:6px;
  padding: 14px 14px 6px;
  border-radius: 6px;
  background-color: #fff;
  margin-bottom: 6px;
  font-size: 14px;
}
.note-book>h4{
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 8px;
}
.note-book>ul{
  max-height: 100px;
  margin-bottom: 8px;
  overflow-x:hidden;
  overflow-y:auto;
  padding:8px 0;
}
.note-book>ul>li{
  line-height: 1.48;
  color:#333;
}
.note-book>ul>li:nth-child(odd){
  color : #666;
}
.note-book>ul>li:nth-child(even){
  color : #333;
}
.note-book>.textarea{
  margin-bottom: 8px;
}
.note-book>.textarea .el-textarea{
  font-size: 14px;
  color:#333;
}
.note-book>.btn-group{
  margin-bottom: 8px;
}
</style>
