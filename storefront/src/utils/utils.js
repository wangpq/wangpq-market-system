/**
 * 获取最近的顶层dom节点
 * @param {*} el
 * @param {*} selector
 */
export function getClosest(el, selector) {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            break;
        }
        el = el.parentElement;
    }
    return el;
}

export function trim(str) {
    return str.replace(/^\s+|\s+$/gm,'');
}


 /**
  * js验证身份证正确性
  * @param {String} sId
  */
let aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
export function isCardID(sId){
    let iSum=0 ;
    let info="" ;
    if(!/^\d{17}(\d|x)$/i.test(sId))
        return "你输入的身份证长度或格式错误";
    sId=sId.replace(/x$/i,"a");
    if(aCity[parseInt(sId.substr(0,2))]==null) return "你的身份证地区非法";
    let sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
    let d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return "身份证上的出生日期非法";
    for(let i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
    if(iSum%11!=1) return "你输入的身份证号非法";
    return true;//aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女")
}

 /**
  * 当页面超时用户退出登录时
  * @param {Object} response ajax响应数据
  * @param {Function} fn 未超时响应函数
  */
export function timeOutFn(self,response,fn){
   if(response.data.data==10004){
      self.$toast({
        message : "用户未登录，请先登录！",
        autoHide : true,
        onAfterToastHide(){
            localStorage.clear();
            self.$store.dispatch('emptyProductList');
            self.$router.push({ path: "/login" });
        }
      });
      return false;
   }else{
      fn & fn();
   }
}

export function getCookie(c_name) {
  if (document.cookie.length>0)
  {
    let c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1)
    {
      c_start=c_start + c_name.length+1
      let c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return ""
}

/**
 * 日期字符串转换为星期几
 * @param {String} date 
 * return number
 */
export function formatDateStrToDay(date) {
    // 考虑ios、android兼容性问题，日期字符串先转为标准的"2018/09-17"
    // 将类似 "2018-09-17 00:00:00"这样的日期格式化为"2018/09-17"
    let formatData=date.substr(0,10).replace(/-/g,"/");
    // new Date().getDay() 获取当天是星期几
    // new Date("2018/09-17").getDay() 给定日期是星期几
    // 返回0，表示星期天，1：星期一……
    return new Date(formatData).getDay()
  }
