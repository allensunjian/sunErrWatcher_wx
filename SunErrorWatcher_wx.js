function tracker (opts) {
    return
    const utils = {
        typeOf: function (type) {
           return Object.prototype.toString.call(this) == `[object ${type}]`
        },
        forEach: function (args) {
            let FE = Array.prototype.forEach;
            function a (f) {
                Object.keys(this).forEach(function (k) {
                    f(this[k],k)
                }.bind(this))
            }
            utils.typeOf.call(this,'Object')?a.apply(this,arguments):FE.apply(this,arguments);
        }
    }
    const consEvent = {
        log:console.log,
        warn:console.warn,
        error:console.error
    }
    const handleEventCenter = {
        getDate: function () {
            let time = this.getTime()
            let y = time.getFullYear(), m = time.getMonth()+1, d = time.getDate(), h = time.getHours(), M = time.getMinutes();
            return `${y}-${m}-${d}  ${h}:${M}`
        },
        getTime: function () {
            return new Date();
        },
        getSystemInfo: function () {
            return new Promise(resolve => {
                wx.getSystemInfo({
                    success:function (info) {
                        resolve(info)
                    }
                })
            })
        },
        getCurrentPage:function () {
          return getCurrentPages()
        },
        resetHttpRequest: function () { // http方法重写
            const handleRequest = wx.request;
            Object.defineProperty(wx,'request',{
                configurable:true,
                enumerable:true,
                writable:true,
                value:function () {
                    const config = arguments[0] || {},
                        url = config.url,
                        headers = config.header,
                        fail = config.fail,
                        success =config.success;
                    config.fail = function (res) {
                  //      console.log(res);
                        fail && fail.apply(this,arguments);
                    }
                    config.success =function (res) {
                  //      console.log(res);
                        success && success.apply(this,arguments);
                    }
                    return handleRequest.apply(this,arguments);
                }
            })
        },
        resetLogger: function () { //重写console对象
            utils.forEach.call(consEvent,(f,k) => {
                console[k] = function () {
                    f.apply(this,arguments)
                }
            })
        },
        resetPage: function () { // 重写Page对象
            let orginPage = Page;
            Page = function () {
                let e = arguments[0],
                savedEvents = {}, //保存的原始事假
                re = null; //执行声明周期时的返回值
                 utils.forEach.call(eventCurrent,(f,k) => {
                     savedEvents[k] = e[k];
                     e[k] = function () {
                         savedEvents[k] && savedEvents[k].apply(this,arguments);
                         re = !f?'':f(re)
                     }
                 })
                orginPage.apply(null,[].slice.call(arguments))
            };
        }
    };
    let systemInfo = {};
    let eventCurrent = {
        onShow: function (data) {
            let currentPage = this.getCurrentPage();
            let ret = {
                page:currentPage.length > 0? currentPage[currentPage.length - 1].route: '',
                date:this.getDate(),
                entry:this.getTime().getTime(),
                leave:null,
                stay:null,
            }
            return ret;
        }.bind(handleEventCenter),
        onHide: function (data) {
            data.leave = this.getTime().getTime();
            data.stay =  (data.leave - data.entry)/1000;
            console.log(data);
            return data;
        }.bind(handleEventCenter),
        onUnload: function (data) {
            data.leave = this.getTime().getTime();
            data.stay =  (data.leave - data.entry)/1000;
            console.log(data);
            return data;
        }.bind(handleEventCenter)
    }
    handleEventCenter.getSystemInfo().then(res => {
        systemInfo = res;
    })
    handleEventCenter.resetHttpRequest();
    handleEventCenter.resetLogger();
    handleEventCenter.resetPage();
}
module.exports = tracker;
