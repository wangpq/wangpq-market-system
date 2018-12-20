<template>
    <div>
      <CommModal v-model="options.visible"
                 :mask-closable="false"
                 okText="确定"
                 @on-cancel="onCancel"
                 @on-ok="onOK">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>文件上传</span>
        </p>
          <Upload
            ref="upload"
            type="drag"
            :name="name"
            :before-upload="beforeUpload"
            :on-progress="onProgress"
            :on-success="onSuccess"
            :on-error="onError"
            :show-upload-list="showList"
            :max-size="fileMaxSize"
            :action="uploadUrl">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或者拖拽文件到此处进行上传</p>
            </div>
          </Upload>
          <template v-if="fileType=='image'" v-for="item in fileList">
            <template v-for="sitem in item.data">
              <img style="margin-left: 10px" :src="showUrl + sitem.shortPath" width="60" height="60"/>
            </template>
          </template>
      </CommModal>
    </div>
</template>

<script>
  /*
  *使用方法:
  * 1、加载模块:import FileUpload from '@/components/common/FileUpload'
  *    components中添加 FileUpload
  * 2、添加标签:<FileUpload name="myimage" fileType="image" :options="options" @uploads="uploadFiles"></FileUpload>
  *    name:为上传后文件存放路径，默认为file
  *    fileType:文件类型默认为file ,为image可以显示上传图片缩略图
  *    options:上传弹框显示隐藏数据
  *    uploads:确定关闭弹窗后接收上传列表
  *  3、数据:options:{visible:false}
  *  4、接收返回列表:
  *  uploadFiles(list){
          console.log("获取到上传文件:",list)
        }
  * */
  import CommModal from '../../../plugins/CommModal'
    export default {
        name: "ImageUpload",
      components:{
        CommModal
      },
      props:{
        options: {
          visible: {
            type: Boolean,
            default: false
          },
        },
        fileType:{
          type:String,
          default:()=>{
            return 'file';
          }
        },
          name:{
            type:String,
            default:()=>{
              return "file";
            }
          }
      },
      data(){
          return{
            fileMaxSize:10240,//10M
            uploadUrl:this.apis.EXTRA.uploadFile,
            showUrl:this.apis.EXTRA.fileLoadUrl,
            showList:true,
            fileList:[]
          }
      },
      methods:{
        beforeUpload(){

        },
        onProgress(event,file,fileList){
        },
        onSuccess(response,file,fileList){
          this.fileList.push(response);
        },
        onError(error,file,fileList){
        },
        onOK(callback){
          this.$emit("uploads",this.fileList);
          this.fileList = [];
          this.$refs.upload.clearFiles();
          callback(true)
        },
        onCancel(callback){
          this.fileList = [];
          this.$refs.upload.clearFiles();
        }
      }
    }
</script>

<style scoped>

</style>
