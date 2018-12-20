<template>
    <Modal id="dictFormDialog"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Form ref="dictForm"
              :model="dictForm"
              :rules="formRules"
              :label-width="90">
            <FormItem label="客户名称" prop="name">
                <Input  v-model="dictForm.name"/>
            </FormItem>
            <FormItem label="联系人" prop="contactUser">
                <Input  v-model="dictForm.contactUser"/>
            </FormItem>
             <FormItem label="联系电话" prop="contactTel">
                <Input  v-model="dictForm.contactTel"/>
            </FormItem>
            <FormItem label="地址（省）" prop="province">
                <Input  v-model="dictForm.province"/>
            </FormItem>
             <FormItem label="地址（市）" prop="city">
                <Input  v-model="dictForm.city "/>
            </FormItem>
            <FormItem label="地址（区）" prop="area">
                <Input  v-model="dictForm.area"/>
            </FormItem>
             <FormItem label="详细地址" prop="detailAdderss">
                <Input  v-model="dictForm.detailAdderss"/>
            </FormItem>
             <FormItem label="备注" prop="remark">
                <Input  v-model="dictForm.remark"/>
            </FormItem>

        </Form>
        <div slot="footer">
            <Button type="primary" @click="$parent.dictFormInitOption.visible = false"
                    v-if="initOption.action === 'view'">关闭
            </Button>
            <Button type="primary" @click="handleSubmit"
                    v-if="initOption.action === 'add' || initOption.action === 'edit'">保存
            </Button>
            <Button type="error" @click="reset" v-if="initOption.action === 'add'">重置</Button>
        </div>
    </Modal>
</template>
<script>
  import $http from '@/utils/httputils'


  export default {

    name: 'dictFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增客户信息'
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

        dictList: [],
        formRules: {
          name: [
            {required: true, message: '客户名称不能为空', trigger: 'blur'}
          ],
           contactUser: [
            {required: true, message: '联系人不能为空', trigger: 'blur'}
          ],
           contactTel: [
            {required: true, message: '联系电话不能为空', trigger: 'blur'}
          ],
          province: [
            {required: true, message: '地址（省）不能为空', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '地址（市）不能为空', trigger: 'blur'}
          ],
           area: [
            {required: true, message: '地址（区）不能为空', trigger: 'blur'}
          ],
           detailAdderss: [
            {required: true, message: '详细地址不能为空', trigger: 'blur'}
          ],
        },
        dictForm: {
        }
      }
    },
    methods: {

      init () {
        this.reset();debugger
        //判断是否为编辑，如果是
        if (this.initOption.action !== 'add') {
            this.dictForm = this.initOption.row
        }
      },
      selectParentDict (option) {
        this.dictForm.parentName = option.label.trim()
      },

      handleSubmit () {
        this.$refs.dictForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            let entity={
              "area": this.dictForm.area,
              "city": this.dictForm.city,
              "contactTel": this.dictForm.contactTel,
              "contactUser": this.dictForm.contactUser,
              "detailAdderss": this.dictForm.detailAdderss,
              //"location": "106.618678,26.660938",
              "name": this.dictForm.name,
              "province": this.dictForm.province,
              "remark": this.dictForm.remark
            }

            console.log(JSON.stringify(entity))

            //编辑
            if(this.initOption.action !== 'add'){
              entity.id=this.initOption.row.id
               $http({
                path: this.apis.customer.update,
                method: 'put',
                data: entity
            }).then(response => {
                this.handleResult(response.data)
            })
            //添加
            }else{
               $http({
                path: this.apis.customer.add,
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
        this.clearObjData(this.dictForm)
      },
    }
  }
</script>
<style>
</style>
