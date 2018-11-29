<template>
  <div id="LodopDetect">
    <!--
    <object id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0> 
      <embed id="LODOP_EM" type="application/x-print-lodop" width=0 height=0 />
    </object>  
    -->
  </div>
</template>

<script>
import {getLodop} from '@/utils/LodopFuncs'

export default {
  name: 'LodopDetect'
}

window.onload=function(){
  /*
  var LODOP=getLodop(document.getElementById('LODOP_OB')
    , document.getElementById('LODOP_EM')); 
  if ((LODOP!=null)&&(typeof(LODOP.VERSION)!="undefined")){
    //alert("本机已成功安装过Lodop控件!\n  版本号:"+LODOP.VERSION); 
  }else{
    alert("本机未成功安装Lodop控件!"); 
  }
  */
  var LODOP=getLodop(); 
  if ((LODOP!=null)&&(typeof(LODOP.VERSION)!="undefined")){
    //alert("本机已成功安装过Lodop控件!\n  版本号:"+LODOP.VERSION); 
  }else{
    alert("本机未成功安装Lodop控件!");                 
  }  
}

</script>

<style scoped>
#LodopDetect{
  width:0;
  height:0;
  margin:0;
  padding:0;
  overflow:hidden;
}
</style>
