//@ts-nocheck
import axios, { AxiosError } from "axios"
axios.defaults.baseURL = "http://localhost:1337/api"
// axios.defaults.params = {}
// axios.defaults.params["publicationState"]="preview"
function errorHandler(err: AxiosError) {
  // 这里是返回状态码不为200时候的错误处理
  if (err && err.response != null) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        err.message = '请重新登录'
        return
      case 403:
        err.message = '拒绝访问'
        // err.message = "token不存在或已过时"
        break
      case 404:
        err.message = `请求地址出错: ${err.response.config.url ?? ''}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
    }
  }
  // if (err.code !== 'ERR_CANCELED') {
  // }
  return Promise.reject(err)
}
function changeArr(arr) {
  for(const obj of arr){
    Object.assign(obj, obj.attributes)
    // delete obj.id 
    delete obj.attributes
    delete obj.createdAt
    delete obj.updatedAt
    delete obj.publishedAt
  }
}
axios.interceptors.request.use((req)=>{
  if(!req.params)
    req.params = {}
  req.params["publicationState"] = "preview"
  return req
})
axios.interceptors.response.use((res) => {
  const data: {
    err: string
    data: any,
    meta: any
  } = res.data
  if (data.err) {
    // 错误处理
    return Promise.reject(new Error(data.err))
  } else {
    changeArr(data.data)
    if (res.config.params.isList === true){
      return {
        list:data.data,
        pagination: data.meta.pagination
      }
    }else{
      return data.data
    }
  }
}, errorHandler)

export function getNavItems(){
  return axios.get<null, navItems>("/nav-items")
}
export function getArticleNavItems(){
  return axios.get<null, articleNavItems>("/article-nav-items")
}
export function getArticleList(
  category: string,
  tag: null|string,//null 全部 
  page: number,
  sort: "default"|"time"|"hot" = "default"
){
  const params = {
    "filters[category][$eq]":category,
    "pagination[page]":page,

    "fields[0]":"createTime",
    "fields[1]":"hotIndex",
    "fields[2]":"viewCount",
    "fields[3]":"agreeCount",
    "fields[4]":"commentCount",
    "fields[5]":"category",
    "fields[6]":"tags",
    "fields[7]":"title",
    "fields[8]":"briefContent",
    "fields[9]":"img",
    "fields[10]":"author",
    "fields[11]":"id",

    isList:true
  }
  if(tag !== null){
    params["filters[tags][$contains]"] = tag
  }
  if(sort === "time"){
    //@ts-ignore
    params["sort[0]"] = "createTime:desc"
  }else if(sort === "hot"){
     //@ts-ignore
    params.sort = "createTime:desc"
  }
  return axios.get<null,{
    list: articleMeta[],
    pagination: {
      page:number,
      pageSize:number,
      pageCount:number
      total:number
    }
  }>("/articles",{
    params
  })
}
export function getAritcleById(id:string){
  return axios.get("/articles",{
    params:{
      [id]:true,
    }
  }).then(res=>res[0])
}
getNavItems().then(res=>{
  console.log(res);
})
getArticleNavItems().then(res=>{
  console.log(res);
})