/**
 * Created by ali on 8/1/17.
 */
module.exports= {
    getChatAdminUrl:function (id) {
        return '<a href="https://t.me/channeladmindids/'+id+'" > Chat</a>';
    },
    getPostLink:function (tag,id) {
        return '<a href="https://t.me/'+tag+'/'+id+'" > See post</a>';
    },
     getChannels:function(otherchannels){
     if(otherchannels&&otherchannels!=null&&otherchannels!='null') {
         channels = otherchannels.split(',');
         if (channels.length == 1) {
             channels = otherchannels.split('@')
         }
         if (channels.length == 1) {
             channels = otherchannels.split('-')
         }
         if (channels.length == 1) {
             channels = otherchannels.split(' ')
         }
         result = [];
         if (channels.length > 1) {
             for (i = 0; i < channels.length; i++) {
                 if (channels[i].trim() != "")
                     result = result.concat(utilM.getChannels(channels[i].trim()));
             }
             if (result.length > 0)
                 return result;
         }
         return [otherchannels];
     }
     return[];
},
    getRejectInfo:function (params) {
        this.text="";
        if(params.length==5){
            this.text+="type : "+(params[0]!="irej"?"VIP":"MASS")+"\r\n";
            this.text+="tag : @"+(params[2])+"\r\n";
            this.text+="number : "+(utilM.getOrderNumber(params[1],params[3]))+"\r\n";
            this.text+="reason : "+(params[4])+"\r\n";
        }
        return this.text;
    },
    dateEnToSh:function (date) {
        //console.log(date)
       return moment(date, 'YYYY-M-D HH:mm:ss').format('jYYYY/jM/jD HH:mm:ss')
    },
    sendBulkMessage: function (messages, target,btns, cb) {
        this.promises = [];

        for (this.numb in messages) {
           // console.log(this.numb);
            this.promises.push(sendMessage(messages[this.numb]));
        }
        Promise.all(this.promises)
            .then(function (data) { // do stuff when success
               // console.log(data);
                if(messages&& messages.length>0&&messages[0].adminDescription) {
                    this.text=messages[0].adminDescription;
                     this.text +=utilM.generateText(messages[0]);
                    bot.sendMessage(target.chatid,this.text, {replyMarkup: btns}).then(function (res2) {
                        this.date = new Date().setSeconds(new Date().getSeconds() + 15);
                        this.date=utilM.getCronTime(this.date);
                       // console.log(this.date);
                        this.crondata={
                            chatid:target.chatid,
                            text:this.text,
                            markup:btns,
                            tag:messages[0].channelTag
                        };
                        this.messageid=data[data.length-1].result['message_id'];
                        this.query="update raaz_orderdetail set crontime='"+this.date+"',crontype='1',crondata='"+JSON.stringify(this.crondata)+"' " +
                            ",messageid='"+this.messageid+"' where orderdetailid="+messages[0].orderdetailid;
                        exeqM.exec(this.query,function (err,data) {
                            schedule.scheduleJob(messages[0].orderdetailid.toString(), this.date.toString(), function () {
                                bot.sendMessage(target.chatid, this.text, {replyMarkup: btns});
                                utilM.remindOrder(messages[0].orderdetailid);
                            });
                            cb(data);
                        });
                    }).catch(function (err) {
                        cb(data);
                    })
                }
                //console.log(data)
                cb(data);
            })
            .catch(function (err) { // error handling
                cb(err);
              //  console.log(err)
            });
        function sendMessage(mydata) {
            return new Promise(function (resolve, reject) {
              //  console.log(mydata);
                setTimeout(function () {
                    if(mydata.type==1) {
                        bot.sendPhoto("@testviewchannel", mydata.link, {caption:mydata.description}).then(function (res2) {
                            bot.forwardMessage(target.chatid, "@testviewchannel", res2.result['message_id'], {notification: true})
                                .then(function (data) {
                                    resolve(res2);
                                }).catch(function (err) {
                                resolve(res2);
                            })
                    }).catch(function (err) {
                        console.log(err);
                        resolve(null);
                    })
                }
                else if(mydata.type==2){
                    bot.sendVideo("@testviewchannel", mydata.link,{caption:mydata.description}).then(function (res2) {
                        bot.forwardMessage(target.chatid, "@testviewchannel", res2.result['message_id'], {notification: true})
                            .then(function (data) {
                                resolve(res2);
                            }).catch(function (err) {
                            resolve(res2);
                        })
                    }).catch(function (err) {
                        console.log(err);
                        resolve(null);
                    })
                }
                else if(mydata.type==3){
                    bot.sendDocument("@testviewchannel", mydata.link,{caption:mydata.description}).then(function (res2) {
                        bot.forwardMessage(target.chatid, "@testviewchannel", res2.result['message_id'], {notification: true})
                            .then(function (data) {
                                resolve(res2);
                            }).catch(function (err) {
                            resolve(res2);
                        })
                    }).catch(function (err) {
                        console.log(err);
                        resolve(null);
                    })
                }
                else{
                    bot.sendMessage("@testviewchannel", mydata.description, {}).then(function (res2) {
                        bot.forwardMessage(target.chatid, "@testviewchannel", res2.result['message_id'], {notification: true})
                            .then(function (data) {
                                resolve(res2);
                            }).catch(function (err) {
                            resolve(res2);
                        })
                    }).catch(function (err) {
                        console.log(err);
                        resolve(null);
                    })
                }
                },750);
                // place here your logic
                // return resolve([result object]) in case of success
                // return reject([error object]) in case of error
            });
        }
    },
    sendBulk: function (orderid,messages, targets, cb) {
        // this.btns=this.replyMarkup = bot.inlineKeyboard([
        //     [bot.inlineButton('Uncompleted!', {callback: 'dn-no-'+orderid}),
        //         bot.inlineButton('Completed!', {callback: 'dn-ya-'+orderid})],
        //     [bot.inlineButton('Later 1!', {callback: 'dn-l1-'+orderid}),
        //         bot.inlineButton('Later 2!', {callback: 'dn-l2-'+orderid})],
        //     [bot.inlineButton('Later 3!', {callback: 'dn-l3-'+orderid}),
        //         bot.inlineButton('Later 4!', {callback: 'dn-l4-'+orderid})]
        // ]);
        this.promises = [];

        for (this.numb in targets) {
            //console.log(this.numb);
            this.promises.push(sendMessageToTarget(messages,targets[this.numb]));
        }
        Promise.all(this.promises)
            .then(function (data) { // do stuff when success
            })
            .catch(function (err) { // error handling
                console.log(err)
            });
        function sendMessageToTarget(mymessages,mytarget) {
            return new Promise(function (resolve, reject) {
                if(mymessages&&mymessages.length>0) {
                    this.btns = bot.inlineKeyboard([
                        [bot.inlineButton('Uncompleted!', {callback: 'dn-no-' + mymessages[0].orderdetailid}),
                            bot.inlineButton('Completed!', {callback: 'dn-ya-' + mymessages[0].orderdetailid})],
                        [bot.inlineButton('Later 1!', {callback: 'dn-l1-' + mymessages[0].orderdetailid}),
                            bot.inlineButton('Later 2!', {callback: 'dn-l2-' + mymessages[0].orderdetailid})],
                        [bot.inlineButton('Later 3!', {callback: 'dn-l3-' + mymessages[0].orderdetailid}),
                            bot.inlineButton('Later 4!', {callback: 'dn-l4-' + mymessages[0].orderdetailid})]
                    ]);
                    utilM.sendBulkMessage(mymessages, mytarget,  this.btns, function (data) {
                      //  console.log("==========", data)
                        resolve(data);
                    });
                }
                else {
                    resolve(mymessages);
                }
            });
        }
    },
    isImage:function (link){
        this.ext=link.split('.').pop();
        this.imgext=['jpg','png','jpeg']
        if(this.imgext.indexOf(this.ext)==-1)
            return false;
        else
            return true;
    },
    getExt:function (link){
        this.ext=link.split('.').pop();
        return "."+this.ext;
    },
    getCronTime:function (date,utc) {
      
        if(isNaN(date)) {
            if(!utc)
                date=date.getLocalTime()
            else
                date=date.getTime()
        }
        //     if(!isNaN(date)) {
        //     if ("1502820176".length === date.toString().length){
        //         //date -= parseFloat(4 * 3600)
        //     }
        //     else
        //        // date -= parseFloat(4 * 3600000)
        // }
        // console.log(isNaN(date),date,new Date(date).toLocaleString(),new Date(date).getLocalTime());
        // x=l;
        // console.log(dateFormat(new Date(date), 'ss MM HH dd mm N',true),dateFormat(new Date(date), 'o'))
        if(!utc)
            return  dateFormat(new Date(date).getLocal(), 'ss MM HH dd mm N',true)
        else
            return  dateFormat(new Date(date), 'ss MM HH dd mm N',true)
    },
  getRCronTime:function (date,utc) {
    if(isNaN(date)) {
      if(!utc)
        date=date.getLocalTime()
      else
        date=date.getTime()
    }
    //     if(!isNaN(date)) {
    //     if ("1502820176".length === date.toString().length){
    //         //date -= parseFloat(4 * 3600)
    //     }
    //     else
    //        // date -= parseFloat(4 * 3600000)
    // }
    // console.log(isNaN(date),date,new Date(date).toLocaleString(),new Date(date).getLocalTime());
    // x=l;
    // console.log(dateFormat(new Date(date), 'ss MM HH dd mm N',true),dateFormat(new Date(date), 'o'))
    if(!utc)
      return  dateFormat(new Date(date).getLocal(), 'mmddHHMMss',true)
    else
      return  dateFormat(new Date(date), 'mmddHHMMss',true)
  }
    ,
    cronToDate:function (crontime) {
        // date=new Date().getFullYear().toString()+crontime.substr(0,4)
        try {
            time = crontime.substr(4).match(/.{1,2}/g).join(':')
        }
        catch (err){
            time=crontime;
        }
        return time;
    },
    getCronUTCTime:function (date) {
        if(isNaN(date)) {
            date=date.getTime()
        }
        //     if(!isNaN(date)) {
        //     if ("1502820176".length === date.toString().length){
        //         //date -= parseFloat(4 * 3600)
        //     }
        //     else
        //        // date -= parseFloat(4 * 3600000)
        // }
        // console.log(isNaN(date),date,new Date(date).toLocaleString(),new Date(date).getLocalTime());
        // x=l;
        // console.log(dateFormat(new Date(date), 'ss MM HH dd mm N',true),dateFormat(new Date(date), 'o'))
        return  dateFormat(new Date(date), 'ss MM HH dd mm N',true)

    },
    getLocalTimeDiff:function (start,end) {
        // if(!isNaN(start)) {
        //     if ("1502820176".length === start.toString().length){
        //         start -= parseFloat(4 * 3600)
        //         start*=1000;
        //
        //     }
        //     else
        //         start -= parseFloat(4 * 3600000)
        // }
        // if(!isNaN(end)) {
        //     if ("1502820176".length === end.toString().length){
        //         end -= parseFloat(4 * 3600)
        //         end*=1000;
        //     }
        //     else
        //         end -= parseFloat(4 * 3600000)
        // }
        if(!isNaN(start)&&!isNaN(end)) {

        }
        var diff = (Math.abs(end - start) / 3600000).toFixed(2);
        diff=Math.ceil(diff*10)/10;
        // console.log(dateFormat(new Date(date), 'ss MM HH dd mm N',true),dateFormat(new Date(date), 'o'))
        return diff;

    },
    getOrderNumber:function (orderid,suborderid) {
        return ("\r\nشماره تبلیغ :#raaz" + orderid+(suborderid?("_"+suborderid):""))+"\r\n";
    },
    getOrderJustNumber:function (orderid,suborderid) {
        return "#raaz" + orderid+(suborderid?("_"+suborderid):"");
    },
    getType:function (type) {
        return varM.consts[type+'type'];
    },

        generateText:function (data) {
        this.text="";
        this.text +="\nprice : "+data.price;
        this.text +="\nview limit  : "+data.view;
        this.text +="\noffer time : "+data.offerTime;
        return this.text;
    },
    getActionByData:function (data) {
        if(data=="ya")
            this.text ="Accepted !!"
        else if(data=="no")
            this.text ="Not Accepted !!"
        else{
            data=data.replace('l','');
            this.text ="Accept after "+data+" hour!!"
        }
        return this.text;
    },
    updateView:function(orderdetailid) {
        if (orderdetailid in schedule.scheduledJobs) {
            schedule.scheduledJobs[orderdetailid].cancel();
            delete schedule.scheduledJobs[orderdetailid];
        }
        // {
        //     "username":"testfwd",
        //     "id":"413",
        //     "from":"1121102848"
        // }
        this.query="select * from view_productorder where orderdetailid="+orderdetailid;
        new exeqM.exec(this.query,function (err,result) {
            if(!err&&result&&result.length>0) {
                result=result[0];
                this.post_data=  {
                        "username":result.channelTag.replace('@',''),
                        "id":result.messageid,
                        "from":originalchannel.id
                    };
                new utilM.getUpdates(this.post_data,function (err,post) {
                    if(!err&&post) {
                        console.log(post);
                        if(post.view!=-1) {
                            var date = new Date().setSeconds(new Date().getSeconds() + 60);
                            date = utilM.getCronTime(date);
                            diff = parseFloat(new Date().getLocalTime()/1000) - parseFloat((post.start).toString());
                           console.log(diff,parseFloat(new Date().getLocalTime()/1000), parseFloat((post.start)))
                            //diff = diff / 3600000;
                           // console.log(diff,result.duration , result.duration )
                            if ((post.view <result.viewCount && result.viewCount > 0) || (diff<(result.duration*100) &&result.duration&& result.duration > 0)) {
                                this.query = "update raaz_orderdetail set crontime='" + date + "',crontype='2'," +
                                    " view='" + post.view + "',reshot='" + post.reshot + "',starttime=from_unixtime('" + post.start + "') " +
                                    " where orderdetailid=" + orderdetailid;
                              //  console.log(this.query)

                                new exeqM.exec(this.query, function (err, data) {
                                    schedule.scheduleJob(orderdetailid.toString(), date.toString(), function () {
                                        console.log("updateView", utilM.getCronTime(new Date()));
                                        utilM.updateView(orderdetailid);
                                    });
                                });
                            }
                            else {
                                // this.query = "update raaz_orderdetail set status='finish',endtime=from_unixtime('" +parseInt(new Date().getLocalTime()/1000)+ "')," +
                                // " view='" + post.view + "',reshot='" + post.reshot + "',starttime=from_unixtime('" + post.start + "') " +
                                // " where orderdetailid=" + orderdetailid;
                                // //  console.log(this.query)
                                //
                                // new exeqM.exec(this.query, function (err, data) {})
                                this.text = "";
                                this.text += utilM.generateText(result);
                                this.text += "\n completed, please delete banner from your channel ..............";
                             //   console.log(this.text)
                                bot.sendMessage(result.chatid, this.text).then(function (data) {
                                 //   console.log(data)
                                }).catch(function (err) {
                                    console.log(err)
                                })
                            }
                        }
                        else{
                            ///send notify for admins
                        }
                    }
                    else {
                        console.log(err,post)
                    }
                })
            }
        });
    },
    remindBanner:function (orderdetailid) {
        if (orderdetailid in schedule.scheduledJobs) {
            schedule.scheduledJobs[orderdetailid].cancel();
            delete schedule.scheduledJobs[orderdetailid];
        }
        // {
        //     "username":"testfwd",
        //     "id":"413",
        //     "from":"1121102848"
        // }
        this.query="select * from view_productorder where orderdetailid="+orderdetailid;
        new exeqM.exec(this.query,function (err,result) {
            if(!err&&result&&result.length>0) {
                result = result[0];
                var date = new Date().setSeconds(new Date().getSeconds() + 60);
                date = utilM.getCronTime(date);
                this.text=result.adminDescription;
                this.text +=utilM.generateText(result);
                this.text +="\n reminder ..............";
                bot.sendMessage(result.chatid,this.text)
                this.query = "update raaz_orderdetail set crontime='" + date + "',crontype='2'" +
                    " where orderdetailid=" + orderdetailid;
                new exeqM.exec(this.query, function (err, data) {
                    schedule.scheduleJob(orderdetailid.toString(), date.toString(), function () {
                        console.log("updateView", utilM.getCronTime(new Date()));
                        new utilM.updateView(orderdetailid);
                    });
                });
            }
            });
    },
    remindOrder: function (orderdetailid) {
        this.query="select * from raaz_orderdetail where orderdetailid="+orderdetailid;
        new exeqM.exec(this.query,function (err,result) {

            if(!err&&result&&result.length>0) {
                result=result[0];
                if (orderdetailid in schedule.scheduledJobs) {
                    schedule.scheduledJobs[orderdetailid].cancel();
                    delete schedule.scheduledJobs[orderdetailid];
                }
               this.data=JSON.parse(result.crondata);
                this.date = new Date().setSeconds(new Date().getSeconds() + 80);
                this.date=utilM.getCronTime(this.date);
                this.query="update raaz_orderdetail set crontime='"+this.date+"' where orderdetailid="+result.orderdetailid;
                var those=this;
             //    console.dir(this.data.chatid,  this.data.text, {replyMarkup:  this.data.markup});

                bot.sendMessage( this.data.chatid,  this.data.text, {replyMarkup:  this.data.markup});
                exeqM.exec(this.query,function (err,data) {
                    schedule.scheduleJob(result.orderdetailid.toString(), those.date.toString(), function () {
                        utilM.remindOrder(result.orderdetailid);
                    });
                });
            }
        });
    },
    getUpdates:function (data,cb) {
       //console.log(data)
        this.post_data = querystring.stringify(data);
        this.post_req = http.request(httpCredRequest, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
              //  console.log(res.statusCode);
                if(res.statusCode==200)
                    cb(null,JSON.parse(chunk));
                else
                    cb(chunk,null);
            });

        });
        this.post_req.on('error',function (err) {
            cb(err,null);
        })
        this.post_req.write(this.post_data);
        this.post_req.end();
    }
}
