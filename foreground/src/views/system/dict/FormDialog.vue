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

            <FormItem label="标签名" prop="label">
                <Input v-model="dictForm.label"></Input></FormItem>
            <FormItem label="数据值" prop="value">
                <InputNumber :min="0" v-model="dictForm.value"></InputNumber></FormItem>
            <FormItem label="类型" prop="type">
                <Input v-model="dictForm.type"></Input></FormItem>
            <FormItem label="描述" prop="description">
                <Input v-model="dictForm.description"></Input></FormItem>
            <FormItem label="排序" prop="sort">
                <InputNumber :min="0" v-model="dictForm.sort"></InputNumber></FormItem>
            <FormItem label="父级编号" prop="parentId">
                <Select v-model="dictForm.parentId" clearable label-in-value @on-change="selectParentDict">
                    <Option v-for="item in dictList" :value="item.id" :key="item.id">
                        {{item.label }}
                    </Option>
                </Select>
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
          default: '新增字典'
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
          label: [
            {required: true, message: '标签名不能为空', trigger: 'blur'}
          ],
          value: [
            {type: 'number',required: true, message: '数据值不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '类型不能为空', trigger: 'blur'}
          ],
          sort: [
            {type: 'number',required: true, message: '类型不能为空', trigger: 'blur'}
          ]
        },
        dictForm: {
          id: this.initOption.id,
          value: null,
          label: null,
          type: null,
          description: null,
          sort: null,
          parentId: null,
          parentName: null,
        }
      }
    },
    methods: {

      init () {
        this.reset()
        this.getSelectList()
        if (this.initOption.action !== 'add') {
          this.getInfo()
        }
      },

      selectParentDict (option) {
        this.dictForm.parentName = option.label.trim()
      },

      getSelectList () {
        var $this = this
        $this.getDictCall('', function (res) {
          $this.dictList = res
        })
      },

      getInfo () {
        $http({
          path: this.apis.systemDict.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.dictForm = res.data
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.dictForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $http({
              path: this.apis.systemDict.add,
              method: 'post',
              data: this.dictForm
            }).then(response => {
              this.handleResult(response.data)
            })
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
          // this.$parent.dictFormInitOption.visible = false
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
