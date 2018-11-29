import {getLodop} from '@/utils/LodopFuncs'

export function  print(preview,printHtml){
  let lodop = getLodop();
  lodop.PRINT_INIT("打印购物单");
  lodop.SET_PRINT_PAGESIZE(3,580,10,"");
  lodop.SET_PRINT_STYLEA(0,"TextNeatRow",true);
  lodop.ADD_PRINT_HTM(10,0,"100%","100%",printHtml);
  if (preview){
    LODOP.PREVIEW();
  }else{
    LODOP.PRINT();
  }
}

export function  printBarcode(preview,code){
  let lodop = getLodop();
  lodop.PRINT_INIT("打印购物单");
  lodop.SET_PRINT_PAGESIZE(3,580,10,"");
  lodop.SET_PRINT_STYLEA(0,"TextNeatRow",true);
  if (preview){
    LODOP.PREVIEW();
  }else{
    LODOP.PRINT();
  }
}
