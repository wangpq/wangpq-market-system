<template>
    <div>
        <Modal id="cateFormDialog"
               v-model="initOption.visible"
               :mask-closable="false">
            <p slot="header" style="color:#f60;text-align:center;">
                <Icon type="information-circled"></Icon>
                <span>{{initOption.title}}</span>
            </p>
            <Form ref="cateForm"
                  :model="cateForm"
                  :rules="formRules"
                  :label-width="90">
                <FormItem label="分类名称" prop="cateName">
                    <Input class="Input" v-model="cateForm.cateName"></Input></FormItem>
                <FormItem label="分类图标">
                    <Input class="Input" v-model="cateForm.icon"></Input></FormItem>
                <FormItem label="排序" prop="sort">
                    <InputNumber :min="0" class="Input" v-model="cateForm.sort"></InputNumber></FormItem>
                <FormItem label="父节点">
                    <CateTreeCombo @selectNode="selectNode" ref="CateTreeCombo"></CateTreeCombo>
                </FormItem>
                <FormItem label="备注">
                    <Input class="Input" v-model="cateForm.remark"></Input></FormItem>

            </Form>

            <div slot="footer">
                <Button type="primary" @click="$parent.cateFormInitOption.visible = false"
                        v-if="initOption.action === 'view'">关闭
                </Button>
                <Button type="primary" @click="handleSubmit"
                        v-if="initOption.action === 'add' || initOption.action === 'edit'">保存
                </Button>
                <Button type="error" @click="reset" v-if="initOption.action === 'add'">重置</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'

  import CateTreeCombo from '@/components/tree/CateTreeCombo'

  export default {

    name: 'cateFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增商品分类'
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

        formRules: {
          cateName: [
            {required: true, message: '商品分类名称不能为空', trigger: 'blur'}
          ],
          sort: [
            {type: 'number',required: true, message: '排序不能为空', trigger: 'blur'}
          ]
        },
        cateForm: {
          id: this.initOption.id,
          cateName: null,
          remark: null,
          parentId: null,
          parentName: null,
          icon: null,
          sort: null,
        },
      }
    },
    methods: {

      init () { 
        this.reset();
        if (this.initOption.action == 'add') { 
          this.cateForm=this.initOption.row;
          this.$refs.CateTreeCombo.setNodeName(this.cateForm.parentName)
        }else{
          this.getInfo()
        }
      },

      //选择 父级菜单之后回调方法
      selectNode (opt) {
        this.cateForm.parentId = opt.id
        this.cateForm.parentName = opt.title
        console.log('选择父级菜单之后回调值：' + opt.id + opt.title)
      },

      getInfo () {
        $http({
          path: this.apis.productCate.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.copyValue(res.data, this.cateForm)
            this.$refs.CateTreeCombo.setNodeName(this.cateForm.parentName)
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.cateForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $http({
              path: this.apis.productCate.add,
              method: 'post',
              data: this.cateForm
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
          this.$parent.cateFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },

      //选择树节点
      selectTree () {
        var $this = this
        $this.$refs.commTree.getSelectedNodes(function (node) {
          console.log(node)
          if (node && node.length > 0 && node[0].id) {
            $this.cateForm.parentName = node[0].title
            $this.cateForm.parentId = node[0].id
          }
        })
      },

      reset () {
        this.clearObjData(this.cateForm);
        this.$refs.CateTreeCombo.setNodeName("");
      },
    },
    components: {
      CateTreeCombo
    },
  }
</script>
<style>
    .ivu-input-number {
        width: 100% !important;
    }
</style>
