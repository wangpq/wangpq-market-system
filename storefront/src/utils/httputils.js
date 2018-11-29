import axios from 'axios'
import api from '@/api/apiList'

axios.defaults.baseURL = api.host;


function  userBody(method) {
  if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put'){
    return true
  }else{
    return false;
  }
}

//需要请求服务器
function needRequest(params) {
  if(!params.hasOwnProperty("cache") || !params.cache) {
    return true;
  }else if (params.hasOwnProperty("refresh") && params.refresh){
    return true;
  }
  return false;
}

function showErr(vueTarget,message) {
  if (vueTarget){
    vueTarget.$toast(message);
  }
}

// download url
const downloadUrl = url => {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  iframe.onload = function () {
    document.body.removeChild(iframe)
  }
  document.body.appendChild(iframe)
}

export function $http (params, success,fail,vueTarget) {
  if (!needRequest(params)) {
    let value = sessionStorage.getItem(params.path);
    if (value != null){
      (typeof  success === "function")?success(JSON.parse(value)):null;
      return;
    }
  }
  axios({
    method: params.method,
    url: params.path,
    data: userBody(params.method)?params.data:"",
    params:userBody(params.method)?"":params.data
    // responseType: params.hasOwnProperty('type')?params.type:''
  }).then(res=>{
    // 当页面超时用户自动退出登录时
    if (interceptors(res,vueTarget)){
      (typeof  fail === "function")?fail(res.data):null;
      return;
    }

    if (res.headers['content-type'].search("octet-stream") != -1) { //数据流类型直接下载
      downloadUrl(res.request.responseURL);
      (typeof  success === "function")?success(res.data):null;
    }else if (res.headers['content-type'].search("text/html") != -1){
      (typeof  success === "function")?success(res.data):null;
    } else{ //json类型
      if (res.data.success){
        if(params.hasOwnProperty("cache") && params.cache){
          sessionStorage.setItem(params.path,JSON.stringify(res.data));
        }
        (typeof  success === "function")?success(res.data):null;
      }else{
        (typeof  fail === "function")?fail(res.data):null;
        showErr(vueTarget,res.data.message);
      }
    }
  }).catch(err => {
    (typeof  fail === "function")?fail(err.data):null;
    showErr(vueTarget,err.data.message);
  })
}


function interceptors(res,vue) {
  if (res.data.data == 10004 && vue) {
    vue.$toast({
      message : "用户未登录，请先登录！",
      autoHide : true,
      onAfterToastHide(){
        localStorage.clear();
        vue.$store.dispatch('emptyProductList');
        vue.$router.push({ path: "/login" });
      }
    });
    return true;
  }else if (res.data.data == 10005 && vue) {
    vue.$alert('登录密码为初始密码，请修改', '温馨提示', {
      confirmButtonText: '确定',
      callback: action => {
        if (action === 'confirm'){
          vue.$router.push({ path: "/modifypass" });
        }
      }
    });
    return true;
  }
  return false;
}


export default $http

