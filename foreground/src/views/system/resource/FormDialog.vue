<template>
    <div>
        <Modal id="menuFormDialog"
               v-model="initOption.visible"
               :mask-closable="false">
            <p slot="header" style="color:#f60;text-align:center;">
                <Icon type="information-circled"></Icon>
                <span>{{initOption.title}}</span>
            </p>
            <Form ref="menuForm"
                  :model="menuForm"
                  :rules="formRules"
                  :label-width="90">

                <FormItem label="菜单名称" prop="content">
                    <Input v-model="menuForm.content"></Input></FormItem>
                <FormItem label="父级菜单" prop="pid">
                    <MenuTreeCombo :initOption="initOption" @selectNode="selectNode" ref="MenuTreeCombo"
                                   v-model="menuForm.pid"></MenuTreeCombo>
                </FormItem>
                <FormItem label="菜单类型" prop="type">
                    <Select v-model="menuForm.type" clearable>
                        <Option v-for="item in apis.dictVal.menuType" :value="item.value" :key="item.value">
                            {{item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="使用范围" prop="useType">
                    <Select v-model="menuForm.useType" clearable>
                        <Option v-for="item in apis.dictVal.menuUseType" :value="item.value" :key="item.value">
                            {{item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="菜单图标" prop="resIcon">
                    <input class="ivu-input" v-model="menuForm.resIcon" v-on:dblclick="selectResIcon"
                           placeholder="双击图标拾取"></input>
                </FormItem>
                <FormItem label="访问路径" prop="url">
                    <Input v-model="menuForm.url" placeholder="例如：/sys/index"></Input>
                </FormItem>
                <FormItem label="按钮颜色" prop="resId">
                    <Select v-model="menuForm.resId">
                        <Option value="primary" label="primary">
                            <span style="float:left">
                                <Button type="primary">primary</Button>
                            </span>
                        </Option>
                        <Option value="" label="default">
                            <span style="float:left">
                                <Button type="">default</Button>
                            </span>
                        </Option>
                        <Option value="dashed" label="dashed">
                            <span style="float:left">
                                <Button type="dashed">dashed</Button>
                            </span>
                        </Option>
                        <Option value="info" label="info">
                            <span style="float:left">
                                <Button type="info">info</Button>
                            </span>
                        </Option>
                        <Option value="success" label="success">
                            <span style="float:left">
                                <Button type="success">success</Button>
                            </span>
                        </Option>
                        <Option value="warning" label="warning">
                            <span style="float:left">
                                <Button type="warning">warning</Button>
                            </span>
                        </Option>
                        <Option value="error" label="error">
                            <span style="float:left">
                                <Button type="error">error</Button>
                            </span>
                        </Option>
                        <Option value="danger" label="danger">
                            <span style="float:left">
                                <Button type="danger"
                                        style=" color: #fff; background-color: #f56c6c;  border-color: #f56c6c;">danger</Button>
                            </span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="按钮方法" prop="click">
                    <Input v-model="menuForm.click"></Input>
                </FormItem>
                <FormItem label="排序" prop="sort">
                    <InputNumber :min="0" v-model="menuForm.sort"></InputNumber>
                </FormItem>

            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit"
                        v-if="initOption.action === 'add' || initOption.action === 'edit'">保存
                </Button>
                <Button type="error" @click="reset" v-if="initOption.action === 'add'">重置</Button>
            </div>
        </Modal>
        <IconSelect :initOption="initIconOption"></IconSelect>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'

  import MenuTreeCombo from '@/components/tree/MenuTreeCombo'
  import IconSelect from '@/components/common/IconSelect'

  export default {

    name: 'menuFormDialog',
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
        initIconOption: {
          visible: false,
        },
        parentList: [],
        formRules: {
          content: [
            {required: true, message: '菜单名称不能为空', trigger: 'blur'}
          ],
          type: [
            {type: 'number', required: true, message: '菜单类型不能为空', trigger: 'blur'}
          ],
          useType: [
            {type: 'number', required: true, message: '使用范围不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '路径不能为空', trigger: 'blur'}
          ],
          click: [
            {required: true, message: '方法不能为空', trigger: 'blur'}
          ],
          sort: [
            {type: 'number', required: true, message: '排序不能为空', trigger: 'blur'}
          ],
        },
        menuForm: {
          id: null,
          content: null,
          type: null,
          useType: null,
          resId: null,
          resIcon: null,
          click: null,
          sort: null,
          pid: null,
          url: null,
        },
      }
    },
    methods: {

      init () {
        this.$refs.MenuTreeCombo.nodeName = this.initOption.row.title
        this.menuForm.pid = this.initOption.row.id
      },

      selectResIcon () {
        this.initIconOption.visible = true
      },

      //选择 父级菜单之后回调方法
      selectNode (id) {
        this.menuForm.pid = id
        console.log('选择父级菜单之后回调值：' + id)
      },

      setDict () {
        //获取数据字典
        this.getDict('menu_type', 'menuType')
        this.getDict('menu_use_type', 'menuUseType')
      },

      getInfo () {
        $http({
          path: this.apis.resource.view,
          method: 'get',
          data: {id: this.initOption.row.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            console.log('资源菜单修改查询：' + JSON.stringify(res.data))
            this.copyValue(res.data, this.menuForm)
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.menuForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $http({
              path: this.apis.resource.add,
              method: 'post',
              data: this.menuForm
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
          this.$parent.query()
          this.initOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.menuForm)
      },
    },

    mounted () {
      this.setDict()
    },
    components: {
      MenuTreeCombo,
      IconSelect
    }
  }
</script>
<style>
</style>
