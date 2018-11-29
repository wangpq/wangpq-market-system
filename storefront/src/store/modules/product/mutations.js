export default {
  /**
   * 清空商品数组
   * @param {Object} state 
   * @param {Object or Array} product 要清空的商品数组
   */
  empty_product_list(state){ 
    state.productList = [];
  },
  /**
   * 删除单个或多个指定商品
   * @param {Object} state 
   * @param {Object or Array} product 要删除的商品
   */
  delete_product_list(state,product){ 
    if(product.constructor==Array){
      product.forEach((item,index)=>{ 
        state.productList.forEach((n,i)=>{ 
          if(n.productNo == item.productNo){
            state.productList.splice(i,1)
          }   
        })
      })
    }else{
      state.productList.forEach((n,i)=>{
        if(n.productNo== product.productNo){
          state.productList.splice(i,1)
        }
      })
    }
  },
  /**
   * 删除单个指定prdId的商品
   * @param {Object} state 
   * @param {String} productId 要删除的商品Id
   */
  delete_product_list_by_id(state,productId){ 
    state.productList.forEach((item,index)=>{
      if(item.id== productId){
        state.productList.splice(index,1)
      }
    })
    //console.log("-----delete_product_list_by_id--------");
    //console.log(state.productList);
  },
  /**
   * 修改指定商品数量
   * @param {Object} state 
   * @param {Object} product 商品要修改的购买数量
   */ 
  modify_product_list_sales_amount(state,product){  
    let index=state.productList.findIndex(x => x.productNo == product.productNo);
    let currentPrdItem=state.productList[index];
    currentPrdItem.saleNumber=product.saleNumber;
    currentPrdItem.payPrice=((currentPrdItem.salePrice-currentPrdItem.discountPrice )*product.saleNumber).toFixed(2);
    currentPrdItem.totalDiscount=(currentPrdItem.discountPrice*product.saleNumber).toFixed(2);
  },
  /**
   * 修改指定商品的折扣率
   * @param {Object} state 
   * @param {Array} product 商品折扣率
   */ 
  modify_product_list_discount_ratio(state,product){  
    product.forEach((prd,idx)=>{
      state.productList.forEach((item,index)=>{
        if(prd.id== item.id){
          let currentPrdItem=state.productList[index];
          currentPrdItem.ratio=prd.ratio;
          currentPrdItem.discountPrice=prd.discountPrice;
          currentPrdItem.payPrice=((currentPrdItem.salePrice-currentPrdItem.discountPrice )*currentPrdItem.saleNumber).toFixed(2);
          currentPrdItem.totalDiscount=(currentPrdItem.discountPrice*currentPrdItem.saleNumber).toFixed(2);
        }
      })
    })
  },
  /**
   * 修改所有商品的折扣率未1(没有折扣)
   * @param {Object} state 
   */ 
  modify_product_list_all_ratio_one(state){  
    state.productList.forEach((item,index)=>{
      item.ratio=1;
      item.discountPrice=0;
      item.payPrice=(item.salePrice*item.saleNumber).toFixed(2);
      item.totalDiscount=0;
    })
  },

  /**
   * 添加到商品数组
   * @param {Object} state 
   * @param {Object || Array} product 要添加的商品
   */
  add_prd_to_product_list (state,product){ 
    if(product.constructor==Array){
      // 多个商品添加到商品数组(已经存在的数据，不用管同商品数量相同合并为一个的问题)
      // 从挂单选择返回到商品数组
      product.forEach((item,index)=>{
        state.productList.push(item);
      })
    }else{
      //相同商品数量+1
      let exist=false;
      state.productList.forEach((item,index)=>{
        item.memberInfo=product.memberInfo;
        if(item.productNo==product.productNo){
          item.saleNumber=item.saleNumber+1;
          item.payPrice=((item.salePrice-item.discountPrice)*item.saleNumber).toFixed(2);
          item.totalDiscount=(item.discountPrice*item.saleNumber).toFixed(2);
          exist=true;
        }
      })
      if(!exist){
        state.productList.push(product);

      }
    }
    //console.log("---mutations-----add_prd_to_product_list-----state.productList----------");
    //console.log(state.productList);
  },
  /**
   * 添加到商品数组
   * @param {Object} state 
   * @param {Object || Array} product 要添加的商品
   * @param {Number} index 要添加数组的位置
   */
  add_prd_to_product_list_to_index(state,param){ 
    let {product,index}=param;
    //console.log("-------add_prd_to_product_list_to_index------------")
    //console.log(product)
 
    if(product.constructor==Array){
      let arr_1=state.productList.slice(0,index);
      let arr_2=state.productList.slice(index);
      state.productList=arr_1.concat(product).concat(arr_2)
    }else{
      state.productList.splice(index, 0, product);
    }
    //console.log(state.productList)
  },
  /**
   * 添加到选中商品数组
   * @param {Object} state 
   * @param {Array} product 要添加的商品
   */
  add_prd_to_product_list_select (state,product){ 
    state.productListSelect=product;
    //console.log(state.productListSelect);
  },
  /**
   * 清空选中商品数组
   * @param {Object} state 
   * @param {Object or Array} product 要清空的选中商品数组
   */
  empty_product_list_select(state){ 
    state.productListSelect = []
  },
  /**
   * 添加到挂单列表
   * @param {Object} state 
   * @param {Array} product 要添加的未出账订单商品数组
   */
  add_to_entry_orders_list(state,product){  
    state.entryOrdersList=product;
  },
  /**
   * 删除挂单列表中数据
   * @param {Object} state 
   * @param {Objest} order 要删除的挂单商品数据
   */
  del_from_entry_orders_list(state,product){ 
   let idx=state.entryOrdersList.findIndex(x => x.id == product.id);
   state.entryOrdersList.splice(idx,1);
  },
  /**
   * 计算所有商品总价和总优惠额
   */
  count_all_product_total_price_discount(state){
    let payPrice=0;
    let totalDiscount=0;
    if(state.productList.length>0){
      state.productList.forEach((item,index)=>{
        payPrice+=parseFloat(item.payPrice);
        totalDiscount+=parseFloat(item.totalDiscount);
      })
    }
    // 结算---总价
    state.allProductPayPrice=payPrice.toFixed(2);
    // 结算---优惠
    state.allProductTotalDiscounts= totalDiscount.toFixed(2);
  },
  // 设置今日销售单数
  update_today_sales_count(state,num){
    state.todaySalesCount=num;
  }
}
   



