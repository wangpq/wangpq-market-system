<template>
    <div>
      <!--<center>-->
         <!--<b>中铁如家</b>-->
      <!--</center>-->
      <el-table id="table"
        :data="tables"
        style="width: 100%;height: 40vh;overflow-y:auto" >
        <template v-for = "(item,index)  in columns">
          <el-table-column v-if="item.type != 'spread'"
                           align="center"
                           :key="index"
                           :type="item.type"
                           :formatter="item.formatter"
                           :prop="item.prop"
                           :width="item.width"
                           :label="item.title">
          </el-table-column>
        </template>
      </el-table>
       <div class="line"></div>
        <el-row v-show="member != null">
          <el-col :span="2"><div class="item-member" style="text-align: right">会员:</div></el-col>
          <el-col :span="8"><div  class="item-member" style="text-align: left">({{member.name}}){{member.memberCode}}</div></el-col>
          <el-col :span="4"><div  class="item-member" style="text-align: center">{{status}}</div></el-col>
        </el-row>

      <div class="line"></div>

      <el-row   type="flex"  align="middle">
        <el-col><div  class="item-border">总计(元):</div></el-col>
        <el-col><div  class="item-border">{{(order.salePrice?order.salePrice:price)|numFilter}}</div></el-col>
      </el-row>
      <el-row   type="flex"  align="middle">
        <el-col><div  class="item-border">应收(元):</div></el-col>
        <el-col><div  class="item-border">{{(order.payPrice?order.payPrice:price)|numFilter}}</div></el-col>
      </el-row>
      <el-row   type="flex"  align="middle">
        <el-col><div  class="item-border">实收(元):</div></el-col>
        <el-col><div  class="item-border">{{(pay.money?pay.money:0.00)|numFilter}}</div></el-col>
      </el-row>
      <el-row   type="flex"  align="middle">
        <el-col><div  class="item-border">找零(元):</div></el-col>
        <el-col><div  class="item-border">{{(pay.money?(pay.money-order.payPrice):0.00)|numFilter}}</div></el-col>
      </el-row>
    </div>
</template>

<script>
  import subscreen from '@/utils/SubScreenUtils'
    export default {
      name: "SubScreen",
      data(){
        return{
          tables:[],
          member:{},
          order:{},
          status:'销售中...',
          price:0,
          pay:{
            money:0,
            odd:0
          },
          columns:[{
            type:'index',
            title:'序号',
            width:100
          },{
            prop:'productNo',
            title:'货号'
          },{
            prop:'productName',
            title:'商品名称'
          },{
            prop:'productName',
            title:'商品名称'
          },{
            prop:'saleNumber',
            title:'购买数量'
          },{
            prop:'payPrice',
            title:'支付金额'
          }]
        }
      },
      methods:{
        update(){
          let data = subscreen.get();
          this.tables = data.hasOwnProperty('product')?data.product:this.tables;
          this.member = (data.hasOwnProperty('member')&&data.member != "")?JSON.parse(data.member):this.member;
          this.order = data.hasOwnProperty('order')?data.order:this.order;
          this.pay = data.hasOwnProperty('pay')?data.pay:this.pay;
          this.status = data.hasOwnProperty('status')?data.status:this.status;
          this.price = data.hasOwnProperty('price')?data.price:this.price;
          if (data.hasOwnProperty("clear") || !this.tables.length){
            this.order = "";
            this.pay = "";
            this.status = "销售中..."
            this.price = 0.0;
          }
          setTimeout(()=>{
            let ele = document.getElementById('table');
            ele.scrollTop = ele.scrollHeight;
          },200)
        }
      },
      mounted(){
        this.update();
        window.addEventListener('storage',(ev)=>{
          if (ev.key == 'subscreen') {
           this.update();
          }
        });
      },
      filters:{
        numFilter(value) {
          // 截取当前数据到小数点后两位
          let realVal = Number(value).toFixed(2)
          // num.toFixed(2)获取的是字符串
          return Number(realVal)

        }
      }

    }
</script>

<style scoped>
  .line{
    margin: 10px 0 10px 0;
    border: 2px solid red;
  }

  .item-member{
    font-size: 0.4rem;
    padding: 10px;
    color: #82848a;
  }

  .item-border{
    font-size: 0.8rem;
    text-align: center;
    padding: 10px;
    border: 1px solid black;
  }
</style>
