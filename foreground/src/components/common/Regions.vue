<template>
    <div>
      <Row type="flex"  >
        <Col style="padding-right:10px">
          <div>国家</div>
          <Select v-model="regions.country" label="中国" style="width:100px">
            <Option value="0">中国</Option>
          </Select>
        </Col>
        <Col style="padding-right:10px">
          <div>省</div>
          <Select v-model="regions.province" label-in-value @on-change="onProvinceChange" style="width:160px">
            <Option v-for="item in regions.provinceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </Col>
        <Col style="padding-right:10px">
          <div>市</div>
          <Select v-model="regions.city" label-in-value  @on-change="onCityChange" style="width:160px">
            <Option v-for="item in regions.cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </Col>
        <Col style="padding-right:10px">
          <div>区</div>
          <Select v-model="regions.area" label-in-value @on-change="onAreaChange" style="width:180px">
            <Option v-for="item in regions.areaList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </Col>
        <Col >
          <div>详细地址</div>
          <Input v-model="regions.detailAddress" placeholder="输入详细地址" clearable style="width: 300px" />
        </Col>
      </Row>
    </div>
</template>

<script>
  /*
  *使用方法:
  * 1、加载模块:import Regions from '@/components/common/Regions'
  *    components中添加 Regions
  * 2、添加标签:<Regions ref="regions"></Regions>
  *  3、获取数据:this.$refs.regions.getRegions()
  * */
  import $http from '@/utils/httputils'
    export default {
        name: "Regions",
      data(){
          return{
            regions:{
              country:'中国',
              province:'',
              provinceLabel:'',
              provinceList:null,
              city:'',
              cityLabel:'',
              cityList:null,
              area:'',
              areaLabel:'',
              areaList:null,
              detailAddress:''
            }
          }
      },
      methods:{
          getRegions(){
            let params ={
              country:this.regions.country,
              province:this.regions.provinceLabel,
              city:this.regions.cityLabel,
              area:this.regions.areaLabel,
              detailAddress:this.regions.detailAddress
            }
            return params;
          },
          getDistricts(pid,success){
            $http({
              path: this.apis.systemRegions.districts,
              method: 'get',
              data: { pid : pid }
            }).then(response => {
              let res = response.data;
              (typeof  success ==  'function')?success(res):null;
            })
          },
        onProvinceChange(select){
          this.regions.provinceLabel = select.label;
          this.getDistricts(select.value,res => {
            this.regions.cityList = res.data;
          })
        },
        onCityChange(select){
          this.regions.cityLabel = select.label;
          this.getDistricts(select.value,res => {
            this.regions.areaList = res.data;
            this.regions.areaLabel = res.data[0].name;
          })
        },
        onAreaChange(select){
          this.regions.areaLabel = select.label;
        }
      },
      mounted(){
        this.getDistricts(0,res => {
          this.regions.provinceList = res.data;
          this.regions.provinceLabel = res.data[0].name;
          console.log("默认省:" , this.regions.provinceLabel)
        })
      }
    }
</script>

<style scoped>

</style>
