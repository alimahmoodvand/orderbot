/**
 * Created by ali on 8/7/17.
 */
module.exports= {
    start: function () {
        abot.start();
    },
    commands: function () {


        abot.on(['/start'], function (msg) {
            if (msg.from && admins.searchObject('id', msg.from.id)) {
                markup = varM.markups.getOprations
                abot.sendMessage(msg.from.id, "H i i i i ✋️✋️✋️✋️✋️", {replyMarkup: markup});
            }
        });
        abot.on(['/verifyorders'], function (msg) {
            if (msg.from && admins.searchObject('id', msg.from.id)) {
                new autilM.setAllOrders(msg);
            }
        });
        abot.on(['/sendmessage'], function (msg) {
            if (msg.from && admins.searchObject('id', msg.from.id)) {
                abot.sendMessage(msg.from.id, varM.msg.entermessage, {ask: 'sendmessage'});
            }
        });
        abot.on(['/setsticker'], function (msg) {
            if (msg.from && admins.searchObject('id', msg.from.id)) {
                abot.sendMessage(msg.from.id, varM.msg.sticker, {ask: 'setsticker'});
            }
        });
        abot.on(['/curorders'], function (msg) {
            if (msg.from && admins.searchObject('id', msg.from.id)) {
                new autilM.getAllOrders(msg);
            }
        });
        abot.on(['/resetcrons'], function (msg) {
            if (msg.from && admins.searchObject('id', msg.from.id)) {
                cronM.recovery(function () {
                });
            }
        });
        // abot.on(['/denycancel'],function (msg) {
        //   //console.log(msg)
        //   if(msg.from&&admins.searchObject('id', msg.from.id)) {
        //
        //     this.query = `update raaz_orderdetail set adminop=NULL where adminop='canceling' ;
        //      update raaz_ordercategorydetail set adminop=NULL  where adminop='canceling';
        //     `
        //     //this.query = " select 1 as oneber";
        //
        //     new exeqM.exec(this.query, function (err, data) {
        //       abot.sendMessage(msg.from.id, msg.text);
        //
        //     });
        //   }
        //  });
        // abot.on(['/resetbanervip'],function (msg) {
        //   if(msg.from&&admins.searchObject('id', msg.from.id)) {
        //
        //     this.query = `delete from bot_banners where type=1 and orderdetailid in (select orderdetailid from raaz_orderdetail
        //         where  status='banner' or status='reply'  or status='waitforverify'  or status='replytype' or status='postlimit' or  status='screenshot') ;
        //        update raaz_orderdetail set status=NULL
        //         where  status='banner' or status='reply'  or status='waitforverify'  or status='replytype' or status='postlimit' or  status='screenshot'; `
        //     //this.query = " select 1 as oneber";
        //     new exeqM.exec(this.query, function (err, data) {
        //       abot.sendMessage(msg.from.id, msg.text);
        //     });
        //   }
        //  });
        // abot.on(['/resetbanermass'],function (msg) {
        //   if(msg.from&&admins.searchObject('id', msg.from.id)) {
        //     this.query = `delete from bot_banners where type=2 and orderdetailid in (select orderCategoryDetailId from raaz_ordercategorydetail
        //         where  status='banner' or status='reply' or status='waitforverify' or status='replytype' or status='postlimit' or  status='screenshot') ;
        //         update raaz_ordercategorydetail set status=NULL
        //          where  status='banner' or status='reply'  or status='waitforverify'  or status='replytype' or status='postlimit' or  status='screenshot'; `
        //     //this.query = " select 1 as oneber";
        //     new exeqM.exec(this.query, function (err, data) {
        //       abot.sendMessage(msg.from.id, msg.text);
        //     });
        //   }
        //  });
    },
    cbq: function () {
        abot.on('callbackQuery', function (msg) {
            msgid = fs.readFileSync(chatpath + msg.from.id).toString('utf8');
            console.log(msg.message.message_id, msgid)
            if ((msgid && msgid == msg.message.message_id) || true) {
                console.log(msg.data.split('-'))
                if (msg.data.indexOf('po-') == 0) {
                    var params = msg.data.split('-');
                    this.query = " update raaz_orderdetail set status='banner' where status is null and orderdetailid=" + params[1] + ";";
                    this.query += " select * from raaz_orderdetail where orderdetailid=" + params[1] + " limit 1;";
                    //this.query = " select 1 as oneber";
                    //console.log(this.query)
                    new exeqM.exec(this.query, function (err, data) {
                        //console.log(data)
                        if (data && data.length == 2) {
                            if (data[0] && data[0].changedRows > 0) {
                                abot.sendMessage(msg.from.id,
                                    varM.msg.banner
                                        .replace(/~resetcmd/ig, " /resetbanervip_" + params[1])
                                    + "\r\n" + "تاریخ:" + utilM.dateEnToSh(data[1][0].performDate)
                                    + "\r\n" + "کانال:@" + data[1][0].channelTag.replace('@', '')
                                    + "\r\n" + "ویو :" + data[1][0].productView + " کا "
                                    + "\r\n" + utilM.getOrderNumber(data[1][0].orderId, data[1][0].orderDetailId)
                                    , {ask: 'banner'});
                            }
                            else {
                                this.btns = [];
                                this.btns.push([abot.inlineButton("ویژه - " + params[1],
                                    {callback: "resetvip-" + params[1]})]);
                                this.btns = abot.inlineKeyboard(this.btns)
                                abot.sendMessage(msg.from.id, varM.msg.beforeset, {replyMarkup: this.btns});
                            }
                        }
                    });
                }
                if (msg.data.indexOf('io-') == 0) {
                    var params = msg.data.split('-');
                    this.query = " update raaz_ordercategorydetail set status='banner' where status is null and orderCategoryDetailId=" + params[1] + ";";
                    this.query += " select * from raaz_ordercategorydetail where orderCategoryDetailId=" + params[1] + " limit 1;";
                    new exeqM.exec(this.query, function (err, data) {
                        if (data && data.length == 2) {
                            if (data[0] && data[0].changedRows > 0) {
                                abot.sendMessage(msg.from.id,
                                    varM.msg.banner.replace(/~resetcmd/ig, " /resetbanermass_" + params[1])
                                    + "\r\n" + "تاریخ:" + utilM.dateEnToSh(data[1][0].performDate)
                                    + "\r\n" + "ویو :" + data[1][0].orderCount + " کا "
                                    + "\r\n" + utilM.getOrderNumber(data[1][0].orderid, data[1][0].orderCategoryDetailId)
                                    , {ask: 'ibanner'});
                            }
                            else {
                                this.btns = [];
                                this.btns.push([abot.inlineButton("انبوه - " + params[1],
                                    {callback: "resetmass-" + params[1]})]);
                                this.btns = abot.inlineKeyboard(this.btns)
                                abot.sendMessage(msg.from.id, varM.msg.beforeset, {replyMarkup: this.btns});
                            }
                        }

                    });
                }
                if (msg.data.indexOf('resetvip-') == 0) {
                    var params = msg.data.split('-');
                    this.query = `delete from bot_banners where type=1 and orderdetailid=${params[1]} ;
              update raaz_orderdetail set status='banner' ,sitestatus=3
               where  orderdetailid=${params[1]} ;`;
                    new exeqM.exec(this.query, function (err, data) {
                        abot.sendMessage(msg.from.id, varM.msg.banner.replace(/~resetcmd/ig, " /resetbanervip_" + params[1]), {ask: 'banner'});
                    });
                }
                if (msg.data.indexOf('resetmass-') == 0) {
                    var params = msg.data.split('-');
                    this.query = `delete from bot_banners where type=2 and orderdetailid =${params[1]};
               update raaz_ordercategorydetail set status='banner',sitestatus=3
                where  orderCategoryDetailId=${params[1]};`
                    new exeqM.exec(this.query, function (err, data) {
                        abot.sendMessage(msg.from.id, varM.msg.banner.replace(/~resetcmd/ig, " /resetbanermass_" + params[1]), {ask: 'ibanner'});
                    });
                }
                if (msg.data.indexOf('idone-') == 0) {
                    // var params = msg.data.split('-');
                    // this.query = " SELECT * FROM `view_icontributors` where  orderCategoryDetailId=" + params[1] + " group by categoryId,TelegramId;";
                    // //console.log(this.query)
                    // new exeqM.exec(this.query, function (err, data) {
                    //     //  new autilM.setOrders(msg,data[0][0].orderid)
                    //     this.text = "تعداد :" + data.length + "\r\n";
                    //     // console.log(this.text)
                    //     for (this.ci = 0; data.length > this.ci; this.ci++) {
                    //         this.text += "@" + data[this.ci].TelegramId + "\r\n";
                    //         if (this.ci % 20 == 0 && this.ci != 0) {
                    //             abot.sendMessage(msg.from.id, this.text);
                    //             this.text = "";
                    //         }
                    //     }
                    //     if (this.text)
                    //         abot.sendMessage(msg.from.id, this.text);
                    //
                    // })
                    var params = msg.data.split('-');
                    this.query = " SELECT TelegramId,senderid,messageid,cstatus as status,postlimit,initview,bannerid,otherchannels FROM `view_icontributors` where  orderCategoryDetailId=" +
                        params[1] + "  order by TelegramId;";
                    // console.log(this.query);
                    // return;

                    new exeqM.exec(this.query, function (err, result) {
                        if (!err && result && result.length > 0) {
                            this.tmp = [];
                            this.post_data =
                                {
                                    msgs: JSON.stringify(result)
                                }
                            //console.log(new Date())
                            reqhM.igetOtherChannels(this.post_data, function (err, post) {
                                // console.log(post.length);
                                // return;
                                console.log(post.length)
                                if(!err&&post&&post.length>0){
                                this.text="";
                                post.sortOn('TelegramId');
                                this.passedtags=[];
                                this.passedothertags=[];
                                k=0;
                                for (pi = 0; pi < post.length; pi++) {
                                    if(this.passedtags.indexOf(post[pi].TelegramId)==-1) {
                                        k++;
                                        this.passedtags.push(post[pi].TelegramId);
                                        banners = post.searchObjects('TelegramId', post[pi].TelegramId);
                                        this.text+="@"+post[pi].TelegramId;

                                        for(bi=0;bi<banners.length;bi++) {
                                           //console.log(banners[bi].otherchannels);
                                                
                                            if(this.passedothertags.indexOf(banners[bi].otherchannels)==-1) {
                                                this.passedothertags.push(banners[bi].otherchannels);
                                                tmpbanners = banners.searchObjects('otherchannels', banners[bi].otherchannels);
                                                reply = tmpbanners.searchObject('status', 'reply');
                                                sticker = tmpbanners.searchObject('status', 'sticker');
                                                banner = banners.searchObjects('otherchannels', banners[bi].otherchannels).searchObject('status', 'banner');
                                                obj = null;
                                                // console.log(reply,sticker);
                                                // return;
                                                if (reply && reply.view > 0 && reply.view > sticker.view) {
                                                    obj = reply
                                                }
                                                else if (sticker && sticker.view > 0) {
                                                    obj = sticker
                                                }
                                                //console.log(banner, obj, this.text, (obj ? this.text.indexOf(obj.otherchannels) : null))
                                                //  if(!obj){
                                                //      console.log(obj);
                                                //    //  return;
                                                //
                                                //  }
                                                //console.log(banner,obj);
                                                if (banner && obj && obj.view > 0 /*&& this.text.indexOf(obj.otherchannels) == -1*/) {
                                                    this.text += " & @" + obj.otherchannels + "";
                                                }
                                            }
                                        }
                                        this.text+="\r\n";
                                        if(k%20==0&&k>0){
                                            abot.sendMessage(msg.from.id, this.text);
                                            this.text="";
                                        }
                                    }
                                }
                                if(this.text!=""){
                                    abot.sendMessage(msg.from.id, this.text);
                                }
                                }

                            })
                        }
                    });

                }
                if (msg.data.indexOf('cl-') == 0) {
                    var params = msg.data.split('-');
                    // this.query = " update raaz_orderdetail set adminop='canceling' where orderdetailid=" + params[1];
                    // new exeqM.exec(this.query, function (err, data) {
                    abot.sendMessage(msg.from.id, varM.msg.cancel + "\r\n#" + params[0] + params[1], {ask: 'canceling'});
                    // });
                }
                if (msg.data.indexOf('icl-') == 0) {
                    var params = msg.data.split('-');
                    //   this.query = " update raaz_ordercategorydetail set adminop='canceling' where orderCategoryDetailId=" + params[1];
                    //  new exeqM.exec(this.query, function (err, data) {
                    abot.sendMessage(msg.from.id, varM.msg.cancel + "\r\n#" + params[0] + params[1], {ask: 'icanceling'});
                    //   });
                }
                if (msg.data.indexOf('imsgdone-') == 0) {
                    var params = msg.data.split('-');
                    abot.sendMessage(msg.from.id, varM.msg.entermessage + "\r\n#" + params[0] + params[1], {ask: 'imsgdone'});
                }
                if (msg.data.indexOf('imsgall-') == 0) {
                    var params = msg.data.split('-');
                    abot.sendMessage(msg.from.id, varM.msg.entermessage + "\r\n#" + params[0] + params[1], {ask: 'imsgall'});
                }
                if (msg.data.indexOf('stkden-') == 0) {
                    var params = msg.data.split('-');
                    abot.answerCallbackQuery(msg.id, {text: varM.msg.done})
                    filename = rootPath + "stickers/" + params[1] + ".webm";
                    if (fs.existsSync(filename)) {
                        fs.unlinkSync(filename);
                    }
                    bot.sendMessage(params[1], varM.msg.stickerdeny);
                }
                if (msg.data.indexOf('stkver-') == 0) {
                    var params = msg.data.split('-');
                    abot.answerCallbackQuery(msg.id, {text: varM.msg.done})
                    bot.sendMessage(params[1], varM.msg.stickerverify);
                }
                if (msg.data.indexOf('imsgo-') == 0) {
                    var params = msg.data.split('-');
                    //   this.query = " update raaz_ordercategorydetail set adminop='canceling' where orderCategoryDetailId=" + params[1];
                    //  new exeqM.exec(this.query, function (err, data) {
                    abot.sendMessage(msg.from.id, varM.msg.entermessage + "\r\n#" + params[0] + params[1], {ask: 'imsgo'});
                    //   });
                }
                if (msg.data.indexOf('pmsgo-') == 0) {
                    var params = msg.data.split('-');
                    //   this.query = " update raaz_ordercategorydetail set adminop='canceling' where orderCategoryDetailId=" + params[1];
                    //  new exeqM.exec(this.query, function (err, data) {
                    abot.sendMessage(msg.from.id, varM.msg.entermessage + "\r\n#" + params[0] + params[1], {ask: 'pmsgo'});
                    //   });
                }
                if (msg.data.indexOf('curorders-') == 0) {
                    var params = msg.data.split('-');
                    new autilM.getOrders(msg, params[1]);
                }
                if (msg.data.indexOf('isubcurorders-') == 0) {
                    var params = msg.data.split('-');
                    new autilM.isubOrderOperators(msg, params[1], params[2]);
                }
                if (msg.data.indexOf('subcurorders-') == 0) {
                    var params = msg.data.split('-');
                    new autilM.subOrderOperators(msg, params[1], params[2]);
                }
                if (msg.data.indexOf('ifinish-') == 0) {
                    // var params = msg.data.split('-');
                    // abot.answerCallbackQuery(msg.id,{text:varM.msg.done})
                    // new cutilM.iupdateView(params[1],'ya',null);

                    var params = msg.data.split('-');
                    //msg.text=msg.text.replace(orderdetailid, '')
                    this.query = aqM.icancelQ("finish", params[1]);
                    new exeqM.exec(this.query, function (err, data) {
                        if (params[1] in schedule.scheduledJobs) {
                            schedule.scheduledJobs[params[1]].cancel();
                            delete schedule.scheduledJobs[params[1]];
                        }
                        abot.sendMessage(msg.from.id, varM.msg.done);
                    })
                }
                if (msg.data.indexOf('finish-') == 0) {
                    var params = msg.data.split('-');
                    //msg.text=msg.text.replace(orderdetailid, '')
                    this.query = aqM.cancelQ("finish", params[1]);
                    new exeqM.exec(this.query, function (err, data) {
                        if (params[1] in schedule.scheduledJobs) {
                            schedule.scheduledJobs[params[1]].cancel();
                            delete schedule.scheduledJobs[params[1]];
                        }
                        abot.sendMessage(msg.from.id, varM.msg.done);
                    })
                }
                if (msg.data.indexOf('removeorder-') == 0) {
                    var params = msg.data.split('-');
                    this.text = varM.msg['returnorder' + params[1]] + "\r\nتگ کانال : @" + params[3] + utilM.getOrderNumber(params[5], params[2]);
                    return bot.sendMessage(params[4], this.text);
                }
                if (msg.data.indexOf('fixrej-') == 0) {
                    var params = msg.data.split('-');
                    // console.log(params)
                    // return;
                    this.query = " UPDATE raaz_orderdetail set status='adminpassed',rejectReason=NULL,rejectReason=NULL where status='reject'  and  orderdetailid=" + params[1] + "; ";
                    // this.query += " delete from raaz_rejects where  channelTag='" + params[2] + "' and orderid=" + params[4] + " and suborderid=" + params[1] + " and type=1 limit 1;";
                    new exeqM.exec(this.query, function (err, data) {
                        new autilM.bulkMessage(params[1], varM.msg.orderactivate
                            .replace("~channelname", ": @" + params[2])
                            .replace("~ordernumber", utilM.getOrderNumber(params[4], params[1]))
                        );
                        abot.answerCallbackQuery(msg.id, {text: varM.msg.done})
                    });
                }
                if (msg.data.indexOf('rejrej-') == 0) {
                    var params = msg.data.split('-');
                    this.query = "UPDATE raaz_orderdetail set sitestatus=-3 where status='reject'  and  orderdetailid=" + params[1] + ";";
                    new exeqM.exec(this.query, function (err, data) {
                        abot.answerCallbackQuery(msg.id, {text: varM.msg.done})
                    });
                }
                if (msg.data.indexOf('member-') == 0) {
                    var params = msg.data.split('-');
                    this.query = "select fromid,startmembers,endmembers,access_hash  from raaz_orderdetail where orderdetailid=" + params[1] + " limit 1;";
                    new exeqM.exec(this.query, function (err, data) {
                        if (!err && data && data.length == 1) {
                            //abot.sendMessage(msg.from.id,  data[0].startmembers+" --> "+ data[0].endmembers)
                            reqhM.getMembers({channel: JSON.stringify(data[0])}, function (err, post) {
                                abot.sendMessage(msg.from.id, post.startmembers + " 👉👉👉👉 " + post.endmembers)
                            })
                        }
                    });
                }
                if (msg.data.indexOf('imember-') == 0) {
                    var params = msg.data.split('-');
                    this.query = "select fromid,startmembers,endmembers,access_hash from raaz_ordercategorydetail where orderCategoryDetailId=" + params[1] + " limit 1;";
                    new exeqM.exec(this.query, function (err, data) {
                        if (!err && data && data.length == 1) {
                            reqhM.getMembers({channel: JSON.stringify(data[0])}, function (err, post) {
                                abot.sendMessage(msg.from.id, post.startmembers + " 👉👉👉👉 " + post.endmembers)
                            })
                        }
                    })

                }
                if (msg.data.indexOf('crontime-') == 0) {
                    var params = msg.data.split('-');
                    this.query = "select cronReverse(crontime) as crontime from raaz_orderdetail where orderdetailid=" + params[1] + " limit 1;";
                    new exeqM.exec(this.query, function (err, data) {
                        if (!err && data && data.length == 1) {
                            abot.answerCallbackQuery(msg.id, {
                                text: utilM.cronToDate(data[0].crontime),
                                showAlert: true
                            })
                        }
                    });
                }
                if (msg.data.indexOf('icrontime-') == 0) {
                    var params = msg.data.split('-');
                    this.query = "select cronReverse(crontime) as crontime from raaz_ordercategorydetail where orderCategoryDetailId=" + params[1] + " limit 1;";
                    new exeqM.exec(this.query, function (err, data) {
                        if (!err && data && data.length == 1) {
                            abot.answerCallbackQuery(msg.id, {
                                text: utilM.cronToDate(data[0].crontime),
                                showAlert: true
                            })
                        }
                    });
                }
                if (msg.data.indexOf('ireli-') == 0) {
                    var params = msg.data.split('-');
                    this.query = "SELECT vrl.*,rod.rejectReason FROM view_rejectlist vrl join raaz_orderdetail rod " +
                        " on vrl.channelTag=rod.channelTag and vrl.ordercategorydetailid=rod.categoryId " +
                        "  where vrl.ordercategorydetailid=" + params[1] + " and  rod.screenshotId is null ;";
                    // console.log(this.query);
                    // return;

                    new exeqM.exec(this.query, function (err, data) {
                        if (!err && data && data.length>0) {
                            excel=[];
                            for (j = 0; j < data.length; j++) {
                                excel.push({
                                    tag: data[j].channelTag,
                                    reason: data[j].rejectReason,
                                    categoryid: data[j].ordercategorydetailid,
                                    orderid: data[j].orderid,
                                    ordernumber: utilM.getOrderJustNumber(data[j].orderid, data[j].ordercategorydetailid),
                                })
                            }
                            if(excel.length>0) {
                                var csv = json2csv({data: excel, fields: Object.keys(excel[0])});
                                filename = rootPath + "reposts/reject report " + excel[0].ordernumber + ".csv".replace('#', '');
                                // console.log(filename);
                                fs.writeFileSync(filename, csv);
                                    abot.sendDocument(msg.from.id, filename);
                            }
                            // abot.answerCallbackQuery(msg.id, {
                            //     text: utilM.cronToDate(data[0].crontime),
                            //     showAlert: true
                            // })
                        }
                    });
                }
                if (msg.data.indexOf('fixirej-') == 0) {
                    var params = msg.data.split('-');
                    this.query = "select performDate,ordercount from raaz_ordercategorydetail where ordercategorydetailid=" + params[1] + " limit 1;" +
                        " update raaz_ordercategorydetail set " +
                        " rejectlist=REPLACE(rejectlist,'," + params[2] + ",',',')," +
                        " rejectlist=TRIM(LEADING '" + params[2] + ",' FROM rejectlist)," +
                        " rejectlist=TRIM(LEADING '" + params[2] + "' FROM rejectlist)," +
                        " rejectlist=TRIM(TRAILING '," + params[2] + "' FROM rejectlist)" +
                        " where ordercategorydetailid=" + params[1] + ";";
                    this.query+=" update raaz_orderdetail set status='adminpassed',rejectReason=NULL where categoryId=" + params[1] + " and channelTag='"+this.params[2]+"' ; ";
                    // console.dir(msg);
                    // this.query += " delete from raaz_rejects where  channelTag='" + params[2] + "' and orderid=" + params[4] + " and suborderid=" + params[1] + " and type=1 limit 1;";
                    // this.query += " delete from raaz_rejects where  channelTag='" + params[2] + "' and orderid=" + params[4] + " and suborderid=" + params[1] + " and type=1 limit 1;";

                    new exeqM.exec(this.query, function (err, data) {
                        if (data[0][0]) {
                            this.btns = [];
                            this.btns.push([bot.inlineButton(data[0][0].ordercount + "-" + params[2],
                                {callback: "io-" + params[1] + "-" + params[2] + "-" + new Date(data[0][0].performDate).getTime()})]);
                            this.btns = bot.inlineKeyboard(this.btns)
                            bot.sendMessage(params[3], varM.msg.orderactivate
                                    .replace("~channelname", ": @" + params[2])
                                    .replace("~ordernumber", utilM.getOrderNumber(params[4], params[1])),
                                {replyMarkup: this.btns})
                            // console.dir(msg.id);
                            abot.answerCallbackQuery(msg.id, {text: varM.msg.done})
                        }
                    });
                }
                if (msg.data.indexOf('order-') == 0) {
                    var params = msg.data.split('-');
                    new autilM.setOrders(msg, params[1]);
                }
                if (msg.data.indexOf('limit-') == 0) {
                    var params = msg.data.split('-');

                    this.query = "SELECT * FROM `view_banners` where orderdetailid=" + params[1] + "  order by `bannerid` desc;";
                    new exeqM.exec(this.query, function (err, result) {
                        if (!err && result && result.length > 0) {
                            // console.log(result)
                            //this.tmp = [];
                            // for (ui = 0; ui < result.length; ui++) {
                            //     // if(result[ui].cstatus!='banner')
                            //     {
                            //         this.tmp.push({
                            //             username: result[ui].channelTag,//result[ui].senderid==originalchannel.id?originalchannel.tag.replace('@',''):result[ui].postlink,
                            //             tag: result[ui].channelTag,
                            //             chatid: result[ui].cchatid,
                            //             messageid: result[ui].messageid,
                            //             messageid: result[ui].messageid,
                            //             status: result[ui].status,
                            //             bannerid: result[ui].bannerid,
                            //             orderid: result[ui].orderid,
                            //             initview: result[ui].initview,
                            //             postlimit: result[ui].postlimit,
                            //             orderdetailid: result[ui].orderdetailid,
                            //             senderid: result[ui].senderid
                            //         })
                            //     }
                            // }
                            this.post_data =
                                {
                                    msgs: JSON.stringify(result)
                                }

                            reqhM.getBulkTargetsUpdates(this.post_data, function (err, post) {
                                console.log(post.length);
                                if (!err && post) {
                                    this.text = "";
                                    this.repsindex = -1;
                                    this.bannerindex = -1;
                                    post.sortOn('status');
                                    for (pi = 0; pi < post.length; pi++) {
                                        if (post[pi].view != -1/*&&!this.msgs.searchObject('tag',post[pi].tag)*/) {

                                            if (post[pi].status != "banner") {
                                                this.repsindex = post[pi].index;
                                            }
                                            else {
                                                this.bannerindex = post[pi].index;
                                            }

                                            this.text += " tag : @" + post[pi].channelTag.replace('@', '');
                                            this.text += "   type : " + post[pi].status;
                                            this.text += "   first view : " + post[pi].initview;
                                            this.text += "   view : " + post[pi].view;
                                            this.text += "   limit : " + post[pi].postlimit;
                                            this.text += "   now : " + post[pi].index + (post[pi].postlimit < post[pi].index ? " ⚠️ " : "");
                                            this.text += "   repeat : " + post[pi].reshot + "\r\n";
                                            if (this.repsindex != -1 && this.bannerindex != -1) {
                                                if (this.bannerindex - this.repsindex < -1 || this.bannerindex - this.repsindex > 1)
                                                    this.text += "⛔️️️    /alertspace_" + post[0].orderdetailid + "\r\n";
                                            }
                                        }
                                    }
                                    if (this.text) {
                                        this.text += (this.text.indexOf("⚠️") == -1 ? "" : " ⚠ ️") + "\r\n/alertlimit_" + post[0].orderdetailid;
                                        abot.sendMessage(msg.from.id, this.text);
                                    }
                                    else {
                                        abot.answerCallbackQuery(msg.id, {text: "not found"})
                                    }
                                }
                                else {
                                    console.log(err, post)
                                }
                            })
                        }
                    });

                }
                if (msg.data.indexOf('ilimit-') == 0) {
                    var params = msg.data.split('-');
                    this.query = " SELECT TelegramId,senderid,messageid,cstatus as status,postlimit,initview,bannerid,chatadmin,starttime FROM `view_icontributors` where  orderCategoryDetailId=" +
                        params[1] + " order by TelegramId limit " + params[2] + "," + params[3] + ";";
                    // console.log(this.query);
                    // return;
                        
                    new exeqM.exec(this.query, function (err, result) {
                        if (!err && result && result.length > 0) {
                            this.tmp = [];
                            this.post_data =
                                {
                                    msgs: JSON.stringify(result)
                                }
                            console.log(new Date())
                            reqhM.igetBulkTargetsUpdates(this.post_data, function (err, post) {
                                // console.log(post);
                                // return;
                                console.log(new Date())
                                this.msgs = [];
                                this.text = "";
                                this.shotlView = 0;
                                this.totalView = 0;
                                this.tags = "";
                                this.beforetag = "";
                                this.channelChanged = 0;
                                this.repsindex = -1;
                                this.bannerindex = -1;
                                this.replyIs = false;
                                this.stickerIs = false;
                                this.replyView = -1;
                                this.stickerView = -1;
                                post.sortOn('TelegramId');
                                this.tmptext=""
                                this.cheaters=[];
                                for (pi = 0; pi < post.length; pi++) {
                                    // console.log(post[pi].view,post[pi].status )
                                    if (post[pi].view != -1&&this.cheaters.indexOf(post[pi].TelegramId)==-1/*&&!this.msgs.searchObject('tag',post[pi].tag)*/) {
                                        if (post[pi].status == "banner" ||
                                            (post[pi].status == "reply" && (!this.stickerIs || post[pi].view >= this.stickerView)) ||
                                            (post[pi].status == "sticker" && (!this.replyIs || post[pi].view > this.replyView))) {

                                            if (this.beforetag != post[pi].TelegramId) {
                                                // this.channelChanged++;
                                                // this.beforetag=post[pi].tag;
                                                this.repsindex = -1;
                                                this.bannerindex = -1;
                                                this.replyIs = false;
                                                this.stickerIs = false;
                                                if (this.text && post[pi].status == "banner")
                                                    this.text += "------------------------------\r\n";
                                                // this.text+="/ialertindex_"+post[pi].bannerid+"\r\n";
                                            }
                                            if (this.beforetag != post[pi].TelegramId) {
                                                // console.log("this.beforetag");


                                                this.channelChanged++;

                                                this.beforetag = post[pi].TelegramId;
                                            }
                                            //console.log(this.channelChanged,this.beforetag,post[pi].TelegramId,post[pi].status)
                                            if (this.channelChanged % 10 == 0 && pi != 0) {
                                                this.channelChanged++;
                                                abot.sendMessage(msg.from.id,this.text,{webPreview:false,parseMode:'html'});
                                                this.text="";
                                                // this.text = this.text.replace(this.tmptext,'');
                                            }

                                            if (post[pi].status != "banner") {
                                                this.repsindex = post[pi].index;
                                            }
                                            else {
                                                this.bannerindex = post[pi].index;
                                            }

                                            if (post[pi].status == "sticker") {
                                                this.stickerIs = true;
                                                this.stickerView = post[pi].view;
                                            }
                                            else if (post[pi].status == "reply") {
                                                this.replyView = post[pi].view;
                                                this.replyIs = true;
                                            }

                                            // this.text += " tag : @" + post[pi].tag.replace('@', '');
                                            this.text += post[pi].status == "banner"?(" 📱 : "+ utilM.getChatAdminUrl(post[pi].chatadmin)+"\r\n"):"";
                                            this.text += post[pi].status == "banner"?(" 🔗 : "+ utilM.getPostLink(post[pi].TelegramId.replace('@', ''),post[pi].postid)+"\r\n"):"";
                                            this.text += post[pi].status+" :  @" + post[pi].TelegramId.replace('@', '');
                                            this.text += " ( "+post[pi].reshot+" ) " ;
                                            this.text += post[pi].status != "banner"?(" 👀 : "+ post[pi].view):"";
                                            this.text += " ( "+post[pi].index+"/"+post[pi].postlimit+" ) " + "\r\n"  ;
                                            if (this.repsindex != -1 && this.bannerindex != -1) {
                                                if (this.bannerindex - this.repsindex < -1 || this.bannerindex - this.repsindex > 1)
                                                    if (post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'reply')){
                                                        this.text +="\r\n"+ "زمان درج تبلیغ : " +
                                                            utilM.dateEnToSh(new Date(parseInt(post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'reply').starttime)))
                                                            + "\r\n";
                                                        this.text += "⛔️️️/ialertspace_" + post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'reply').bannerid + "\r\n";
                                                    }
                                                    else{
                                                        this.text +="\r\n"+ "زمان درج تبلیغ : " +
                                                            utilM.dateEnToSh(new Date(parseInt(post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'sticker').starttime)))
                                                            + "\r\n";
                                                        this.text += "⛔️️️/ialertspace_" + post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'sticker').bannerid + "\r\n";
                                                    }
                                            }
                                            if (post[pi].status != "banner") {
                                                this.text += (post[pi].postlimit < post[pi].index ? " ⚠️ " : "") +
                                                    "/ialertlimit_" + post[pi].bannerid + "\r\n\n";
                                                this.shotlView += post[pi].view;
                                                this.repsview = post[pi].view;
                                            }
                                            else {
                                                this.totalView = (post[pi].view - post[pi].initview);
                                                this.bannerview = post[pi].view;

                                            }


                                            // this.text +="\r\n"

                                        }
                                    }
                                    else if (post[pi].view == -1 && post[pi].status == "banner") {
                                        objs=post.searchObjects('TelegramId',post[pi].TelegramId.replace('@', ''))
                                        ischeat=false;
                                        for(oi=0;oi<objs.length;oi++){
                                            if(objs[oi].view > 0){
                                                ischeat=true;
                                            }
                                        }
                                        if(ischeat) {
                                           // this.cheaters.push(post[pi].TelegramId);
                                            if (this.text)
                                                this.text += "------------------------------\r\n";
                                            this.text += post[pi].status == "banner"?(" 📱 : "+ utilM.getChatAdminUrl(post[pi].chatadmin)+"\r\n"):"";
                                            this.text += "\r\n❌☠️😱😱😱😱☠️❌\r\n";
                                            this.text += post[pi].status + " :  @" + post[pi].TelegramId.replace('@', '');
                                            //console.log(post.searchObjects('tag',post[pi].tag))
                                            // console.log("55555555555555555555555",
                                            //     post.searchObjects('tag',post[pi].tag).searchObject('status','reply')
                                            // ,"55555555555555555555555")
                                            if (post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'reply'))
                                                this.text += "😱️😱\r\n/ialertbanner_" + post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'reply').bannerid + "\r\n";
                                            else if (post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'sticker'))
                                                this.text += "😱\r\n/ialertbanner_" + post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'sticker').bannerid + "\r\n";
                                           // this.text += "------------------------------\r\n";
                                        }
                                    }
                                    this.tmptext=this.text;
                                }
                                this.text += "\r\n\r\n" + " Done List Count :" + this.channelChanged +
                                    "   Total View : " + this.totalView +
                                    "   Shot View : " + this.shotlView
                                abot.sendMessage(msg.from.id, this.text,{webPreview:false,parseMode:'html'});
                            })
                        }
                    });

                }
                if (msg.data.indexOf('chnl-') == 0) {
                    var params = msg.data.split('-');
                    this.query = "SELECT * FROM `view_banners` where orderdetailid=" + params[1] + " and otherchannels is not null and otherchannels <> ''  order by `bannerid` desc;";
                    new exeqM.exec(this.query, function (err, result) {
                        if (!err && result && result.length > 0) {
                            this.post_data =
                                {
                                    msgs: JSON.stringify(result)
                                }
                            reqhM.getOtherChannels(this.post_data, function (err, post) {
                                console.log(post.length);
                                if (!err && post) {
                                    this.text = "";
                                    this.repsindex = -1;
                                    this.bannerindex = -1;
                                    post.sortOn('status');
                                    for (pi = 0; pi < post.length; pi++) {
                                        if (post[pi].view != -1/*&&!this.msgs.searchObject('tag',post[pi].tag)*/) {

                                            if (post[pi].status != "banner") {
                                                this.repsindex = post[pi].index;
                                            }
                                            else {
                                                this.bannerindex = post[pi].index;
                                            }

                                            this.text += " tag : @" + post[pi].channelTag.replace('@', '');
                                            this.text += " & @" + post[pi].otherchannels.replace('@', '');
                                            this.text += "   type : " + post[pi].status;
                                            this.text += "   first view : " + post[pi].initview;
                                            this.text += "   view : " + post[pi].view;
                                            this.text += "   limit : " + post[pi].postlimit;
                                            this.text += "   now : " + post[pi].index + (post[pi].postlimit < post[pi].index ? " ⚠️ " : "");
                                            this.text += "   repeat : " + post[pi].reshot + "\r\n";
                                            if (this.repsindex != -1 && this.bannerindex != -1) {
                                                if (this.bannerindex - this.repsindex < -1 || this.bannerindex - this.repsindex > 1)
                                                    this.text += "⛔️️️    /alertspace_" + post[0].orderdetailid + "\r\n";
                                            }
                                        }
                                    }
                                    if (this.text) {
                                        abot.sendMessage(msg.from.id, this.text);
                                    }
                                    else {
                                        abot.answerCallbackQuery(msg.id, {text: " not found "})
                                    }
                                }
                                else {
                                    console.log(err, post)
                                }
                            })
                        }
                    });

                }
                if (msg.data.indexOf('ichnl-') == 0) {
                    var params = msg.data.split('-');
                    this.query = " SELECT TelegramId,senderid,messageid,cstatus as status,postlimit,initview,bannerid,otherchannels FROM `view_icontributors` where  orderCategoryDetailId=" +
                        params[1] + " and otherchannels is not null and otherchannels <> '' order by TelegramId;";
                    // console.log(this.query);
                    // return;

                    new exeqM.exec(this.query, function (err, result) {
                        if (!err && result && result.length > 0) {
                            this.tmp = [];
                            this.post_data =
                                {
                                    msgs: JSON.stringify(result)
                                }
                            //console.log(new Date())
                            reqhM.igetOtherChannels(this.post_data, function (err, post) {
                                // console.log(post.length);
                                // return;
                                console.log(new Date())
                                this.msgs = [];
                                this.text = "";
                                this.shotlView = 0;
                                this.totalView = 0;
                                this.tags = "";
                                this.beforetag = "";
                                this.channelChanged = 0;
                                this.repsindex = -1;
                                this.bannerindex = -1;
                                this.replyIs = false;
                                this.stickerIs = false;
                                this.replyView = -1;
                                this.stickerView = -1;
                                post.sortOn('TelegramId');
                                for (pi = 0; pi < post.length; pi++) {
                                    // console.log(post[pi].view,post[pi].status )
                                    if (post[pi].view != -1/*&&!this.msgs.searchObject('tag',post[pi].tag)*/) {
                                        if (post[pi].status == "banner" ||
                                            (post[pi].status == "reply" && (!this.stickerIs || post[pi].view >= this.stickerView)) ||
                                            (post[pi].status == "sticker" && (!this.replyIs || post[pi].view > this.replyView))) {
                                            if (this.beforetag != post[pi].otherchannels) {
                                                // this.channelChanged++;
                                                // this.beforetag=post[pi].tag;
                                                this.repsindex = -1;
                                                this.bannerindex = -1;
                                                this.replyIs = false;
                                                this.stickerIs = false;
                                                if (this.text && post[pi].status == "banner")
                                                    this.text += "------------------------------\r\n";
                                                // this.text+="/ialertindex_"+post[pi].bannerid+"\r\n";
                                            }
                                            if (this.beforetag != post[pi].TelegramId) {
                                                console.log("this.beforetag");

                                                this.channelChanged++;

                                                this.beforetag = post[pi].TelegramId;
                                            }
                                            //console.log(this.channelChanged,this.beforetag,post[pi].TelegramId,post[pi].status)
                                            if (this.channelChanged % 4 == 0 && pi != 0) {
                                                this.channelChanged++;
                                                abot.sendMessage(msg.from.id,this.text);
                                                this.text="";
                                                // this.text = this.text.replace(this.tmptext,'');
                                            }
                                            if (post[pi].status != "banner") {
                                                this.repsindex = post[pi].index;
                                            }
                                            else {
                                                this.bannerindex = post[pi].index;
                                            }

                                            if (post[pi].status == "sticker") {
                                                this.stickerIs = true;
                                                this.stickerView = post[pi].view;
                                            }
                                            else if (post[pi].status == "reply") {
                                                this.replyView = post[pi].view;
                                                this.replyIs = true;
                                            }

                                            // this.text += " tag : @" + post[pi].tag.replace('@', '');
                                            this.text += post[pi].status+" :  @" + post[pi].TelegramId.replace('@', '')+ " & @"+
                                                post[pi].otherchannels.replace('@', '');
                                            this.text += " ( "+post[pi].reshot+" ) " ;
                                            this.text += post[pi].status != "banner"?(" 👀 : "+ post[pi].view):"";
                                            this.text += " ( "+post[pi].index+"/"+post[pi].postlimit+" ) " + "\r\n"  ;
                                            if (this.repsindex != -1 && this.bannerindex != -1) {
                                                if (this.bannerindex - this.repsindex < -1 || this.bannerindex - this.repsindex > 1)
                                                    if (post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'reply'))
                                                        this.text += "⛔️️️/ialertspace_" + post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'reply').bannerid+"_"+post[pi].otherchannels.replace('@', '') + "\r\n";
                                                    else
                                                        this.text += "⛔️️️/ialertspace_" + post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'sticker').bannerid+"_"+post[pi].otherchannels.replace('@', '') + "\r\n";
                                            }
                                            if (post[pi].status != "banner") {
                                                this.text += (post[pi].postlimit < post[pi].index ? " ⚠️ " : "") +
                                                    "/ialertlimit_" + post[pi].bannerid +"_"+post[pi].otherchannels.replace('@', '')+ "\r\n\n";
                                                this.shotlView += post[pi].view;
                                                this.repsview = post[pi].view;
                                            }
                                            else {
                                                this.totalView = (post[pi].view - post[pi].initview);
                                                this.bannerview = post[pi].view;

                                            }

                                            // this.text +="\r\n"

                                        }
                                    }
                                    // else if (post[pi].view == -1 && post[pi].status == "banner") {
                                    //     if (this.text)
                                    //         this.text += "------------------------------\r\n";
                                    //     this.text += "\r\n❌☠️😱😱😱😱☠️❌\r\n";
                                    //     this.text += " TelegramId : @" + post[pi].TelegramId.replace('@', '') +" \r\n";
                                    //     //console.log(post.searchObjects('tag',post[pi].tag))
                                    //     // console.log("55555555555555555555555",
                                    //     //     post.searchObjects('tag',post[pi].tag).searchObject('status','reply')
                                    //     // ,"55555555555555555555555")
                                    //     if (post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'reply'))
                                    //         this.text += "😱️😱/ialertbanner_" + post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'reply').bannerid+"_"+post[pi].otherchannels.replace('@', '') + "\r\n\n";
                                    //     else if (post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'sticker'))
                                    //         this.text += "😱/ialertbanner_" + post.searchObjects('TelegramId', post[pi].TelegramId).searchObject('status', 'sticker').bannerid+"_"+post[pi].otherchannels.replace('@', '') + "\r\n\n";
                                    // }
                                }
                                this.text += "\r\n\r\n" + " Done List Count :" + this.channelChanged +
                                    "   Total View : " + this.totalView +
                                    "   Shot View : " + this.shotlView
                                abot.sendMessage(msg.from.id, this.text);
                            })
                        }
                    });

                }
            }
        });
    },
    text: function () {
        abot.on('*', function (msg) {
            //console.log(msg)
            // autilM.fetchInfo(msg, function (obj) {
            //     console.log(msg)
            // })
            // autilM.getPhotoUrl(msg,null)
            if (msg.text && msg.from && admins.searchObject('id', msg.from.id)) {
                if (msg.text == "تبلیغات جدید") {
                    new autilM.setAllOrders(msg);
                }
                else if (msg.text == "ارسال پیام") {
                    abot.sendMessage(msg.from.id, varM.msg.entermessage, {ask: 'sendmessage'});
                }
                else if (msg.text == "تغییر استیکر") {

                    abot.sendMessage(msg.from.id, varM.msg.sticker, {ask: 'setsticker'});
                }
                else if (msg.text == "تبلیغات جاری") {
                    new autilM.getAllOrders(msg);
                }
                else if (msg.text.indexOf('#') == 0 && msg.text[msg.text.length - 1] == "#") {
                    msg.text = msg.text.replace(/#/ig, '').trim();
                    if (!isNaN(msg.text))
                        new autilM.getOrders(msg, msg.text);
                }
                else if (msg.text && msg.text.indexOf('#') == 0) {
                    msg.text = msg.text.replace('#', '').trim();
                    if (!isNaN(msg.text))
                        new autilM.setOrders(msg, msg.text)
                }
                else if (msg.text && msg.text.indexOf('$') == 0) {
                    msg.text = msg.text.replace('$', '').trim();
                    if (!isNaN(msg.text))
                        new autilM.getCurrentOrders(msg, msg.text);
                }
                else if (msg.text == "/endbannerset") {
                    this.query = aqM.endbannerset();
                    console.log(this.query)
                    new exeqM.exec(this.query, function (err, data) {
                        //   new autilM.setOrders(msg,data[0][0].orderid)
                        abot.sendMessage(msg.from.id, varM.msg.limit,
                            {ask: 'postlimit'});
                    })
                }
                else if (msg.text == "/endibannerset") {
                    this.query = aqM.endibannerset();
                    new exeqM.exec(this.query, function (err, data) {
                        //  new autilM.setOrders(msg,data[0][0].orderid)
                        abot.sendMessage(msg.from.id, varM.msg.limit,
                            {ask: 'ipostlimit'});

                    })
                }
                else if (msg.text.indexOf('/resetbanermass') == 0 && msg.text != "/resetbanermass") {
                    msg.text = msg.text.replace(/\/resetbanermass_/ig, '').trim();
                    if (!isNaN(msg.text)) {
                        this.query = `delete from bot_banners where type=2 and orderdetailid =${msg.text};
               update raaz_ordercategorydetail set status=NULL,sitestatus=3
                where  orderCategoryDetailId=${msg.text};`
                        //this.query = " select 1 as oneber";
                        console.log(this.query)
                        new exeqM.exec(this.query, function (err, data) {
                            abot.sendMessage(msg.from.id, msg.text);
                        });
                    }
                }
                else if (msg.text.indexOf('/verifybanermass_') == 0) {
                    msg.text = msg.text.replace(/\/verifybanermass_/ig, '').trim();
                    if (!isNaN(msg.text)) {
                        this.query = `
                    select performDate,orderid,orderCategoryDetailid from raaz_ordercategorydetail where  orderCategoryDetailId=${msg.text} and status='waitforverify' limit 1;
               update raaz_ordercategorydetail set status='adminpassed',sitestatus=4
                where  orderCategoryDetailId=${msg.text} and status='waitforverify';`
                        //this.query = " select 1 as oneber";
                        console.log(this.query)
                        new exeqM.exec(this.query, function (err, data) {
                            if (data[0][0]) {
                                if (new Date(data[0][0].performDate) > new Date().getLocal())
                                    new autilM.ibulkMessage(msg.text, msg);
                                // console.log(new Date(data[0][0].performDate),data[0][0].performDate)
                                new cutilM.iremindBanner(msg.text, '-', new Date(data[0][0].performDate));

                                new autilM.setOrders(msg, data[0][0].orderid, varM.msg.bannerset + " /resetbanermass_" + data[0][0].orderCategoryDetailid + "\r\n");
                            }
                        });
                    }
                }
                else if (msg.text.indexOf('/resetbanervip_') == 0 && msg.text != "/resetbanervip") {
                    msg.text = msg.text.replace(/\/resetbanervip_/ig, '').trim();
                    if (!isNaN(msg.text)) {
                        this.query = `delete from bot_banners where type=1 and orderdetailid=${msg.text} ;
              update raaz_orderdetail set status=NULL,sitestatus=3
               where  orderdetailid=${msg.text} ;`;
                        //this.query = " select 1 as oneber";
                        console.log(this.query)
                        new exeqM.exec(this.query, function (err, data) {
                            abot.sendMessage(msg.from.id, msg.text);
                        });
                    }
                }
                else if (msg.text.indexOf('/ialertlimit_') == 0) {
                    msg.text = msg.text.replace(/\/ialertlimit_/ig, '').trim();
                    if (!isNaN(msg.text)) {
                        this.query = ` SELECT * FROM view_ibanners where bannerid=${msg.text} and (status='reply' or status='sticker' ) limit 1;`;
                        //this.query = " select 1 as oneber";
                        //console.log(this.query)
                        new exeqM.exec(this.query, function (err, data) {
                            if (!err && data && data.length == 1) {
                                bot.sendMessage(data[0].chatid,
                                    varM.msg.alertindex
                                    + "\r\n@" + data[0].telegramid
                                    + utilM.getOrderNumber(data[0].orderid, data[0].orderdetailid)
                                    + data[0].title
                                )
                            }
                            abot.sendMessage(msg.from.id, varM.msg.done);
                        });
                    }
                    else {
                       params= msg.text.split('_')
                        if (params.length>0&&!isNaN(params[0])) {
                            msg.otherchannels=params.splice(1).join("_");
                            this.query = ` SELECT * FROM view_ibanners where bannerid=${params[0]} and (status='reply' or status='sticker' ) limit 1;`;
                            //this.query = " select 1 as oneber";
                            //console.log(this.query)
                            new exeqM.exec(this.query, function (err, data) {
                                if (!err && data && data.length == 1) {
                                    bot.sendMessage(data[0].chatid,
                                        varM.msg.alertindex
                                        + "\r\nکانال مشترک : @" + msg.otherchannels
                                        + utilM.getOrderNumber(data[0].orderid, data[0].orderdetailid)
                                        + data[0].title
                                    )
                                }
                                abot.sendMessage(msg.from.id, varM.msg.done);
                            });
                        }
                    }
                }
                else if (msg.text.indexOf('/ialertspace_') == 0) {
                    msg.text = msg.text.replace(/\/ialertspace_/ig, '').trim();
                    if (!isNaN(msg.text)) {
                        this.query = ` SELECT * FROM view_ibanners where bannerid=${msg.text} and (status='reply' or status='sticker' ) limit 1;`;
                        //this.query = " select 1 as oneber";
                        console.log(this.query)
                        new exeqM.exec(this.query, function (err, data) {
                            if (!err && data && data.length == 1) {
                                bot.sendMessage(data[0].chatid,
                                    varM.msg.alertspace
                                    + "\r\n@" + data[0].telegramid
                                    + utilM.getOrderNumber(data[0].orderid, data[0].orderdetailid)
                                    + data[0].title
                                )
                            }
                            abot.sendMessage(msg.from.id, varM.msg.done);
                        });
                    }
                    else {
                        params= msg.text.split('_')
                        if (params.length>0&&!isNaN(params[0])) {
                            msg.otherchannels=params.splice(1).join("_");
                            this.query = ` SELECT * FROM view_ibanners where bannerid=${params[0]} and (status='reply' or status='sticker' ) limit 1;`;
                            //this.query = " select 1 as oneber";
                            //console.log(this.query)
                            new exeqM.exec(this.query, function (err, data) {
                                if (!err && data && data.length == 1) {
                                    bot.sendMessage(data[0].chatid,
                                        varM.msg.alertspace
                                        + "\r\nکانال مشترک : @" + msg.otherchannels
                                        + utilM.getOrderNumber(data[0].orderid, data[0].orderdetailid)
                                        + data[0].title
                                    )
                                }
                                abot.sendMessage(msg.from.id, varM.msg.done);
                            });
                        }
                    }
                }
                else if (msg.text.indexOf('/ialertbanner_') == 0) {
                    msg.text = msg.text.replace(/\/ialertbanner_/ig, '').trim();
                    if (!isNaN(msg.text)) {
                        this.query = ` SELECT * FROM view_ibanners where bannerid=${msg.text} and (status='reply' or status='sticker' ) limit 1;`;
                        //this.query = " select 1 as oneber";
                        console.log(this.query)
                        new exeqM.exec(this.query, function (err, data) {
                            if (!err && data && data.length == 1) {
                                bot.sendMessage(data[0].chatid,
                                    varM.msg.returnorder1
                                    + "\r\n@" + data[0].telegramid
                                    + utilM.getOrderNumber(data[0].orderid, data[0].orderdetailid)
                                    + data[0].title
                                )
                            }
                            abot.sendMessage(msg.from.id, msg.text);
                        });
                    }
                }
                else if (msg.text.indexOf('/alertlimit_') == 0) {
                    msg.text = msg.text.replace(/\/alertlimit_/ig, '').trim();
                    if (!isNaN(msg.text)) {
                        this.query = ` SELECT * FROM view_banners where orderdetailid=${msg.text} and chatid is not null and  (status='reply' or status='sticker' or status='banner' ) ORDER by status desc limit 1;`;
                        //this.query = " select 1 as oneber";
                        console.log(this.query)
                        new exeqM.exec(this.query, function (err, data) {
                            if (!err && data && data.length == 1) {
                                bot.sendMessage(data[0].chatid,
                                    varM.msg.alertindex
                                    + "\r\n@" + data[0].channelTag
                                    + utilM.getOrderNumber(data[0].orderid, data[0].orderdetailid)
                                )
                            }
                            abot.sendMessage(msg.from.id, msg.text);
                        });
                    }
                }
                else if (msg.text.indexOf('/alertspace_') == 0) {
                    msg.text = msg.text.replace(/\/alertspace_/ig, '').trim();
                    if (!isNaN(msg.text)) {
                        this.query = ` SELECT * FROM view_banners where orderdetailid=${msg.text} and chatid is not null and  (status='reply' or status='sticker' or status='banner' ) ORDER by status desc limit 1;`;
                        //this.query = " select 1 as oneber";
                        console.log(this.query)
                        new exeqM.exec(this.query, function (err, data) {
                            if (!err && data && data.length == 1) {
                                bot.sendMessage(data[0].chatid,
                                    varM.msg.alertspace
                                    + "\r\n@" + data[0].channelTag
                                    + utilM.getOrderNumber(data[0].orderid, data[0].orderdetailid)
                                )
                            }
                            abot.sendMessage(msg.from.id, msg.text);
                        });
                    }
                }
                else if (msg.text.indexOf('/verifybanervip_') == 0) {
                    msg.text = msg.text.replace(/\/verifybanervip_/ig, '').trim();
                    if (!isNaN(msg.text)) {
                        this.query = `
                    select performDate,orderid,orderdetailid from raaz_orderdetail where  orderdetailid=${msg.text} and status='waitforverify'  limit 1;
                    update raaz_orderdetail set status='adminpassed',sitestatus=4 
               where  orderdetailid=${msg.text} and status='waitforverify';`;
                        //this.query = " select 1 as oneber";
                        // console.log(this.query)
                        new exeqM.exec(this.query, function (err, data) {
                            if (data[0][0]) {
                                new autilM.bulkMessage(msg.text);

                                new cutilM.remindOrder(data[0][0].orderdetailid, 'adminpassed', new Date(data[0][0].performDate), true);

                                // new cutilM.remindBanner(data[0][0].orderid);
                                new autilM.setOrders(msg, data[0][0].orderid, varM.msg.bannerset + " /resetbanervip_" + msg.text + "\r\n");
                            }
                        });
                    }
                }
            }
            else if (msg.chat && msg.chat.username == "raazforward") {
                // console.log(msg)
                if (!msg.text || (msg.text && msg.text.indexOf('https://t.me/raazforward/') != 0)) {
                    if (msg.forward_from_chat && msg.forward_from_chat.username) {
                        bot.sendMessage(msg.chat.id, "https://t.me/raazforward/" + msg.message_id + "/" + msg.forward_from_chat.username)
                    }
                    else if (msg.forward_from_chat) {
                        bot.sendMessage(msg.chat.id, "channel private")
                    }
                }
                if (msg.forward_from_chat && msg.forward_from_chat.username) {
                    new reqhM.addTochannel({"username": msg.forward_from_chat.username}, function () {
                    });
                }
            }
        });
    },
    asks: function () {
        abot.on('ask.banner', function (msg) {
            if (!msg.text || (msg.text.indexOf('/') != 0)) {
                autilM.fetchInfo(msg, function (obj) {
                    this.query = aqM.bannerQ(obj);
                    new exeqM.exec(this.query, function (err, data) {
                        abot.sendMessage(msg.from.id, varM.msg.reply.replace("~endcommand", "/endbannerset"),
                            {ask: 'reply'})
                        /*.then(res=>{

                         }).catch(err=>{
                         console.log(err)
                         });*/
                    })
                })
            }
        })
        abot.on('ask.reply', function (msg) {
            if (!msg.text || (msg.text.indexOf('/') != 0)) {
                autilM.fetchInfo(msg, function (obj) {
                    this.query = aqM.replyQ(obj);
                    new exeqM.exec(this.query, function (err, data) {
                        //  new autilM.setOrders(msg,data[1][0].orderid)
                        abot.sendMessage(msg.from.id, varM.msg.replytype + "\r\n/force \r\n /optional",
                            {ask: 'replytype'});
                    })
                })
            }
        })
        abot.on('ask.replytype', function (msg) {
            if (msg.text) {
                this.query = aqM.replyTypeQ(msg.text.replace('/', ''));
                new exeqM.exec(this.query, function (err, data) {
                    //  new autilM.setOrders(msg,data[1][0].orderid)
                    abot.sendMessage(msg.from.id, varM.msg.limit,
                        {ask: 'postlimit'});
                })
            }
        })
        abot.on('ask.postlimit', function (msg) {
            if (msg.text && !isNaN(msg.text.trim())) {
                this.query = aqM.postLimitQ(msg.text.replace('/', ''));
                new exeqM.exec(this.query, function (err, data) {
                    //  new autilM.setOrders(msg,data[1][0].orderid)
                    abot.sendMessage(msg.from.id, varM.msg.screenshot,
                        {ask: 'screenshot'});
                    // new autilM.bulkMessage(data[0][0].orderid);
                    // new cutilM.remindBanner(data[0][0].orderid, date, true);
                    // new autilM.setOrders(msg, data[0][0].orderid,varM.msg.bannerset);
                })
            }
            else {
                abot.sendMessage(msg.from.id, varM.msg.limit,
                    {ask: 'postlimit'});
            }
        })
        abot.on('ask.screenshot', function (msg) {
            if (msg.photo) {
                autilM.getPhotoUrl(msg, function (msgid) {
                    this.query = aqM.screenShotQ(msgid);
                    new exeqM.exec(this.query, function (err, data) {
                        return abot.sendMessage(msg.from.id, varM.msg.waitforverify
                            .replace('~denycmd', " /resetbanervip_" + data[0][0].orderdetailid)
                            .replace('~verifycmd', " /verifybanervip_" + data[0][0].orderdetailid)
                        )
                    })
                })
            }
            else {
                abot.sendMessage(msg.from.id, varM.msg.screenshot,
                    {ask: 'screenshot'});
            }
        })
        abot.on('ask.date', function (msg) {
            if (msg.text && (msg.text.indexOf('/') != 0)) {
                var date = new Date(msg.text.split(' ').join('T')).getLocalTime();
                if (new Date().getLocalTime() < date) {
                    this.query = aqM.date(date);
                    new exeqM.exec(this.query, function (err, data) {
                        new autilM.bulkMessage(data[0][0].orderid);
                        new cutilM.remindBanner(data[0][0].orderid, date, true);
                        new autilM.setOrders(msg, data[0][0].orderid, varM.msg.bannerset);
                    })
                }
                else {
                    abot.sendMessage(msg.from.id, varM.msg.date + "\n" + dateFormat(new Date(), "yyyy-mm-dd HH:MM").toString(),
                        {ask: 'date'});
                }
            }
        })
        abot.on('ask.canceling', function (msg) {
            if (msg.text && msg.text.indexOf("cancel") == -1) {
                if (msg.text.indexOf('#cl') != -1) {
                    msg.text = msg.text.replace(/^\s+|\s+$/g, '').trim().replace('#cl', '');
                    orderdetailid = parseInt(msg.text);
                    if (!isNaN(orderdetailid)) {
                        msg.text = msg.text.replace(orderdetailid, '')
                        this.query = aqM.cancelQ("cancel", orderdetailid);
                        new exeqM.exec(this.query, function (err, data) {
                            if (data[0][0].orderdetailid in schedule.scheduledJobs) {
                                schedule.scheduledJobs[data[0][0].orderdetailid].cancel();
                                delete schedule.scheduledJobs[data[0][0].orderdetailid];
                            }
                            new autilM.cancelBulkMessage(data[0][0].orderdetailid, msg.text);
                            abot.sendMessage(msg.from.id, varM.msg.done);
                        })
                    }
                    else {
                        abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'canceling'});
                    }
                }
                else {
                    abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'canceling'});
                }
            }
            else {
                abot.sendMessage(msg.from.id, "cancel")
            }
        })
        abot.on('ask.ibanner', function (msg) {
            if (!msg.text || (msg.text.indexOf('/') != 0)) {
                autilM.fetchInfo(msg, function (obj) {
                    this.query = aqM.ibannerQ(obj);
                    new exeqM.exec(this.query, function (err, data) {
                        abot.sendMessage(msg.from.id, varM.msg.reply.replace("~endcommand", "/endibannerset"),
                            {ask: 'ireply'})
                    })
                })
            }
        })
        abot.on('ask.ireply', function (msg) {
            if (!msg.text || (msg.text.indexOf('/') != 0)) {
                autilM.fetchInfo(msg, function (obj) {
                    this.query = aqM.ireplyQ(obj);
                    new exeqM.exec(this.query, function (err, data) {
                        //  new autilM.setOrders(msg,data[1][0].orderid)
                        abot.sendMessage(msg.from.id, varM.msg.replytype + "\r\n/force \r\n /optional",
                            {ask: 'ireplytype'});
                    })
                })
            }
        })
        abot.on('ask.ireplytype', function (msg) {
            if (msg.text) {
                this.query = aqM.ireplyTypeQ(msg.text.replace('/', ''));
                new exeqM.exec(this.query, function (err, data) {
                    //  new autilM.setOrders(msg,data[1][0].orderid)
                    abot.sendMessage(msg.from.id, varM.msg.limit,
                        {ask: 'ipostlimit'});
                })
            }
        })
        abot.on('ask.ipostlimit', function (msg) {
            if (msg.text && !isNaN(msg.text.trim())) {
                this.query = aqM.ipostLimitQ(msg.text.replace('/', ''));
                new exeqM.exec(this.query, function (err, data) {
                    //  new autilM.setOrders(msg,data[1][0].orderid)
                    abot.sendMessage(msg.from.id, varM.msg.screenshot,
                        {ask: 'iscreenshot'});
                    // new autilM.bulkMessage(data[0][0].orderid);
                    // new cutilM.remindBanner(data[0][0].orderid, date, true);
                    // new autilM.setOrders(msg, data[0][0].orderid,varM.msg.bannerset);
                })
            }
            else {
                abot.sendMessage(msg.from.id, varM.msg.limit,
                    {ask: 'ipostlimit'});
            }
        })

        abot.on('ask.iscreenshot', function (msg) {
            if (msg.photo) {
                autilM.getPhotoUrl(msg, function (msgid) {
                    this.query = aqM.iscreenShotQ(msgid);
                    new exeqM.exec(this.query, function (err, data) {
                        return abot.sendMessage(msg.from.id, varM.msg.waitforverify
                            .replace('~denycmd', " /resetbanermass_" + data[0][0].orderCategoryDetailid)
                            .replace('~verifycmd', " /verifybanermass_" + data[0][0].orderCategoryDetailid)
                        )
                    })
                })
            }
            else {
                abot.sendMessage(msg.from.id, varM.msg.screenshot,
                    {ask: 'iscreenshot'});
            }
        })
        abot.on('ask.icanceling', function (msg) {
            if (msg.text && msg.text.indexOf("cancel") == -1) {
                if (msg.text.indexOf('#icl') != -1) {
                    msg.text = msg.text.replace(/^\s+|\s+$/g, '').trim().replace('#icl', '');
                    orderdetailid = parseInt(msg.text);
                    if (!isNaN(orderdetailid)) {
                        msg.text = msg.text.replace(orderdetailid, '')
                        this.query = aqM.icancelQ("cancel", orderdetailid);
                        new exeqM.exec(this.query, function (err, data) {
                            if (data[0][0].orderCategoryDetailid in schedule.scheduledJobs) {
                                schedule.scheduledJobs[data[0][0].orderCategoryDetailid].cancel();
                                delete schedule.scheduledJobs[data[0][0].orderCategoryDetailid];
                            }
                            new autilM.icancelBulkMessage(data[0][0].orderCategoryDetailid, msg.text);
                            abot.sendMessage(msg.from.id, varM.msg.done);
                        })
                    }
                    else {
                        abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'icanceling'});
                    }
                }
                else {
                    abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'icanceling'});
                }
            }
            else {
                abot.sendMessage(msg.from.id, "cancel")
            }
        })
        abot.on('ask.imsgo', function (msg) {
            if (msg.text && msg.text.indexOf("deny") == -1) {
                if (msg.text.indexOf('#imsgo') != -1) {
                    msg.text = msg.text.replace(/^\s+|\s+$/g, '').trim().replace('#imsgo', '');
                    orderdetailid = parseInt(msg.text);
                    if (!isNaN(orderdetailid)) {
                        msg.text = msg.text.replace(orderdetailid, '')
                        new autilM.icurAllBulkMessage(orderdetailid, msg.text)
                        abot.sendMessage(msg.from.id, varM.msg.done);
                    }
                    else {
                        abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'imsgo'});
                    }
                }
                else {
                    abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'imsgo'});
                }
            }
            else {
                abot.sendMessage(msg.from.id, "cancel")
            }
        })
        abot.on('ask.imsgdone', function (msg) {
            if (msg.text && msg.text.indexOf("deny") == -1) {
                if (msg.text.indexOf('#imsgdone') != -1) {
                    msg.text = msg.text.replace(/^\s+|\s+$/g, '').trim().replace('#imsgdone', '');
                    orderdetailid = parseInt(msg.text);
                    if (!isNaN(orderdetailid)) {
                        msg.text = msg.text.replace(orderdetailid, '')
                        new autilM.icurDoneBulkMessage(orderdetailid, msg.text)
                        abot.sendMessage(msg.from.id, varM.msg.done);
                    }
                    else {
                        abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'imsgdone'});
                    }
                }
                else {
                    abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'imsgdone'});
                }
            }
            else {
                abot.sendMessage(msg.from.id, "cancel")
            }
        })
        abot.on('ask.imsgall', function (msg) {
            if (msg.text && msg.text.indexOf("deny") == -1) {
                if (msg.text.indexOf('#imsgall') != -1) {
                    msg.text = msg.text.replace(/^\s+|\s+$/g, '').trim().replace('#imsgall', '');
                    orderdetailid = parseInt(msg.text);
                    if (!isNaN(orderdetailid)) {
                        msg.text = msg.text.replace(orderdetailid, '')
                        new autilM.icurAllBulkMessage(orderdetailid, msg.text)
                        abot.sendMessage(msg.from.id, varM.msg.done);
                    }
                    else {
                        abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'imsgall'});
                    }
                }
                else {
                    abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'imsgall'});
                }
            }
            else {
                abot.sendMessage(msg.from.id, "cancel")
            }
        })
        abot.on('ask.pmsgo', function (msg) {
            if (msg.text && msg.text.indexOf("deny") == -1) {
                if (msg.text.indexOf('#pmsgo') != -1) {
                    msg.text = msg.text.replace(/^\s+|\s+$/g, '').trim().replace('#pmsgo', '');
                    orderdetailid = parseInt(msg.text);
                    console.log(orderdetailid);
                    if (!isNaN(orderdetailid)) {
                        msg.text = msg.text.replace(orderdetailid, '')
                        new autilM.porderBulkMessage(orderdetailid, msg.text)
                        abot.sendMessage(msg.from.id, varM.msg.done);
                    }
                    else {
                        abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'pmsgo'});
                    }
                }
                else {
                    abot.sendMessage(msg.from.id, varM.msg.invalidNumber, {ask: 'pmsgo'});
                }
            }
            else {
                abot.sendMessage(msg.from.id, "cancel")
            }
        })
        abot.on('ask.sendmessage', function (msg) {
            if (msg.text && msg.text.indexOf("deny") == -1) {
                new autilM.allBulkMessage(msg.text)
                abot.sendMessage(msg.from.id, varM.msg.done);
            }
            else {
                abot.sendMessage(msg.from.id, "cancel")
            }
        })
        abot.on('ask.setsticker', function (msg) {
            if (msg.sticker && msg.from) {
                abot.getFile(msg.sticker.file_id).then(function (info) {
                    filename = rootPath + "sticker.webp";
                    console.log(info.fileLink, filename)
                    autilM.download(info.fileLink, filename, function () {
                        abot.sendMessage(msg.from.id, varM.msg.done);
                    })
                })
            }
            else {
                abot.sendMessage(msg.from.id, "cancel")
            }
        })
    }
}