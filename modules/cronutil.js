/**
 * Created by ali on 8/9/17.
 */
module.exports= {
    remindOrder: function (orderdetailid, later, perdate, first) {
        return;
        //console.log("remindOrder");
        if (later != "ya" && later != "adminpassed") {
            later = "later";
        }
        if (!first) {
            var date = new Date().setSeconds(new Date().getSeconds() + (0.25 * hour));
            //perdate=new Date(new Date().setSeconds(perdate.getSeconds() + (0.025 * hour)))
            date = utilM.getCronTime(date);
            //console.log(date,perdate);

            this.query = "SELECT * FROM `view_banners` where ostatus like '" + later + "' and  ostatus!='reject'  and orderdetailid=" + orderdetailid + ";";
            this.query += "update raaz_orderdetail set status='" + later + "',crontime='" + date + "',cronType='3'" +
                " where orderdetailid=" + orderdetailid + " and status like '" + later + "';";
            console.log(this.query)

            new exeqM.exec(this.query, function (err, result) {
                if (!err && result && result.length == 2) {
                    if (orderdetailid in schedule.scheduledJobs) {
                        schedule.scheduledJobs[orderdetailid].cancel();
                        delete schedule.scheduledJobs[orderdetailid];
                    }
                    banners = result[0];
                    if(banners&&banners.length>0) {
                        this.btns = [];
                        this.btns.push([bot.inlineButton("ویژه -" + banners[0].view + " - " + banners[0].channelTag,
                            {callback: "po-" + banners[0].orderdetailid + "-" + banners[0].channelTag + "-" + new Date(banners[0].performDate).getTime()})]);
                        this.btns = bot.inlineKeyboard(this.btns);
                        bot.sendMessage(banners[0].cchatid, varM.msg.reminderinprogress + ": @" + banners[0].channelTag, {replyMarkup: this.btns})
                            .then(function (ilk) {
                                fs.writeFileSync(chatpath + banners[0].cchatid, ilk.result.message_id, 'utf8')
                            })
                        job = cutilM.remindOrder.bind(null, orderdetailid, later, perdate, false)
                        schedule.scheduleJob(orderdetailid.toString(), date.toString(), job);
                    }
                }
            });
        }
        else {
            // var date = new Date().setSeconds(new Date().getSeconds() + (later*hour));
            // console.log(perdate,"      ",new Date().getLocal());
            //perdate=new Date(data[0][0].performDate);
            if(perdate<=new Date().getLocal()){
                perdate=new Date().getLocal().setSeconds(new Date().getSeconds() + (0.25 * hour));
            }
            var date = utilM.getCronTime(perdate, true);
            //   console.log(perdate,date)
            this.query = "update raaz_orderdetail set status='" + later + "',crontime='" + date + "',cronType='3'" +
                " where orderdetailid=" + orderdetailid + " and status='adminpassed'";
            new exeqM.exec(this.query, function (err, data) {
                if (orderdetailid in schedule.scheduledJobs) {
                    schedule.scheduledJobs[orderdetailid].cancel();
                    delete schedule.scheduledJobs[orderdetailid];
                }
                if (!first) {
                    this.btns = uutilM.btnGenerator(orderdetailid);
                    this.btns.push([bot.inlineButton('back ', {callback: 'order'})]);
                    this.btns = bot.inlineKeyboard(this.btns);
                    bot.sendMessage(result.cchatid, "توضیحات\r\n", {replyMarkup: this.btns}).then(function (ilk) {
                        fs.writeFileSync(chatpath + result.cchatid, ilk.result.message_id, 'utf8')
                    })
                }
                job = cutilM.remindOrder.bind(null, orderdetailid, later, perdate, false)
                // job=cutilM.iupdateView.bind(null,"cron.orderCategoryDetailId","cron.status",null);
                //console.log(orderdetailid.toString(), date.toString())
                schedule.scheduleJob(orderdetailid.toString(), date.toString(), job);
                //   console.log(schedule.scheduledJobs)
            });
        }
    },
    remindBanner: function (orderdetailid, date, first) {
        return;
        console.log(orderdetailid, date, first);
        if (!first) {
            this.query = "SELECT * FROM `view_banners` where   orderdetailid=" + orderdetailid;
            new exeqM.exec(this.query, function (err, result) {
                if (!err && result && result.length > 0) {
                    if (orderdetailid in schedule.scheduledJobs) {
                        schedule.scheduledJobs[orderdetailid].cancel();
                        delete schedule.scheduledJobs[orderdetailid];
                    }
                    this.post_data = {
                        "username": result[0].channelTag.replace('@', ''),
                        msgs: result
                    };
                    var banners = result;
                    result = result[0];

                    new reqhM.getUpdates(this.post_data, function (err, post) {
                        if (!err && post)
                            if (!uutilM.checkBannerSet(post)) {
                                var date = new Date().setSeconds(new Date().getSeconds() + (1800));
                                date = utilM.getCronTime(date);
                                this.query = "update raaz_orderdetail set crontime='" + date + "',cronType='4'" +
                                    " where orderdetailid=" + orderdetailid + " and status like '%adminpassed%'";
                                new exeqM.exec(this.query, function (err, data) {
                                    if (!first) {
                                        this.btns = uutilM.btnGenerator(orderdetailid)
                                        this.btns.push([bot.inlineButton('back ', {callback: 'order'})])
                                        this.btns = bot.inlineKeyboard(this.btns);
                                        bot.sendMessage(result.cchatid, "توضیحات\r\n" + uutilM.generateDesc(banners), {replyMarkup: this.btns}).then(function (ilk) {
                                            fs.writeFileSync(chatpath + result.cchatid, ilk.result.message_id, 'utf8')
                                        })
                                    }
                                    job = cutilM.remindOrder.bind(null, orderdetailid, later, false)
                                    schedule.scheduleJob(orderdetailid.toString(), date.toString(), job);
                                });

                            }
                            else {
                                new cutilM.updateView(orderdetailid, result.ostatus);
                            }
                    })
                }
            });
        }
        else {
            //var date = new Date().setSeconds(new Date().getSeconds() + (later*10));
            date = utilM.getCronTime(date);
            this.query = "update raaz_orderdetail set crontime='" + date + "',cronType='4'" +
                " where orderdetailid=" + orderdetailid + " and status='adminpassed'";
            new exeqM.exec(this.query, function (err, data) {
                if (!first) {
                    this.btns = uutilM.btnGenerator(orderdetailid)
                    this.btns.push([bot.inlineButton('back ', {callback: 'order'})])
                    this.btns = bot.inlineKeyboard(this.btns);
                    bot.sendMessage(result.cchatid, "توضیحات\r\n", {replyMarkup: this.btns}).then(function (ilk) {
                        fs.writeFileSync(chatpath + result.cchatid, ilk.result.message_id, 'utf8')
                    })
                }
                ///console.log(" remindBanner run cron",date.toString())
                job = cutilM.remindOrder.bind(null, orderdetailid, later, false)
                schedule.scheduleJob(orderdetailid.toString(), date.toString(), job);
            });
        }
    },
    updateView: function (orderdetailid, status) {
        return;
        if (orderdetailid in schedule.scheduledJobs) {
            schedule.scheduledJobs[orderdetailid].cancel();
            delete schedule.scheduledJobs[orderdetailid];
        }
        this.query = "SELECT * FROM `view_banners` where orderdetailid=" + orderdetailid;
        // console.log(this.query)
        new exeqM.exec(this.query, function (err, result) {
            if (!err && result && result.length > 0) {
                this.post_data = {
                    username: result[0].channelTag,
                    msgs: result
                };

                if (!result.searchObject('status', 'reply')) {
                    result = result[result.length - 1];

                }
                else {
                    result = result.searchObject('status', 'reply');

                }
                result.view = result.view * kilo;
                //console.log(result)

                new reqhM.getUpdates(this.post_data, function (err, post) {
                    if (!err && post) {
                        //  console.log(post);
                        if (uutilM.checkBannerSet(post) && result.adminop != "cancel") {
                            if (post.searchObject('status', 'reply') && post.searchObject('status', 'reply').view != -1) {
                                post = post.searchObject('status', 'reply');
                            }
                            else {
                                if (post[post.length - 1].view == -1) {
                                    post = post[post.length - 2];
                                }
                                else {
                                    post = post[post.length - 1];
                                }
                            }


                            //   console.log(new Date())
                            post.view = parseInt(post.view - parseInt(((result.initview && result.initview > 0) ? result.initview : 0)));

                            var date = new Date().setSeconds(new Date().getSeconds() + 1800);
                            date = utilM.getCronTime(date);
                            diff = parseFloat(new Date().getLocalTime() / kilo) - parseFloat((post.start).toString());
                            // console.log(diff,parseFloat(new Date().getLocalTime()/kilo), parseFloat((post.start)))
                            //diff = diff / hour000;
                            //  console.log(post.view ,result.view,";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;" );
                            if ((post.view < parseInt(result.view) && parseInt(result.view) > 0) /*|| (diff<(result.duration*100) &&result.duration&& result.duration > 0)*/) {
                                this.flag = true;
                                if (post.view > result.view * 0.90 && result.adminop != "cancel") {
                                    bot.sendMessage(result.cchatid,
                                        varM.msg.finshing + "\r\nتگ کانال : @" + result.channelTag + utilM.getOrderNumber(result.orderid, orderdetailid))
                                    //.then(re>={}).catch(err>={console.log(err)})
                                }
                                else if (post.view > result.view * 0.95 && result.adminop == "cancel") {
                                    this.flag = false;
                                }
                                //   console.log(result)
                                if (this.flag) {
                                    this.query = "update raaz_orderdetail set status='ya',crontime='" + date + "',cronType='2',sitestatus=5," +
                                        " view='" + post.view + "',reshot='" + post.reshot + "',endmembers='" + post.membercout + "',starttime='" + post.start + "' " +
                                        " where orderdetailid=" + orderdetailid //+ " and status like '%" + status + "%'";
                                    // console.log(this.query)
                                    new exeqM.exec(this.query, function (err, data) {
                                        //       console.log(orderdetailid.toString(), date.toString())
                                        if (result.adminop != "cancel") {
                                            job = cutilM.updateView.bind(null, orderdetailid, 'ya')
                                            schedule.scheduleJob(orderdetailid.toString(), date.toString(), job);
                                        }
                                        else {
                                            new cutilM.orderFinish(orderdetailid);

                                        }
                                    });
                                }
                                else {
                                    new cutilM.orderFinish(orderdetailid);
                                }
                            }
                            else {
                                new cutilM.orderFinish(orderdetailid);
                            }
                        }
                        else if (post.view > result.view * 0.95 || result.adminop == "cancel") {
                            new cutilM.orderFinish(orderdetailid);
                        }
                        else {
                            this.btns = [];
                            this.btns.push([abot.inlineButton("ویژه - alert - " + orderdetailid,
                                {callback: "removeorder-1-" + orderdetailid + "-" + result.channelTag + "-" + result.cchatid + "-" + result.orderid})]);
                            [abot.inlineButton("ویژه - fire - " + orderdetailid,
                                {callback: "removeorder-2-" + orderdetailid + "-" + result.channelTag + "-" + result.cchatid + "-" + result.orderid})]
                            this.btns = abot.inlineKeyboard(this.btns)
                            this.text = varM.msg.removeorder + "\r\nتگ کانال : @" + result.channelTag + utilM.getOrderNumber(result.orderid, orderdetailid)
                            for (ai = 0; ai < admins.length; ai++) {
                                abot.sendMessage(admins[ai].id, this.text, {replyMarkup: this.btns})
                            }
                        }
                    }
                    else {
                        console.log(err, post)
                    }
                })
            }
        });
    },
    orderFinish: function (orderdetailid) {
        return;
        if (orderdetailid in schedule.scheduledJobs) {
            schedule.scheduledJobs[orderdetailid].cancel();
            delete schedule.scheduledJobs[orderdetailid];
        }
        this.query = "SELECT * FROM `view_banners` where orderdetailid=" + orderdetailid + "  order by `bannerid` desc;";
        new exeqM.exec(this.query, function (err, result) {
            if (!err && result && result.length > 0) {
                // console.log(result)
                this.tmp = [];
                for (ui = 0; ui < result.length; ui++) {
                    // if(result[ui].cstatus!='banner')
                    {

                        this.tmp.push({
                            username: result[ui].senderid == originalchannel.id ? originalchannel.tag.replace('@', '') : result[ui].postlink,
                            tag: result[ui].channelTag,
                            chatid: result[ui].cchatid,
                            messageid: result[ui].messageid,
                            messageid: result[ui].messageid,
                            status: result[ui].status,
                            bannerid: result[ui].bannerid,
                            price: result[ui].channelCost,
                            orderid: result[ui].orderid,
                            fromid: result[ui].fromid,
                            title: result[ui].title,
                            adminDescription: result[ui].adminDescription,
                            senderid: result[ui].senderid
                        })
                    }
                }
                this.post_data =
                    {
                        chats: this.tmp
                    }
                reqhM.getBulkTargetsUpdates(this.post_data, function (err, post) {
                    if (!err && post) {
                        for (pi = 0; pi < post.length; pi++) {
                            if (post[pi].view != -1 && (!post.searchObject('status', 'reply'))) {
                                this.query = "update raaz_orderdetail set status='finished'," +
                                    " sitestatus=6,view='" + post[pi].view + "' " +
                                    " where orderdetailid=" + orderdetailid + ";";
                                this.msg = varM.msg.finish + utilM.getOrderNumber(post[pi].orderid, orderdetailid) + "\r\nکانال : @" + post[pi].tag +
                                    "\r\nعنوان : @" + post[pi].adminDescription +
                                    "\r\nتوضیحات : @" + post[pi].title +
                                    "\r\nویو ثبت شده : " + post[pi].view + "\r\nچگونگی درج تبلیغ : " + utilM.getType(post[pi].status);
                                this.chatid = post[pi].chatid;
                                this.from = post[pi].fromid;
                                break;
                            }
                            else if (post[pi].view != -1 && (post.searchObject('status', 'reply') && post[pi].status == 'reply')) {
                                this.query = "update raaz_orderdetail set status='finished'," +
                                    " sitestatus=6,view='" + post[pi].view + "'" +
                                    " where orderdetailid=" + orderdetailid + ";";
                                this.msg = varM.msg.finish + utilM.getOrderNumber(post[pi].orderid, orderdetailid) +
                                    "کانال : @" + post[pi].tag + "\r\n" +
                                    ((post[pi].title && post[pi].title != 'undefiend') ? (" عنوان : " + post[pi].title + "\r\n") : "") +
                                    ((post[pi].adminDescription && post[pi].adminDescription != 'undefiend') ? (" توضیحات : " + post[pi].adminDescription + "\r\n") : "") +
                                    "درآمد حاصل :  " + ((post[pi].price * post[pi].view) / kilo).toFixed(0) + " تومان 💰 " + "\r\n"
                                "ویو ثبت شده : " + post[pi].view + "ویو \r\nچگونگی درج تبلیغ : " + utilM.getType(post[pi].status);
                                this.chatid = post[pi].chatid;
                                this.from = post[pi].fromid;
                                break;
                            }
                        }
                        // console.log(this.chatid,this.msg,this.query,post.length)
                        // return;
                        var that = this;
                        if (this.query != "") {
                            new exeqM.exec(that.query, function (err, upd) {
                            })

                            bot.sendMessage(that.chatid, that.msg);
                            for (ai = 0; ai < admins.length; ai++) {
                                abot.sendMessage(admins[ai].id, that.msg)
                            }
                        }
                    }
                    else {
                        console.log(err, post)
                    }
                })
            }
        });
    },
    iremindOrder: function (orderdetailid, later, first) {
        return;
        //console.log("remindOrder");
        if (!first) {
            this.query = "SELECT * FROM `view_acceptlist` where ostatus='later" + later + "' and orderdetailid=" + orderdetailid + " group by postlink";
            new exeqM.exec(this.query, function (err, result) {


            });
        }
        else {
            var date = new Date().setSeconds(new Date().getSeconds() + (later * hour));
            date = utilM.getCronTime(date);
            this.query = "update raaz_ordercategorydetail set status='later" + later + "',crontime='" + date + "',cronType='3'" +
                " where ordercategorydetailid=" + orderdetailid + " and status='adminpassed'";
            new exeqM.exec(this.query, function (err, data) {
                if (!first) {
                    this.btns = uutilM.btnGenerator(orderdetailid)
                    this.btns.push([bot.inlineButton('back ', {callback: 'order'})])
                    this.btns = bot.inlineKeyboard(this.btns);
                    bot.sendMessage(result.chatid, "توضیحات\r\n", {replyMarkup: this.btns})
                        .then(function (ilk) {
                            fs.writeFileSync(chatpath + result.chatid, ilk.result.message_id, 'utf8')
                        })
                }
                job = cutilM.remindOrder.bind(null, orderdetailid, later, false)
                schedule.scheduleJob(orderdetailid.toString(), date.toString(), job);
            });
        }
    },
    iupdateView: function (orderdetailid, status, bids, tag) {
        return;
        console.log("iupdateView",orderdetailid, status, bids, tag)
        if (orderdetailid in schedule.scheduledJobs) {
            schedule.scheduledJobs[orderdetailid].cancel();
            delete schedule.scheduledJobs[orderdetailid];
        }
        this.query = uqM.ibannerQ(orderdetailid);
        if (bids) {
            this.query += " update  raaz_orderdetail set status='ya',channelTag	='" + tag + "',categoryId=" + orderdetailid + ",starttime='" + new Date().getLocalTime() + "' " +
                " where bannerid in (" + bids.toString() + "); ";
        }
        console.log(this.query)
        new exeqM.exec(this.query, function (err, result) {
            if (!err && result && result.length > 0 && !bids) {
                result = uutilM.fixBanners(result[0][0] ? result[0] : result);

                result = result[0][0] ? result[0][0] : result[0];
                this.post_data = {
                    "username": result.postlink.replace('@', ''),
                    "access_hash": result.access_hash,
                    "fromid": result.fromid,
                    "id": result.messageid
                };
                new reqhM.igetUpdates(this.post_data, function (err, post) {
                    if (!err && post) {
                        if (post.view != -1) {
                            result.view *= kilo;
                            post.view = parseInt(post.view - parseInt(((result.initview && result.initview > 0) ? result.initview : 0)));
                            //   result.view = parseInt(result.view- parseInt(((result.initview && result.initview > 0) ? result.initview : 0)));
                            var date = new Date().setSeconds(new Date().getSeconds() + 1800);
                            date = utilM.getCronTime(date);
                            diff = parseFloat(new Date().getLocalTime() / kilo) - parseFloat((post.start).toString());
                            // console.log(diff,parseFloat(new Date().getLocalTime()/kilo), parseFloat((post.start)))
                            //console.log(post.view,result.view);
                            //diff = diff / hour000;
                            // console.log(diff,result.duration , result.duration )
                            crondata = cutilM.getStatus(result.crondata, post.view, result.view, result.adminop);

                            //  console.log(post);
                            console.log("crondata=cutilM.getStatus", crondata, result.crondata, post.view, result.view, post,
                                (!crondata || crondata < 100) && (result.adminop != "cancel"))
                            if ((!crondata || crondata < 100) && (result.adminop != "cancel")
                            /*|| (diff<(result.duration*100) &&result.duration&& result.duration > 0)*/
                            ) {
                                if (crondata) {
                                    crondatasql = "crondata='" + crondata + "',";
                                }
                                else {
                                    crondatasql = "";
                                }
                                this.query = "update raaz_ordercategorydetail set status='ya',crontime='" + date + "',cronType='2',sitestatus=5," +
                                    " view='" + post.view + "',reshot='" + post.reshot + "',endmembers='" + post.membercout + "'," + crondatasql + "starttime='" + post.start + "' " +
                                    " where orderCategoryDetailId=" + orderdetailid + " and status like '%" + status + "%';";
                                // if (bids) {
                                //   this.query += "update  raaz_orderdetail set status='ya' where bannerid in (" + bids.toString() + ");";
                                // }
                                if (crondata && crondata <= 50) {
                                    this.query += " SELECT * FROM `view_iremind` where  orderCategoryDetailId=" + orderdetailid + " group by orderCategoryDetailId,TelegramId;";
                                }
                                if (crondata && crondata > 50 && crondata < 100) {
                                    this.query += " SELECT * FROM `view_icontributors` where  orderCategoryDetailId=" + orderdetailid + " group by orderCategoryDetailId,TelegramId;";
                                }
                                // console.log(this.query)
                                new exeqM.exec(this.query, function (err, data) {
                                    if (data && data.length == 2) {
                                        this.msgs = [];
                                        if (crondata && crondata <= 50) {
                                            this.msg = varM.msg.reminderinprogress;
                                            for (ii = 0; ii < data[1].length; ii++) {
                                                this.btns = [];
                                                this.btns.push([bot.inlineButton(data[1][ii].orderCount + " - " + data[1][ii].TelegramId,
                                                    {callback: "io-" + data[1][ii].orderCategoryDetailId + "-" + data[1][ii].TelegramId + "-" + new Date(data[1][ii].performDate).getTime()})]);
                                                this.btns = bot.inlineKeyboard(this.btns)
                                                this.msgs.push({
                                                    chatid: data[1][ii].chatid,
                                                    text: this.msg + "\r\nتگ کانال :@" + data[1][ii].TelegramId + utilM.getOrderNumber(data[1][ii].orderid, orderdetailid)
                                                    + ((data[1][ii].ordertitle && data[1][ii].ordertitle != 'undefiend') ? (" عنوان : " + data[1][ii].ordertitle + "\r\n") : ""),
                                                    replyMarkup: this.btns
                                                })
                                            }
                                        }
                                        else if (crondata && crondata > 50 && crondata < 100) {
                                            this.msg = varM.msg.finish;
                                            for (ii = 0; ii < data[1].length; ii++) {
                                                this.msgs.push({
                                                    chatid: data[1][ii].chatid,
                                                    text: this.msg + "\r\nتگ کانال :@" + data[1][ii].TelegramId + utilM.getOrderNumber(data[1][ii].orderid, orderdetailid)
                                                    + ((data[1][ii].ordertitle && data[1][ii].ordertitle != 'undefiend') ? (" عنوان : " + data[1][ii].ordertitle + "\r\n") : "")
                                                })
                                            }
                                        }


                                        new autilM.sendBulk(this.msgs)
                                    }
                                    job = cutilM.iupdateView.bind(null, orderdetailid, 'ya', null)
                                    schedule.scheduleJob(orderdetailid.toString(), date.toString(), job);
                                });
                            }
                            else {
                                new cutilM.iorderFinish(orderdetailid);
                            }
                        }
                        else {
                            var date = new Date().setSeconds(new Date().getSeconds() + 1800);
                            date = utilM.getCronTime(date);
                            this.query = " update raaz_ordercategorydetail set status='ya',crontime='" + date + "',cronType='2',sitestatus=5," +
                                " view='" + post.view + "',reshot='" + post.reshot + "' " +
                                " where orderCategoryDetailId=" + orderdetailid + " and status like '%" + status + "%';";
                            this.query += " SELECT * FROM `view_iremind` where  orderCategoryDetailId=" + orderdetailid + " group by orderCategoryDetailId,TelegramId;";
                            new exeqM.exec(this.query, function (err, data) {
                                if (data && data.length == 2) {
                                    this.msg = varM.msg.reminderinprogress;
                                    this.msgs = [];
                                    for (ii = 0; ii < data[1].length; ii++) {
                                        this.btns = [];
                                        this.btns.push([bot.inlineButton(data[1][ii].orderCount + " - " + data[1][ii].TelegramId,
                                            {callback: "io-" + data[1][ii].orderCategoryDetailId + "-" + data[1][ii].TelegramId + "-" + new Date(data[1][ii].performDate).getTime()})]);
                                        this.btns = bot.inlineKeyboard(this.btns)
                                        this.msgs.push({
                                            chatid: data[1][ii].chatid,
                                            text: this.msg + "\r\nتگ کانال :@" + data[1][ii].TelegramId + utilM.getOrderNumber(result.orderid, orderdetailid)
                                            + ((data[1][ii].ordertitle && data[1][ii].ordertitle != 'undefiend') ? (" عنوان : " + data[1][ii].ordertitle + "\r\n") : "")
                                            ,
                                            replyMarkup: this.btns
                                        })
                                    }
                                    new autilM.sendBulk(this.msgs)
                                    job = cutilM.iupdateView.bind(null, orderdetailid, 'ya', null)
                                    schedule.scheduleJob(orderdetailid.toString(), date.toString(), job);
                                }
                            })
                        }
                    }
                    else {
                        console.log(err, post)
                    }
                })
            }
        });
    },
    iorderFinish: function (orderdetailid) {
        return;
        if (orderdetailid in schedule.scheduledJobs) {
            schedule.scheduledJobs[orderdetailid].cancel();
            delete schedule.scheduledJobs[orderdetailid];
        }
        this.query = " SELECT * FROM `view_icontributors` where  orderCategoryDetailId=" + orderdetailid + ";";
        // console.log(this.query);
        // return;
        new exeqM.exec(this.query, function (err, result) {
            if (!err && result && result.length > 0) {
                // result= uutilM.fixBanners(result);
                this.tmp = [];
                for (ui = 0; ui < result.length; ui++) {
                    if (result[ui].cstatus != 'banner' && result[ui].cstatus == 'reply') {
                        this.tmp.push({
                            username: result[0].postlink == forwardchannel.tag.replace('@', '') ? originalchannel.tag.replace('@', '') : result[0].postlink,
                            tag: result[ui].TelegramId,
                            chatid: result[ui].chatid,
                            messageid: result[ui].messageid,
                            status: result[ui].cstatus,
                            bannerid: result[ui].bannerid,
                            price: result[ui].channelCost,
                            orderid: result[ui].orderid,
                            ordertitle: result[ui].ordertitle,
                            fromid: result[ui].fromid,
                            title: result[ui].title,
                            adminDescription: result[ui].adminDescription,
                            senderid: result[ui].senderid
                        })
                    }
                    else if (result[ui].cstatus != 'banner' && result[ui].cstatus == 'sticker') {
                        this.tmp.push({
                            username: result[0].postlink == forwardchannel.tag.replace('@', '') ? originalchannel.tag.replace('@', '') : result[0].postlink,
                            tag: result[ui].TelegramId,
                            chatid: result[ui].chatid,
                            messageid: result[ui].messageid,
                            status: result[ui].cstatus,
                            bannerid: result[ui].bannerid,
                            orderid: result[ui].orderid,
                            price: result[ui].channelCost,
                            fromid: result[ui].fromid,
                            title: result[ui].title,
                            adminDescription: result[ui].adminDescription,
                            senderid: result[ui].senderid
                        })
                    }
                }
                this.post_data =
                    {
                        chats: this.tmp
                    }
                reqhM.getBulkTargetsUpdates(this.post_data, function (err, post) {
                    console.log(post);
                    this.msgs = [];
                    this.msg = "your order finished:"
                    this.query = "";
                    this.totalView = 0;
                    this.tags = "";
                    for (pi = 0; pi < post.length; pi++) {
                        if (post[pi].view != -1 && !this.msgs.searchObject('tag', post[pi].tag)) {
                            //if(post[pi].status=="banner")
                            this.from = post[pi].fromid || post[pi].senderid
                            //  }post[pi].fromid
                            this.query += "update raaz_orderdetail set sitestatus=6,view='" + post[pi].view + "',status='finished' where status='ya' and bannerid=" + post[pi].bannerid + ";";
                            this.msgs.push({
                                chatid: post[pi].chatid,
                                tag: post[pi].tag,
                                text: varM.msg.finish + utilM.getOrderNumber(post[pi].orderid, orderdetailid) + "کانال : @" + post[pi].tag + "\r\n" +
                                ((post[pi].title && post[pi].title != 'undefiend') ? (" عنوان : " + post[pi].title + "\r\n") : "") +
                                ((post[pi].adminDescription && post[pi].adminDescription != 'undefiend') ? (" توضیحات : " + post[pi].adminDescription + "\r\n") : "") +
                                "\r\nدرآمد حاصل : " + ((post[pi].price * post[pi].view) / kilo).toFixed(0) + " تومان 💰 " +
                                "\r\nویو ثبت شده : " +
                                post[pi].view + "ویو \r\nچگونگی درج تبلیغ : " + utilM.getType(post[pi].status)
                            })
                            this.totalView += post[pi].view;
                            this.tags += "@" + post[pi].tag + " -- " + post[pi].view + "\r\n";
                        }
                    }
                    var that = this;
                    that.query += "update raaz_ordercategorydetail set sitestatus=6,status='finished',view='" + that.totalView + "' where  orderCategoryDetailId=" +
                        orderdetailid + ";"
                    new exeqM.exec(that.query, function (err, result) {
                    })
                    this.finalText = varM.msg.finish + utilM.getOrderNumber(post[0].orderid, orderdetailid) + "\r\nکانال ها :\r\n" + this.tags + "\r\nویو ثبت شده : " + this.totalView
                    for (ai = 0; ai < admins.length; ai++) {
                        abot.sendMessage(admins[ai].id, this.finalText)
                    }
                    new autilM.sendBulk(this.msgs)
                })
            }
        });
    },
    iremindBanner: function (orderCategoryDetailid, tag, date) {
        return;
        console.log(orderCategoryDetailid, tag, date)
        if (orderCategoryDetailid in schedule.scheduledJobs) {
            schedule.scheduledJobs[orderCategoryDetailid].cancel();
            delete schedule.scheduledJobs[orderCategoryDetailid];
        }

        var cdate = utilM.getCronTime(date.getTime(), true);
        if (date.getTime() <= new Date(new Date().getLocal()).getTime()) {
            this.query = " update raaz_ordercategorydetail set status='ya',crontime='" + cdate + "',cronType='4'," +
                " rejectlist=REPLACE(rejectlist,'," + tag + ",',',')," +
                " rejectlist=TRIM(LEADING '" + tag + ",' FROM rejectlist)," +
                " rejectlist=TRIM(LEADING '" + tag + "' FROM rejectlist)," +
                " rejectlist=TRIM(TRAILING '," + tag + "' FROM rejectlist)" +
                " where ordercategorydetailid=" + orderCategoryDetailid + " ;";
            //console.log(this.query);
                
            new exeqM.exec(this.query, function (err, data) {

                //console.log("iremindBanner", date, new Date(new Date().getLocal()), date.getTime() > new Date(new Date().getLocal()).getTime())
                // if (date.getTime() > new Date(new Date().getLocal()).getTime()) {
                //     job = cutilM.iupdateView.bind(null, orderCategoryDetailid, 'adminpassed')
                //     schedule.scheduleJob(orderCategoryDetailid.toString(), cdate.toString(), job);
                // }
                // else {
                //     console.log("call iupdateview");
                //
                //      new cutilM.iupdateView(orderCategoryDetailid, 'adminpassed')
                // }

            });
        }
        else{
            job = cutilM.iremindBanner.bind(iremindBanner, '-', date)
                schedule.scheduleJob(orderCategoryDetailid.toString(), cdate.toString(), job);
        }
    },
    getStatus: function (crondata, curview, oview) {
        if (!crondata || crondata == 'undefined' || crondata == 'null' || crondata == 'NULL') {
            crondata = 5;
            return crondata;
        }
        // else{
        crondata = parseInt(crondata)
        percent = parseInt((curview / oview) * 100);
        //console.log(percent, crondata)
        /*if(percent>5&&percent<10){*/
         // if(crondata==5)
         // return 5;
        if (percent >= crondata) {
            if (percent >= 10 && percent < 15) {
                if (crondata < 10 || percent < crondata)
                    return 10;
            }
            else if (percent >= 15 && percent < 20) {
                if (crondata < 15 || percent < crondata)
                    return 15;
            }
            else if (percent >= 20 && percent < 30) {
                if (crondata < 20 || percent < crondata)
                    return 20;
            }
            else if (percent >= 30 && percent < 40) {
                if (crondata < 30 || percent < crondata)
                    return 30;
            }
            else if (percent >= 40 && percent < 50) {
                if (crondata < 40 || percent < crondata)
                    return 40;
            }
            else if (percent >= 95 && percent < 100) {
                if (crondata < 95 || percent < crondata)
                    return 95;
            }
            else if (percent >= 100) {
                if (crondata < 100 || percent < crondata)
                    return 100;
            }
            // }
        }
        return false;
    }
}
