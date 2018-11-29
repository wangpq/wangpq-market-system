<template>
  <div id="backBodyHome">
    <div class="container">

    <h2 class="header"><span>今日销售额：</span><strong>¥{{todaySales}}</strong></h2>
    
    <div class="orders">
      <div class="item">
        <dl>
          <dt>
            <div class="figure">
              <img src="../assets/images/backEnd/img_sale_nums.png" alt="">
            </div>
          </dt>
          <dd>
            <p>销售单数：{{salesOrderNum}}单</p>
            <p>均单价：¥ {{averageOrderSinglePrice}}</p>
          </dd>
        </dl>
      </div>
      <div class="item">
        <dl>
          <dt>
            <div class="figure">
              <img src="../assets/images/backEnd/img_chargeback_nums.png" alt="">
            </div>
          </dt>
          <dd>
            <p>退单数：{{chargebackNum}}单</p>
            <p>均退单价：¥ {{averageChargebackSinglePrice}}</p>
          </dd>
        </dl>
      </div>
    </div>

    <div class="charts">
      <div id="charts">
        <canvas id="myChart" ref="myChart" height="360"></canvas>
      </div>
    </div>
     </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Chart from 'chart.js/dist/Chart';
import api from '@/api/apiList'
import {timeOutFn,formatDateStrToDay} from '@/utils/utils'

Vue.component('Chart', Chart)

export default {
  name: 'BackHome',
  data() {
    return {
      // 今日销售额
      todaySales : "0.0",
      // 销售单数
      salesOrderNum : "0",
      // 均单价
      averageOrderSinglePrice :"0.0",
      // 退单数
      chargebackNum : "0",
      // 均退单价
      averageChargebackSinglePrice : "0.0",
    }
  },
  mounted  () {
    this.queryWeekSalesVolume();
  },
  computed : {
  },
  methods : {
    queryWeekSalesVolume(){
      this.$ajax
      .get(api.queryBackIndex)
      .then( (response) =>{    

        timeOutFn(this,response,()=>{
          let res=response.data;
          if(res.success){

            let dd=res.data[0];

            // 今日销售额
            this.todaySales = dd.payPrice==null ? 0 : dd.payPrice.toFixed(2);
            // 销售单数
            this.salesOrderNum = dd.saleNum || 0;
            // 均单价
            this.averageOrderSinglePrice =  dd.argPrice==null ? 0 : dd.argPrice.toFixed(2);
            // 退单数
            this.chargebackNum = dd.refundNum || 0;
            // 均退单价
            this.averageChargebackSinglePrice = dd.refundArgprice==null ? 0 : dd.refundArgprice.toFixed(2);
            // 时间
            let weekTime=[];
            // 销售单数
            let weeksOrderNums=[];
            // 销售额
            let weeksSales=[];
            // 平均售价
            let weeksAvgPrice=[];
            // 一周数据
            let weeks=[];
            dd.weeks.forEach(item => {
              item.day=formatDateStrToDay(item.dateTime);
              if(item.orderType==0){
                weeks.push(item);
              }
            });

            for(let i=0;i<7;i++){
              weeksOrderNums[i]=0;
              weeksSales[i]=0;
              weeksAvgPrice[i]=0;
              for(let j=0,len=weeks.length;j<len;j++){
                let item=weeks[j];
                if(item.day===i){
                  weeksOrderNums[i]=item.salesSlip;
                  weeksSales[i]=item.sales;
                  weeksAvgPrice[i]=item.avgPrice;
                }
              }
            }
            this.renderChartsBar([weeksSales,weeksOrderNums]);     
          }
        })
      })
      .catch( (error)=> {  
      });
    },
    renderChartsBar(data){

      let ctx = this.$refs.myChart.getContext('2d');

      let backgroundColor = ctx.createLinearGradient(0,0,0,200);
      backgroundColor.addColorStop(0,'rgba(252,131,71,1)');
      backgroundColor.addColorStop(1,'rgba(230,177,65,1)');

      let hoverBackgroundColor = ctx.createLinearGradient(0,0,0,200);
      hoverBackgroundColor.addColorStop(0,'rgba(252,131,40,0.8)');
      hoverBackgroundColor.addColorStop(1,'rgba(230,172,40,0.8)');

      let backgroundColor_2 = ctx.createLinearGradient(0,0,0,200);
      backgroundColor_2.addColorStop(0,'rgba(82,207,196,1)');
      backgroundColor_2.addColorStop(1,'rgba(82,155,227,1)');

      let hoverBackgroundColor_2 = ctx.createLinearGradient(0,0,0,200);
      hoverBackgroundColor_2.addColorStop(0,'rgba(82,207,196,0.8)');
      hoverBackgroundColor_2.addColorStop(1,'rgba(82,155,227,0.8)');

      let barChartData = {
        
        labels: ['周日','周一', '周二', '周三', '周四', '周五', '周六'],
        datasets: [
          {
            label: '销售额',
            backgroundColor: backgroundColor,
            hoverBackgroundColor : hoverBackgroundColor,
            data:data[0]
          }
          /*
          ,
          {
            label: '销售单数',
            backgroundColor: backgroundColor_2,
            hoverBackgroundColor : hoverBackgroundColor_2,
            data:data[1]
          }
          */
        ]

      };
      
      window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 10
            }
          },
          legend: {
            display : false,
            labels: {
              fontColor: 'black',
              fontSize : 14
            }
          },
          title: {
            display: true,
            text: '本周销量',
            fontSize : 16
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            titleFontSize : 15,
            titleSpacing : 8,
            bodyFontSize : 14,
            bodySpacing : 8
          },
          responsive: true,            
          scales: {
            xAxes: [{
              stacked: true, 
            }],
            yAxes: [{
              stacked: true
            }]
          }
        }
      });
    }
  },

}
</script>

<style scoped>
#backBodyHome{
  flex :1;
  padding:0.24rem;
}
.header{
  background: #aac849 url(../assets/images/backEnd/welcome.png) bottom right no-repeat;
  background-size: 40% 80%;
  border-top-left-radius: 6px;
  border-top-right-radius:6px;
  font-size:24px;
  padding:20px 36px;
  color:#fff;
}
.header>span{
  vertical-align: middle;
}
.header>strong{
  color:#333;
  font-size:54px;
  vertical-align: middle;
  font-weight: bold;
}
.orders{
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding:20px 0;
  margin-bottom:12px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
.orders>.item{
  flex:1;
}
.orders>.item>dl{
  display: flex;
  flex :row;
  padding-left:60px;
}
.orders>.item>dl>dt{
  display: flex;
  flex-direction: row;
}
.orders>.item>dl>dt>.figure{
  align-self: center;
}
.orders>.item>dl>dt img{
  height: 60px;
}
.orders>.item>dl>dd{
  padding:20px 0;
}
.orders>.item>dl>dd>p{
  font-size: 20px;
  padding:12px;
}

.charts{
  border-radius: 6px;
  background-color: #fff;
}
canvas{
  width:100%;
}
</style>
