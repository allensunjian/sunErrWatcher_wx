# sunErrWatcher_wx
###### 微信小程序的 前端监控程序
#####  功能
- 用户动作监控
- http请求异常监测
- 控制台监测

##### 用户动作监测

返回值
    date: "2019-10-11  16:3"  // 进入小程序的日期
    entry: 1570781034487  // 进入页面的时间
    leave: 1570781036884  // 离开页面的时间
    page: "pages/eliteTalents/eliteTalents"  //进入的页面
    stay: 2.397  //该页面停留的时间

##### http请求异常监测

返回值：
{
requestData:{}, 包含url,data,dataType,method, headers
responseData:{} 包含 data, errMsg, headers, statusCode
}
返回值中包含了所有请求和返回的信息，可有针对性的做处理

##### 控制台监测

- log （日志）
- warning (警告错误)
- err (错误)

