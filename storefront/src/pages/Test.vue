<template>
    <div>
      <!--<el-upload-->
        <!--:action="uploadUrl"-->
        <!--list-type="picture-card"-->
        <!--multiple-->
        <!--name="file"-->
        <!--:data="updateParams"-->
        <!--:on-preview="handlePictureCardPreview"-->
        <!--:on-remove="handleRemove">-->
        <!--<i class="el-icon-plus"></i>-->
      <!--</el-upload>-->
      <!--<el-dialog :visible.sync="dialogVisible">-->
        <!--<img width="100%" :src="dialogImageUrl" alt="">-->
      <!--</el-dialog>-->
      <Keyboard></Keyboard>
    </div>
</template>

<script>
  import Keyboard from  '@/components/Keyboard'
    export default {
        name: "Test",
      components:{
        Keyboard
      },
      data() {
        return {
          uploadUrl:'http://127.0.0.1:8081/image/file/upload',
          updateParams:{
            dir:"header"
          },
          dialogImageUrl: '',
          dialogVisible: false
        };
      },
      methods: {
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        }
      }
    }
</script>

<style scoped>

</style>
