<template>
    <div>
        <Modal id="providerFormDialog"
               v-model="initOption.visible"
               :mask-closable="false" width="50">

            <p slot="header" style="color:#f60;text-align:center;">
                <Icon type="information-circled"></Icon>
                <span>{{initOption.title}}</span>
            </p>
            <Form ref="providerForm"
                  :model="providerForm"
                  :rules="formRules"
                  :label-width="90" style="overflow-y: auto;height: 70vh">

                <FormItem label="供应商名称" prop="name">
                    <Input v-model="providerForm.name"  placeholder="供应商名称"/>
                </FormItem>

                 <FormItem label="配送周期" prop="deliverPeriod">
                    <InputNumber :min="0" v-model="providerForm.deliverPeriod" placeholder="配送周期（天）" style="width: 12rem"></InputNumber>
                </FormItem>
                
                 <FormItem label="经营方式" prop="businessType">
                    <Select v-model="providerForm.businessType" clearable>
                        <Option v-for="item in busiType" :value="item.value" :key="item.key">
                            {{item.key }}
                        </Option>
                    </Select>
                </FormItem>

                <!-- <FormItem label="业务员" prop="countermanName">
                    <Input v-model="providerForm.countermanName"  placeholder="业务员"/>
                </FormItem> -->

                 <FormItem label="业务员" prop="countermanName">
                    <Input v-model="providerForm.countermanName" v-on:dblclick.native="initUserOption.visible=true"
                           placeholder="双击选择业务员" />
                </FormItem>

                 <FormItem label="结算方式" prop="settleType">
                    <Select v-model="providerForm.settleType" clearable>
                        <Option v-for="item in settlementType" :value="item.value" :key="item.key">
                            {{item.key }}
                        </Option>
                    </Select>
                </FormItem>
                 <FormItem label="结算周期" prop="settlePeriod">
                    <InputNumber :min="0" v-model="providerForm.settlePeriod" placeholder="结算周期（天）" style="width: 12rem"></InputNumber>
                </FormItem>
                <FormItem label="月结日期" prop="settleTime">
                  <DatePicker 
                    :value="providerForm.settleTime" 
                    type="datetime" 
                    placeholder="请选择月结日期"
                    style="width:100%;"
                    @on-change="onActDateChange"
                  >
                </DatePicker>
                </FormItem>

                 <FormItem label="供应商联系人电话" prop="contactMobile">
                    <Input v-model="providerForm.contactMobile"  placeholder="供应商联系人电话"/>
                </FormItem>
                <FormItem label="联系人" prop="contactName">
                    <Input v-model="providerForm.contactName"  placeholder="联系人"/>
                </FormItem>

                 <FormItem label="地址（省）" prop="province">
                    <Input  v-model="providerForm.province"/>
                </FormItem>
                <FormItem label="地址（市）" prop="city">
                    <Input  v-model="providerForm.city "/>
                </FormItem>
                <FormItem label="地址（区）" prop="area">
                    <Input  v-model="providerForm.area"/>
                </FormItem>
                <FormItem label="详细地址" prop="detailAddress">
                    <Input  v-model="providerForm.detailAddress"/>
                </FormItem>

                <FormItem label="开户行" prop="bankName">
                    <Input v-model="providerForm.bankName"  placeholder="开户行"/>
                </FormItem>
                 <FormItem label="开户行账号" prop="bankAccount">
                    <Input v-model="providerForm.bankAccount"  placeholder="开户行账号"/>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="providerForm.remark"  placeholder="备注"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="$parent.providerFormInitOption.visible = false"
                        v-if="initOption.action === 'view'">关闭
                </Button>
                <Button type="primary" @click="handleSubmit"
                        v-if="initOption.action === 'add' || initOption.action === 'edit'">保存
                </Button>
                <Button type="error" @click="reset" v-if="initOption.action === 'add'">重置</Button>
            </div>
        </Modal>
        <UserSelectDialog :initOption="initUserOption" @on-ywy-ok="onUserSelectOk"></UserSelectDialog>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'
   import UserSelectDialog from '@/components/common/UserSelectDialog'

  export default {

    name: 'providerFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增供应商信息'
        },
        action: {
          type: String,
          default: 'add'
        },
        visible: {
          type: Boolean
        },
        id: {
          type: String,
          default: null
        }
      }
    },
    data () {
      return {
         //经营方式选择
        busiType:[
          {
            key : '国有',
            value : 1
          },
          {
            key : '民营',
            value : 2
          },
          {
            key : '合资',
            value : 3
          }, 
          {
            key : '外资',
            value : 4
          },
          {
            key : '个体',
            value : 5
          },
        ],
        //结算方式选择
        settlementType:[
          {
            key : '及时结算',
            value : 1
          },
          {
            key : '周期结算',
            value : 2
          },
          {
            key : '按月结算',
            value : 3
          },
        ],

        formRules: {
          name: [
            {required: true, message: '供应商名称不能为空！', trigger: 'blur'}
          ],
          businessType: [
            {type: 'number',required: true, message: '经营方式不能为空！', trigger: 'blur'}
          ],
          countermanName: [
            {required: true, message: '业务员不能为空！', trigger: 'blur'}
          ],
   
          contactMobile: [
            {required: true, message: '供应商联系人电话不能为空！', trigger: 'blur'}
          ],
          contactName: [
            {required: true, message: '联系人不能为空！', trigger: 'blur'}
          ],
           province: [
            {required: true, message: '地址（省）不能为空！', trigger: 'blur'}
          ],
           city: [
            {required: true, message: '地址（市）不能为空！', trigger: 'blur'}
          ],
           area: [
            {required: true, message: '地址（区）不能为空！', trigger: 'blur'}
          ],
           detailAddress: [
            {required: true, message: '详细地址不能为空！', trigger: 'blur'}
          ],       
        },
        productChildName: '',
        providerForm: {
         
        },
        initUserOption: {
          visible: false,
          title: '选择业务员'
        },
        brandNameList: [],
      }
    },
    methods: {
      init () { 
        this.reset()
        if (this.initOption.action !== 'add') {
            this.providerForm = this.initOption.row
        }
      },
      onUserSelectOk(data){

        this.providerForm.countermanId=data.countermanId;
        this.providerForm.countermanName=data.countermanName;

debugger


      },
      handleSubmit () {
        this.$refs.providerForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            let entity=
            {
              "area": this.providerForm.area,
              "bankAccount": this.providerForm.bankAccount,
              "bankName": this.providerForm.bankName,
              //"businessLicencePic": "https://",
              "businessType": this.providerForm.businessType,
              "city": this.providerForm.city,
              //"contactIdBack": "string",
              //"contactIdFront": "string",
              "contactMobile": this.providerForm.contactMobile,
              "contactName":  this.providerForm.contactName,
              "countermanId": this.providerForm.countermanId,
              "countermanName": this.providerForm.countermanName,
              "country": "中国",
              "deliverPeriod": this.providerForm.deliverPeriod,
              "detailAddress":  this.providerForm.detailAddress,
              //"id": 0,
              "name": this.providerForm.name,
              "province": this.providerForm.province,
              "remark": this.providerForm.remark,
              "settlePeriod":  this.providerForm.settlePeriod,
              "settleTime": this.providerForm.settleTime,
              "settleType":this.providerForm.settleType,
            }
            
            console.log(JSON.stringify(entity))

            //编辑
            if(this.initOption.action !== 'add'){  
              entity.id=this.initOption.row.id
               $http({
                path: this.apis.provider.update,
                method: 'put',
                data: entity
            }).then(response => {
                this.handleResult(response.data)
            })
            //添加
            }else{
               $http({
                path: this.apis.provider.add,
                method: 'post',
                data: entity
            }).then(response => {
                this.handleResult(response.data)
            })

            }
          }
        })
      },
     
      handleResult (obj) {
        if (obj.success) {
          this.$Notice.success({
            title: '提示',
            desc: '保存成功！'
          })
          this.$parent.$children[0].query()
          this.initOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },

     reset () { 
        this.clearObjData(this.providerForm)
        
         this.providerForm.settlePeriod="";
      },
       onActDateChange(date_1,data_2){ 
        this.providerForm.settleTime=date_1;
      },


    },

    
    components: {
       UserSelectDialog
    }
  }
</script>
<style lang="scss">
    #providerFormDialog {
        .ivu-input-number {
            width: 100% !important;
        }
    }


</style>
