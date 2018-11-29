import axios from 'axios';
import querystring from 'querystring';

//处理req data
const opera_req = (data) => {
  return querystring.stringify(data)
}

//处理res data
const opera_res = (data) => {
  return data
}

//通过axios发送请求
export default async(pathName, queryData)=>{  
  let url = pathName;
  console.log(url)

  let result;
  if (queryData) {
    result = await axios.get(url, {
      params: queryData
    });
  } else {
    result = await axios(url);
  }
  let resdata = opera_res(result);

  return new Promise((resolve, reject) => {
    resolve(resdata)
  })


}