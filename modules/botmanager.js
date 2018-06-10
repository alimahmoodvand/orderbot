/**
 * Created by ali on 7/31/17.
 */
module.exports={
    start:function (msg) {
        bot.start();
    },
    commands:function () {
        // bot.on(['/orders'],function (msg) {
        // });
        bot.on(['/start'],function (msg) {
            new botM.sendAction(msg);
            this.promises=[botM.forwardPromise("@channeladmindids", msg.from.id, msg.message_id)];
            Promise.all(this.promises).then(function (data){
                //console.log(data);
                    
                this.query = " SELECT * FROM `channelscopy` where register=1 and  chatid=" + msg.from.id + " group by  TelegramId;";
                if(data&&data.length==1&&data[0].result){
                    this.query +=" update channelscopy set chatadmin='"+data[0].result.message_id+"'  where chatid=" + msg.from.id + ";";
                }
                else{
                    this.query+="select 1;"
                }
                // console.log( this.query);
                // return;
                    
                new exeqM.exec(this.query, function (err, data) {
                    if (data && !err && data.length ==2) {
                        data=data[0];
                    if (data && !err && data.length > 0) {
                        bot.sendMessage(msg.from.id, varM.msg.welcome, {replyMarkup: varM.markups.getOrders}).then(function (idres) {
                            this.text = "";
                            this.msgs = [];
                            for (ci = 0; ci < data.length; ci++) {
                                this.text += "@" + data[ci].TelegramId + "   ";
                                if (ci % 2 == 0) {
                                    this.text += "\r\n";
                                }
                                if (ci % 16 == 0) {
                                    // bot.sendMessage(msg.from.id, this.text).then(function (idres) {
                                    // });
                                    this.msgs.push({
                                        chatid: msg.from.id,
                                        text: this.text
                                    })
                                    this.text = "";

                                }
                            }
                            if (this.text)
                                this.msgs.push({
                                    chatid: msg.from.id,
                                    text: this.text
                                })

                            this.msgs.push({
                                chatid: msg.from.id,
                                text: varM.msg.pressorderbtn
                            })
                            new autilM.sendBulk(this.msgs);
                        })
                    }
                    else {
                        bot.sendMessage(msg.from.id, varM.msg.notexistchannel,{replyMarkup:'hide'})
                    }
                    }
                    else {
                        bot.sendMessage(msg.from.id, varM.msg.notexistchannel,{replyMarkup:'hide'})
                    }
                });
            });

        });
        bot.on('*',function (msg) {
            new botM.sendAction(msg);
            // bot.sendSticker(msg.from.id,'/var/www/html/orderbot/sticker.webp')
            // console.log(msg.location)
            // bot.sendAction(msg.from.id,"record_video_note")
            // return;


            if(msg.text) {
                if (msg.text == "id") {
                    return bot.sendMessage(msg.from.id, msg.from.id).then(function (idres) {
                        console.log(idres)
                    })
                }
                else if(msg.text=="تبلیغات به زودی"){
                  new uutilM.getOrders(msg);
                }
                else if(msg.text=="گرفتن تبلیغ جدید"){
                    new uutilM.getCurOrders(msg);
                }
                else if(msg.text=="تبلیغات جاری من"){
                    new uutilM.getContOrders(msg);
                }
                else if(msg.text=="تبلیغات پایان یافته من"){
                    new uutilM.getFinOrders(msg);
                }
                else if(msg.text=="افزودن/حذف کانال"){
                    new botM.sendAction(msg);
                        //console.log(data);

                        this.query = " SELECT * FROM `channelscopy` where register=1 and  chatid=" + msg.from.id + " group by  TelegramId;";
                        // console.log( this.query);
                        // return;

                        new exeqM.exec(this.query, function (err, data) {
                                if (data && !err && data.length > 0) {
                                    bot.sendMessage(msg.from.id, varM.msg.varizbot, {replyMarkup: varM.markups.getOrders}).then(function (idres) {
                                        this.text = "";
                                        this.msgs = [];
                                        for (ci = 0; ci < data.length; ci++) {
                                            otherchannels=utilM.getChannels(data[ci].otherchannels);
                                            this.text += "@" + data[ci].TelegramId +
                                                ((otherchannels&&
                                                otherchannels.length>0)?
                                                    (" & @"+otherchannels.join(' & @')):"");

                                           // if (ci % 2 == 0) {
                                                this.text += "\r\n";
                                           // }
                                            if (ci % 16 == 0) {
                                                // bot.sendMessage(msg.from.id, this.text).then(function (idres) {
                                                // });
                                                this.msgs.push({
                                                    chatid: msg.from.id,
                                                    text: this.text
                                                })
                                                this.text = "";

                                            }
                                        }
                                        if (this.text)
                                            this.msgs.push({
                                                chatid: msg.from.id,
                                                text: this.text
                                            })

                                        // this.msgs.push({
                                        //     chatid: msg.from.id,
                                        //     text: varM.msg.pressorderbtn
                                        // })
                                        new autilM.sendBulk(this.msgs);
                                    })
                            }
                            else {
                                bot.sendMessage(msg.from.id, varM.msg.notexistchannel,{replyMarkup:'hide'})
                            }
                        });
                }
                else if(msg.text=="تغییر استیکر"){
                    return bot.sendMessage(msg.from.id, varM.msg.sticker)
                }
                else if (msg.text.indexOf("/contributors_") == 0) {
                    this.orderdetailid = msg.text.replace("/contributors_", '')
                    this.query = " SELECT * FROM `view_icontributors` where  orderCategoryDetailId=" + this.orderdetailid + " group by categoryId,TelegramId;";
                    new exeqM.exec(this.query, function (err, data) {
                        //  new autilM.setOrders(msg,data[0][0].orderid)
                        this.text = "تعداد :" + data.length + "\r\n";
                        for (this.ci = 0; data.length > this.ci; this.ci++) {
                            this.text += "@" + data[this.ci].TelegramId + "\r\n";
                            if (this.ci % 20==0&&this.ci!=0) {
                                bot.sendMessage(msg.from.id, this.text);
                                this.text = "";
                            }
                        }
                        if(this.text)
                            bot.sendMessage(msg.from.id, this.text);
                    })
                }
                // abot.getChatMembersCount("@darsnews").then(function (info) {
                //     console.log(info)
                // }).catch(err=>{
                //     console.log(err)
                // })
            }
            else if(msg.sticker&&msg.from) {
                bot.getFile(msg.sticker.file_id).then(function (info) {
                    filename = rootPath + "stickers/" + msg.from.id + ".webp";
                    console.log(info.fileLink, filename)
                    autilM.download(info.fileLink, filename, function () {
                        bot.sendMessage(msg.from.id,varM.msg.done);
                        this.btns=[];
                        this.btns.push([abot.inlineButton("Verify "+(msg.from.username?"  @"+msg.from.username:""),
                            {callback: "stkver-"+msg.from.id})]);
                        this.btns.push([abot.inlineButton("Deny "+(msg.from.username?"  @"+msg.from.username:""),
                            {callback: "stkden-"+msg.from.id})]);
                        // this.btns.push([abot.inlineButton("انبوه - REJECT - " + this.params[3],
                        //     {callback: "rejirej-" + this.params[3]+"-"+this.params[2]+"-"+msg.from.id+"-"+this.params[1]+"-"+this.params[4]})]);
                        this.btns = abot.inlineKeyboard(this.btns)
                        filename = rootPath + "stickers/" + msg.from.id + ".webm";
                        for (ai = 0; ai < admins.length; ai++) {
                            abot.sendSticker(admins[ai].id, filename, {replyMarkup:this.btns})
                        }
                    })
                })
                // console.log(msg);
            }
        });
    },
    cbq:function () {
        bot.on('callbackQuery', function (msg){
            new botM.sendAction(msg);
            console.log(msg.data.split('-'))
            msgid=fs.readFileSync(chatpath+msg.from.id).toString('utf8');
            if((msgid&&msgid==msg.message.message_id)||true) {
                if (msg.data.indexOf('dn-') == 0) {
                    new uutilM.orderRes(msg, msg.data.split('-'))
                }
                else if (msg.data.indexOf('idn-') == 0) {
                    new uutilM.iorderRes(msg, msg.data.split('-'))
                }
                else if (msg.data.indexOf('po-') == 0) {
                    new uutilM.sendOrder(msg, msg.data.split('-'));
                }
                else if (msg.data.indexOf('io-') == 0) {
                    new uutilM.isendOrder(msg, msg.data.split('-'));
                }
                else if (msg.data.indexOf('pco-') == 0) {
                    new uutilM.sendOrder(msg, msg.data.split('-'));
                }
                else if (msg.data.indexOf('ico-') == 0) {
                    new uutilM.isendOrder(msg, msg.data.split('-'));
                }
                else if (msg.data.indexOf('pcto-') == 0) {
                    new uutilM.getOrderInfo(msg, msg.data.split('-'),'جاری');
                }
                else if (msg.data.indexOf('icto-') == 0) {
                    new uutilM.igetOrderInfo(msg, msg.data.split('-'),'جاری');
                }
                else if (msg.data.indexOf('pfo-') == 0) {
                    new uutilM.getOrderInfo(msg, msg.data.split('-'),'تمام شده');
                }
                else if (msg.data.indexOf('ifo-') == 0) {
                    new uutilM.igetOrderInfo(msg, msg.data.split('-'),'تمام شده');
                }
                else if (msg.data === 'order' || msg.data === 'iorder') {
                    new uutilM.getOrders(msg);
                }
                else if (msg.data.indexOf('irej-') == 0) {
                    this.params = msg.data.split('-');
                    if(this.params[4]=="back"){
                        console.dir(msg);
                        console.log(this.params);
                        bot.deleteMessage(msg.from.id,msg.message.message_id)
                        return
                    }

                    this.query= "UPDATE raaz_ordercategorydetail set  rejectlist=CASE WHEN rejectlist is not null and rejectlist<>'' " +
                        " then concat(rejectlist,',"+this.params[2]+"')  " +
                        " else '"+this.params[2]+"'  END " +
                        " where ordercategorydetailid=" + this.params[3] + " and " +
                        " ((rejectlist not like '"+this.params[2]+",%' and rejectlist not like '%,"+this.params[2]+"' and rejectlist not like '"+this.params[2]+"'  ) or rejectlist is null) ;";
                   // this.query+=" insert into raaz_rejects (orderid,suborderid,channelTag,reason,rejecttime,type) values" +
                   //     " ("+this.params[1]+","+this.params[3]+",'"+this.params[2]+"','"+this.params[4]+"',"+new Date().getLocalTime()+",2);";
                    this.query+=" update raaz_orderdetail set status='reject',rejectReason='"+this.params[4]+"',sitestatus=-3 where categoryId=" + this.params[3] + " and channelTag='"+this.params[2]+"' ; ";
                   // console.log(this.query);
                   // return;
                    this.query+=" select chatadmin from channelscopy where TelegramId='"+this.params[2]+"' limit 1; ";

                    new exeqM.exec(this.query, function (err, orders) {
                        this.params = msg.data.split('-');
                        // console.log(utilM.getRejectInfo(this.params));
                        // return;
                            
                        this.text=utilM.getRejectInfo(this.params)
                        +(orders[2]&&orders[2][0]&&orders[2][0].chatadmin?("\r\n"+" 📱 : "+ utilM.getChatAdminUrl(orders[2][0].chatadmin)):"");
                        this.btns = [];
                        this.btns.push([abot.inlineButton("انبوه - FIX - " + this.params[3],
                            {callback: "fixirej-" + this.params[3]+"-"+this.params[2]+"-"+msg.from.id+"-"+this.params[1]+"-"+this.params[4]})]);
                        // this.btns.push([abot.inlineButton("انبوه - REJECT - " + this.params[3],
                        //     {callback: "rejirej-" + this.params[3]+"-"+this.params[2]+"-"+msg.from.id+"-"+this.params[1]+"-"+this.params[4]})]);
                        this.btns = abot.inlineKeyboard(this.btns)
                        for (ai = 0; ai < admins.length; ai++) {
                            abot.sendMessage(admins[ai].id,"❌"+varM.msg.rejected+"❌\r\n\n"+this.text, {replyMarkup:this.btns,parseMode:'html',webPreview:false})
                        }
                        bot.sendMessage(msg.from.id, varM.msg.rejectSend)
                    })
                }
                else if (msg.data.indexOf('rej-') == 0) {
                    this.params = msg.data.split('-');
                    if(this.params[4]=="back"){
                        console.dir(msg);
                        console.log(this.params);
                        bot.deleteMessage(msg.from.id,msg.message.message_id)
                        return
                    }
                    this.query= " UPDATE raaz_orderdetail set status='reject',rejectReason='"+this.params[4]+"'  where status='adminpassed' and orderdetailid=" + this.params[3] + ";";
                   this.query+=" select chatadmin from channelscopy where TelegramId='"+this.params[2]+"' limit 1; ";
                    // this.query+=" insert into raaz_rejects (orderid,suborderid,channelTag,reason,rejecttime,type) values" +
                    //     " ("+this.params[1]+","+this.params[3]+",'"+this.params[2]+"','"+this.params[4]+"',"+new Date().getLocalTime()+",1);";
                    new exeqM.exec(this.query, function (err, orders) {
                        this.params = msg.data.split('-');
                        // console.log(orders);
                        // return;
                            
                        this.text=utilM.getRejectInfo(this.params)
                            +(orders[1]&&orders[1][0]&&orders[1][0].chatadmin?("\r\n"+" 📱 : "+ utilM.getChatAdminUrl(orders[1][0].chatadmin)):"");

                        this.btns = [];
                        this.btns.push([abot.inlineButton("ویژه - FIX - " + this.params[3],
                            {callback: "fixrej-" + this.params[3]+"-"+this.params[2]+"-"+msg.from.id+"-"+this.params[1]+"-"+this.params[4]})]);
                        this.btns.push([abot.inlineButton("ویژه - REJECT - " + this.params[3],
                            {callback: "rejrej-" + this.params[3]+"-"+this.params[2]+"-"+msg.from.id+"-"+this.params[1]+"-"+this.params[4]})]);
                        this.btns = abot.inlineKeyboard(this.btns)
                        for (ai = 0; ai < admins.length; ai++) {
                            abot.sendMessage(admins[ai].id,"❌"+varM.msg.rejected+"❌\r\n\n"+ this.text, {replyMarkup:this.btns,parseMode:'html',webPreview:false})
                        }
                        bot.sendMessage(msg.from.id, varM.msg.rejectSend)
                    });
                }
            }
            });
    },
    sendAction:function (msg) {
        if(msg.from&&msg.from.id)
        return bot.sendChatAction(msg.from.id,'typing').then(res=>{
            //console.log(res);
                
                
            })
    },
    forwardPromise(to,from,msgid){
        return new Promise(function (resolve, reject) {
            bot.forwardMessage(to, from, msgid).then(res => {
              //  console.log(res);
            resolve(res);
        }).catch(err => {
                resolve(null);
        })
        })
    }
};
