<template>
  <div id="FrontFoot">

    <div class="item">
      <div class="c">
        <div class="p">

          <el-select v-model="waySelect" placeholder="自动" size="small" @change="onWaySelectChange" style="width:80px;margin-right:6px;">
            <el-option
              v-for="item in waySelectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="barcode" size="small" :placeholder="wayInputPlaceholder" @keyup.enter.native="onWayTargetEnter" @change="onWayTargetChange" style="width:145px;" ref="barcodeNode"></el-input>
          <label for="member" style="margin-left:6px;font-size:14px;">会员:</label>
          <el-input size="small" v-model="memberNameAndCode" ref="wayInputNode" placeholder="点击输入会员码"  readonly @focus="onFeedInMemberCodeBtnSelected" style="width:168px;cursor:pointer;"></el-input>
        </div>
        <div class="p">
            <div class="wp-btn" id="btnUpdatePrdCount" v-on:click="updatePrdCount">数量</div>
            <div class="wp-btn" id="btnDeleteSelectedPrd" @click="deleteSelectedPrd">删除</div>
            <div class="wp-btn" id="btnClearAllPrd" @click="clearAllPrd">清空</div>
            <div class="wp-btn" id="btnDoPresent" @click="doPresent">赠品</div>
            <div class="wp-btn" id="btnDoChargeback" @click="doChargeback">退单</div>
            <div class="wp-btn" id="btnDoEntryOrders" >
              <span class="txt" @click="doEntryOrders">挂单</span><span v-show="entryOrdersTotal>0" class="num" @click="onEntryOrdersTotalSelected">{{entryOrdersTotal}}</span>
            </div>
            <div class="wp-btn" id="btnDoMore" @click="doMore">客显</div>
        </div>
      </div>
    </div>

    <div class="item">
      <div class="c">
        <div class="wp-btn" id="btnNewMember" @click="addNewMember">新增会员</div>
      </div>
    </div>

    <div class="item">
      <dl class="account-zone">
        <dt>
          <div class="c">
            <p>总价：<span>¥ {{allProductPayPrice}}</span></p>
            <p>优惠：<span>¥ {{allProductTotalDiscounts}}</span></p>
          </div>
        </dt>
        <dd @click="settleAccounts">结算</dd>
      </dl>
    </div>

    <!-- 修改商品数量对话框 -->
    <el-dialog :visible.sync="prdCountDialogVisible" width="380px" :show-close=false :close-on-click-modal=false top="0vh" :center=true>
      <div class="prdCountDialogBody">
        <div class="p">
          <label for="name">商品名称：</label>
          <span>{{prdCountDialogPrdName}}</span>
        </div>
        <div class="p">
          <label for="count">商品数量：</label>
          <span id="count"><el-input-number v-model="salePrdCount" @change="onPrdCountDialogNumberChange" :min="1" label="商品数量" size="mini"></el-input-number>
</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="prdCountDialogBtnOk" size="small" round>确 定</el-button>
        <el-button type="info" @click="prdCountDialogVisible = false" size="small" round>取 消</el-button>
      </span>
    </el-dialog>

    <!-- 退单对话框 -->
    <el-dialog :visible.sync="chargebackDialogVisible" width="460px" :show-close=false :close-on-click-modal=false top="0vh" :center=true>
      <div class="chargebackDialogBody">
         <div class="p">
           <div class="item">
              <label for="code">输入退单码：</label>
           </div>
           <div class="item">
              <input type="text" v-model="chargebackCode"  ref="chargebackDialogInput" @keyup.enter="chargebackDialogBtnOk">
           </div>
         </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="chargebackDialogBtnOk" size="small" round>确 定</el-button>
        <el-button type="info" @click="chargebackDialogBtnCancel" size="small" round>取 消</el-button>
      </span>
    </el-dialog>

    <!-- 输入会员码对话框 -->
    <el-dialog :visible.sync="feedInMemberCodeDialogVisible" width="460px" :show-close=false :close-on-click-modal=false top="0vh" :center=true>
      <div class="chargebackDialogBody">
         <div class="p">
           <div class="item">
              <label for="code">输入会员码：</label>
           </div>
           <div class="item">
              <input type="text" v-model="membercode" ref="feedInMemberCodeDialogInput" id="feedInMemberCodeDialogInput" @keyup.enter="feedInMemberCodeDialogBtnOk">
           </div>
         </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="feedInMemberCodeDialogBtnOk" size="small" round>确 定</el-button>
        <el-button type="info" @click="feedInMemberCodeDialogBtnCancel" size="small" round>取 消</el-button>
      </span>
    </el-dialog>


    <!-- 退单详情对话框 -->
    <el-dialog :visible.sync="chargebackDetailsDialogVisible" width="460px" :show-close=false :close-on-click-modal=false top="0vh" :center=true>
      <div class="chargebackDetailsDialogBody">
        <dl>
          <dt class="dialogHeader">
            <div class="head">
              <i></i><span>退单详情</span>
            </div>
          </dt>
          <dd>
            <div class="hd">
              <table>
                <thead>
                  <tr>
                    <th>商品名称</th>
                    <th>商品金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in chargebackDetail" :key="item.productNo" :index="index">
                    <td>{{item.productName}}</td>
                    <td>¥{{item.payPrice}}</td>
                  </tr>
                </tbody>
              </table>

            </div>
            <div class="bd">
              总计：¥{{chargebackTotalPrice}}
            </div>
          </dd>
        </dl>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success"  @click="chargebackDetailsDialogBtnOk" size="mini" round>确 定</el-button>
        <el-button type="info" @click="chargebackDetailsDialogVisible = false" size="mini" round>取 消</el-button>
      </span>
    </el-dialog>

    <!-- 结算对话框 -->
    <el-dialog :visible.sync="accountDialogVisible" width="600px"  :show-close=true :close-on-click-modal=false :close-on-press-escape=false top="0vh" :center=true>
      <div class="accountDialogBody">
        <div class="item">
          <dl>
            <dt>
              <h4>日期：{{orderDetailsDate}}</h4>
              <div class="top">
                <p>
                  <label for="total">总金额：</label>
                  <span>¥ {{orderDetailsTotalPrice}}</span>
                </p>
                <p>
                  <label for="total">会员优惠：</label>
                  <span>¥ {{orderDetailsDiscountPrice}}</span>
                </p>
                <p>
                  <label for="total">积分抵扣：</label>
                  <span>¥ {{orderDetailsPointsDeduction}}</span>
                </p>
                <p>
                  <label for="total">其他优惠：</label>
                  <span>¥ {{orderDetailsOtherDiscounts}}</span>
                </p>
              </div>
              <div class="result">
                <p>
                  <label for="total">应收金额：</label>
                  <span>¥ {{orderDetailsActualAmount}}</span>
                </p>
                <p>
                  <label for="total">找零：</label>
                  <span>¥ {{orderDetailsChange}}</span>
                </p>
              </div>
            </dt>
            <dd>
              <el-button type="success" round @click="totalOrdersCancel" size="small">整单取消</el-button>
              <el-button type="primary" round @click="changeZero" size="small">抹零</el-button>
              <el-button type="warning" round @click="clearFen" size="small">去分</el-button>

              <!--
              <el-button type="warning" round @click="directPreferential" size="small">直接优惠</el-button>
              -->
            </dd>
          </dl>
        </div>
        <div class="item">
          <div class="hd payway">
            <!--<div class="item" @click="onAccountDialogPayZfb">-->
                <!--<i class="icon-zfb"></i>-->
                <!--<span>支付宝</span>-->
            <!--</div>-->
            <!--<div class="item" @click="onAccountDialogPayWeixin">-->
                <!--<i class="icon-weixin"></i>-->
                <!--<span>微信</span>-->
            <!--</div>-->
            <!--
            <div class="item" @click="onAccountDialogPayJfdk">
                <i class="icon-jfdk"></i>
                <span>积分抵扣</span>
            </div>
            -->

            <div class="item" @click="onAccountDialogPayJhzf">
                <i class="icon-jhzf"></i>
                <span>聚合支付</span>
            </div>
            <div class="item" @click="onPayUnionCloud">
              <i class="icon-union-cloud"></i>
              <span>云闪付</span>
            </div>
            <div class="item" @click="onLineScanCode">
                <i class="icon-jfdk"></i>
                <span>线下扫码</span>
            </div>
            <div class="item" @click="payAdvanceOnClick">
              <i class="icon-advance"></i>
              <span>预支付</span>
            </div>
          </div>
          <div class="bd">
             <div class="cash">
                <span class="item">
                  <input type="number" v-model="cashNum" placeholder="输入现金交易额" @keyup.enter="onCashEnter" @input="onCashChange" ref="cashInputNode">
                </span>
                <span class="item">
                  <i class="cancel" @click="onCancelAccountDialogCashNum"></i>
                  <i class="del" @click="onClearAccountDialogCashNums"></i>
                </span>
             </div>
             <div class="num-box">
               <table>
                 <tr>
                   <td @click="onAccountDialogNumSelect">1</td>
                   <td @click="onAccountDialogNumSelect">2</td>
                   <td @click="onAccountDialogNumSelect">3</td>
                 </tr>
                 <tr>
                   <td @click="onAccountDialogNumSelect">4</td>
                   <td @click="onAccountDialogNumSelect">5</td>
                   <td @click="onAccountDialogNumSelect">6</td>
                 </tr>
                 <tr>
                   <td @click="onAccountDialogNumSelect">7</td>
                   <td @click="onAccountDialogNumSelect">8</td>
                   <td @click="onAccountDialogNumSelect">9</td>
                 </tr>
                 <tr>
                   <td @click="onAccountDialogNumSelect">0</td>
                   <td @click="onAccountDialogNumSelect">.</td>
                   <td @click="onAccountDialogBtnOkSelect">确定</td>
                 </tr>
               </table>
             </div>
          </div>
        </div>
      </div>
    </el-dialog>


    <!-- 新增会员对话框 -->
    <el-dialog :visible.sync="addNewMemberDialogVisible" width="560px" :show-close=false :close-on-click-modal=false :append-to-body=false top="0vh" :center=true>
      <div class="addNewMemberDialogBody">
         <dl>
            <dt class="dialogHeader">
              <div class="head">
                <i></i><span>新增会员</span>
              </div>
            </dt>
            <dd class="dialogBody">
              <div class="p">
                <div class="item"><i>*</i>
                  <el-select size="small" v-model="addNewMemberDialogWay" placeholder="请选择">
                    <el-option
                      v-for="item in addNewMemberDialogSelect"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="item">
                  <el-input size="small" v-model="addNewMemberDialogUserTelOrIdCard" placeholder="请输入手机号或身份证号"></el-input>
                </div>
              </div>
              <div class="p">
                <div class="item"><i>*</i>姓名</div>
                <div class="item">
                  <el-input size="small" v-model="addNewMemberDialogUserName" placeholder="请输入用户姓名"></el-input>
                </div>
              </div>
              <div class="p">
                <div class="item"><i>*</i>性别</div>
                <div class="item">
                  <el-radio v-model="addNewMemberDialogSex" label="0">保密</el-radio>
                  <el-radio v-model="addNewMemberDialogSex" label="1">男</el-radio>
                  <el-radio v-model="addNewMemberDialogSex" label="2">女</el-radio>
                </div>
              </div>
              <div class="p">
                <div class="item">生日</div>
                <div class="item">
                  <el-date-picker
                    size="small"
                    v-model="addNewMemberDialogBirthday"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
              </div>
              <div class="p">
                <div class="item">备注</div>
                <div class="item">
                  <el-input
                    size="small"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="addNewMemberDialogNote">
                  </el-input>
                </div>
              </div>

            </dd>
         </dl>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="success" @click="addNewMemberDialogBtnOk" round>确 定</el-button>
        <el-button size="small" type="info" @click="addNewMemberDialogVisible = false" round>取 消</el-button>
      </span>
    </el-dialog>


    <!-- 挂单对话框 -->
    <transition name="fade">
    <div v-show="entryOrdersDialogVisible" width="60%" class="entryOrdersDialog" top="0vh" :center=true>
      <div class="dialog-wrap">
        <div class="dialog-body">
          <div class="entryOrdersDialogBody">
              <dl>
                <dt>
                  <div class="item">序号</div>
                  <div class="item order">单号</div>
                  <div class="item">序号</div>
                  <div class="item name">商品名称</div>
                  <div class="item">数量</div>
                  <div class="item">小计</div>
                </dt>
                <dd>

                  <ul>

                    <li class="tr" v-for='(order,index) in entryOrdersListArray' @click="entryOrdersDialogListSelected" :key="order.id" :index="index">
                      <div v-if="order.products.length>1" class="m">
                        <div class="item">
                          <div class="num">{{index+1}}</div>
                        </div>
                        <div class="item">
                          <div class="order">{{order.orderNo}}</div>
                        </div>
                        <div class="item">
                          <ul >
                            <li v-for='(item,idx) in order.products' :key="item.id">
                              <div class="item">{{idx+1}}</div>
                              <div class="item name">{{item.productName}}</div>
                              <div class="item">{{item.saleNumber}}</div>
                              <div class="item">¥{{item.payPrice}}</div>
                            </li>
                          </ul>
                        </div>

                      </div>
                      <div v-if="order.products.length==1" class="s">
                        <div class="item">
                          <div class="num">{{index+1}}</div>
                        </div>
                        <div class="item">
                          <div class="order">{{order.orderNo}}</div>
                        </div>
                        <div class="item">
                          <ul >
                            <li v-for='(item,idx) in order.products' :key="item.id">
                              <div class="item">{{idx+1}}</div>
                              <div class="item name">{{item.productName}}</div>
                              <div class="item">{{item.saleNumber}}</div>
                              <div class="item">¥{{item.payPrice}}</div>
                            </li>
                          </ul>
                        </div>
                      </div>

                    </li>
                  </ul>
                </dd>
              </dl>
          </div>
          <div class="dialog-footer">
            <div class="wrap">
              <el-button size="small" type="success" round  @click="entryOrdersDialogBtnOk">确 定</el-button>
              <el-button size="small" type="info" round  @click="entryOrdersDialogVisible=false">取 消</el-button>
              <el-button size="small" type="danger" round  @click="entryOrdersDialogBtnDelete">删 除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </transition>


    <!--在线支付弹出框 -->
    <el-dialog :visible.sync="payOnlineDialogVisible" width="8rem" :show-close=true  :close-on-click-modal=false :close-on-press-escape=false top="0vh" :center=true>
      <div class="payOnlineDialogBody">
        <div class="header">{{payOnlineDialogPayWay}}</div>
        <div class="body">
          <div class="p">
            <div class="item">
              <label for="code">支付金额：</label>
            </div>
            <div class="item">
              <span>¥{{orderDetailsActualAmount}}</span>
            </div>
          </div>

          <div class="p">
            <div class="item">
              <label for="code">支付码：</label>
            </div>
            <div class="item">
              <input type="text" v-model="payOnlineDialogCode" ref="payOnlineDialogInput" id="payOnlineDialogInput" :placeholder="payOnlinePlaceholder" @change="payOnlineDialogCodeChange">
            </div>
          </div>
        </div>

      </div>

    </el-dialog>

    <div style="display: none">{{updateProduct}}</div>

  </div>
</template>

<script>





import Vue from 'vue';
import subscreen from '@/utils/SubScreenUtils'

import {Button,Select,Dialog,InputNumber,Table,Radio,DatePicker,Input} from 'element-ui';
Vue.use(Button);
Vue.use(Select);
Vue.use(Dialog);
Vue.use(InputNumber);
Vue.use(Table);
Vue.use(Radio);
Vue.use(DatePicker);
Vue.use(Input);

import {
  mapGetters,
  mapActions
} from "vuex";

import api from '@/api/apiList'
import dateformat from '@/utils/dateformat'
import {getClosest,trim,isCardID,timeOutFn} from '@/utils/utils'
import {getLodop} from '@/utils/LodopFuncs'
import $http from '@/utils/httputils'

// 定义LODOP全局变量
let LODOP;

export default {
  name: 'FrontFoot',
  data() {
    return {
      // 输入会员码对话框展示变量
      feedInMemberCodeDialogVisible : false,
      // 挂单对话框展示变量
      entryOrdersDialogVisible : false,
      // 被选中的挂单
      entryOrdersSelectedArr : [],
      // 新增会员对话框展示变量
      addNewMemberDialogVisible : false,
      // 数量对话框展示变量
      prdCountDialogVisible : false,
      // 被修改数量商品的名称
      prdCountDialogPrdName : "",
      // 被修改数量商品id
      prdCountDialogPrdId : "",
      // 退单对话框
      chargebackDialogVisible : false,
      // 退单详情对话框
      chargebackDetailsDialogVisible : false,
      // 结算对话框展示变量
      accountDialogVisible : false,
      // 结算对话框输入现金默认值
      defaultCashNum : "",
      // 结算对话框输入现金初始值,
      cashNum : "",
      // 结算加载等待框
      cashWaitLoading : "",
      // 结算支付状态，默认支付失败
      cashFlag : false,
      // 新增会员---手机或身份证方式
      addNewMemberDialogWay : 1,
      // 新增会员---性别单选框值
      addNewMemberDialogSex : "0",
      // 新增会员---生日选择
      addNewMemberDialogBirthday :"",
      // 新增会员---手机号或者身份证号
      addNewMemberDialogUserTelOrIdCard : "",
      // 新增会员---用户名
      addNewMemberDialogUserName : "",
      // 新增会员---备注
      addNewMemberDialogNote : "",

      // 收银底部select选择框
      barcode : "",
      // 会员信息
      memberInfo : "",
      // 收银底部会员输入框
      membercode : "",
      // 会员名和会员码 eg ： 李四(15132548545)
      memberNameAndCode : "",

      // 订单号
      orderDetailsNo : "",
      // 订单日期
      orderDetailsDate : "",
      // 总金额
      orderDetailsTotalPrice : 0,
      // 会员优惠
      orderDetailsDiscountPrice: 0,
      // 积分抵扣(暂时为0)
      orderDetailsPointsDeduction: 0,
      // 其他优惠(暂时为0)
      orderDetailsOtherDiscounts: 0,
      // 订单应收金额
      orderDetailsActualAmount : 0,
      // 找零
      orderDetailsChange : 0,

      // 默认销售商品数量
      salePrdCount : 1,
      // 退单对话框---退单码输入框(要退单的单号)
      chargebackCode : "",

      // 在线支付弹出框---展示变量
      payOnlineDialogVisible : false,
      // 在线支付弹出框---支付方式
      payOnlineDialogPayWay : "",
      // 在线支付弹出框---支付码
      payOnlineDialogCode : "",
      // 在线支付弹出框---输入框placeholder
      payOnlinePlaceholder : "",

      addNewMemberDialogSelect : [
        {
          value: 2,
          label: '身份证'
        },
        {
          value: 1,
          label: '手机号'
        }
      ],
      // 退单详细
      chargebackDetail : [],
      // 退单总价
      chargebackTotalPrice :"",
      waySelectOptions: [
        {
          value: '自动',
          label: '自动'
        },
        /*
        {
          value: '名称',
          label: '名称'
        },
        */
        {
          value: '条形码',
          label: '条形码'
        }
      ],
      waySelect: '自动',
      wayInputPlaceholder : "请扫入条形码"
    }
  },
  methods:  {
    // 自动+名称+条形码 下拉选择框
    onWaySelectChange : function(val){
      this.waySelect=val;
      if(val==="自动"){
        this.wayInputPlaceholder="请扫入条形码"
      }
      /*
      if(val==="名称"){
        this.wayInputPlaceholder="请输入名称"
      }
      */
      if(val==="条形码"){
        this.wayInputPlaceholder="请输入条形码"
      }
    },
    onWayTargetChange (){
      if(this.waySelect==="自动"){
        this.onWayInputChange();
      }
    },
    onWayTargetEnter(){
      if(this.waySelect==="条形码"){
        this.onWayInputChange();
      }
    },
    // 自动+名称+条形码 文本框
    onWayInputChange : function(){
      // /product/sales

      let memberId=this.memberInfo ? JSON.parse(this.memberInfo).id : "";

      // 获取商品名称价格等信息  /product/sales

      this.$ajax.get(api.queryChainSales, {
        params: {
          code : this.barcode.trim(), // 条形码
          memberId : memberId // 会员Id
        }
      })
      .then( (response) =>{

        timeOutFn(this,response,()=>{
          if(response.status==200){
              let res=response.data;
              //console.log("----onWayInputChange-----获取商品名称价格等信息-----/product/sales-------------")
              //console.log(res)

              if(res.success){
                let prd=res.data;
                prd.saleNumber=1;
                prd.totalPrice=(prd.salePrice-prd.discountPrice).toFixed(2);
                prd.payPrice=(prd.salePrice-prd.discountPrice).toFixed(2);
                prd.totalDiscount=prd.discountPrice.toFixed(2);

                // 存储会员信息
                prd.memberInfo=this.memberInfo;

                this.$store.dispatch('addPrdToProductList',prd);
                this.$store.dispatch('countAllProductTotalPriceDiscount');

                this.barcode="";
            }else{
                this.$toast(res.message);
                this.barcode="";
            }
          }

        })
      })
      .catch( (error)=> {
      });
    },
    entryOrdersDialogListSelected : function(evt){
      let targetNode=getClosest(evt.target,".tr");

      let _index=parseInt(targetNode.getAttribute("index"));
      let productListSelectItem=this.$store.state.product.entryOrdersList[_index];
      let idx=this.entryOrdersSelectedArr.findIndex(x => x.id == productListSelectItem.id);

      if(targetNode.className.indexOf("active")>-1){
        targetNode.classList.remove("active");
        if(idx>=0){
          this.entryOrdersSelectedArr.splice(idx,1);
        }
      }else{
        targetNode.classList.add("active");
        if(idx<0){
          this.entryOrdersSelectedArr.push(productListSelectItem);
        }
      }
      //console.log("------entryOrdersDialogListSelected-------------");
      //console.log(this.entryOrdersSelectedArr);

    },
    // 挂单对话框---确定按钮
    entryOrdersDialogBtnOk : function(){
      if(this.entryOrdersSelectedArr.length==1){
        this.entryOrdersDialogVisible=false;
        this.dropEntryOrdersToprdList();
      }else if(this.entryOrdersSelectedArr.length>1){
        this.$toast({
          message : '请选择单个挂单商品！',
          showBtn : true
        });
      }else{
        this.$toast({
          message : '当前没有挂单商品！',
          showBtn : true
        });
      }
    },
    // 选择挂单商品返回商品列表
    dropEntryOrdersToprdList : function(){
      let item=this.entryOrdersSelectedArr[0];
      this.$ajax.put(api.queryDownside,{
        "orderNo":item.orderNo
      })
      .then( (response) =>{

        timeOutFn(this,response,()=>{


          if(response.status &&  response.data && response.data.success){

            let entryOrdersSelected=this.entryOrdersSelectedArr[0].products;
            this.$store.dispatch('emptyProductList');
            this.$store.dispatch('delFromEntryOrdersList',entryOrdersSelected);
            this.$store.dispatch('addPrdToProductList',entryOrdersSelected);
            this.$store.dispatch('countAllProductTotalPriceDiscount');


            // 重置会员信息
            this.memberInfo=entryOrdersSelected[0].memberInfo;
            let memberTarget=this.memberInfo? JSON.parse(this.memberInfo) : "";
            this.memberNameAndCode=this.memberInfo ? memberTarget.name+ "("+memberTarget.memberCode+")"  : "";

            // 重置已选中挂单数组
            this.entryOrdersSelectedArr=[];
          }else{
            this.$toast({
              message : "选取挂单"+item.orderNo+"失败",
              showBtn : true
            });
          }


        })




      })
      .catch( (error)=> {
      });

    },
    // 挂单对话框---删除
    entryOrdersDialogBtnDelete : function(){
      if(this.entryOrdersSelectedArr.length==0){
        this.$toast({
          message : '删除前请选择挂单商品！',
          showBtn : true
        });
      }else{

        //console.log('------      console.log(this.entryOrdersSelectedArr);---------');
        //console.log(this.entryOrdersSelectedArr);

        this.dropEntryOrders();
      }
    },
    dropEntryOrders : function(){

      this.entryOrdersSelectedArr.forEach((item,idx)=>{

         let index=idx;
         this.$ajax.put(api.queryDownside,{
            "orderNo":item.orderNo
         })
        .then( (response) =>{
          //console.log("--------dropEntryOrders------");
          //console.log(this.entryOrdersSelectedArr);
          //console.log(item);

          timeOutFn(this,response,()=>{
            if(response.status &&  response.data && response.data.success){
              this.$store.dispatch('delFromEntryOrdersList',item);
              this.$toast({
                message : response.data.message || "删除挂单成功",
                showBtn : true
              });
            }else{
              this.$toast({
                message : response.data.message || "删除挂单失败",
                showBtn : true
              });
            }
          })

        })
        .catch( (error)=> {
        });
      })

      // 重置已选中挂单数组
      this.entryOrdersSelectedArr=[];


    },

    // 新增会员---保存按钮
    addNewMemberDialogBtnOk: function(){
      // 日期格式不能trim
      //this.addNewMemberDialogBirthday=trim(this.addNewMemberDialogBirthday);
      this.addNewMemberDialogUserTelOrIdCard=trim(this.addNewMemberDialogUserTelOrIdCard);
      this.addNewMemberDialogUserName =trim(this.addNewMemberDialogUserName);
      this.addNewMemberDialogNote=trim(this.addNewMemberDialogNote);

      if(this.addNewMemberDialogUserTelOrIdCard.length!==11 && this.addNewMemberDialogWay==1){
        this.$toast("请输入正确的手机号！");
        return false;
      }

      if(this.addNewMemberDialogWay==2){

        if(this.addNewMemberDialogUserTelOrIdCard==""){
          this.$toast("请输入正确的身份证号！");
          return false;
        }else{
          let flag=isCardID( this.addNewMemberDialogUserTelOrIdCard );
          if(flag!==true){
            this.$toast(flag);
            return false;
          }
        }
      }

      if(this.addNewMemberDialogUserName==""){
        this.$toast("请输入姓名！");
        return false;
      }
      if(this.addNewMemberDialogSex==""){
        this.$toast("请选择性别！");
        return false;
      }

      let birthday="";
      if(!!this.addNewMemberDialogBirthday){
        birthday=dateformat.format(this.addNewMemberDialogBirthday, 'yyyy-MM-dd hh:mm:ss');
      }

      let ajaxParam={
          // 新增会员---手机或身份证方式
          type : this.addNewMemberDialogWay,
          // 新增会员---性别单选框值
          gender : this.addNewMemberDialogSex,
          // 新增会员---生日选择
          birthday : birthday,
          // 新增会员---手机号或者身份证号
          mobile : this.addNewMemberDialogUserTelOrIdCard,
          // 新增会员---用户名
          name : this.addNewMemberDialogUserName ,
          // 新增会员---手机号或身份证号
          code : this.addNewMemberDialogUserTelOrIdCard,
          // 新增会员---备注
          remark : this.addNewMemberDialogNote
      }

      this.$ajax
      .post(api.queryMember,ajaxParam)
      .then( (response) =>{
        timeOutFn(this,response,()=>{
          let res=response.data;
          //console.log(res);
          if(res.success){
            this.addNewMemberDialogVisible=false;
            this.$toast('新增会员成功！');
          }else{
            this.addNewMemberDialogVisible=false;
            this.$toast(res.message || '新增会员失败！');
          }
        })
      })
      .catch( (error)=> {
      });

    },
    // 数量---修改数量对话框---数值改变
    onPrdCountDialogNumberChange: function(value){
      //alert(value);
      this.salePrdCount=value;
      return false;
    },
    // 点击会员输入框
    onFeedInMemberCodeBtnSelected  : function(){
      this.feedInMemberCodeDialogVisible=true;
      let timer=window.setTimeout(()=>{
        window.clearTimeout(timer);
        let targetNode=this.$refs.feedInMemberCodeDialogInput;
        targetNode.focus();
      },180)
    },
    //  会员---输入会员码对话框---取消按钮
    feedInMemberCodeDialogBtnCancel : function(){
      this.feedInMemberCodeDialogVisible=false;
      this.$refs.feedInMemberCodeDialogInput.value="";
    },
    //  会员---输入会员码对话框---确定按钮
    feedInMemberCodeDialogBtnOk : function(){
        this.feedInMemberCodeDialogVisible=false;

        this.membercode= trim(this.membercode);

        if(this.membercode==""){
          this.memberNameAndCode="";
          this.memberInfo="";
        }

        let productIds="";
        if(this.$store.state.product.productList.length>0){
          this.$store.state.product.productList.forEach((item)=>{
            productIds+=","+String(item.id)
          })
          productIds=productIds.substr(1);
        }


        // 无会员
        if(this.membercode==""){
          // 有商品
          if(productIds!==""){
            // 重新生成挂单
            this.queryEntryOrders();
            // 修改所有商品折扣为1
            this.$store.dispatch('modifyProductListAllRatioOne');
            // 触发更新总价优惠
            this.$store.dispatch('countAllProductTotalPriceDiscount');
          }
          // 无商品
          else{
            // 重新生成挂单
            this.queryEntryOrders();
          }
        }
        // 有会员
        else{
          // /member/sales
          this.$ajax
          .get(api.queryMemberSales,{
            params : {
              code : this.membercode,
              productIds : productIds
            }
          })
          .then( (response) =>{

            timeOutFn(this,response,()=>{

              let res=response.data;
              //console.log("--------会员---输入会员码对话框---确定按钮-------queryMemberSales-------")
              //console.log(res);
              if(res.success && res.data){

                let memberObj=res.data.member;
                // 会员信息
                this.memberInfo=JSON.stringify(memberObj);
                this.memberNameAndCode="("+memberObj.name+")"+memberObj.memberCode;

                // 重新生成挂单
                this.queryEntryOrders();

                // 如果存在商品列表
                if(res.data.products){

                  let products=res.data.products;
                  products.forEach((item,index)=>{
                    products[index].memberInfo=memberObj;
                  })

                  this.$store.dispatch('modifyProductListDiscountRatio',products);
                  // 触发更新总价优惠
                  this.$store.dispatch('countAllProductTotalPriceDiscount');

                }
              }else{
                this.$toast(res.message || "请输入正确的会员码！");
              }

            })

          })
          .catch( (error)=> {

          });


        }
    },
    // 数量---修改数量对话框---确定按钮
    prdCountDialogBtnOk: function(){

      this.prdCountDialogVisible=false;
      // /product/convert
      this.$ajax.get(api.queryPrdConvert, {
        params: {
          memberId : this.memberInfo ? JSON.parse(this.memberInfo).id : "",
          number : this.salePrdCount ,
          productId : this.prdCountDialogPrdId
        }
      })
      .then( (response) =>{

        timeOutFn(this,response,()=>{
          //console.log("------数量---修改数量对话框---确定按钮-------/product/convert------------------------")
          //console.log(response.data)
          if(response.status=200){
            let res=response.data;
            if(res.success){
              let prd=res.data;
              let prdArr=[];
              prd.forEach((item,index)=>{
                let p=item.product;
                p.saleNumber=item.number;
                p.payPrice=((p.salePrice-p.discountPrice )*p.saleNumber).toFixed(2);
                p.totalDiscount=(p.discountPrice*p.saleNumber).toFixed(2);
                prdArr.push(p);
              })


            let index=this.$store.state.product.productList.findIndex(x => x.id == this.prdCountDialogPrdId);
            this.$store.dispatch('deleteProductListById',this.prdCountDialogPrdId);

            this.$store.dispatch('addPrdToProductListToIndex',{product:prdArr,index:index});
            this.$store.dispatch('countAllProductTotalPriceDiscount');

            }
          }
        })
      })
      .catch( (error)=> {
      });
    },
    // 退单---输入退单码对话框---确定按钮
    chargebackDialogBtnOk : function(){

      if(this.chargebackCode!==""){
        this.chargebackDialogVisible=false;
        this.chargebackDetailsDialogVisible=true;

        // ajax 获取要退单商品详细数据
        this.$ajax
        .get(api.queryProductLists,{
          params :{
             "orderNo" : this.chargebackCode
          }
        })
        .then( (response) =>{
          timeOutFn(this,response,()=>{
            let res=response.data;
            if(res.success && res.data && res.data.length>0){
              this.chargebackDetail =res.data;
              this.chargebackTotalPrice=this.chargebackDetail[0].totalPrice;
            }
          })
        })
        .catch( (error)=> {
        });
      }else{
        this.$toast({
          message : '请输入退单码！',
          showBtn : true
        });
      }
    },
    chargebackDialogBtnCancel : function(){
      this.chargebackCode=="";
      this.chargebackDialogVisible=false;
    },
    // 退单---退单详情对话框---确定按钮
    chargebackDetailsDialogBtnOk : function(){
      this.chargebackDetailsDialogVisible=false;

      this.$ajax
      .post(api.queryOrderRefund,{
        parentNo  : this.chargebackCode
      })
      .then( (response) =>{
        let res=response.data;
        console.log("退单数据:",res)
        if(res.success){
          this.$toast('退单成功！');
        }
      })
      .catch( (error)=> {

      });
    },
    // 数量按钮
    updatePrdCount : function (event) {
      let prdSelect= this.$store.state.product.productListSelect;
      let {length}= prdSelect;
      if(length==1){
        this.prdCountDialogVisible=true;
        this.prdCountDialogPrdName=prdSelect[0].productName;
        this.prdCountDialogPrdId=prdSelect[0].id;
        this.salePrdCount=prdSelect[0].saleNumber;
      }else if(length>1){
        this.$toast({
          message : '修改数量请选择单个商品！',
          showBtn : true
        });
      }else{
        this.$toast({
          message : '请选择您要修改数量的商品！',
          showBtn : true
        });
      }
    },
    // 删除
    deleteSelectedPrd : function (event) {
      if(this.$store.state.product.productListSelect.length>0){
        this.$store.dispatch('deleteProductList',this.$store.state.product.productListSelect);
        this.$store.dispatch('emptyProductListSelect');
        this.$store.dispatch('countAllProductTotalPriceDiscount');
        this.$toast('删除成功');
      }else{
        this.$toast({
          message : '请选择您要删除的商品！',
          showBtn : true
        });
      }
    },
    // 清空按钮
    clearAllPrd : function (event) {
      this.$store.dispatch('emptyProductList');
      this.$store.dispatch('emptyProductListSelect');
      this.$store.dispatch('countAllProductTotalPriceDiscount');
      this.refreshSub({clear:true});
    },
    // 赠品按钮
    doPresent : function (event) {
      // this.$toast("正在开发，敬请期待！");
    },
     // 退单按钮
    doChargeback : function (event) {
      //alert("退单F8");
      this.chargebackDialogVisible=true;
      this.chargebackCode="";
      let timer=window.setTimeout(()=>{
        this.$refs.chargebackDialogInput.focus();
        window.clearTimeout(timer);
      },480)
    },
    // 挂单按钮
    doEntryOrders : function (event) {
      // 执行挂单操作


      let productList=this.$store.state.product.productList
      if(productList.length>0){

        let prdsArr=[];
        this.$store.state.product.productList.forEach((item,index)=>{
          prdsArr.push({
            number : item.saleNumber,
            productId : item.id
          })
        })
        let ajaxParam={
          "cashierId": localStorage.getItem("userId"),  //收银员ID
          "memberId": this.memberInfo ? JSON.parse(this.memberInfo).id : "",   //用户会员ID
          "products": prdsArr
        }

        // 创建挂单  /chain/order/upside
        this.$ajax
        .post(api.queryCreateEntryOrder,ajaxParam)
        .then( (response) =>{
          timeOutFn(this,response,()=>{
            let res=response.data;
            //console.log("-----创建挂单---doEntryOrders---ajax----");
            //console.log(res);
            if(res.success && res.data){
              // 挂单成功，查询挂单
              this.queryEntryOrders();
              this.$store.dispatch('emptyProductList');
            }else{
              this.$toast("创建挂单失败！")
            }
          })
        })
        .catch( (error)=> {
        });

      }else{
        this.$toast({
          message : '当前没有商品！',
          showBtn : true
        });
      }
    },
    // 查询挂单
    queryEntryOrders : function(){

      let nowDate=new Date();
      let endTime=dateformat.format(nowDate, 'yyyy-MM-dd hh:mm:ss');

      let startTime=dateformat.format(new Date(nowDate.getTime() - 1*24*60*60*1000) , 'yyyy-MM-dd hh:mm:ss');
      //console.log(startTime)
      const ajaxParam={
        "endTime": endTime,
        "limit": 100,  // 每页显示条数
        "memberId": this.memberInfo ? JSON.parse(this.memberInfo).id : "",
        "orderStatus": 0, // 挂起
        "orderType": 1, // 1 挂单
        "pageIndex": 1, // 第一页
        "startTime": startTime
      }

      // 获取挂单  /chain/order/search
      this.$ajax
      .post(api.queryOrder,ajaxParam)
      .then( (response) =>{

        timeOutFn(this,response,()=>{

          let res=response.data;

          //console.log("----获取挂单--queryEntryOrders--/chain/order/search---ajax----");
          //console.log(res);

          if(res.success && res.data){

            let entryOrdersList= res.data.list;
            entryOrdersList.forEach((item,index)=>{
              let products=item.products;
                products.forEach((prd,idx)=>{

                  // 这里的id不是productId，重置一遍
                  prd.id=prd.productId;
                  if(prd.ratio==null || prd.ratio==undefined){
                    prd.ratio=1;
                  }

                  prd.totalDiscount=(prd.discountPrice*prd.saleNumber).toFixed(2);
                  prd.totalPrice= (prd.payPrice*prd.saleNumber).toFixed(2);

                  if(item.memberName){
                    prd.memberInfo=JSON.stringify({
                      "id": item.memberId || "",
                      "name": item.memberName || "",
                      "memberCode": item.memberCode || ""
                    })
                  }else{
                    prd.memberInfo="";
                  }

                })
            })

            this.$store.dispatch('addToEntryOrdersList', entryOrdersList);
            this.$store.dispatch('countAllProductTotalPriceDiscount');

          }

        })

      })
      .catch( (error)=> {
      });
    },
    // 挂单按钮数字
    onEntryOrdersTotalSelected : function(evt){
      // 阻止冒泡防止触发挂单按钮
      evt.stopPropagation();

      if(this.entryOrdersTotal>0){
        this.entryOrdersDialogVisible=true;
        this.queryEntryOrders();
      }
    },
    // 更多按钮
    doMore : function (event) {
      // this.$toast("正在开发，敬请期待！");
      this.openSubScreen();

    },
    // 新增会员按钮
    addNewMember: function (){
      this.addNewMemberDialogVisible=true;
    },
    // 结算按钮
    settleAccounts: function (){

      if(this.$store.state.product.productList.length==0){
        return false;
      }

      // 清除可能存在的上次输入的值
      this.cashNum="";

      // ajax 创建订单
      //  /chain/order/create

      let products=[];
      this.$store.state.product.productList.forEach((item)=>{
        products.push({
          number : item.saleNumber,
          productId : item.id
        })
      })


      let ajaxParam={
        "cashierId": JSON.parse(localStorage.getItem("userInfo")).id, // 收银员ID
        "memberId": this.memberInfo ? JSON.parse(this.memberInfo).id : "",  // 用户会员Id
        "products": products
      }




      // 清空商品列表 （放到结算成功、或者整单取消成功、以后执行）
      // this.$store.dispatch('emptyProductList');


      this.$ajax
      .post(api.queryCreateOrder,ajaxParam)
      .then( (response) =>{


        timeOutFn(this,response,()=>{

          this.accountDialogVisible=true;

          let res=response.data;
          if(res.success && res.data){
            let result=res.data;
            this.refreshSub({
              order:result,
              status:'结算中...'
            });

            // 当前订单号
            this.orderDetailsNo=result.orderNo;
            // 订单时间
            this.orderDetailsDate=result.saleTime;
            // 总金额
            this.orderDetailsTotalPrice=result.salePrice;
            // 会员优惠
            this.orderDetailsDiscountPrice=result.discountPrice;
            // 积分抵扣(暂时为0)
            this.orderDetailsPointsDeduction =0;
            // 其他优惠(暂时为0)
            this.orderDetailsOtherDiscounts=0;
            // 应收金额：
            this.orderDetailsActualAmount=result.payPrice;
            // 找零
            this.orderDetailsChange=0;

          }

          // 自动选中输入框
          let timer=window.setTimeout(()=>{
            this.$refs.cashInputNode.focus();
            window.clearTimeout(timer);
          },0)

        })
      })
      .catch( (error)=> {
      });
    },
    //关闭结算
    closeBalance(dialog){
      this.accountDialogVisible=false;
      this.$ajax
        .delete(api.queryOrderDelete,{
          params :{
            orderNo  : this.orderDetailsNo
          }
        })
        .then( (response) =>{
          let res=response.data;
          if(res.success){
            this.$toast('成功取消订单！');
            this.refreshSub({clear:true});
          }
        })
        .catch( (error)=> {

        });
    },
    // 结算对话框---整单取消
    totalOrdersCancel : function (){
      //alert("整单取消");
      this.accountDialogVisible=false;

       //console.log("-----结算对话框---整单取消---orderNo---------");
       //console.log(this.orderDetailsNo);

      this.$ajax
      .delete(api.queryOrderDelete,{
        params :{
          orderNo  : this.orderDetailsNo
        }
      })
      .then( (response) =>{
        let res=response.data;

        //console.log("-----结算对话框---整单取消---ajax---------");
        //console.log(res);

        if(res.success){
          this.$toast('成功取消订单！');
          this.refreshSub({clear:true});
          this.$store.dispatch('emptyProductList');
          this.$store.dispatch('countAllProductTotalPriceDiscount');
        }else{
          this.$toast('取消订单失败！');
        }
      })
      .catch( (error)=> {
          this.$toast('取消订单失败！');
      });
    },
    // 结算对话框---抹零
    changeZero : function (){
      this.$ajax
      .put(api.queryOrderIntegral,{
         orderNo  : this.orderDetailsNo
      })
      .then( (response) =>{
        let res=response.data;
        //console.log("-----结算对话框---抹零-ajax---------");
        //console.log(res.data);
        if(res.success){
          //this.$toast('抹零成功！');
          this.orderDetailsActualAmount=res.data.payPrice;
          this.orderDetailsDiscountPrice=res.data.discountPrice;
          this.refreshSub({
            order:res.data,
            status:'结算中...'
          });
          // 从新计算找零
          this.autoGetZero();
        }else{
          this.$toast('抹零操作失败啦！');
        }
      })
      .catch( (error)=> {
        this.$toast('抹零操作失败啦！');
      });
    },
    // 结算对话框---去分
    clearFen (){
      this.$ajax
      .put(api.queryOrderDivision,{
         orderNo  : this.orderDetailsNo
      })
      .then( (response) =>{
        let res=response.data;
        if(res.success){
          this.orderDetailsActualAmount=res.data.payPrice;
          this.orderDetailsDiscountPrice=res.data.discountPrice;
          console.log("去分数据:",res)
          this.refreshSub({
            order:res.data,
            status:'结算中...'
          });
          // 从新计算找零
          this.autoGetZero();
        }else{
          this.$toast('去分操作失败啦！');
        }
      })
      .catch( (error)=> {
        this.$toast('去分操作失败啦！');
      });
    },



    //  结算对话框---直接优惠
    directPreferential : function (){
      //alert("直接优惠");
      this.accountDialogVisible=false;
    },
    // 结算对话框---表格数字选中
    onAccountDialogNumSelect : function (evt){
      if(evt){
        let num=evt.target.innerText;
        if(this.cashNum!==this.defaultCashNum){
          if(this.cashNum.indexOf(".")>-1){
            let a=this.cashNum.split(".")[1];
            if(a.length<2){
              this.cashNum+=num;
            }
          }else{
            this.cashNum+=num;
          }
        }else{
           this.cashNum=num;
        }

        this.$refs.cashInputNode.focus();
        this.autoGetZero();
      }
    },
    // 在线支付
    payOrderOnline : function(){

      this.cashWaitLoading = this.$loading({
        lock: true,
        spinner: 'my-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      });

      this.$ajax
      .post(api.queryPayOnline,{
        "orderNo":  this.orderDetailsNo,
        "code": this.payOnlineDialogCode
      })
      .then( (response) =>{

        let res=response.data;

        //console.log("-------payOrderOnline--在线支付---parms----");
        /*
        console.log({
        "orderNo":  this.orderDetailsNo,
        "code": this.payOnlineDialogCode
        });
        */
        //console.log("-------payOrderOnline--在线支付---ajax---res----");
        //console.log(res);

        // 支付成功
        if(res.success){
          this.onPaySuccess();
        }
        // 支付可能失败
        else{
          this.onPayFail();
        }

      })
      .catch( (error)=> {
        this.onPayFail();
      });
    },
    // 云闪付
    payUnionCloud : function(){
      this.cashWaitLoading = this.$loading({
        lock: true,
        spinner: 'my-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      });

      this.$ajax
      .post(api.queryUnionCloud,{
        "orderNo":  this.orderDetailsNo,
        "code": this.payOnlineDialogCode
      })
      .then( (response) =>{
        let res=response.data;
        // 支付成功
        if(res.success){
          this.onPaySuccess();
        }
        // 支付可能失败
        else{
          this.onPayFail();
        }
      })
      .catch( (error)=> {
        this.onPayFail();
      });
    },
    // 现金结算处理
    payOrderCash : function(){

      if(this.cashNum==""){
        this.$toast("请输入现金交易额!");
        return false;
      }
      if( !!this.cashNum && parseFloat(this.cashNum)< parseFloat(this.orderDetailsActualAmount)  ){
        this.$toast("请正确输入现金交易额!");
        return false;
      }


      this.autoGetZero();


      // ajax  /payment/cash
      this.$ajax
      .post(api.queryPayCash,{
        "orderNo":  this.orderDetailsNo,
        "money": this.cashNum
      })
      .then( (response) =>{
        let res=response.data;

        //console.log("-------payOrderCash--现金结算处理-------");
        //console.log(res);



        // 支付成功
        if(res.success){
          this.onPaySuccess();
        }
        // 支付失败
        else{
          this.onPayFail();
        }

        // 延时关闭结算弹出框
        let timer=window.setTimeout(()=>{
          this.payOnlineDialogVisible=false;
          this.accountDialogVisible=false;
          this.refreshSub({
            clear:true});
          window.clearTimeout(timer);
        },4000)

      })
      .catch( (error)=> {

      });
    },
    // 支付失败
    onPayFail : function(){
      // cashFlag : 支付状态。默认失败
      this.cashFlag=false;
      this.onQueryPaymentQuery();

      // 若一分钟内任然查询失败，则默认支付失败啦
      let _nums=1;
      let timer=window.setInterval(()=>{
        if(this.cashFlag){
          window.clearInterval(timer);
        }else{
          _nums=_nums+1;
          if(_nums<=30){
            this.onQueryPaymentQuery();
          }else{
            this.$toast({
              autoHide : true,
              message : "订单支失败!"
            });

            // 关闭加载框
            this.cashWaitLoading && this.cashWaitLoading.close();
            window.clearInterval(timer);
            this.payOnlineDialogVisible=false;
            this.accountDialogVisible=false;
          }
        }
      },2000)

    },
     // 查询订单支付状态
    onQueryPaymentQuery(){
      // ajax /payment/query
      this.$ajax
      .get(api.queryPaymentQuery,{
        params : {
          "orderNo":  this.orderDetailsNo
        }
      })
      .then( (response) =>{
        let res=response.data;

        // 成功返回订单实体
        // payStatus 已支付
        if(res.success && res.data){
          if(res.data.payStatus==1){
            this.cashFlag=true;
            this.onPaySuccess();
          }else{
            this.cashFlag=false;
            //this.$toast("订单支付失败!");
          }
        }
        // 返回订单实体失败
        else{
          this.cashFlag=false;
        }
      })
      .catch( (error)=> {
        this.cashFlag=false;
      });
    },

    // 支付成功
    onPaySuccess : function(){

      let timer=window.setTimeout(()=>{
        this.payOnlineDialogVisible=false;
        this.accountDialogVisible=false;
        window.clearTimeout(timer);
      },2000)

      this.cashWaitLoading && this.cashWaitLoading.close();

      this.$toast({
        autoHide : true,
        message : "订单支付成功!"
      });

      // 调用小票模板
      this.printTemplate();
      // 清空收银页面的商品列表
      this.$store.dispatch('emptyProductList');
      // 更新头部的销售单数
      this.$store.dispatch('updateTodaySalesCount');
      // 重置页面展示中的总价优惠
      this.$store.dispatch('countAllProductTotalPriceDiscount');

    },

    // 获取小票打印模板
    printTemplate: function(){
      this.$ajax
      .get(api.queryPrintTemplate,{
        params : {
          "orderNo":  this.orderDetailsNo,
          "stack": ""
        }
      })
      .then( (response) =>{

        if(response.status==200){
          // 打印预览
          this.lodopPrint(false,response.data);
        }
      })
      .catch( (error)=> {

      });
    },
    lodopPrint(printTag,printHtml){
        //var strHTML=document.getElementsByTagName("html")[0].innerHTML;
        LODOP=getLodop();
				LODOP.PRINT_INIT("打印购物单");
				LODOP.SET_PRINT_PAGESIZE(3,580,10,"");
				LODOP.SET_PRINT_STYLEA(0,"TextNeatRow",true);
				//LODOP.SET_PRINT_STYLE("FontSize",18);
				//LODOP.SET_PRINT_STYLE("Bold",1);
        //LODOP.PRINT_INITA(10,20,580,610,"测试C-Lodop远程打印四步骤");
        //LODOP.ADD_PRINT_TEXT(1,1,300,200,"下面输出的是本页源：");
        //LODOP.ADD_PRINT_TEXT(20,10,"90%","95%",strHTML);
        // LODOP.SET_PRINT_STYLEA(0,"ItemType",4);
        //LODOP.NewPageA();
        LODOP.ADD_PRINT_HTM(10,0,"100%","100%",printHtml);

        if (printTag){
          // 预览
          LODOP.PREVIEW();
        }else{
          // 打印
          LODOP.PRINT();
        }
    },
    //  结算对话框---现金输入框--回车事件
    onCashEnter : function (){
      //alert("现金输入框--回车事件");
      //this.payOrderCash();
      // 去掉回车结算的功能，避免店员直接扫描微信码或者支付码等导致进入现金结算
    },
    onCashChange(){
      this.autoGetZero();
    },
    //  结算对话框---确定按钮
    onAccountDialogBtnOkSelect : function (){
      this.payOrderCash();
    },
    // 结算对话框---按步删除现金额
    onCancelAccountDialogCashNum : function (){
      if(this.cashNum!=this.defaultCashNum){
        let num=this.cashNum.slice(0,-1);
        this.cashNum=num!=="" ? num : this.defaultCashNum;
      }
      this.$refs.cashInputNode.focus();
      this.autoGetZero();
    },
    // 自动找零的计算
    autoGetZero(){
      if(parseFloat(this.cashNum)>parseFloat(this.orderDetailsActualAmount)){
        this.orderDetailsChange=Number( (parseFloat(this.cashNum)-parseFloat(this.orderDetailsActualAmount)).toFixed(2) )
      }else{
        this.orderDetailsChange=0
      }
      this.refreshSub({
        pay:{ money:this.cashNum,odd:this.orderDetailsChange}});
    },

    // 结算对话框---清除输入现金额
    onClearAccountDialogCashNums : function (){
      this.cashNum=this.defaultCashNum;
      this.$refs.cashInputNode.focus();
      this.autoGetZero();
    },
    // 结算对话框---支付宝
    onAccountDialogPayZfb : function (){
      this.payOnlineDialogVisible=true;
      this.payOnlineDialogPayWay="支付宝支付";
      this.payOnlineDialogCode ="";
      this.payOnlinePlaceholder="反扫支付宝支付条码";


      let timer=window.setTimeout(()=>{
        this.$refs.payOnlineDialogInput.focus();
        window.clearTimeout(timer);
      },0)

    },
    // 结算对话框--微信
    onAccountDialogPayWeixin : function (){
      this.payOnlineDialogVisible=true;
      this.payOnlineDialogPayWay="微信支付";
      this.payOnlineDialogCode ="";
      this.payOnlinePlaceholder="反扫微信支付条码";

      let timer=window.setTimeout(()=>{
        this.$refs.payOnlineDialogInput.focus();
        window.clearTimeout(timer);
      },80)

    },
    // 结算对话框---积分抵扣
    onAccountDialogPayJfdk : function (evt){
      this.$toast('积分抵扣功能尚在开发中！');
    },
    validateNonCash(){//检测非现金交易
      if (this.cashNum != null && this.cashNum.length > 0){
        this.$message({
          message: '非现金交易，请清空现金输入框',
          type: 'warning'
        });
        return true;
      }
      return false;
    },
    payAdvanceOnClick(){
      if (this.validateNonCash()){
        return;
      }
      this.$confirm('该操作为预付款支付, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass : "is-round",
        cancelButtonClass : "is-round",
        type: 'warning'
      }).then(() => {
        $http({
          method:'post',
          path:api.paymentAdvance,
          data:{ orderNo:this.orderDetailsNo}
        },res=>{
          this.onPaySuccess();
        },err=>{

        },this);
      }).catch(() => {
      });
    },
    // 结算对话框---聚合支付
    onAccountDialogPayJhzf : function (evt){
      if (this.validateNonCash()){
        return;
      }
      this.payOnlineDialogVisible=true;
      this.payOnlineDialogPayWay="聚合支付";
      this.payOnlineDialogCode ="";
      this.payOnlinePlaceholder="反扫聚合支付条码";

      let timer=window.setTimeout(()=>{
        this.$refs.payOnlineDialogInput.focus();
        window.clearTimeout(timer);
      },80)
    },
    // 云闪付
    onPayUnionCloud(){
      if (this.validateNonCash()){
        return;
      }
      this.payOnlineDialogVisible=true;
      this.payOnlineDialogPayWay="云闪付";
      this.payOnlineDialogCode ="";
      this.payOnlinePlaceholder="反扫云闪付条码";

      let timer=window.setTimeout(()=>{
        this.$refs.payOnlineDialogInput.focus();
        window.clearTimeout(timer);
      },80)
    },
    // 结算对话框---线下扫码
    onLineScanCode(){
      if (this.validateNonCash()){
        return;
      }
      this.$confirm('确定线下扫码操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass : "is-round",
        cancelButtonClass : "is-round",
        type: 'warning'
      }).then(() => {

        this.$ajax
        .post(api.queryPaymentScan,{
          "orderNo":  this.orderDetailsNo
        })
        .then( (response) =>{
          let res=response.data;
          if(res.success){
            this.$toast({
              autoHide : true,
              message: '成功触发线下扫码操作！'
            });

            this.onPaySuccess();

          }else{
            this.$toast({
              autoHide : true,
              message: '对不起，触发线下扫码失败！'
            });
          }
        })
        .catch( (error)=> {
          this.$toast({
            autoHide : true,
            message: '对不起，触发线下扫码失败！'
          });
        });

      }).catch(() => {
        /*
        this.$toast({
          autoHide : true,
          message: '已取消线下扫码操作'
        });
        */
      });
    },

    payOnlineDialogCodeChange(){
      if(this.payOnlineDialogPayWay=="云闪付"){
        this.payUnionCloud();
      }else{
        this.payOrderOnline();
      }
    },
    //打开客显
    openSubScreen(){
      if (this.$global.subWin == null || this.$global.subWin.closed){
        const { href } = this.$router.resolve("/sub-screen")
        this.$global.subWin = window.open(href, '_blank', 'toolbar=no ');
        let timer=window.setTimeout(()=>{
          this.refreshSub({
            product:this.$store.state.product.productList,
            price:this.$store.state.product.allProductPayPrice,
            member:this.memberInfo,
            status:'销售中...'});
          window.clearTimeout(timer);
        },2000);
      }else{
        this.$toast("客显窗口已经被打开");
      }
    },
    refreshSub(params){
      subscreen.put(params);
    },

    // 快捷键
    hotkeys(){
      window.addEventListener("keydown", (e)=>{

        // 数量A
        if(e && e.keyCode==65){
          this.updatePrdCount();
        }

        // 赠品Z
        if(e && e.keyCode==90){
          this.doPresent();
        }

        // 删除D
        if(e && e.keyCode==68){
          this.deleteSelectedPrd();
        }

        // 清空C
        if(e && e.keyCode==67){
          this.clearAllPrd();
        }

        // 挂单G
        if(e && e.keyCode==71){
          this.doEntryOrders();
        }

        // 退单T
        if(e && e.keyCode==84){
          this.doChargeback();
        }

        // 更多M
        if(e && e.keyCode==77){
          this.doMore();
        }

        // 新增会员N
        if(e && e.keyCode==78){
          this.addNewMember();
        }

      },false)
    },

  },
  created : function(){

    this.queryEntryOrders();

    //this.hotkeys();

  },
  computed : {
     // 挂单商品数组
     entryOrdersListArray : function(){
       return this.$store.state.product.entryOrdersList;
     },
     // 挂单数量
     entryOrdersTotal : function(){
       return this.$store.state.product.entryOrdersList.length;
     },
     // 结算---总价
     allProductPayPrice : function(){
       return this.$store.state.product.allProductPayPrice;
     },
     // 结算---优惠
     allProductTotalDiscounts : function(){
       return this.$store.state.product.allProductTotalDiscounts;
     },
    updateProduct(){
      this.refreshSub({
        product:this.$store.state.product.productList,
        price:this.$store.state.product.allProductPayPrice,
        member:this.memberInfo,
        status:'销售中...'});
    }
  },
  mounted (){
    this.$refs.barcodeNode.focus();
  }
}



</script>


<style scoped>
#FrontFoot{
  display: flex;
  background:#aac849;
  height: 150px;
}
#FrontFoot>.item:first-child{
  display: -webkit-flex;
  display: flex;
}
#FrontFoot>.item:first-child .c .el-input {
    width:3rem;
}
#FrontFoot>.item:first-child .c{
    -webkit-align-self: center;
    -moz-align-self: center;
    -o-align-self: center;
    -ms-align-self: center;
    align-self: center;
    padding-left:0.32rem;
}
#FrontFoot>.item:nth-child(2){
  flex :1;
  display: -webkit-flex;
  display: flex;
}
#FrontFoot>.item:nth-child(2) .c{
    -webkit-align-self: center;
    -moz-align-self: center;
    -o-align-self: center;
    -ms-align-self: center;
    align-self: center;
    margin:0 auto;
}
#FrontFoot>.item:nth-child(3){
   /*flex :3;*/
   padding-right:0.32rem;
}
#barcode{
  margin-right:2em;
}
.wp-input{
  background-color: rgba(255,255,255,0.3);
  color:#fff;
  padding:0 0.2rem;
  height:0.6rem;
  line-height: 0.6rem;
  border-radius:0.04rem;
  font-size:0.25rem;
  width:2.5rem;
}
.wp-btn{
   display:inline-block;
   padding:6px 14px;
   font-size:14px;
   background-color:#fff;
   border-radius:4px;
   cursor:pointer;
   margin-right:6px;
   margin-bottom:6px;
   transition: all 0.2s;
   position: relative;
   color:#000;
   box-shadow: 0 0 0.2rem 0.04rem #e1f493 inset;
}
.wp-btn:active{
   background-color:#e8e8e8;
}
.wp-btn .num{
  position: absolute;
  right: -9px;
  top: -9px;
  display: block;
  background-color: #e26336;
  text-align: center;
  font-size: 13px;
  color: #fff;
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 9px;
}
.account-zone{
  border-top-left-radius:0.1rem;
  border-top-right-radius:0.1rem;
  background-color: #fff;
  box-shadow:0 -0.02rem 0.3rem 0.04rem #aac849;
  height:3.75rem;
  transform: translateY(-0.3rem);
  width:5.4rem;
}
.account-zone dt{
  text-align: left;
  height:2rem;
}
.account-zone dt>.c{
  padding:0.28rem;
}
.account-zone dt>.c p{
  font-size:0.4rem;
  line-height: 1;
  padding:0.2rem 0;
  color:#333;
}
.account-zone dt>.c p>span{
  color: #e26336;
}
.account-zone dd{
  height:1.2rem;
  line-height: 1.2rem;
  cursor:pointer;
  background-color: #e26336;
  font-size: 0.58rem;
  text-align: center;
  color:#fff;
}
#FrontFoot>.item:first-child .p:first-child{
   margin-bottom:0.32rem;
   font-size:0.25rem;
}
.el-select{
  width:1.6rem;
  height:0.4rem;
}
.el-input__icon{
    line-height: 0.6rem;
}

.accountDialogBody{
  display: flex;
  flex-direction: row;
  font-size:0.25rem;
  padding:0.3rem 0.2rem;
}
.accountDialogBody>.item:first-child{
  flex:6.5;
}
.accountDialogBody>.item:last-child{
  flex:5;
}
.accountDialogBody dl{
  margin-right:0.2rem;
}
.accountDialogBody dt h4{
  font-weight: bold;
  margin-bottom:0.2rem;
  text-indent: 0.2rem;
}
.accountDialogBody dt .top p,
.accountDialogBody dt .result p{
  display: flex;
  flex-direction: row;
  line-height: 2.55;
  padding:0 0.2rem;
  color:#333;
}
.accountDialogBody dt .top label,
.accountDialogBody dt .result label{
  flex:1;
}
.accountDialogBody dt .top span,
.accountDialogBody dt .result span{
  flex:1;
  text-align: right;
}

.accountDialogBody dt .result{
  border-top:1px solid #ccc;
  border-bottom:1px solid #ccc;
  padding:0.2rem 0;
  margin:0.2rem 0;
}
.accountDialogBody dt .result p{
  font-weight: bold;
  font-size:15px;
}
.accountDialogBody dt .result p span{
  color:#e26336;
}
.accountDialogBody dd{
  text-align:center;
  padding-top:0.1rem;
}

.accountDialogBody .payway{
  display: flex;
  flex-direction: row;
  margin-bottom:0.2rem;
}
.accountDialogBody .payway .item{
  flex :1;
  cursor: pointer;
}
.accountDialogBody .payway i{
  display: block;
  margin:0 auto 0.04rem;
  width:0.58rem;
  height:0.58rem;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.accountDialogBody .payway span{
  display: block;
  text-align: center;
  font-size:0.25rem;
  font-weight: bold;
}
.icon-zfb{
  background-image: url(../assets/images/frontEnd/img_zfb.png);
}
.icon-weixin{
  background-image: url(../assets/images/frontEnd/img_weixin.png);
}
.icon-advance{
  background-image: url(../assets/images/frontEnd/advance.png);
}
.icon-jfdk{
  background-image: url(../assets/images/frontEnd/offline_scan.png);
}
.icon-jhzf{
  background-image: url(../assets/images/frontEnd/online_scan.png);
}

.icon-union-cloud{
  background-image: url(../assets/images/frontEnd/img_union_cloud.png);
}

.accountDialogBody .cash{
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius:0.04rem;
  height:0.6rem;
  display: flex;
  flex-direction: row;
  margin-bottom:0.2rem;
}
.accountDialogBody .cash>.item:first-child{
  flex:7;
}
.accountDialogBody .cash>.item:last-child{
  flex:3;
  padding-top:0.04rem;
  text-align: center;
}
.accountDialogBody .cash input{
  line-height: 1;
  height: 0.6rem;
  padding: 0;
  width:100%;
  text-indent: 0.2rem;
  color:#333;
}
.accountDialogBody .cash .cancel,
.accountDialogBody .cash .del{
  display: inline-block;
  vertical-align: middle;
  width:0.4rem;
  height: 0.4rem;
  cursor:pointer;
}
.accountDialogBody .cash .cancel{
  width:0.54rem;
  height: 0.54rem;
  background: url(../assets/images/frontEnd/icon_cancel.png) center center no-repeat;
  background-size: contain;
  margin-right: 0.08rem;
}
.accountDialogBody .cash .del{
  background: url(../assets/images/frontEnd/icon_delete.png) center center no-repeat;
  background-size: contain;
}
.accountDialogBody .num-box{
  border-radius: 0.06rem;
  overflow:hidden;
}
.accountDialogBody table{

  width:100%;

}
.accountDialogBody table td{
  border:1px solid #ccc;
  background-color: #f2f2f2;
  text-align: center;
  padding:0.15rem 0;
  font-size: 0.48rem;
  cursor: pointer;
}
.accountDialogBody table tr:last-child td:last-child{
  background-color: #e26336;
  color:#fff;
}

.prdCountDialogBody{
  padding:60px 50px 40px;
}
.prdCountDialogBody .p{
  padding:12px;
  color:#000;
}

.chargebackDialogBody{
  padding:2rem 0.8rem 1.5rem;
}
.chargebackDialogBody .p{
   color:#000;
   display: flex;
   flex-direction: row;
}
.chargebackDialogBody .p .item:first-child{
  color:#000;
  text-align: right;
}
.chargebackDialogBody .p .item:last-child{
  flex :1;
}
.chargebackDialogBody .p label{
  color:#000;
  font-size:14px;
}
.chargebackDialogBody .p input{
  border-bottom: 1px solid #ccc;
  width:100%;
  color:#000;
  text-indent:0.1rem;
}


.entryOrdersDialog{
  position: fixed;
  width:100%;
  height:100%;
  left:0;
  top:0;
  z-index:9999;
  background-color: rgba(0,0,0,0.1);
}
.entryOrdersDialog>.dialog-wrap{
  width:100%;
  height:100%;
  padding-left:40%;
  padding-top:66px;
}
.entryOrdersDialog>.dialog-wrap>.dialog-body{
  background-color: #f2f2f2;
  height:100%;
  position: relative;
}
.entryOrdersDialog>.dialog-wrap>.dialog-body>.entryOrdersDialogBody{
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:1.4rem;
  overflow:auto;
}
.entryOrdersDialog>.dialog-wrap>.dialog-body>.dialog-footer{
  position: absolute;
  left:0;
  right:0;
  bottom:0;
  height:1.4rem;
  background-color: #fff;
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: row;
}
.entryOrdersDialog>.dialog-wrap>.dialog-body>.dialog-footer>.wrap{
  width:100%;
  align-self: center;
  text-align: center;
}

.entryOrdersDialogBody dl{
  width:100%;
}
.entryOrdersDialogBody dl>dt{
  display: flex;
  flex-direction: row;
  background-color: #fff;
  border-bottom:1px solid #ccc;
  padding: 28px 0 12px;
}
.entryOrdersDialogBody dl>dt>.item{
  flex :1;
  font-weight: bold;
  text-align: center;
  font-size:16px;
}
.entryOrdersDialogBody dl>dt>.item.order{
  flex :2;
}
.entryOrdersDialogBody dl>dt>.item.name{
  flex :3;
}
.entryOrdersDialogBody dl>dd>ul>li{
  background-color: #fff;
  margin-bottom:0.14rem;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  transition: all 0.4s;
}
.entryOrdersDialogBody dl>dd>ul>li>div{
  display: flex;
  flex-direction: row;
}
.entryOrdersDialogBody dl>dd>ul>li:hover{
  background-color: #f0f0f0;
}
.entryOrdersDialogBody dl>dd>ul>li.active{
  background-color: #fdf5cf;
}
.entryOrdersDialogBody dl>dd>ul>li:first-child{
  border-top:none;
}


.entryOrdersDialogBody dl>dd>ul>li>div>.item{
  text-align: center;
  font-size:0.32rem;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item:first-child{
  flex :1;
  display: flex;
  flex-direction: row;
}
.entryOrdersDialogBody dl>dd>ul>li>div.s>.item:first-child{
  flex :1;
}
.entryOrdersDialogBody dl>dd>ul>li>div.m>.item:nth-child(2){
  flex :2;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: row;
}
.entryOrdersDialogBody dl>dd>ul>li>div.s>.item:nth-child(2){
  flex :2;
  border-right: none;
  display: flex;
  flex-direction: row;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item:last-child{
  flex :6;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item:first-child>.num{
  width:100%;
  align-self: center;
  text-align: center;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item:nth-child(2)>.order{
  width:100%;
  align-self: center;
  text-align: center;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item>ul{
  width:100%;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item>ul>li{
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #ccc;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item>ul>li:last-child{
  border-bottom: none;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item>ul>li>.item{
  flex :1;
  padding:14px 0;
  line-height: 1;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item>ul>li>.item.order{
  flex :2;
}
.entryOrdersDialogBody dl>dd>ul>li>div>.item>ul>li>.item.name{
  flex :3;
  color:#333;
}

.addNewMemberDialogBody{
  padding:8px 24px 8px 8px;
}
.dialogHeader{
  padding:10px 10px 18px;
}
.dialogHeader .head>i{
  display: inline-block;
  width:3px;
  height:16px;
  line-height: 16px;
  background-color: #aac849;
  vertical-align: middle;
  margin-right:6px;
}
.dialogHeader .head>span{
  font-size:16px;
  font-weight: bold;
  vertical-align: middle;
  color:#000;
}
.dialogBody .p{
  display: flex;
  flex-direction: row;
  margin-bottom:0.2rem;
  font-size:14px;
}
.dialogBody .p:last-child{
  margin-bottom: 0;
}
.dialogBody .p .item:first-child{
  flex :1;
  text-align: right;
  padding-right:0.2rem;
  color:#000;
}
.dialogBody .p .item:first-child i{
  font-style: normal;
  color:#e26336;
  padding:2px;
  font-family: Arial, Helvetica, sans-serif;
  font-size:0.34rem;
}
.dialogBody .p .item:last-child{
  flex :3;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.chargebackDetailsDialogBody .dialogHeader{
  padding:0.4rem;
}
.chargebackDetailsDialogBody dd{
  padding : 0 1rem;
}
.chargebackDetailsDialogBody dd .hd{
  max-height:4rem;
  overflow:auto;
}
.chargebackDetailsDialogBody dd .hd table{
  width:100%;
}
.chargebackDetailsDialogBody dd .hd table th{
  font-weight: bold;
  text-align: center;
  padding:0.14rem 0;
  font-size:0.28rem;
}
.chargebackDetailsDialogBody dd .hd table tr td{
  text-align: center;
  padding:0.14rem 0;
  font-size:0.25rem;
}

.chargebackDetailsDialogBody .bd{
  color:#e26336;
  font-weight: bold;
  font-size:0.3rem;
  padding:0.3rem 0 0.2rem;
}


.payOnlineDialogBody{
  text-align: center;
  padding:0.48rem 0;
  font-size:0.25rem;
  width:80%;
  margin:0 auto;
}
.payOnlineDialogBody>.header{
  text-align: center;
  color:#aac849;
  font-size:20px;
  margin-bottom:26px;
}
.payOnlineDialogBody>.body{
  text-align: center;
  color:#333;
  font-size:14px;
  margin-bottom:36px;
}
.payOnlineDialogBody>.body>.p{
  display: flex;
  flex-direction: row;
  margin:12px 0;
}
.payOnlineDialogBody>.body>.p>.item>label{
  display: block;
  height:32px;
  line-height : 32px;
}
.payOnlineDialogBody>.body>.p>.item:first-of-type{
  flex :1;
  text-align: right;
}
.payOnlineDialogBody>.body>.p>.item:last-of-type>span{
  color:#e26336;
  display: block;
  height: 0.58rem;
  line-height : 0.58rem;
}
.payOnlineDialogBody>.body>.p>.item:last-of-type{
  flex :3;
  text-align: left;
}
.payOnlineDialogBody>.body>.p>.item:last-of-type>input{
  border:1px solid #ccc;
  padding:0 0.14rem;
  line-height: 0.58rem;
  background-color: #f2f2f2;
  border-radius:0.08rem;
  color:#999;
  font-size: 0.2rem;
  width:4rem;
}

</style>
