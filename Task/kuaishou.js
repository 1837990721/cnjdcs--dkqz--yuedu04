/*
更新时间: 2020-09-08 11:45

本脚本仅适用于快手极速版签到
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下
2.APP登陆账号后，以下方法获取Cookie
打开设置页面:"积分兑好礼"

3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
仅测试Quantumult x，Surge、Loon自行测试
by Macsuny
感谢
@Chavy
@Nobyda
~~~~~~~~~~~~~~~~

Surge 4.0 :
[Script]
快手极速版 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js,script-update-interval=0

快手极速版 = type=http-request,pattern=https:\/\/nebula\.kuaishou\.com\/nebula\/task\/earning\?,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js

~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js, enabled=true, tag=快手

http-request https:\/\/nebula\.kuaishou\.com\/nebula\/task\/earning\? script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js

-----------------

QX 1.0.7+ :
[task_local]
0 9 * * * kuaishou.js

[rewrite_local]

https:\/\/nebula\.kuaishou\.com\/nebula\/task\/earning\? url script-request-header kuaishou.js

~~~~~~~~~~~~~~~~

hostname = nebula.kuaishou.com

~~~~~~~~~~~~~~~~

*/
const logs = 0   //日志开关
const $ = new Env('快手极速版')
const cookieVal = $.getdata('cookie_ks');
let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
   GetCookie()
} else {
 !(async() => {
  await sign();
  await signifo();
  await info()
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
}
function GetCookie() {
  if ($request.headers) {
    var CookieValue = $request.headers['Cookie'];
    
    if ($.getdata('cookie_ks') != (undefined || null)) {
      if ($.getdata('cookie_ks') != CookieValue) {
        var cookie = $.setdata(CookieValue, 'cookie_ks');
        if (!cookie) {
          $.msg("更新" + $.name + "Cookie失败‼️", "", "");
          $.log(`[${$.name}] 获取Cookie: 失败`);
        } else {
          $.msg("更新" + $.name + "Cookie成功 🎉", "", "");
          $.log(`[${$.name}] 获取Cookie: 成功, Cookie: ${CookieValue}`)
        }
      }
    } else {
      var cookie = $.setdata(CookieValue, 'cookie_ks');
      if (!cookie) {
        $.msg("首次写入" + $.name + "Cookie失败‼️", "", "");
      } else {
        $.msg("首次写入" + $.name + "Cookie成功 🎉", "", "");
      }
    }
  } else {
    $.msg("写入" + $.name + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
  }
$.done()
}

function sign() {
   return new Promise((resolve, reject) => {
	 let signurl = {
		url: 'https://nebula.kuaishou.com/rest/n/nebula/sign/sign',
		headers: {Cookie: cookieVal}}
    $.get(signurl, (error, response, data) => {
      if(logs) $.log(`${$.name}, data: ${data}`)
      let result = JSON.parse(data)
      if(result.result == 10007){
        subTitle = `签到结果: ${result.error_msg}`
        $.msg($.name,subTitle,'')}
        if(logs) $.log(`错误代码: ${result.result}, 返回信息: ${result.error_msg}`)
       })
     resolve()
   })
 }
function signifo() {
   return new Promise((resolve, reject) => {
    earnurl = {
		url: 'https://nebula.kuaishou.com/rest/n/nebula/sign/query',
		headers: {Cookie: cookieVal}}
    $.get(earnurl, (error, response, data) => {
      if(logs)$.log(`${$.name}, data: ${data}`)
      let result = JSON.parse(data)
     if (result.data.nebulaSignInPopup.button == '立即签到'){ 
       detail = `签到成功: ${result.data.nebulaSignInPopup.subTitle}, ${result.data.nebulaSignInPopup.title}`
      } else if (result.data.nebulaSignInPopup.button == '好的'){ 
       detail = `重复签到: ${result.data.nebulaSignInPopup.subTitle}, ${result.data.nebulaSignInPopup.title}`
      }
    resolve()
     })
  })
}
function info() {
   return new Promise((resolve, reject) => {
    let reurl = {url:'https://nebula.kuaishou.com/rest/n/nebula/activity/earn/overview',
    headers: {Cookie:cookieVal}}
	$.get(reurl, (error, response, data) =>{
	if(logs)$.log(`${$.name}, data: ${data}`)
	let result = JSON.parse(data) 
	if (result.result == 1) {
	     subTitle = `现金收益: 💵${result.data.allCash}元    金币收益: 💰${result.data.totalCoin}`
		  } 
         $.msg($.name,subTitle,detail)
          resolve()
	     })
      })
 }
      
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}