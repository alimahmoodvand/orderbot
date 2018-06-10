/**
 * Created by ali on 7/31/17.
 */
module.exports= {
    updateNewChannelMessage: function (updates) {
        //console.log("updateNewChannelMessage",updates.length)
        //if(JSON.stringify(updates).indexOf("#Portrait")!=-1)
        // {
        //     for (ui = 0; ui < updates.length; ui++) {
        //         console.log(JSON.stringify(updates[ui]));
        //     }
        //     return;
        // }
        this.fromids = [];
        this.senderids = [];
        this.messageids = [];
        //var mytarget=false;
        for (ui = 0; ui < updates.length; ui++) {
            //  if(updates[ui].message.message== 'bm'&&updates[ui].message.fwd_from){
            // //     console.dir(updates[ui].message)
            // //     console.dir(updates[ui].message.fwd_from)
            // //     return;
            //      mytarget=true
            //  }
            // console.log(updates[ui].message.to_id,updates[ui].message.fwd_from)
            if (updates[ui]['message'] && updates[ui]['message']['fwd_from']
            &&updates[ui].message.to_id.channel_id
            &&updates[ui].message.fwd_from.channel_id
            &&updates[ui].message.fwd_from.channel_post
            ) {
                senderid=originalchannel.id.indexOf(updates[ui].message.fwd_from.channel_id)==-1
                ?updates[ui].message.fwd_from.channel_id:originalchannel.id;


                fromid=originalchannel.id.indexOf(updates[ui].message.to_id.channel_id)==-1
                ?updates[ui].message.to_id.channel_id:originalchannel.id;

                // senderid=originalchannel.id.indexOf(updates[ui].message.fwd_from.channel_id)==-1
                // ?updates[ui].message.fwd_from.channel_id:originalchannel.id;
                //
                //
                // fromid=originalchannel.id.indexOf(updates[ui].message.to_id.channel_id)==-1
                // ?updates[ui].message.to_id.channel_id:originalchannel.id;


                this.fromids.push(fromid);
                this.senderids.push(senderid);
                this.messageids.push(updates[ui].message.fwd_from.channel_post);
                //console.log(updates[0]);
                //console.log();
            }
        }
        // if(JSON.stringify(updates).indexOf("banner")!=-1)
        // console.log(this.fromids,this.senderids ,this.messageids)
        // return;
        if (this.fromids.length > 0 && this.senderids.length > 0 && this.messageids.length > 0) {
            this.query = uqM.updateNewMessageQ(this.fromids.join(','), this.senderids.join(','), this.messageids.join(','));
            this.query += uqM.newMessageQ();
            // if(mytarget) {
            //     console.log(this.query);
            //     return;
            // }
            new exeqM.exec(this.query, function (err, results) {
                if (!err && results && results.length == 2 && results[1].length > 0) {
                    result = results[1];
                    this.msgs = [];
                    ids=[];
                   console.log(result);
                        
                    for (ri = 0; ri < result.length; ri++) {
                        ids.push( result[ri].orderdetailid)
                        this.msgs.push({
                            chatid: result[ri].cchatid,
                            text: varM.msg.setverify + "\r\nتگ کانال :@" + result[ri].channelTag + utilM.getOrderNumber(result[ri].vorderid, result[ri].orderdetailid)
                        })

                    }
                    this.query=" update raaz_orderdetail set status='ya',sitestatus=5,starttime='"+ new Date().getLocalTime()+"' where orderdetailid in ("+ids.join(",")+"); ";
                    new exeqM.exec(this.query, function (err, results) {
                    })
                    new autilM.sendBulk(this.msgs)
                }
            })
        }
    },
    iupdateNewChannelMessage: function (updates) {
        this.fromids = [];
        this.senderids = [];
        this.messageids = [];
        var imytarget=false;
        this.fwds=[];
        for (ui = 0; ui < updates.length; ui++) {
            if(/*updates[ui].message.message== 'bm'&&*/updates[ui].message.fwd_from){
                //    console.dir(updates[ui].message)
               //     console.dir(updates[ui].message.fwd_from)
                  //  return;
                imytarget=true
            }
            if (updates[ui]['message'] && updates[ui]['message']['fwd_from']
                &&updates[ui].message.to_id.channel_id
                &&updates[ui].message.fwd_from.channel_id
                &&updates[ui].message.fwd_from.channel_post
            ) {
                senderid=originalchannel.id.indexOf(updates[ui].message.fwd_from.channel_id)==-1
                ?updates[ui].message.fwd_from.channel_id:originalchannel.id;


                fromid=originalchannel.id.indexOf(updates[ui].message.to_id.channel_id)==-1
                    ?updates[ui].message.to_id.channel_id:originalchannel.id;

                senderid=forwardchannel.id.indexOf(senderid)==-1
                ?senderid:forwardchannel.id;


                fromid=forwardchannel.id.indexOf(fromid)==-1
                    ?fromid:forwardchannel.id;

                // senderid=originalchannel.id.indexOf(updates[ui].message.fwd_from.channel_id)==-1
                // ?updates[ui].message.fwd_from.channel_id:originalchannel.id;
                //
                //
                // fromid=originalchannel.id.indexOf(updates[ui].message.to_id.channel_id)==-1
                // ?updates[ui].message.to_id.channel_id:originalchannel.id;
                this.fwds.push({
                    fromid:fromid,
                    senderid:senderid,
                    messageid:updates[ui].message.fwd_from.channel_post,
                })
                this.fromids.push(fromid);
                this.senderids.push(senderid);
                this.messageids.push(updates[ui].message.fwd_from.channel_post);
            }
        }
        // console.dir(this.fromids)
        // console.dir(this.senderids)
        // console.dir(this.messageids)
        // return
        if (this.fromids.length > 0 && this.senderids.length > 0 && this.messageids.length > 0) {
            this.query = uqM.iupdateNewMessageQ(this.fwds,this.fromids.join(','), this.senderids.join(','), this.messageids.join(','));
            this.query += uqM.inewMessageQ();
            // if(imytarget) {
            //    console.log(this.query);
            //     return;
            // }
            exeqM.exec(this.query, function (err, results) {
                if (!err && results && results.length == 2 && results[1].length > 0) {
                    result = results[1];
                    this.msgs = [];
                    ids=[];
                    this.query="";
                    for (ri = 0; ri < result.length; ri++) {
                        //ids.push( result[ri].bannerid)
                        this.msgs.push({
                            chatid: result[ri].chatid,
                            text: varM.msg.setverify + "\r\nتگ کانال :@" + result[ri].postlink + utilM.getOrderNumber(result[ri].orderid, result[ri].orderCategoryDetailId)
                        })
                        this.query += " update  raaz_orderdetail set  status='ya',starttime='" + new Date().getLocalTime() + "' " +
                            " where screenshotId IS NULL and channelTag='" + result[ri].postlink.replace('@') +"' and categoryId=" + result[ri].orderCategoryDetailId;
                    }
                    // console.log(this.query)
                    // return

                   // this.query=" update raaz_orderdetail set status='ya' where bannerid in ("+ids.join(",")+"); ";
                    new exeqM.exec(this.query, function (err, results) {
                    })
                    new autilM.sendBulk(this.msgs)
                }
            })
        }
    },
    updateViews: function (vips,cancel) {
        query = "";
        vips.sortOn('orderdetailid');
        //console.dir(vips)
        // return;
        msgs = [];
        for (ui = 0; ui < vips.length; ui++) {
            banners = vips.searchObjects('orderdetailid', vips[ui].orderdetailid);
            reply = banners.searchObject('status', 'reply');
            sticker = banners.searchObject('status', 'sticker');
            banner = banners.searchObject('status', 'banner');
            obj = null;
            if (reply && reply.views > 0) {
                obj = reply
            }
            else if (sticker && sticker.views > 0) {
                // console.log(sticker);

                obj = sticker
            }
            else if (banner && banner.views > 0) {
                obj = banner
                obj.views = parseInt(obj.views - obj.initview);
            }
           // if(vips[ui].orderdetailid==16)
           // console.log(obj);
           //  return;
            if (obj && obj.views > 0) {
                // console.log(obj.views , obj.ordercount,vips[ui].orderdetailid,obj.ordercount*kilo)
                if (obj.views >= obj.ordercount*kilo||obj.adminop=="cancel"||obj.adminop=="finish") {
                    str = " update raaz_orderdetail SET view=" + obj.views + ",status='finished',sitestatus=6 where bannerid is null and orderdetailid=" +
                        obj.orderdetailid + " ; ";
                    text = varM.msg.finish + utilM.getOrderNumber(obj.orderid, obj.orderdetailid) + "\r\nکانال : @" + obj.channelTag +
                        "\r\nعنوان :  " + obj.title +
                        "\r\nویو ثبت شده : " + obj.views + "\r\nچگونگی درج تبلیغ : " + utilM.getType(obj.status) +
                        "\r\nدرآمد حاصل :" + obj.price+ " تومان 💰 " ;
                        // "\r\nدرآمد حاصل :" + ((obj.price * obj.views) / kilo).toFixed(0) + " تومان 💰 " ;
                    msg = {
                        chatid: obj.chatid,
                        text: text
                    };
                    //  console.dir(JSON.stringify(msgs).indexOf(JSON.stringify(msg)))
                    if (JSON.stringify(msgs).indexOf(JSON.stringify(msg)) == -1) {
                        msgs.push(msg)
                    }
                    if (query.indexOf(str) == -1) {
                        query += str;
                    }
                }
                else {
                    this.rdate=utilM.getRCronTime(new Date())
                    crontime="";
                  //  console.log(this.rdate,obj.crontime)
                    if (obj.views >= obj.ordercount * 0.95&&(this.rdate>obj.crontime||!obj.crontime||obj.crondata=='undefined'||obj.crondata=='null'||obj.crondata=='NULL')) {
                        this.ndate=utilM.getCronTime(new Date().setSeconds(new Date().getSeconds() + (0.10 * hour)))
                        crontime=" , crontime='"+this.ndate+"' ";
                        msg = {
                            chatid: obj.chatid,
                            text: varM.msg.finshing + "\r\nتگ کانال : @" + obj.channelTag + utilM.getOrderNumber(obj.orderid, obj.orderdetailid)
                        };
                        if (JSON.stringify(msgs).indexOf(JSON.stringify(msg)) == -1) {
                            msgs.push(msg)
                        }
                    }
                    str = " update raaz_orderdetail SET view=" + obj.views + crontime+" where bannerid is null and orderdetailid=" + obj.orderdetailid + " ; ";
                    if (query.indexOf(str) == -1) {
                        query += str;
                    }
                }
            }
        }
        var msgsvip=msgs;
        // console.log("msgsvip",msgsvip);
// return;
//         query="select 1;"
        new exeqM.exec(query, function (err, results) {
            msgadmin=[];
            tmp=null;
            tmps=JSON.parse(JSON.stringify(msgsvip));
            for(vi=0;vi<tmps.length;vi++){
                for(jv=0;jv<admins.length;jv++){
                    tmp=JSON.parse(JSON.stringify(tmps[vi]));
                    tmp.chatid=admins[jv].id;
                    tmp.text=tmp.text.replace(varM.msg.finish,'');
                    msgadmin.push(tmp);
                }
            }
            // console.log("msgadmin",msgadmin);
            // console.log("msgsvip",msgsvip);
            //     return;
            if(msgadmin&&msgadmin.length>0)
                new autilM.sendBulkAdmin(msgadmin)
            if(msgsvip&&msgsvip.length>0)
                new autilM.sendBulk(msgsvip)

        })
        // console.log(query, msgs);
    },
    iupdateViews: function (mass) {
        query="";
        msgs=[];
        selectQueries=[];
        mass.sortOn('orderdetailid');
        orders=[];
        for(ui=0;ui<mass.length;ui++) {
            if (mass[ui].status != 'banner') {
                banners = mass.searchObjects('postlink', mass[ui].postlink);
                reply = banners.searchObject('status', 'reply');
                sticker = banners.searchObject('status', 'sticker');
                banner = mass.searchObjects('orderdetailid', mass[ui].orderdetailid).searchObject('status', 'banner');
                obj = null;

                if (reply && reply.views > 0&&reply.views>sticker.views) {
                    obj = reply
                }
                else if (sticker && sticker.views > 0) {
                    obj = sticker
                }

                if (banner && obj && obj.views > 0) {
                    banner.massview = parseInt(banner.views - banner.initview);

                    // console.log(banner, banner.massview, banner.ordercount*kilo)
                    // return;
                    if (banner.massview >= banner.ordercount*kilo||obj.adminop=="cancel"||obj.adminop=="finish") {
                        //console.log("orderdetailid]",orders);

                        if(!orders.searchObject('orderdetailid',obj.orderdetailid)){
                          //  console.log("!orders[obj.orderdetailid]");
                            orders.push({
                                orderdetailid:obj.orderdetailid,
                                tags:[{view:obj.views,tag:obj.channelTag,price:obj.price,
                                    cost:Math.floor((obj.price*obj.views)/kilo),otherchannels:obj.otherchannels}],
                                sumview:obj.views,
                                totalview:banner.views,
                                initview: banner.initview,
                                massview: banner.massview,
                                orderid: banner.orderid,
                                suborderid: banner.orderdetailid,
                                otherchannels: obj.otherchannels,
                                })
                        }
                        else if(!orders.searchObject('orderdetailid',obj.orderdetailid).tags.
                            searchObject('tag',obj.channelTag)){
                           // console.log("!!!!!!orders[obj.orderdetailid]");
                            orders[orders.length-1].tags.push({view:obj.views,tag:obj.channelTag,price:obj.price,
                                cost:Math.floor((obj.price*obj.views)/kilo),otherchannels:obj.otherchannels});
                            orders[orders.length-1].sumview=orders.searchObject('orderdetailid',obj.orderdetailid).sumview+obj.views;
                            orders[orders.length-1].totalview=banner.views;
                            orders[orders.length-1].initview=banner.initview;
                            orders[orders.length-1].massview=banner.massview;
                            orders[orders.length-1].orderid=banner.orderid;
                            orders[orders.length-1].suborderid=banner.orderdetailid;
                            // orders[orders.length-1].otherchannels=obj.otherchannels;
                        }

                        text = varM.msg.finish + utilM.getOrderNumber(obj.orderid, obj.orderdetailid) + "\r\nکانال : @" + obj.channelTag +
                            "\r\nعنوان :  " + obj.title +
                            "\r\nویو ثبت شده : " + obj.views + "\r\nچگونگی درج تبلیغ : " + utilM.getType(obj.status) + "\r\n"+
                            "درآمد حاصل :" + ((obj.price * obj.views) / kilo).toFixed(0) + " تومان 💰 " + "\r\n";
                        msg = {
                            chatid: obj.chatid,
                            text: text
                        };
                        if (JSON.stringify(msgs).indexOf(JSON.stringify(msg)) == -1) {
                            msgs.push(msg)
                        }
                        if(sticker) {
                            str = " update raaz_orderdetail SET view=" + sticker.views + ",status='finished' where productid is null and bannerid=" +
                                sticker.bannerid + " ; ";
                            if (query.indexOf(str) == -1) {
                                query += str;
                            }
                        }
                        if(reply) {
                            str = " update raaz_orderdetail SET view=" + reply.views + ",status='finished' where productid is null and bannerid=" +
                                reply.bannerid + " ; ";
                            if (query.indexOf(str) == -1) {
                                query += str;
                            }
                        }
                        str = " update raaz_ordercategorydetail SET view=" + banner.massview + ",status='finished',sitestatus=6  where orderCategoryDetailId=" + banner.orderdetailid + " ; ";
                        if (query.indexOf(str) == -1) {
                            query += str;
                        }
                    }
                    else if(banner){
                        crondata = cutilM.getStatus(banner.crondata, banner.massview, banner.ordercount*kilo);
                       // console.log("crondata",crondata)
                       //  return;
                        if ((!crondata || crondata < 100)){
                            if (crondata||!banner.crondata||banner.crondata=='undefined'||banner.crondata=='null'||banner.crondata=='NULL') {
                                crondatasql = "crondata='" + crondata + "',";
                            }
                            else {
                                crondatasql = "";
                            }
                        }
                        if (crondata && crondata <= 50) {
                            selectQuery={type:'reminds',id:banner.orderdetailid};
                            if(JSON.stringify( selectQueries).indexOf(JSON.stringify(selectQuery))==-1)
                                selectQueries.push(selectQuery)
                        }
                        if (crondata && crondata > 50 && crondata < 100) {
                            selectQuery={type:'contributors',id:banner.orderdetailid};
                            if(JSON.stringify( selectQueries).indexOf(JSON.stringify(selectQuery))==-1)
                                selectQueries.push(selectQuery)
                        }
                        str = "  update raaz_ordercategorydetail SET "+crondatasql+"view=" +banner.massview +
                            " where  orderCategoryDetailId=" + banner.orderdetailid + " ; ";
                        if (query.indexOf(str) == -1) {
                            query += str;
                        }
                    }
                }
            }
            else {
                crondatasql="";
                banners = mass.searchObjects('postlink', mass[ui].postlink);
                banner = mass.searchObjects('orderdetailid', mass[ui].orderdetailid).searchObject('status', 'banner');
                banner.massview = parseInt(banner.views - banner.initview);
                crondata = cutilM.getStatus(banner.crondata, banner.massview, banner.ordercount*kilo);
                // console.log("crondata",crondata,banner.crondata, banner.massview, banner.ordercount*kilo)
                // return;
                if ((!crondata || crondata < 100)){
                    if (crondata||!banner.crondata||banner.crondata=='undefined'||banner.crondata=='null'||banner.crondata=='NULL') {
                        crondatasql = "crondata='" + crondata + "',";
                    }
                    else {
                        crondatasql = "";
                    }
                }
                if (crondata && crondata <= 50) {
                    selectQuery={type:'reminds',id:banner.orderdetailid};
                    if(JSON.stringify( selectQueries).indexOf(JSON.stringify(selectQuery))==-1)
                        selectQueries.push(selectQuery)
                }
                if (crondata && crondata > 50 && crondata < 100) {
                    selectQuery={type:'contributors',id:banner.orderdetailid};
                    if(JSON.stringify( selectQueries).indexOf(JSON.stringify(selectQuery))==-1)
                        selectQueries.push(selectQuery)
                }
                str = "  update raaz_ordercategorydetail SET "+crondatasql+"view=" +banner.massview +
                    " where  orderCategoryDetailId=" + banner.orderdetailid + " ; ";
                if (query.indexOf(str) == -1) {
                    query += str;
                }
            }
        }
        if(msgs.length>0){
            new autilM.sendBulk(msgs)
        }
        // if(orders.length>0)
        //     console.log(orders[orders.length-1].tags);
        // return;

        if(orders.length>0){
            // console.log(orders[orders.length-1].tags);
            excel=[];
            for(i=0;i<orders.length;i++){
                excel=[];
                if(orders[i]&&orders[i].orderid) {
                    this.finalText = varM.msg.finish + utilM.getOrderNumber(orders[i].orderid, orders[i].suborderid) + "\r\nکانال ها :\r\n";
                    for (j = 0; j < orders[i].tags.length; j++) {
                        this.finalText += "@" + orders[i].tags[j].tag + " -- " + orders[i].tags[j].view + "\r\n"
                        excel.push({
                            tag: orders[i].tags[j].tag,
                            view: orders[i].tags[j].view,
                            price: orders[i].tags[j].price,
                            cost: orders[i].tags[j].cost,
                            otherchannels: orders[i].tags[j].otherchannels,
                            otherchannels: orders[i].tags[j].otherchannels,
                            ordernumber: utilM.getOrderJustNumber(orders[i].orderid, orders[i].suborderid),
                        })
                    }
                    this.finalText += "\r\nویو ثبت شده : " + orders[i].massview;
                    this.finalText += "\r\nویو شات : " + orders[i].sumview;
                    this.finalText += "\r\nویو بنر : " + orders[i].totalview;
                    for (ai = 0; ai < admins.length; ai++) {
                        abot.sendMessage(admins[ai].id, this.finalText)
                    }
                }
                //console.log(excel)

                if(excel.length>0) {
                    var csv = json2csv({data: excel, fields:Object.keys(excel[0])});
                    filename=rootPath + "reposts/final report "+excel[0].ordernumber+".csv".replace('#','');
                    // console.log(filename);
                    fs.writeFileSync(filename,csv);
                    for (ai = 0; ai < admins.length; ai++) {
                        abot.sendDocument(admins[ai].id, filename);
                    }
                }
            }

        }
        //return;
        var contids=[];
        var remindids=[];
        for(si=0;si<selectQueries.length;si++){
            if(selectQueries[si].type=="contributors"){
                contids.push(selectQueries[si].id)
            }
            else if(selectQueries[si].type=="reminds"){
                remindids.push(selectQueries[si].id)
            }

        }
        //query="select 1;";
        if (remindids.length>0) {
            query += " SELECT * FROM `view_iremind` where  orderCategoryDetailId in (" + remindids.join(",") + ") group by orderCategoryDetailId,TelegramId;";
        }
        if (contids.length>0) {
            query += " SELECT * FROM `view_icontributors` where   orderCategoryDetailId in (" + contids.join(",") + ") group by orderCategoryDetailId,TelegramId;";
        }
       // console.log(query);
       //  return;
        new exeqM.exec(query, function (err, results) {
            //console.log(results)
            if(!err&&results.length>0) {
                msgs=[];
                if (remindids.length > 0) {
                    if (contids.length > 0)
                        reminds = results[results.length-2];
                    else
                        reminds = results[results.length-1];
                    this.msg = varM.msg.reminderinprogress;
                    for(ri=0;ri<reminds.length;ri++){
                        this.btns = [];
                        this.btns.push([bot.inlineButton(reminds[ri].orderCount + " - " + reminds[ri].TelegramId,
                            {callback: "io-" + reminds[ri].orderCategoryDetailId + "-" + reminds[ri].TelegramId + "-" + new Date(reminds[ri].performDate).getTime()})]);
                        this.btns = bot.inlineKeyboard(this.btns)
                        msgs.push({
                            chatid: reminds[ri].chatid,
                            tag:reminds[ri].TelegramId,
                            text: this.msg + "\r\nتگ کانال :@" + reminds[ri].TelegramId +utilM.getOrderNumber(reminds[ri].orderid,reminds[ri].orderCategoryDetailId)
                            +((reminds[ri].ordertitle && reminds[ri].ordertitle != 'undefiend') ?(" عنوان : "+reminds[ri].ordertitle + "\r\n"):""),
                            replyMarkup: this.btns
                        })
                    }
                }
                if (contids.length > 0) {
                    conts = results[results.length-1];
                    this.msg = varM.msg.finish;
                    for (ii = 0; ii < conts.length; ii++) {
                        msgs.push({
                            chatid:conts[ii].chatid,
                            tag:conts[ii].TelegramId,
                            text: this.msg + "\r\nتگ کانال :@" + conts[ii].TelegramId +utilM.getOrderNumber(conts[ii].orderid,conts[ii].orderCategoryDetailId)
                            +((conts[ii].ordertitle && conts[ii].ordertitle != 'undefiend') ?(" عنوان : "+ conts[ii].ordertitle + "\r\n"):"")
                        })
                    }
                }
            }
            //console.log(msgs)
            if(msgs&&msgs.length>0){
                msg={
                    from:{
                        id:admins[0].id
                    }
                }

                new autilM.sendBulk(msgs,msg)
            }
        })
    }
}