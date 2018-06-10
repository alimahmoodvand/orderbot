/**
 * Created by ali on 8/8/17.
 */
module.exports= {
    setOrders: function (msg, orderid, premsg) {
        this.query = " SELECT * FROM view_integrate where  orderid=" + orderid +
            "  and sitestatus=3 and ((status!='adminpassed' and status!='ya' and status!='finished')or status is null) group by orderid,orderCategoryDetailId  order by performDate desc;";
        this.query += " select * from view_product where " +
            " sitestatus=3  and orderid=" + orderid + " and ((status!='adminpassed' and status!='finished') or status is null)  order by performDate desc ;";
       // console.log(this.query)
        new exeqM.exec(this.query, function (err, data) {
            this.btns = [];
            for (i = 0; i < data[0].length; i++) {
                this.btns.push([
                    abot.inlineButton("ست کردن بنر انبوه - " + data[0][i].orderCount + "k-" + data[0][i].ChannelCategoryTitle+"-"+data[0][i].orderCategoryDetailId,
                    {callback: "io-" + data[0][i].orderCategoryDetailId}),
                    abot.inlineButton("ارسال پیام انبوه - " + data[0][i].orderCount + "-" + data[0][i].ChannelCategoryTitle+"-"+data[0][i].orderCategoryDetailId,
                        {callback: "imsgo-" + data[0][i].orderCategoryDetailId})
                ]);
            }
            for (i = 0; i < data[1].length; i++) {
                this.btns.push([
                    abot.inlineButton("ست کردن بنر ویژه - " + data[1][i].viewCount + "k-" + data[1][i].channelTag.trim()+"-"+data[1][i].orderdetailid,
                    {callback: "po-" + data[1][i].orderdetailid}),
                    abot.inlineButton("ارسال پیام ویژه - " + data[1][i].viewCount + "-" + data[1][i].channelTag.trim()+"-"+data[1][i].orderdetailid,
                        {callback: "pmsgo-" + data[1][i].orderdetailid}),
                ]);
            }
            this.btns = abot.inlineKeyboard(this.btns)
            abot.sendMessage(msg.from.id, (premsg ? premsg : "all sub orders ") + utilM.getOrderNumber(orderid), {replyMarkup: this.btns})
                .then(function (ilk) {
                    fs.writeFileSync(chatpath+msg.from.id, ilk.result.message_id, 'utf8')
                })
        })
    },
    setAllOrders: function (msg) {
        this.query = " SELECT * FROM raaz_order where (status=2 and subOrdersConfirmedCount>0) or status=3  ;";
        new exeqM.exec(this.query, function (err, data) {
          //  console.log(data)
            this.btns = [];
            for (i = 0; i < data.length; i++) {
                this.btns.push([abot.inlineButton("#" + data[i].orderid,
                    {callback: "order-" + data[i].orderid})]);
            }
            this.btns = abot.inlineKeyboard(this.btns)
            abot.sendMessage(msg.from.id," all oreders ", {replyMarkup: this.btns})
                .then(function (ilk) {
                    fs.writeFileSync(chatpath+msg.from.id, ilk.result.message_id, 'utf8')
                })
        })
    },
    fetchInfo: function (msg,cb) {
        this.obj = {};
        if (msg.forward_from_chat) {
            this.obj.from = msg['forward_from_chat'].id;
            this.obj.postlink = msg['forward_from_chat'].username;
            this.obj.msgid = msg.forward_from_message_id;
            this.obj.date = msg.date;
        }
        else {
            this.obj.from = msg.from.id;
            this.obj.msgid = msg.message_id;
            this.obj.postlink = originalchannel.tag.replace(/@/gi, '');
            this.obj.date = msg.date;
        }
        if (msg.photo) {
            this.obj.type = "photo";
            this.obj.link = msg.photo[3] ?
                (msg.photo[3]['file_id']) :
                (msg.photo[2] ?
                    (msg.photo[2]['file_id']) :
                    (msg.photo[1] ?
                        (msg.photo[1]['file_id']) :
                        (msg.photo[0]['file_id'])))
            this.obj.text = msg.caption

        }
        else if (msg.audio) {
            this.obj.type = "audio";
            this.obj.link = msg.audio['file_id'];
            // fs.writeFileSync(filename,msg.caption);
            this.obj.text = msg.caption;
        }
        else if (msg.video) {
            this.obj.type = "video";
            this.obj.link = msg.video['file_id'];
            //fs.writeFileSync(filename,msg.caption);
            this.obj.text = msg.caption;
        }
        else if (msg.document) {
            this.obj.type = "document";
            this.obj.link = msg.document['file_id'];
            // this.obj.fname=msg.document['file_name']
            //fs.writeFileSync(filename,msg.caption);
            this.obj.text = msg.caption;
        }
        else if (msg.text) {
            this.obj.type = "text";
            this.obj.link = '';
            //fs.writeFileSync(filename,text);
            this.obj.text = msg.text;
            //console.log(msg);
                
        }
        if(this.obj.text&&msg.entities){
            this.obj.text=autilM.getHyperLink(this.obj.text,msg.entities);
            //    return
        }
      //https://t.me/testviewchannel/745
        if(msg.text&&msg.text.trim().indexOf("https://t.me/")==0){
          pars=msg.text.trim().replace('https://t.me/','');
          tempobj=JSON.stringify(this.obj)
          pars=pars.split('/');
          this.obj.from = forwardchannel.id;
          this.obj.msgid = pars[1];
          this.obj.mainchannel = pars[2];
          this.obj.postlink =forwardchannel.tag.replace("@","")
          this.obj.date = msg.date;
          this.obj.type = "text";
          this.obj.link = '';
          this.obj.text =msg.text;
          // //fs.writeFileSync(filename,text);
          // this.obj.forwarded={
          //   from:forwardchannel.id
          // postlink:forwardchannel.tag.replace("@",""),
          //   msgid:pars[1]
          // }
        }
        // else if(this.obj.text&&urls=this.obj.text.match(/\bhttps?:\/\/\S+/gi)){
        //    // https://t.me/joinchat/AAAAAEHgwgYWBrgHhwevKg
        // }
        // data=this.obj;
       new reqhM.getMessageInfo(this.obj,function (err,data) {
           // console.log(data);
           // return;
               
          //  abot.getChatMembersCount(data.fromid).then(function (members) {
          //     // console.log(info)
          //      if(members.ok&&members.result){
          //          data.membercount=members.result
          //      }
          //      else{
          //          data.membercount=-1;
          //      }
          // if(data.link&&false)
          // {
          // abot.getFile(data.link).then(function (info) {
          //     data.fileUrl = "https://api.telegram.org/file/bot" + atoken + "/" + info['file_path'];
          //     data.fileName="img/"+randomstring.generate({length: 40,charset: 'alphanumeric'})+path.extname(data.fileUrl);
          //     console.log(data.fileUrl ,data.fileName,info)
          //
          //     new autilM.download(data.fileUrl, data.fileName, function () {
          //        data.link=data.fileName;
          //       cb(data);
          //     })
          //   })
          // }
          // else{
          //   cb(data);
          // }
          //  }).catch(err=>{
          //          data.membercount=-1;
          //      if(data.link&&false)
          //      {
          //          abot.getFile(data.link).then(function (info) {
          //              data.fileUrl = "https://api.telegram.org/file/bot" + atoken + "/" + info['file_path'];
          //              data.fileName="img/"+randomstring.generate({length: 40,charset: 'alphanumeric'})+path.extname(data.fileUrl);
          //              console.log(data.fileUrl ,data.fileName,info)
          //
          //              new autilM.download(data.fileUrl, data.fileName, function () {
          //                  data.link=data.fileName;
          //                  cb(data);
          //              })
          //          })
          //      }
          //      else{
          //          cb(data);
          //      }
          //      console.log(err)
          //  })
           cb(data);
        })
    },
    getHyperLink:function (text,ent) {
        txtlen=text.length;
        parts=[];
        lastoffset=0;
        for(ie=0;ie<ent.length;ie++){
            if(ent[ie].type=='text_link'){
                parts.push({
                    text:text.substring(lastoffset,ent[ie].offset),
                    type:"text"
                })
                parts.push({
                    text:text.substring(ent[ie].offset,ent[ie].offset+ent[ie].length),
                    type:"link",
                    url:ent[ie].url
                })
                lastoffset=ent[ie].offset+ent[ie].length;
            }
        }
        parts.push({
            text:text.substring(lastoffset),
            type:"text"
        })
        if(parts.length==0){
            return text;
        }
        res="";
        for(pi=0;pi<parts.length;pi++) {
            if(parts[pi].type=="text"){
                res+=parts[pi].text;
            }
            if(parts[pi].type=="link") {
                res+='<a href="' + parts[pi].url + '">' + parts[pi].text + '</a>';
            }
        }
        return res;
    },
    download :function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      // console.log('content-type:', res.headers['content-type']);
      // console.log('content-length:', res.headers['content-length']);
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  },
    updatemessage: function (chatId, messageId, text, markup) {
        // abot.editText(
        //     { chatId, messageId }, text,
        //     {markup}
        // ).catch(function(error){ console.log('Error:', error)});
    },
    bulkMessage: function (orderdetailid,premsg) {
        this.query = "SELECT * FROM view_orders where status='adminpassed'   and  orderdetailid='" + orderdetailid + "' limit 1;";
        exeqM.exec(this.query, function (err, data) {
            if (data && data.length == 1) {
                this.btns = [];
                this.btns.push([bot.inlineButton("ویژه -" + data[0].view+"k" + " - " + data[0].telegramid,
                    {callback: "po-" + data[0].orderdetailid + "-" + data[0].telegramid+"-"+new Date(data[0].performDate).getTime()})]);
                this.btns = bot.inlineKeyboard(this.btns)
                if(!premsg) {
                    if (new Date(data[0].performDate) < new Date().getLocal()) {
                        premsg=varM.msg.neworder
                    }
                    else{
                        premsg=varM.msg.orderchannel
                    }
                }
                bot.sendMessage(data[0].chatid,
                    premsg.replace("~channelname", ": @" + data[0].telegramid)
                        .replace("~channelname", ": @" + data[0].telegramid)
                        .replace("~ordernumber",utilM.getOrderNumber(data[0].orderid,data[0].orderdetailid))
                        .replace("~ordercount", ": " + data[0].view)
                    +"\r\nعنوان : "+data[0].title
                    , {replyMarkup: this.btns})
                    .then(function (ilk) {
                        fs.writeFileSync(chatpath+data[0].chatid, ilk.result.message_id, 'utf8')
                    })
            }
        })
    },
    cancelBulkMessage: function (orderid, msg) {
        this.query = "SELECT * FROM view_orders where adminop='cancel'   and  orderdetailid='" + orderid + "' limit 1;";
        exeqM.exec(this.query, function (err, data) {
            if (data && data.length == 1)
                bot.sendMessage(data[0].chatid, msg + "\r\nتگ کانال :@" + data[0].telegramid + utilM.getOrderNumber(data[0].orderid,data[0].orderdetailid))
        })
    },
    porderBulkMessage: function (orderid, msg) {
        this.query = "SELECT * FROM view_orders where orderdetailid='" + orderid + "' limit 1;";
        exeqM.exec(this.query, function (err, data) {
            if (data && data.length == 1)
                bot.sendMessage(data[0].chatid, msg + "\r\nتگ کانال :@" + data[0].telegramid + utilM.getOrderNumber(data[0].orderid,data[0].orderdetailid))
        })
    },
    icancelBulkMessage: function (orderCategoryDetailId, msg) {
        // this.query = "SELECT * FROM `view_iorders` WHERE   chatid is not null and adminop='cancel' and orderCategoryDetailId=" +
        //     orderCategoryDetailId + " group by orderCategoryDetailId,TelegramId";
        this.query= " SELECT * FROM `view_icontributors` where chatid is not null and adminop='cancel' and orderCategoryDetailId=" +
            orderCategoryDetailId + " group by categoryId,TelegramId;";

       new exeqM.exec(this.query, function (err, data) {
            if (data && data.length > 0) {
                this.msgs = [];
                for (ii = 0; ii < data.length; ii++) {
                    this.msgs.push({
                        chatid: data[ii].chatid,
                        text: msg + "\r\nتگ کانال :@" + data[ii].TelegramId + utilM.getOrderNumber(data[ii].orderid,orderCategoryDetailId)
                    })
                }
                new autilM.sendBulk(this.msgs)
            }
        })
    },
    icurDoneBulkMessage: function (orderCategoryDetailId, msg) {
        // this.query = "SELECT * FROM `view_iorders` WHERE   chatid is not null and adminop='cancel' and orderCategoryDetailId=" +
        //     orderCategoryDetailId + " group by orderCategoryDetailId,TelegramId";
        this.query= " SELECT * FROM `view_icontributors` where chatid is not null and orderCategoryDetailId=" +
            orderCategoryDetailId + " group by categoryId,TelegramId;";
        new exeqM.exec(this.query, function (err, data) {
            if (data && data.length > 0) {
                this.msgs = [];
                for (ii = 0; ii < data.length; ii++) {
                    this.msgs.push({
                        chatid: data[ii].chatid,
                        text: msg + "\r\nتگ کانال :@" + data[ii].TelegramId + utilM.getOrderNumber(data[ii].orderid,orderCategoryDetailId)
                    })
                }
                new autilM.sendBulk(this.msgs)
            }
        })
    },
    icurAllBulkMessage: function (orderCategoryDetailId, msg) {
        // this.query = "SELECT * FROM `view_iorders` WHERE   chatid is not null and adminop='cancel' and orderCategoryDetailId=" +
        //     orderCategoryDetailId + " group by orderCategoryDetailId,TelegramId";
        this.query = "SELECT * FROM `view_iorders` WHERE chatid is not null and orderCategoryDetailId=" +
            orderCategoryDetailId + " group by orderCategoryDetailId,TelegramId";

        new exeqM.exec(this.query, function (err, data) {
            if (data && data.length > 0) {
                this.msgs = [];
                for (ii = 0; ii < data.length; ii++) {
                    this.msgs.push({
                        chatid: data[ii].chatid,
                        text: msg + "\r\nتگ کانال :@" + data[ii].TelegramId + utilM.getOrderNumber(data[ii].orderid,orderCategoryDetailId)
                    })
                }
                new autilM.sendBulk(this.msgs)
            }
        })
    },
    allBulkMessage: function (msg) {
        // this.query = "SELECT * FROM `view_iorders` WHERE   chatid is not null and adminop='cancel' and orderCategoryDetailId=" +
        //     orderCategoryDetailId + " group by orderCategoryDetailId,TelegramId";
        this.query = "SELECT `chatid` FROM channelscopy WHERE chatid is not null and `Register`=1  GROUP by chatid";

        new exeqM.exec(this.query, function (err, data) {
            if (data && data.length > 0) {
                this.msgs = [];
                for (ii = 0; ii < data.length; ii++) {
                    this.msgs.push({
                        chatid: data[ii].chatid,
                        text: msg
                    })
                }
                new autilM.sendBulk(this.msgs)
            }
        })
    },
    ibulkMessage: function (orderCategoryDetailId,msg) {
        this.query = "SELECT * FROM `view_iorders` WHERE chatid is not null and orderCategoryDetailId=" +
            orderCategoryDetailId + " group by orderCategoryDetailId,TelegramId";
        exeqM.exec(this.query, function (err, data) {
            if (data && data.length > 0) {
                this.msgs = [];
                this.btns = [];

                for (ii = 0; ii < data.length; ii++) {
                    this.btns = [];
                    this.btns.push([bot.inlineButton(data[ii].orderCount + "k-" + data[ii].TelegramId,
                        {callback: "io-" + data[ii].orderCategoryDetailId + "-" + data[ii].TelegramId+"-"+new Date(data[ii].performDate).getTime()})]);
                    this.btns = bot.inlineKeyboard(this.btns)
                        if (new Date(data[ii].performDate) < new Date().getLocal()) {
                            premsg=varM.msg.neworder
                        }
                        else{
                            premsg=varM.msg.orderchannel
                        }
                    this.msgs.push({
                        chatid: data[ii].chatid,
                        tag: data[ii].TelegramId,
                        text: premsg
                            .replace("~ordernumber",utilM.getOrderNumber(data[ii].orderid,data[ii].orderCategoryDetailId)
                            +((data[ii].title && data[ii].title != 'undefiend') ?(" عنوان : "+ data[ii].title + "\r\n"):""))
                            .replace("~ordercount", ": " + data[ii].orderCount)
                            .replace("~ordercat", ": " + data[ii].ChannelCategoryTitle)
                            .replace("~channelname", "@" + data[ii].TelegramId),
                        replyMarkup: this.btns
                    })
                }
                new autilM.sendBulk(this.msgs,msg)
            }
        })
    },
    sendBulk: function (msgs,msg) {
       console.log("sendBulk",msgs);

        this.promises = [];
        for (bi = 0; bi < msgs.length; bi++) {
            this.promises.push(autilM.sendMessage(msgs[bi]))
        }
        Promise.all(this.promises).then(function (data) {
             console.log(msgs)
            if(msg&&msg.from){
                rejectlist="Error list \r\n";
                for(di=0;di<data.length;di++){
                    if(!data[di].result){
                        rejectlist+="@"+msgs[di].tag+"  **  ";
                        if(di!=0&&di%2==0){
                            rejectlist+="\r\n"
                        }
                    }
                }
                abot.sendMessage(msg.from.id,rejectlist)
            }
        })
    },
    sendBulkAdmin: function (msgs,msg) {
      //  console.log("sendBulkAdmin",msgs);
            
        this.promises = [];
        for (bi = 0; bi < msgs.length; bi++) {
            this.promises.push(autilM.sendMessageAdmin(msgs[bi]))
        }
        Promise.all(this.promises).then(function (data) {
            // console.log(data)
            // if(msg&&msg.from){
            //     rejectlist="Error list \r\n";
            //     for(di=0;di<data.length;di++){
            //         if(!data[di].result){
            //             rejectlist+="@"+msgs[di].tag+"  **  ";
            //             if(di!=0&&di%2==0){
            //                 rejectlist+="\r\n"
            //             }
            //         }
            //     }
            //     abot.sendMessage(msg.from.id,rejectlist)
            // }
        })
    },
    sendMessage: function (msg) {
        return new Promise(function (resolve, reject) {
            bot.sendMessage(msg.chatid, msg.text, {replyMarkup: msg.replyMarkup}).then(function (res) {
                fs.writeFileSync(chatpath+msg.chatid, res.result.message_id, 'utf8')
                resolve(res);
            }).catch(function (err) {
                //console.log(err.message)
                resolve(err);
            })
        })

    },
    sendMessageAdmin: function (msg) {
        return new Promise(function (resolve, reject) {
            abot.sendMessage(msg.chatid, msg.text, {replyMarkup: msg.replyMarkup}).then(function (res) {
                fs.writeFileSync(chatpath+msg.chatid, res.result.message_id, 'utf8')
                resolve(res);
            }).catch(function (err) {
                console.log(err.message)

                resolve(err);
            })
        })

    },
    getAllOrders: function (msg, orderid) {
        this.query = " SELECT * FROM view_integrate where " +
            "  (status='ya' or status='adminpassed') and adminop is null group by orderid,orderCategoryDetailId;";
        this.query += " select * from view_product where "  +
            " ( status='ya' or status like '%later%' or status='adminpassed')  and adminop is null ;";
        new exeqM.exec(this.query, function (err, data) {
            this.btns = [];
            this.oids=[];
            for (i = 0; i < data[0].length; i++) {
                if(oids.indexOf(data[0][i].orderid)==-1){
                    oids.push(data[0][i].orderid);
                }
            }
            for (i = 0; i < data[1].length; i++) {
                if(oids.indexOf(data[1][i].orderid)==-1){
                    oids.push(data[1][i].orderid);
                }
            }
            for (i = 0; i < oids.length; i++) {
                this.btns.push([abot.inlineButton("#" + oids[i],
                    {callback: "curorders-" + oids[i]})]);
            }
            this.btns = abot.inlineKeyboard(this.btns);
            abot.sendMessage(msg.from.id, "All current orders", {replyMarkup: this.btns})
                .then(function (ilk) {
                    try{
                        fs.writeFileSync(chatpath+msg.from.id, ilk.result.message_id, 'utf8')}
                    catch (err){
                        console.log(chatpath+msg.from.id,err)
                    }
                })
        })
    },
    getOrders: function (msg, orderid) {
        this.query = " SELECT * FROM view_integrate where orderid=" + orderid +
            "  and ( status='ya' or status='adminpassed') and adminop is null group by orderid,orderCategoryDetailId;";
        this.query += " select * from view_product where orderid=" + orderid +
          " and ( status='ya' or status like '%later%' or status='adminpassed')  and adminop is null ;";
        new exeqM.exec(this.query, function (err, data) {


            this.btns = [];
            // for (i = 0; i < data[0].length; i++) {
            //     this.btns.push([abot.inlineButton(data[0][i].orderCount + " - " + data[0][i].ChannelCategoryTitle,
            //         {callback: "icl-" + data[0][i].orderCategoryDetailId})]);
            // }
            // for (i = 0; i < data[1].length; i++) {
            //     this.btns.push([abot.inlineButton(data[1][i].viewCount + " - " + data[1][i].channelTag.trim(),
            //         {callback: "cl-" + data[1][i].orderdetailid})]);
            // }
            for (i = 0; i < data[0].length; i++) {
                this.btns.push([abot.inlineButton(data[0][i].orderCategoryDetailId + "-" +data[0][i].orderCount + "k-"+
                    (data[0][i].status=="adminpassed"?"bannerset":"running"),
                    {callback: "isubcurorders-" + data[0][i].orderCategoryDetailId+"-"+data[0][i].orderid})]);
            }
            for (i = 0; i < data[1].length; i++) {
                this.btns.push([abot.inlineButton(data[1][i].orderdetailid + "-" +data[1][i].viewCount + "k-" + data[1][i].channelTag.trim()+"-"+
                    (data[1][i].status=="adminpassed"?"bannerset":"running"),
                    {callback: "subcurorders-" + data[1][i].orderdetailid+"-"+data[1][i].orderid})]);
            }
            this.btns = abot.inlineKeyboard(this.btns);
            abot.sendMessage(msg.from.id, utilM.getOrderNumber(orderid), {replyMarkup: this.btns})
                .then(function (ilk) {
                    try{
                    fs.writeFileSync(chatpath+msg.from.id, ilk.result.message_id, 'utf8')}
                    catch (err){
                        console.log(chatpath+msg.from.id,err)
                    }
                })
        })
    },
    isubOrderOperators: function (msg,suborderid, orderid) {
        this.query=" SELECT count(TelegramId) cnt FROM `view_icontributors` where  orderCategoryDetailId="+suborderid+" group by TelegramId order by TelegramId;";
        new exeqM.exec(this.query,function (err,result) {
            this.btns = [];
            this.btn=[];
            if(!err&&result&&result.length>0) {
                // result= result.concat(JSON.parse(JSON.stringify(result)))
                // result=result.concat(JSON.parse(JSON.stringify(result)))
                // result=result.concat(JSON.parse(JSON.stringify(result)))
                //console.log(result.length);
                    
                limit=0;
                for(ri=0;ri<result.length;ri++){
                    if(ri%(50)==0&&ri>0){
                        floor=Math.floor(limit/result[0].cnt);
                        limit+="-"+parseInt(ri*result[0].cnt);
                        this.btns.push([abot.inlineButton('Check list - '+floor+"-"+ri,
                            {callback: "ilimit-" + suborderid+"-"+limit})]);
                        limit=parseInt(ri*result[0].cnt);
                    }
                }
               // console.log(limit,ri,result[0].cnt);
                    
                if(limit!=parseInt((ri)*result[0].cnt)){

                    floor=Math.floor(limit/result[0].cnt);
                    //console.log(ri,(ri%(50)),ri-50)
                    limit+="-"+parseInt((ri+((((this.btns.length+1)*50)-ri)))*result[0].cnt);
                    this.btns.push([abot.inlineButton('Check list - '+floor+"-"+ri,
                        {callback: "ilimit-" + suborderid+"-"+limit})]);
                    //limit=parseInt(ri*result[0].cnt)+1;
                }
            }
            // console.dir(this.btns);
            // return;

            // console.log(this.btns);
            //     return;
            this.btns.push([abot.inlineButton('Other Channels',
            {callback: "ichnl-" + suborderid})]);
            this.btns.push([abot.inlineButton('Done list',
                {callback: "idone-" + suborderid})]);

            this.btns.push([abot.inlineButton('Cancel order',
                {callback: "icl-" + suborderid})]);
            this.btns.push([abot.inlineButton('Reject list',
                {callback: "ireli-" + suborderid})]);
            this.btns.push([abot.inlineButton('Finish order',
                {callback: "ifinish-" + suborderid})]);
            this.btns.push([abot.inlineButton('Send message to all',
                {callback: "imsgall-" + suborderid})]);
            this.btns.push([abot.inlineButton('Send message to done list',
                {callback: "imsgdone-" + suborderid})]);
            // this.btns.push([abot.inlineButton('Cron time',
            //     {callback: "icrontime-" + suborderid})]);
            this.btns.push([abot.inlineButton('Get member',
                {callback: "imember-" + suborderid})]);
            this.btns = abot.inlineKeyboard(this.btns);
            abot.sendMessage(msg.from.id, utilM.getOrderNumber(orderid, suborderid), {replyMarkup: this.btns})
                .then(function (ilk) {
                    try {
                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                    }
                    catch (err) {
                        console.log(chatpath + msg.from.id, err)
                    }
                })
        })
    },
    subOrderOperators: function (msg,suborderid, orderid) {
        this.btns = [];
        this.btns.push([abot.inlineButton('Check list',
            {callback: "limit-" + suborderid})]);
        this.btns.push([abot.inlineButton('Channels',
            {callback: "chnl-" + suborderid})]);
        // this.btns.push([abot.inlineButton('Done list',
        //     {callback: "done-" + suborderid})]);
        this.btns.push([abot.inlineButton('Cancel order',
            {callback: "cl-" + suborderid})]);
        this.btns.push([abot.inlineButton('Finish order',
            {callback: "finish-" + suborderid})]);
        this.btns.push([abot.inlineButton('Send message',
            {callback: "pmsgo-" + suborderid})]);
        // this.btns.push([abot.inlineButton('Cron time',
        //     {callback: "crontime-" + suborderid})]);
        this.btns.push([abot.inlineButton('Get member',
            {callback: "member-" + suborderid})]);
        this.btns = abot.inlineKeyboard(this.btns);
        abot.sendMessage(msg.from.id,utilM.getOrderNumber(orderid,suborderid), {replyMarkup: this.btns})
            .then(function (ilk) {
                try{
                    fs.writeFileSync(chatpath+msg.from.id, ilk.result.message_id, 'utf8')}
                catch (err){
                    console.log(chatpath+msg.from.id,err)
                }
            })
    },
    getCurrentOrders: function (msg, orderid) {
        this.query = " SELECT * FROM view_integrate where orderid=" + orderid +
            "  and (  status='ya') group by orderid,orderCategoryDetailId;";
        this.query += " select * from view_product where orderid=" + orderid + " and (  status='ya'  ) ;";
      // this.query = "SELECT * FROM view_iorders where orderid=" + orderid + "  and (  status='ya')   group by orderCategoryDetailId,TelegramId; ";
      // this.query += "SELECT * FROM view_orders where orderid=" + orderid + " and (status='ya') ;";
      console.log(this.query)
        new exeqM.exec(this.query, function (err, data) {
            this.btns = [];
            for (i = 0; i < data[0].length; i++) {
                this.btns.push([abot.inlineButton(data[0][i].orderCount + "k-" + data[0][i].ChannelCategoryTitle,
                    {callback: "ilimit-" + data[0][i].orderCategoryDetailId})]);
            }
            for (i = 0; i < data[1].length; i++) {
                this.btns.push([abot.inlineButton(data[1][i].viewCount + "k-" + data[1][i].channelTag.trim(),
                    {callback: "limit-" + data[1][i].orderdetailid})]);
            }
            this.btns = abot.inlineKeyboard(this.btns);
            abot.sendMessage(msg.from.id,utilM.getOrderNumber(orderid), {replyMarkup: this.btns})
                .then(function (ilk) {
                    fs.writeFileSync(chatpath+msg.from.id, ilk.result.message_id, 'utf8')
                })
        })
    },
    getPhotoUrl: function (msg, cb) {
        this.fileid = (msg.photo ? (msg.photo[2] ? msg.photo[2]['file_id'] : msg.photo[1]['file_id']) : msg.document['file_id']);
        abot.sendPhoto(sschannel.id, this.fileid,{caption:varM.msg.bannerSample}).then(function (ilk) {
            cb(ilk.result.message_id)
        })
    }
}
