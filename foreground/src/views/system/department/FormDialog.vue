<template>
    <div>
        <Modal 
          id="menuFormDialog"
          v-model="initOption.visible"
          :mask-closable="false"
        >
            <p slot="header" style="color:#f60;text-align:center;">
                <Icon type="information-circled"></Icon>
                <span>{{initOption.title}}</span>
            </p>
            <Form 
              ref="menuForm"
              :model="menuForm"
              :rules="formRules"
              :label-width="120"
            >
                <!--
                <FormItem label="ID" prop="id">
                    <Input v-model="menuForm.id" placeholder="请输入部门Id"/>
                </FormItem>
                <FormItem label="部门负责人关联ID" prop="managerId">
                    <Input v-model="menuForm.managerId" placeholder="请输入部门负责人关联ID"/>
                </FormItem>
                -->
                <FormItem label="部门名称：" prop="name">
                    <Input v-model="menuForm.name" placeholder="请输入部门名称"/>
                </FormItem>  
                <FormItem label="部门负责人：" prop="managerName">
                    <Input v-model="menuForm.managerName" placeholder="请输入部门负责人"/>
                </FormItem>
                <FormItem label="部门负责人电话：" prop="managerTel">
                    <Input v-model="menuForm.managerTel" placeholder="请输入部门负责人电话"/>
                </FormItem>
                <FormItem label="部门电话：" prop="mobile">
                    <Input v-model="menuForm.mobile" placeholder="请输入部门电话"/>
                </FormItem>
                <!---
                <FormItem label="pid" prop="pid">
                    <Input v-model="menuForm.pid" placeholder="请输入上级部门Id"/>
                </FormItem>
                <FormItem label="上级部门名称" prop="remark">
                    <Input v-model="menuForm.remark" placeholder="请输入上级部门"/>
                </FormItem>
                -->
                <FormItem label="上级部门名称：" prop="pid">
                    <DepartTreeCombo 
                      :initOption="initOption" 
                      @selectNode="selectNode" 
                      ref="DepartTreeCombo"
                      v-model="menuForm.pid"
                    >
                    </DepartTreeCombo>
                </FormItem>
                <FormItem label="备注：" prop="remark">
                    <Input v-model="menuForm.remark" placeholder="请输入备注"/>
                </FormItem>

                <FormItem label="排序值：" prop="sort">
                    <Input v-model="menuForm.sort" placeholder="请输入排序值"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button 
                  type="primary" 
                  @click="handleSubmit"
                  v-if="initOption.action === 'add' || initOption.action === 'edit'"
                >保存
                </Button>
                <Button type="error" @click="reset" v-if="initOption.action === 'add'">重置</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'
  import DepartTreeCombo from '@/components/tree/DepartTreeCombo'

  const validateTel = (rule, value, callback) => { 
      if(value!==undefined){
        let tel=String(value).trim();
        if (tel!=="" && tel.length>0) {
          setTimeout(() => {
              if (isNaN(value)) {
                  callback(new Error('请正确输入手机号码！'));
              } else {
                if (tel.length!==11) 
                    callback(new Error('手机号码格式不正确!'));
                else 
                  callback();
              }
          }, 400);
        }else{
          callback();
        }
      }else{
        callback();
      }
  };

  export default {
    components: {
      DepartTreeCombo
    },
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增菜单'
        },
        action: {
          type: String,
          default: 'add'
        },
        visible: {
          type: Boolean
        },
        row: {
          type: Object,
          default: {}
        }
      },
    },
    data () {
      return {
        initRow : {},
        initIconOption: {
          visible: false,
        },
        formRules: {
          name : [
            {required: true, message: '部门名称不能为空', trigger: 'blur'}
          ],
          managerTel : [
            {required: true,message: '部门负责人电话不能为空', trigger: 'blur'},
            {validator: validateTel, trigger: 'blur'}
          ],
          managerName : [
            {required: true, message: '部门负责人不能为空', trigger: 'blur'}
          ]
        },
        menuForm: {
          /*
          "id": null,
          "managerId": null,
          "managerName":  null,
          "managerTel":  null,
          "mobile":  null,
          "name":  null,
          "pid":  null,
          "remark":  null,
          "sort":  null
          */
        },
      }
    },
    methods: {
      init () {
        this.initRow=JSON.parse(JSON.stringify( this.initOption.row  ));
        if(this.initOption.action == 'add'){
          this.menuForm.pid=this.initRow.id; 
          this.menuForm.pname=this.initRow.name;  
        }else{
          this.menuForm=this.initRow;   
          this.menuForm.pname=this.menuForm.name; 
        }  
        this.menuForm.sort="";
        this.$refs.DepartTreeCombo.nodeName = this.menuForm.pname;
      },
      selectResIcon () {
        this.initIconOption.visible = true
      },
      //选择 父级菜单之后回调方法
      selectNode (data) {
        this.menuForm.pid = data.id;
      },
      handleSubmit () {  
        this.$refs.menuForm.validate((valid) => {   
          if (valid) {
            let params={
              //"id": this.menuForm.id,
              //"managerId":this.menuForm.managerId,
              "managerName": this.menuForm.managerName,
              "managerTel": this.menuForm.managerTel,
              "mobile": this.menuForm.mobile,
              "name": this.menuForm.name,
              "pid": this.menuForm.pid,
              "remark": this.menuForm.remark,
              "sort": this.menuForm.sort
            }

            let ajaxParams={};
            if(this.initOption.action == 'edit'){ 
              params.id=this.menuForm.id;
              ajaxParams={
                path: this.apis.departmentManage.update,
                method: 'put',
                data: params
              }
            }else{
              ajaxParams={
                path: this.apis.departmentManage.save,
                method: 'post',
                data: params
              }
            }
            $http(ajaxParams).then(response => { 
              this.handleResult(response.data)
            })

          }
        })
      },
      handleResult (obj) {
        let resultStr="";
        if(this.initOption.action == 'edit'){
          resultStr="更新";
        }else{
          resultStr="新增";
        }

        if (obj.success) {
          this.$Notice.success({
            title: '提示',
            desc: resultStr+'数据成功！'
          })
          this.initOption.visible = false
          this.$parent.update();
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {  
        this.clearObjData(this.menuForm)
        this.$refs.DepartTreeCombo.clear();
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
