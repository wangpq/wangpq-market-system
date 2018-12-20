<template>
    <div class="layout">
        <div v-bind:class="[leftClass.left,leftClass.leftToggle,leftClass.leftAni]">
            <AppMenu :iconSize="iconSize" :spanLeft="spanLeft"></AppMenu>
        </div>
        <div v-bind:class="[rightClass.right,rightClass.rightToggle]">
            <div class="layout-top">
                <Top></Top>
            </div>
            <div class="layout-center">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
            <div class="layout-foot">
                <PageFooter></PageFooter>
            </div>
        </div>
    </div>
</template>
<script>
  import AppMenu from '@/components/common/Menu'
  import PageFooter from '@/components/common/Footer'
  import Top from '@/components/common/Top'

  export default {
    data () {
      return {
        spanLeft: 2,
        spanRight: 20,
        rightClass: {
          right: 'layout-right',
          rightToggle: '',
        },
        leftClass: {
          left: 'layout-left',
          leftToggle: '',
          leftAni: '',
        },
      }
    },
    computed: {
      iconSize () {
        return this.spanLeft === 4 ? 15 : 24
      },
    },
    methods: {
      toggleMenu () {
        if (this.rightClass.rightToggle) {
          this.rightClass.rightToggle = '';
          this.leftClass.leftToggle = '';
          this.leftClass.leftAni = 'layout-left-animation';
        } else {
          this.leftClass.leftToggle = 'layout-left-toggle'
          this.rightClass.rightToggle = 'layout-right-toggle'
          this.leftClass.leftAni = ''
        }
      },

      unfoldLeftMenu () {
        this.rightClass.rightToggle = '';
        this.leftClass.leftToggle = '';
        this.leftClass.leftAni = 'layout-left-animation';
      },

      toggleClick () {
        if (this.spanLeft === 4) {
          this.spanLeft = 2
          this.spanRight = 22
        } else {
          this.spanLeft = 4
          this.spanRight = 20
        }
      },
      /**
       * 只针对查询条件是下拉的初始化，，，直接放入对应的页面就是不显示，
       */
      setDict () {
        //门店类型
        this.getDict('shop_type')
        //角色使用类型
        this.getDict('role_use_type')
        //菜单类型
        this.getDict('menu_type')
        //菜单使用类型
        this.getDict('menu_use_type')
        //供应商经营方式
        this.getDict('supplier_business_way')
        //审核状态
        this.getDict('checked_status');
        //商品上下架
        this.getDict('putaway_status')
        //支付方式
        this.getDict('pay_way')
        //支付状态
        this.getDict('pay_status')
        //订单类型
        this.getDict('order_type')
      },
    },
    mounted () {
      if (this.$store.state.user.token) {
        this.setDict()
      }
    },
    watch: {},
    components: {
      AppMenu,
      PageFooter,
      Top,
    }
  }
</script>
<style lang="scss">
    body {
        height: 100%;
        overflow-y: hidden;
        background-color: #f8f8f8;
    }

    .tabs {
        padding: 0 0 0 5px;
        .ivu-icon {
        }
        .ivu-tabs-bar {
            margin-bottom: 1px;
        }
    }

    .layout {
        position: relative;
        height: 100vh;
        background: #f5f7f9;

        .layout-left {
            width: 224px;
            position: absolute;
            overflow: visible;
            padding-bottom: 24px;
            height: 100vh;
            transition: all 0.3s ease-out;
            box-shadow: 4px 4px 20px 0 rgba(0, 0, 0, 0.01);
            z-index: 520;
            color: #999;
            border-right: 1px solid #dbdbdb;
            background: #fff;
            .layout-logo {
                text-align: center;
            }
            .layout-logo-left {
                text-align: center;
                font-size: 1.2em;

                img {
                    /*width: 180px;*/
                }
            }
            .layout-user-info {
                text-align: center;
                background: #E8E8E8;
                padding: 8px;

                img {
                    height: 67px;
                    width: 67px;
                    border-radius: 40px;
                    vertical-align: middle;
                }
                a {
                    font-size: 1.3em;
                }
            }
            .layout-hide-text .layout-text {
                display: none;
            }
        }
        .layout-left-toggle {

            width: 50px;
            .layout-logo {
                display: none;
            }

            .layout-user-info {
                img {
                    height: 30px;
                    width: 30px;
                    border-radius: 40px;
                    vertical-align: middle;
                }
                a {
                    display: none;
                }
            }

            .ivu-menu-light:after {
                display: none;
            }

            .ivu-menu {
                .menu-text {
                    display: none;
                }

                .ivu-menu-item {
                    display: none;
                }

                .ivu-menu-submenu-title {
                    padding: 14px 10px;
                }
                .ivu-menu-submenu-title:hover {
                    background: #2c3e50;
                }

                .ivu-menu-submenu-title-icon {
                    display: none;
                }

            }
        }

        .layout-left-animation {
            animation: fade-in; /*动画名称*/
            animation-duration: 1.3s; /*动画持续时间*/
            -webkit-animation: fade-in 1.3s; /*针对webkit内核*/
        }

        .layout-right {
            margin-left: 224px;
            height: 100vh;
            transition: all 0.3s ease-out;

            .layout-top {
                height: 7vh;
            }
            .layout-center {
                height: 89vh;
            }
            .layout-foot {
                height: 3vh;
            }

            .layout-content {
                margin: 5px 5px 0 5px;
                background: #fff;
                border-radius: 4px;
                min-height: calc(100vh - 112px);

                .layout-content-main {
                    padding: 10px;
                    min-height: 100%;
                }
            }
            .notice {
                height: 4vh;
                display: flex;
                justify-content: space-between;
                .n-right {
                    display: flex;
                    justify-content: flex-end;
                    padding: 6px 20px 0 0;
                    .ivu-badge {
                        cursor: pointer;
                        margin-right: 20px;
                    }

                    .logout:hover, .ivu-badge:hover {
                        color: #2dcc5c;
                    }

                    .logout {
                        cursor: pointer;
                        label {
                            font-size: 14px;
                        }
                    }
                }
                .n-left {
                    padding: 5px 0 0 10px;
                    cursor: pointer;
                }
            }

        }
        .layout-right-toggle {
            margin-left: 50px;
        }
    }

    .my-combo {
        line-height: 30px;
        height: 30px;
        width: 100%;
        &:disabled {
            background: gray;
            cursor: not-allowed;
        }

        .ivu-select-dropdown {
            z-index: 9000 !important;
        }

    }

    @keyframes fade-in {
        /*初始状态 透明度为0*/
        0% {
            opacity: 0;
        }
        80% {
            opacity: 0.8;
        }
        100% {
            opacity: 1;
        }
    }

    @-webkit-keyframes fade-in { /*针对webkit内核*/
        0% {
            opacity: 0;
        }
        80% {
            opacity: 0.8;
        }
        100% {
            opacity: 1;
        }
    }
</style>
