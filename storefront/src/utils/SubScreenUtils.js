
export default function subscreen() {
};


subscreen.put = (data)=> {
  // let cache = localStorage.getItem("subscreen");
  // let cacheJson;
  // if (cache != null){
  //   cacheJson = JSON.parse(cache);
  //   cacheJson = Object.assign({},cacheJson,data);
  // }
  localStorage.setItem('subscreen',JSON.stringify(data));
}

subscreen.get =  () =>{
  let cache = localStorage.getItem("subscreen");
  if (cache != null){
    return JSON.parse(cache);
  }
  return "";
}

subscreen.clear =  ()=> {
  localStorage.removeItem("subscreen");
}
