/**gdfdfgdf
 * Created by ali on 7/31/17.
 */
// process.env.TZ="Asia/Tehran";

var cluster = require('cluster');
if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function (worker, code, signal) {
        shotdown++;
        // cluster.fork();
    });
}
var shotdown = 0;
if (cluster.isWorker) {
    process.env.TZ="Asia/Tehran";
    console.log(new Date())
    String.prototype.escapeSpecialChars = function() {
        return this.replace(/\n/g, "\\n").this.replace(/\u/g, "\\u");
    };
    String.prototype.hexEncode = function(){
        var hex, i;

        var result = "";
        for (i=0; i<this.length; i++) {
            hex = this.charCodeAt(i).toString(16);
            result += ("000"+hex).slice(-4);
        }

        return result
    }
    Array.prototype.hexDecode = function(){
        var j;
        // var hexes = this.match(/.{1,4}/g) || [];
        var back = "";
        for(j = 0; j<this.length; j++) {
            back += String.fromCharCode(parseInt(this[j], 16));
        }

        return back;
    }
    Array.prototype.searchObject=function (field,value) {
        // body...
        for(sbi=0;sbi<this.length;sbi++){
            if(this[sbi][field]==value){
                return this[sbi];
            }
        }
        return false;
    }
    Array.prototype.searchObjects=function (field,value) {
        temp=[];
        for(sbi=0;sbi<this.length;sbi++){
            if(this[sbi][field]==value){
                temp.push(this[sbi]);
            }
        }
        return temp;
    }
    Array.prototype.filterObjects=function (field) {
        temp=[];
        for(sbi=0;sbi<this.length;sbi++){
            console
            if(this[sbi][field]){
                temp.push(this[sbi]);

            }
        }
        return temp;
    }
    String.prototype.getAllIndexes=function(substring) {
        var a=[],i=-1;

        while((i=this.indexOf(substring,i+1)) >= 0) a.push(i);
        return a;

    }
    Date.prototype.getLocalTime=function () {
        dateString=this.toLocaleString();
        date=dateString.split(',')[0].trim();
        mytime=dateString.split(',')[1]
      mytime=mytime.replace("PM","").replace("AM","").trim();
        dateParams=date.split('/');
        timeParams=mytime.split(':');
        if(this.toLocaleString().indexOf("AM")==-1&&parseInt(timeParams[0])+parseInt(12)<24){
            timeParams[0]=parseInt(timeParams[0])+parseInt(12);
        }
        date=dateParams[2]+"-"+(dateParams[0].toString().length==2?dateParams[0]:"0"+dateParams[0].toString())+
            "-"+(dateParams[1].toString().length==2?dateParams[1]:"0"+dateParams[1].toString());
      mytime=(timeParams[0].toString().length==2?timeParams[0]:"0"+timeParams[0].toString())+":"+
            (timeParams[1].toString().length==2?timeParams[1]:"0"+timeParams[1].toString())+":"+
            (timeParams[2].toString().length==2?timeParams[2]:"0"+timeParams[2].toString());
        datetimeString=date+"T"+mytime+"Z";
        // return datetimeString;
        datetime=new Date(datetimeString)
        return datetime.getTime();
    }
  Date.prototype.getLocal=function () {
    dateString=this.toLocaleString();
    date=dateString.split(',')[0].trim();
    mytime=dateString.split(',')[1]
    mytime=mytime.replace("PM","").replace("AM","").trim();
    dateParams=date.split('/');
    timeParams=mytime.split(':');
      if(this.toLocaleString().indexOf("AM")==-1&&parseInt(timeParams[0])+parseInt(12)<24){
      timeParams[0]=parseInt(timeParams[0])+parseInt(12);
    }
    date=dateParams[2]+"-"+(dateParams[0].toString().length==2?dateParams[0]:"0"+dateParams[0].toString())+
      "-"+(dateParams[1].toString().length==2?dateParams[1]:"0"+dateParams[1].toString());
    mytime=(timeParams[0].toString().length==2?timeParams[0]:"0"+timeParams[0].toString())+":"+
      (timeParams[1].toString().length==2?timeParams[1]:"0"+timeParams[1].toString())+":"+
      (timeParams[2].toString().length==2?timeParams[2]:"0"+timeParams[2].toString());
    datetimeString=date+"T"+mytime+"Z";
    datetime=new Date(datetimeString)
    return datetime;
  }
    Array.prototype.sortOn = function(key){
        this.sort(function(a, b){
            if(a[key] < b[key]){
                return -1;
            }else if(a[key] > b[key]){
                return 1;
            }
            return 0;
        });
    }
    // new Date("1512417311000").getLocal()
    // console.log(new Date().getLocalTimezoneOffset(),process.env)
    // console.log(new Date().getLocalTime(),new Date(new Date().getLocalTime()))
    // console.log(new Date().toLocaleString(),new Date(new Date().toLocaleString()))
    global.rootPath=__dirname+"/";
    // dateObj=new Date();
    // var utcEpochSeconds = dateObj.getLocalTime() + (dateObj.getLocalTimezoneOffset() * 60000);
    // console.log(utcEpochSeconds,process.env.TZ)
    // console.log(dateObj)
    global.chatpath=__dirname+"/history/";
    var initM = require('./modules/init')
        initM.init();
          cronM.recovery(function () {
              // utilM.getCronTime(new Date())
              // console.log(now)
              // console.log(now.getLocalTime())
              // bot.sendSticker(71536363,'sticker.webp');
              // bot.start();
              wsM.setConfig();
              wsM.routing();
              wsM.start();
              botM.commands();
              botM.cbq();
              botM.start();
              abotM.commands();
              abotM.cbq();
              abotM.text();
              abotM.asks();
              abotM.start();
        })
  // const run = async () => {
  //   // const first_name = await login()
  //
  //   resut=await abot.sendMessage(admins[0].id,"jkdfnlvf")
  //   console.log(resut)
  //
  //   // await getChat("testviewchannel");
  //   //console.log(new Date().getTime()+ (new Date().getTimezoneOffset() * 60000))
  //   //console.log(new Date(new Date().getTime()+ (new Date().getTimezoneOffset() * 60000)))
  // }
  // run()
  //   this.query = " update raaz_orderdetail set status='banner' where status is null and orderdetailid=" +1000000;
  //   //this.query = " select 1 as oneber";
  //   new exeqM.exec(this.query, function (err, data) {
  //       console.log(data)
  //   })

    process.on('uncaughtException', function (exception) {
        console.log(exception, new Date())
     //  process.exit(0);
    })
    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
       // process.exit(0);

    });
}
// return bot.sendMessage("@testviewchannel", 'Your Order', {}).then(function (res2) {
//     console.log(res2)
//     //  res=res.resuslt;
//     //console.log('message_id',res2.result['message_id'])
//     this.replyMarkup = bot.inlineKeyboard([
//         [bot.inlineButton('Done!', {callback: 'done-21202524424'})]
//     ]);
//     bot.forwardMessage(req.body.chatid, "@testviewchannel", res2.result['message_id'], {notification: true}).then(function (res2) {
//         return bot.sendMessage(req.body.chatid, 'are you okay?!', {replyMarkup: this.replyMarkup})
//     })
// })
// var schedule = require('node-schedule');
// schedule.scheduleJob("jobName", "30,20,10,40,50    *    *    *    *    *", function () {
// //Put your api hit here.
// console.log("start",schedule.scheduledJobs)
// //finally remove the schedule
//     if ("jobName" in schedule.scheduledJobs) {
//         schedule.scheduledJobs["jobName"].cancel();
//         delete schedule.scheduledJobs["jobName"];
//         console.log("remove",schedule.scheduledJobs)
//     }
//     console.log("end",schedule.scheduledJobs)
// })
