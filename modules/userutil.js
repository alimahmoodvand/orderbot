/**
 * Created by ali on 8/9/17.
 */
module.exports= {
    getOrders: function (msg) {
        this.query = "SELECT * FROM view_iorders where   performDate>NOW() and status='adminpassed'  and  chatid='" + msg.from.id + "' group by orderCategoryDetailId,TelegramId; ";
        this.query += "SELECT * FROM view_orders where  performDate>NOW() and status='adminpassed'  and  chatid='" + msg.from.id + "';";
        new exeqM.exec(this.query, function (err, orders) {
            this.text = "";
            this.btns = [];
            for (i = 0; i < orders[0].length; i++) {
                this.btns.push([bot.inlineButton("انبوه -" + orders[0][i].orderCount + "k" + " - " + orders[0][i].TelegramId,
                    {callback: "io-" + orders[0][i].orderCategoryDetailId + "-" + orders[0][i].TelegramId + "-" + new Date(orders[0][i].performDate).getLocalTime()})]);
            }
            for (i = 0; i < orders[1].length; i++) {
                this.btns.push([bot.inlineButton("ویژه -" + orders[1][i].view + "k" + " - " + orders[1][i].telegramid,
                    {callback: "po-" + orders[1][i].orderdetailid + "-" + orders[1][i].telegramid + "-" + new Date(orders[1][i].performDate).getLocalTime()})]);
            }
            if (this.btns.length > 0) {
                this.btns = bot.inlineKeyboard(this.btns)

                bot.sendMessage(msg.from.id, varM.msg.orders, {replyMarkup: this.btns})
                    .then(function (ilk) {
                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                    })
            }
            else {
                bot.sendMessage(msg.from.id, varM.msg.notexist.replace('~order', 'بزودی'))
            }
        })
    },
    getCurOrders: function (msg) {
        // this.query = "SELECT * FROM view_iorders where  (status='ya' or status like '%later%')   and  chatid='" + msg.from.id + "' group by orderCategoryDetailId,TelegramId; ";
        // this.query += "SELECT * FROM view_orders where  (status='ya' or status like '%later%')  and  chatid='" + msg.from.id + "';";
        this.query = "  SELECT * FROM `view_iremind` where performDate is not null and status='ya' and chatid='" + msg.from.id + "'   group by orderCategoryDetailId,TelegramId; ";
        this.query += "SELECT * FROM view_orders where  performDate<NOW() and status='adminpassed'  and  chatid='" + msg.from.id + "';";
        console.log(this.query);
        new exeqM.exec(this.query, function (err, orders) {
            this.text = "";
            this.btns = [];
            for (i = 0; i < orders[0].length; i++) {
                this.btns.push([bot.inlineButton("انبوه -" + orders[0][i].orderCount + "k" + " - " + orders[0][i].TelegramId,
                    {callback: "io-" + orders[0][i].orderCategoryDetailId + "-" + orders[0][i].TelegramId + "-" + new Date(orders[0][i].performDate).getLocalTime()})]);
            }
            for (i = 0; i < orders[1].length; i++) {
                this.btns.push([bot.inlineButton("ویژه -" + orders[1][i].view + "k" + " - " + orders[1][i].telegramid,
                    {callback: "po-" + orders[1][i].orderdetailid + "-" + orders[1][i].telegramid + "-" + new Date(orders[1][i].performDate).getLocalTime()})]);
            }
            if (this.btns.length > 0) {
                this.btns = bot.inlineKeyboard(this.btns)
                bot.sendMessage(msg.from.id, varM.msg.orders, {replyMarkup: this.btns})
                    .then(function (ilk) {
                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                    })
            }
            else {
                bot.sendMessage(msg.from.id, varM.msg.notexist.replace('~order', 'جدید'))
            }
        })
    },
    getContOrders: function (msg) {
        // this.query = "SELECT * FROM view_iorders where  (status='ya' or status like '%later%')   and  chatid='" + msg.from.id + "' group by orderCategoryDetailId,TelegramId; ";
        // this.query += "SELECT * FROM view_orders where  (status='ya' or status like '%later%')  and  chatid='" + msg.from.id + "';";
        this.query = "  SELECT * FROM `view_icontributors` where performDate is not null and status='ya' and chatid='" + msg.from.id + "'   group by orderCategoryDetailId,TelegramId; ";
        this.query += " SELECT * FROM view_orders where  performDate<NOW() and status='ya'  and  chatid='" + msg.from.id + "' ;";
        //  console.log(this.query)
        new exeqM.exec(this.query, function (err, orders) {
            this.text = "";
            this.btns = [];
            for (i = 0; i < orders[0].length; i++) {
                this.btns.push([bot.inlineButton("انبوه -" + orders[0][i].orderCount + "k" + " - " + orders[0][i].TelegramId,
                    {callback: "icto-" + orders[0][i].orderCategoryDetailId + "-" + orders[0][i].TelegramId + "-" + new Date(orders[0][i].performDate).getLocalTime()})]);
            }
            for (i = 0; i < orders[1].length; i++) {
                this.btns.push([bot.inlineButton("ویژه -" + orders[1][i].view + "k" + " - " + orders[1][i].telegramid,
                    {callback: "pcto-" + orders[1][i].orderdetailid + "-" + orders[1][i].telegramid + "-" + new Date(orders[1][i].performDate).getLocalTime()})]);
            }
            if (this.btns.length > 0) {

                this.btns = bot.inlineKeyboard(this.btns)
                bot.sendMessage(msg.from.id, varM.msg.orders, {replyMarkup: this.btns})
                    .then(function (ilk) {
                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                    })
            }
            else {
                bot.sendMessage(msg.from.id, varM.msg.notexist.replace('~order', 'جاری'))
            }
        })
    },
    getFinOrders: function (msg) {
        // this.query = "SELECT * FROM view_iorders where  (status='ya' or status like '%later%')   and  chatid='" + msg.from.id + "' group by orderCategoryDetailId,TelegramId; ";
        // this.query += "SELECT * FROM view_orders where  (status='ya' or status like '%later%')  and  chatid='" + msg.from.id + "';";
        this.query = "  SELECT * FROM `view_ifinish` where performDate is not null and status='finished' and chatid='" + msg.from.id + "'   group by orderCategoryDetailId,TelegramId; ";
        this.query += "SELECT * FROM view_orders where  performDate<NOW() and status='finished'  and  chatid='" + msg.from.id + "';";

        new exeqM.exec(this.query, function (err, orders) {
            this.text = "";
            this.btns = [];
            for (i = 0; i < orders[0].length; i++) {
                this.btns.push([bot.inlineButton("انبوه -" + orders[0][i].orderCount + "k" + " - " + orders[0][i].TelegramId,
                    {callback: "ifo-" + orders[0][i].orderCategoryDetailId + "-" + orders[0][i].TelegramId + "-" + new Date(orders[0][i].performDate).getLocalTime()})]);
            }
            for (i = 0; i < orders[1].length; i++) {
                this.btns.push([bot.inlineButton("ویژه -" + orders[1][i].view + "k" + " - " + orders[1][i].telegramid,
                    {callback: "pfo-" + orders[1][i].orderdetailid + "-" + orders[1][i].telegramid + "-" + new Date(orders[1][i].performDate).getLocalTime()})]);
            }
            if (this.btns.length > 0) {

                this.btns = bot.inlineKeyboard(this.btns)
                bot.sendMessage(msg.from.id, varM.msg.orders, {replyMarkup: this.btns})
                    .then(function (ilk) {
                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                    })
            }
            else {
                bot.sendMessage(msg.from.id, varM.msg.notexist.replace('~order', 'پایان یافته'))
            }
        })
    },
    updatemessage: function (chatId, messageId, text, markup) {
        // bot.editText(
        //     { chatId, messageId }, text,
        //     {markup}
        // ).catch(function(error){ console.log('Error:', error)});
    },
    generateDesc: function (banners) {
        this.desc = "";
        if (banners && banners.length > 0) {
            if (banners && banners.length > 0 && new Date(banners[0].performDate) < new Date().getLocal()) {
                // this.desc += '⚠️ لطفا پس از درج تبلیغ حتما گزینه انجام شد را بزنید. در غیر اینصورت تبلیغی برای شما لحاظ نخواهد شد ⚠️' + '\r\n';
                this.desc += '⚠️ لطفا تبلیغ را در کانال خود فوروارد کنید. پس از درج تبلیغ در کانال خود چنانچه پیام تاییدیه را دریافت نکردید حتما گزینه انجام شد را بزنید. اگر قصد زدن تبلیغ را ندارید از گزینه نمیزنم استفاده کنید . ⚠️' + '\r\n';
            }
            adstype="";
            if(banners.searchObject('status', 'reply')){
                adstype="reply";
            }
            else if(banners.searchObject('status', 'sticker')){
                adstype="sticker";
            }
            else {
                adstype="banner";
            }

            console.log((banners[0].TelegramId && banners[0].TelegramId != 'undefined'), banners[0].TelegramId, banners[0].channelTag)
            // console.log(new Date(banners[0].performDate),banners[0].performDate,new Date(),new Date().getLocal())
            this.desc += (banners[0].title && banners[0].title != 'undefiend') ? (" عنوان : " + banners[0].title + "\r\n") : "";
            this.desc += (banners[0].adminDescription && banners[0].adminDescription != 'undefiend') ? (" توضیح ادمین :🔴 " + banners[0].adminDescription + "🔴\r\n") : "";
            this.desc += " تگ کانال : @" + ((banners[0].TelegramId && banners[0].TelegramId != 'undefiend') ? banners[0].TelegramId : banners[0].channelTag) + "\r\n";
            this.desc += utilM.getOrderNumber(banners[0].orderid, banners[0].orderdetailid) + "\r\n";
            this.desc += "ویو : " + banners[0].view + "کا" +
                " ( ویو اولیه بنر" + banners[0].initview + ")" + "\r\n";
            this.desc += "نوع تبلیغ : این تبلیغ مخصوص و ویژه برای کانال شماست لطفا حتما در کانالتان درج شود" + "\r\n";
            this.desc += "قیمت تبلیغ : " + ((banners[0].channelCost && banners[0].channelCost != 'undefiend') ? banners[0].channelCost : banners[0].price)+" تومان "
                +"("+utilM.getType(adstype)+" فوروارد شود "+")"+"\r\n";
            this.desc += "محدودیت پست : " + banners[0].postlimit + "\r\n";
            this.desc += "شروع تبلیغ : " +
               // moment(banners[0].performDate, 'YYYY-M-D HH:mm:ss').format('jYYYY/jM/jD HH:mm:ss') // 1392/6/31 23:59:59
                utilM.dateEnToSh(banners[0].performDate)
                + "\r\n";
            if (banners.length > 1 && banners.searchObject('status', 'reply')) {
                this.desc += "نوع ریپلای : " +
                    (banners[0].replytype == "optional" ? "اختیاری" : "اجباری")
                    + "\r\n";
            }
        }
        return this.desc;
    },
    igenerateDesc: function (banners) {
        this.desc = "";
       // console.log(banners[0])
        if (banners && banners.length > 0) {
            if (banners && banners.length > 0 && new Date(banners[0].performDate) < new Date().getLocal()) {
                // this.desc += '⚠️ لطفا پس از درج تبلیغ حتما گزینه انجام شد را بزنید. در غیر اینصورت تبلیغی برای شما لحاظ نخواهد شد ⚠️' + '\r\n';
                this.desc += '⚠️ لطفا تبلیغ را در کانال خود فوروارد کنید. پس از درج تبلیغ در کانال خود چنانچه پیام تاییدیه را دریافت نکردید حتما گزینه انجام شد را بزنید. اگر قصد زدن تبلیغ را ندارید از گزینه نمیزنم استفاده کنید . ⚠️' + '\r\n';
            }
            adstype="";
            if(banners.searchObject('status', 'reply')){
                adstype="reply";
            }
            else if(banners.searchObject('status', 'sticker')){
                adstype="sticker";
            }
            else {
                adstype="banner";
            }
            this.desc += (banners[0].title && banners[0].title != 'undefiend') ? (" عنوان : " + banners[0].title + "\r\n") : "";
            this.desc += (banners[0].adminDescription && banners[0].adminDescription != 'undefiend') ? (" توضیح ادمین : 🔴" + banners[0].adminDescription + "🔴\r\n") : "";
            // this.desc += " نام تبلیغ : " + banners[0].title + "\r\n";
            this.desc += " تگ کانال : @" + banners[0].channelTag + "\r\n";
            this.desc += utilM.getOrderNumber(banners[0].orderid, banners[0].orderdetailid) + "\r\n";
            this.desc += "ویو : " + banners[0].view + "کا" +
                " ( ویو اولیه بنر" + banners[0].initview + ")" + "\r\n";
            this.desc += "نوع تبلیغ : انبوه" + "\r\n";
            this.desc += "محدودیت پست : " + banners[0].postlimit + "\r\n";
            this.desc += "شروع تبلیغ : " +
                //moment(banners[0].performDate, 'YYYY-M-D HH:mm:ss').format('jYYYY/jM/jD HH:mm:ss') // 1392/6/31 23:59:59
                utilM.dateEnToSh(banners[0].performDate)
                + "\r\n";
            if (banners.length > 1) {

                if (banners[0].replyPrice == 0 || !banners.searchObject('status', 'reply')) {
                    this.desc += "قیمت هر کا : " + banners[0].price +"("+utilM.getType("sticker")+" فوروارد شود "+")"+ "\r\n";
                }
                else if ((banners[0].replytype != "force") || banners.searchObject('status', 'reply')) {
                    this.desc += "قیمت هر کا تک بنر : " + banners[0].price
                        +"("+utilM.getType("sticker")+" فوروارد شود "+")"+"\r\n";
                    this.desc += "قیمت هر کا بنر با ریپلای : " + banners[0].replyPrice
                        +"("+utilM.getType("reply")+" فوروارد شود "+")"+"\r\n";
                }
                else {
                    this.desc += "قیمت هر کا بنر با ریپلای : " + banners[0].replyPrice
                        +"("+utilM.getType("reply")+" فوروارد شود "+")"+"\r\n";

                }
                if (banners.searchObject('status', 'reply')) {
                    this.desc += "نوع ریپلای : " + (banners[0].replytype == "optional" ? "اختیاری" : "اجباری") + "\r\n";
                }
            }
            if (banners && banners.length > 0 && new Date(banners[0].performDate) < new Date().getLocal()) {
                this.desc += "لیست کانال های شرکت کننده تا الان :" + "\r\n/contributors_" + banners[0].orderdetailid
            }
        }

        return this.desc;
    },
    getOrderInfo: function (msg, params, status) {
        this.query = uqM.curBannersQ(params[1], status == 'جاری' ? 'ya' : 'finished');
        new exeqM.exec(this.query, function (err, banners) {
            banners = uutilM.fixBanners(banners)
            this.desc = "";
            if (banners && banners.length > 0) {
                console.log(new Date(parseInt(banners[0].starttime)))

                // console.log(new Date(banners[0].performDate),banners[0].performDate,new Date(),new Date().getLocal())
                this.desc += (banners[0].admintitle && banners[0].admintitle != 'undefiend') ? (" عنوان : " + banners[0].admintitle + "\r\n") : "";
                this.desc += (banners[0].adminDescription && banners[0].adminDescription != 'undefiend') ? (" توضیح ادمین : 🔴" + banners[0].adminDescription + "🔴\r\n") : "";
                this.desc += " تگ کانال : @" + ((banners[0].TelegramId && banners[0].TelegramId != 'undefiend') ? banners[0].TelegramId : banners[0].channelTag) + "\r\n";
                this.desc += utilM.getOrderNumber(banners[0].orderid, banners[0].orderdetailid) + "(برای مشاهده اطلاعات کلیک کنید)\r\n";
                this.desc += "ویو : " + banners[0].productView + "کا" + "\r\n";
                if (status != 'جاری')
                    this.desc += "ویو درج شده : " + banners[0].view + "کا" + "\r\n";
                this.desc += "نوع تبلیغ :  ویژه " + "\r\n";
                this.desc += "قیمت هر کا : " + ((banners[0].channelCost && banners[0].channelCost != 'undefiend') ? banners[0].channelCost : banners[0].price) + "\r\n";
                if (status != 'جاری')
                    this.desc += "درآمد حاصل : " + ((((banners[0].price && banners[0].price != 'undefiend') ? banners[0].price : banners[0].channelCost) * banners[0].view) / 1000).toFixed(0) + " تومان 💰 " + "\r\n";
                this.desc += "شروع تبلیغ : " +
                    moment(banners[0].performDate, 'YYYY-M-D HH:mm:ss').format('jYYYY/jM/jD HH:mm:ss') // 1392/6/31 23:59:59
                    + "\r\n";
                this.desc += "زمان درج تبلیغ : " +
                    utilM.dateEnToSh(new Date(parseInt(banners[0].starttime)))
                    + "\r\n";
                this.desc += "وضیعت :" + status;
                bot.forwardMessage(msg.from.id, sschannel.id, banners[0].screenshotid).then(function (res1) {
                    bot.sendMessage(msg.from.id, this.desc);
                })
            }
        })
    },
    igetOrderInfo: function (msg, params, status) {
        this.query = uqM.icurBannersQ(params[1], msg.from.id, params[2],status == 'جاری' ? 'ya' : 'finished');
        // console.log(this.query)
        // return
        new exeqM.exec(this.query, function (err, banners) {
            banners = uutilM.fixBanners(banners)
            this.desc = "";
            //console.log("fdlgkmnkngg", new Date(parseInt(banners[0].starttime)).getLocal())
            if (banners && banners.length > 0) {
                // console.log(new Date(banners[0].performDate),banners[0].performDate,new Date(),new Date().getLocal())
                this.desc += (banners[0].admintitle && banners[0].admintitle != 'undefiend') ? (" عنوان : " + banners[0].admintitle + "\r\n") : "";
                this.desc += (banners[0].adminDescription && banners[0].adminDescription != 'undefiend') ? (" توضیح ادمین : 🔴" + banners[0].adminDescription + "🔴\r\n") : "";
                this.desc += " تگ کانال : @" + ((banners[0].TelegramId && banners[0].TelegramId != 'undefiend') ? banners[0].TelegramId : banners[0].channelTag) + "\r\n";
                this.desc += utilM.getOrderNumber(banners[0].orderid, banners[0].orderCategoryDetailId) + "(برای مشاهده اطلاعات کلیک کنید)\r\n";
                this.desc += " ویو : " + banners[0].productview + "کا" + "\r\n";
                if (status != 'جاری')
                    this.desc += "ویو درج شده : " + banners[0].view + "کا" + "\r\n";
                this.desc += "نوع تبلیغ :  انبوه " + "\r\n";
                this.desc += "قیمت هر کا : " + ((banners[0].price && banners[0].price != 'undefiend') ? banners[0].price : banners[0].channelCost) + "\r\n";
                if (status != 'جاری')
                    this.desc += "درآمد حاصل : " + ((((banners[0].price && banners[0].price != 'undefiend') ? banners[0].price : banners[0].channelCost) * banners[0].view) / 1000).toFixed(0) + " تومان 💰 " + "\r\n";
                this.desc += "شروع تبلیغ : " +
                    moment(banners[0].performDate, 'YYYY-M-D HH:mm:ss').format('jYYYY/jM/jD HH:mm:ss') // 1392/6/31 23:59:59
                    + "\r\n";
                this.desc += "زمان درج تبلیغ : " +
                    utilM.dateEnToSh(new Date(parseInt(banners[0].starttime)))
                    + "\r\n";
                this.desc += "وضیعت :" + status;
                bot.forwardMessage(msg.from.id, sschannel.id, banners[0].screenshotid).then(function (res1) {
                    bot.sendMessage(msg.from.id, this.desc);
                })
            }
        })
    },
    sendOrder: function (msg, params) {
        this.query = uqM.bannersQ(params[1]);
        console.log( this.query)
        new exeqM.exec(this.query, function (err, banners) {
            banners = uutilM.fixBanners(banners)
            if (banners && banners.length > 0 && new Date(banners[0].performDate) < new Date().getLocal()) {
                if (banners && banners.length == 2) {
                    if (banners[1].replytype == "force") {
                        if (!admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                            bot.forwardMessage(msg.from.id, banners[0].senderid, banners[0].messageid).then(function (res1) {
                                bot.forwardMessage(msg.from.id, banners[1].senderid, banners[1].messageid).then(function (res2) {
                                    this.btns = uutilM.btnGenerator(banners[0].orderdetailid, banners[0].performDate)
                                    // this.btns.push([bot.inlineButton('back ', {callback: 'order'})])
                                    this.btns = bot.inlineKeyboard(this.btns);
                                    bot.sendMessage(msg.from.id, "توضیحات\r\n" + uutilM.generateDesc(banners)
                                        , {replyMarkup: this.btns}).then(function (ilk) {
                                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                                    })
                                })
                            })
                        }
                        else if (admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                            uutilM.pushMessages(banners, msg, params)
                        }
                        else if (admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                            uutilM.pushMessages([banners[0]], msg, params)
                        }
                        else if (!admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                            uutilM.pushMessages([banners[1]], msg, params)
                        }
                    }
                    else {
                        if (!banners.searchObject('status', 'sticker')) {
                            this.obj = {
                                link: (fs.existsSync(rootPath + "stickers/" + msg.from.id + ".webp")) ? (rootPath + "stickers/" + msg.from.id + ".webp") : ('sticker.webp'),
                                filetype: 'sticker',
                                type: '1',
                                status: 'sticker',
                                post: 'sticker',
                                postlimit: banners[0].postlimit,
                                orderdetailid: banners[0].orderdetailid
                            };
                            if (!admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                                uutilM.pushMessages([this.obj], msg, params)
                            }
                            else if (admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                                banners.push(this.obj)
                                uutilM.pushMessages(banners, msg, params)
                            }
                            else if (admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                                uutilM.pushMessages([banners[0], this.obj], msg, params)
                            }
                            else if (!admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                                uutilM.pushMessages([banners[1], this.obj], msg, params)
                            }
                            // uutilM.pushMessages(this.obj, msg, params)
                        }
                        else {
                            // console.log(msg.from.id,("@"+banners[0].postlink), banners[0].messageid,banners[0].senderid.replace('-100',''))
                            // bot.forwardMessage(msg.from.id,"@testviewchannel", 745)
                            // bot.forwardMessage(msg.from.id,(banners[0].senderid.replace('-100','')), banners[0].messageid)
                            // bot.forwardMessage(msg.from.id,((banners[0].senderid)), banners[0].messageid)

                            bot.forwardMessage(msg.from.id, banners[0].senderid, banners[0].messageid).then(function (res1) {
                                bot.forwardMessage(msg.from.id, banners[1].senderid, banners[1].messageid).then(function (res2) {
                                    this.btns = uutilM.btnGenerator(banners[0].orderdetailid, banners[0].performDate)
                                    // this.btns.push([bot.inlineButton('back ', {callback: 'order'})])
                                    this.btns = bot.inlineKeyboard(this.btns);
                                    bot.sendMessage(msg.from.id, "توضیحات\r\n" + uutilM.generateDesc(banners), {replyMarkup: this.btns}).then(function (ilk) {
                                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                                    })
                                }).catch(function (err) {
                                    console.log("11111111111", err)
                                })
                            }).catch(function (err) {
                                console.log(";;;;;;;;;;;;", err)
                            })
                        }
                    }
                }
                else if (banners && banners.length == 3) {

                    if (!admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                        // console.log("successs");
                        // return;
                        bot.forwardMessage(msg.from.id, banners[0].senderid, banners[0].messageid).then(function (res1) {
                            //console.log(msg.from.id,  parseInt(banners[1].senderid), parseInt(banners[1].messageid));
                            bot.forwardMessage(msg.from.id, parseInt(banners[1].senderid), parseInt(banners[1].messageid)).then(function (res2) {
                                // console.log( banners[1].senderid, banners[1].messageid)

                                bot.forwardMessage(msg.from.id, banners[2].senderid, banners[2].messageid).then(function (res2) {
                                    // console.log( banners[2].senderid, banners[2].messageid)

                                    this.btns = uutilM.btnGenerator(banners[0].orderdetailid, banners[0].performDate)
                                    // this.btns.push([bot.inlineButton('back ', {callback: 'order'})])
                                    this.btns = bot.inlineKeyboard(this.btns);
                                    bot.sendMessage(msg.from.id, "توضیحات\r\n" + uutilM.generateDesc(banners), {replyMarkup: this.btns})
                                        .then(function (ilk) {
                                            fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                                        })
                                }).catch(function (err) {
                                    console.log(err)
                                })
                            }).catch(function (err) {
                                // console.log( banners[1].senderid.replace('-100',''), banners[1].messageid)
                                console.log(err)
                            })
                        }).catch(function (err) {
                            console.log(err)
                        })
                    }
                    else if (admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                        uutilM.pushMessages(banners, msg, params)
                    }
                    else if (admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                        uutilM.pushMessages([banners[0]], msg, params)
                    }
                    else if (!admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                        uutilM.pushMessages([banners[1]], msg, params)
                    }
                }
                else if (banners && banners.length == 1) {
                    // console.log()
                    if (banners[0].senderid == originalchannel.id) {
                        bot.forwardMessage(msg.from.id, banners[0].senderid, banners[0].messageid).then(function (res1) {
                            this.btns = uutilM.btnGenerator(banners[0].orderdetailid, banners[0].performDate)
                            // this.btns.push([bot.inlineButton('back ', {callback: 'order'})])
                            this.btns = bot.inlineKeyboard(this.btns);
                            bot.sendMessage(msg.from.id, "توضیحات\r\n" + uutilM.generateDesc(banners), {replyMarkup: this.btns}).then(function (ilk) {
                                fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                            })
                        })
                    }
                    else if (admins.searchObject('id', banners[0].senderid)) {
                        uutilM.pushMessages(banners, msg, params)
                        // console.log(msg.from.id, banners[0].senderid, banners[0].messageid);
                        // bot.forwardMessage(msg.from.id,banners[0].senderid, banners[0].messageid).then(function (res1) {
                        //     this.btns =bot.inlineKeyboard(uutilM.btnGenerator(banners[0].orderdetailid));
                        //     bot.sendMessage(msg.from.id, "admin desc", {replyMarkup: this.btns}).then(function (res2) {
                        //     })
                        // }).catch(function (err) {
                        //     console.log(err)
                        // })
                    }
                    // else  if (banners[0].senderid == forwardchannel.id){
                    //   this.obj={
                    //     link:(fs.existsSync(rootPath + "stickers/" + msg.from.id + ".webp"))?(rootPath + "stickers/" + msg.from.id + ".webp"):('sticker.webp'),
                    //     filetype: 'sticker',
                    //     type: '1',
                    //     status: 'sticker',
                    //     post: 'sticker',
                    //     postlimit: banners[0].postlimit,
                    //     orderdetailid: banners[0].orderdetailid
                    //   };
                    //   uutilM.pushMessages( [this.obj], msg, params)
                    // }
                    else {
                        banners.push({
                            link: (fs.existsSync(rootPath + "stickers/" + msg.from.id + ".webp")) ? (rootPath + "stickers/" + msg.from.id + ".webp") : ('sticker.webp'),
                            filetype: 'sticker',
                            type: '1',
                            status: 'sticker',
                            post: 'sticker',
                            postlimit: banners[0].postlimit,
                            orderdetailid: banners[0].orderdetailid
                        })
                        uutilM.pushMessages(banners, msg, params)
                    }
                }
            }
            else if (banners && banners.length > 0) {
                bot.forwardMessage(msg.from.id, sschannel.id, banners[0].screenshotid).then(function (res1) {
                    this.btns = uutilM.btnGenerator(banners[0].orderdetailid, banners[0].performDate)
                    // this.btns.push([bot.inlineButton('back ', {callback: 'order'})])
                    this.btns = bot.inlineKeyboard(this.btns);
                    bot.sendMessage(msg.from.id, "توضیحات\r\n" + uutilM.generateDesc(banners), {replyMarkup: this.btns}).then(function (ilk) {
                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                    })
                }).catch(function (err) {
                    console.log(err)
                })
            }
            else {
                bot.sendMessage(msg.from.id, varM.msg.bannerdelete)
            }
        })
    },
    isendOrder: function (msg, params) {
        this.query = uqM.ibannersQ(params[1], msg.from.id, params[2]);
      //  console.log(this.query)

        new exeqM.exec(this.query, function (err, banners) {
            banners = uutilM.fixBanners(banners)
            // console.log(banners);
            // return;
                
            // console.log(new Date(banners[0].performDate) < new Date().getLocal(), new Date(banners[0].performDate), new Date().getLocal())
            if (banners && banners.length > 0 && (new Date(banners[0].performDate) < new Date().getLocal())) {
                if (banners && banners.length == 3) {
                    bot.forwardMessage(msg.from.id, banners[0].senderid, banners[0].messageid).then(function (res1) {
                        bot.forwardMessage(msg.from.id, banners[2].senderid, banners[2].messageid).then(function (res2) {
                            
                            this.query = " select * from raaz_orderdetail where bannerid=" + banners[2].bannerid + " limit 1;" + banners[0].query;
                            console.log(this.query);
                                
                            new exeqM.exec(this.query, function (err, orders) {
                                this.btns = uutilM.ibtnGenerator(orders[0].orderdetailid, banners[0].orderdetailid, params[2], banners[0].performDate)
                                // this.btns.push([bot.inlineButton('back ', {callback: 'iorder'})])
                                this.btns = bot.inlineKeyboard(this.btns);
                                bot.sendMessage(msg.from.id, "توضیحات\r\n" + uutilM.igenerateDesc(banners), {replyMarkup: this.btns}).then(function (ilk) {
                                    fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                                })
                            })
                        })
                    })
                }
                else if (banners && banners.length == 4) {
                    bot.forwardMessage(msg.from.id, banners[0].senderid, banners[0].messageid).then(function (res1) {
                        bot.forwardMessage(msg.from.id, banners[2].senderid, banners[2].messageid).then(function (res2) {
                            bot.forwardMessage(msg.from.id, banners[3].senderid, banners[3].messageid).then(function (res2) {
                                this.query = " select * from raaz_orderdetail where bannerid=" + banners[2].bannerid + " limit 1;" + banners[0].query;
                                new exeqM.exec(this.query, function (err, orders) {
                                    this.btns = uutilM.ibtnGenerator(orders[0].orderdetailid, banners[0].orderdetailid, params[2], banners[0].performDate)
                                    // this.btns.push([bot.inlineButton('back ', {callback: 'iorder'})])
                                    this.btns = bot.inlineKeyboard(this.btns);
                                    bot.sendMessage(msg.from.id, "توضیحات\r\n" + uutilM.igenerateDesc(banners), {replyMarkup: this.btns}).then(function (ilk) {
                                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                                    })
                                })
                            })
                        })
                    })
                }
                else if (banners && banners.length === 2 && banners && banners[1].status !== 'reply') {
                    bot.forwardMessage(msg.from.id, banners[0].senderid, banners[0].messageid).then(function (res1) {
                        bot.forwardMessage(msg.from.id, banners[1].senderid, banners[1].messageid).then(function (res2) {
                            this.query = " select * from raaz_orderdetail where bannerid=" + banners[1].bannerid + " limit 1;" + banners[0].query;
                            new exeqM.exec(this.query, function (err, orders) {
                                this.btns = uutilM.ibtnGenerator(orders[0].orderdetailid, banners[0].orderdetailid, params[2], banners[0].performDate);
                                // this.btns.push([bot.inlineButton('back ', {callback: 'iorder'})]);
                                this.btns = bot.inlineKeyboard(this.btns);
                                bot.sendMessage(msg.from.id, "توضیحات\r\n" + uutilM.igenerateDesc(banners), {replyMarkup: this.btns}).then(function (ilk) {
                                    fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                                })
                            })
                        })
                    })
                }
                else if (banners && banners.length == 2) {
                    if (banners[1].replytype == "force") {
                        if (!admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                            new uutilM.pushMessages([banners[1]], msg, params, 1);
                        }
                        else if (admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                            new uutilM.pushMessages(banners, msg, params, 1);
                        }
                        else if (admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                            new uutilM.pushMessages(banners, msg, params, 1);
                        }
                        else if (!admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                            new uutilM.pushMessages([banners[1]], msg, params, 1);
                        }
                    } else {
                        this.obj = {
                            link: (fs.existsSync(rootPath + "stickers/" + msg.from.id + ".webp")) ? (rootPath + "stickers/" + msg.from.id + ".webp") : ('sticker.webp'),

                            filetype: 'sticker',
                            type: '2',
                            status: 'sticker',
                            post: 'sticker',
                            postlimit: banners[0].postlimit,
                            orderdetailid: banners[0].orderdetailid
                        };
                        //console.log(admins.searchObject('id', banners[0].senderid) ,admins.searchObject('id', banners[1].senderid));
                        // return;
                        if (!admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                            new uutilM.pushMessages([banners[1], this.obj], msg, params, 1);
                        }
                        else if (admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                            //  banners.push(this.obj);
                            banners.push(this.obj)
                            // console.log(banners.length)

                            new uutilM.pushMessages(banners, msg, params, 1);
                        }
                        else if (admins.searchObject('id', banners[0].senderid) && !admins.searchObject('id', banners[1].senderid)) {
                            banners.push(this.obj)
                            console.log(banners)
                            new uutilM.pushMessages(banners, msg, params, 1);
                        }
                        else if (!admins.searchObject('id', banners[0].senderid) && admins.searchObject('id', banners[1].senderid)) {
                            new uutilM.pushMessages([banners[1], this.obj], msg, params, 1);
                        }
                    }
                }
                else if (banners && banners.length == 1) {
                    banners.push({
                        link: (fs.existsSync(rootPath + "stickers/" + msg.from.id + ".webp")) ? (rootPath + "stickers/" + msg.from.id + ".webp") : ('sticker.webp'),

                        filetype: 'sticker',
                        type: '2',
                        status: 'sticker',
                        post: 'sticker',
                        postlimit: banners[0].postlimit,
                        orderdetailid: banners[0].orderdetailid
                    })
                    if (!admins.searchObject('id', banners[0].senderid)) {
                        new uutilM.pushMessages([banners[1]], msg, params, 2);
                    }
                    else {
                        new uutilM.pushMessages(banners, msg, params, 2);
                    }
                }
                else {
                    console.log("dooooooooooooooooooooooooooooooooneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
                    new cutilM.iremindOrder(params[1], params[4], true);
                }
            }
            else if (banners && banners.length > 0) {
                bot.forwardMessage(msg.from.id, sschannel.id, banners[0].screenshotid).then(function (res1) {
                    this.btns = uutilM.ibtnGenerator(null, banners[0].orderdetailid, params[2], banners[0].performDate);
                    // this.btns.push([bot.inlineButton('back ', {callback: 'order'})])
                    this.btns = bot.inlineKeyboard(this.btns);
                    banners[0].channelTag = params[2];
                    bot.sendMessage(msg.from.id, "توضیحات\r\n" + uutilM.igenerateDesc(banners), {replyMarkup: this.btns}).then(function (ilk) {
                        fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
                    })
                })
            }
            else {
                bot.sendMessage(msg.from.id, varM.msg.bannerdelete)
            }
        })
    },
    btnGenerator: function (orderdetailid, performDate) {
        this.date = new Date().getLocalTime();
        performDate = new Date(performDate).getTime();
        //console.log(performDate, "btnGenerator", this.date)
        if (this.date >= performDate || !performDate) {
            return [
                [bot.inlineButton('نمیزنم !', {callback: 'dn-no-' + orderdetailid})],
                 [bot.inlineButton('انجام شد!', {callback: 'dn-ya-' + orderdetailid})],
                 /*[bot.inlineButton('یک ساعت بعد میزنم!', {callback: 'dn-l1-' + orderdetailid}),
                 bot.inlineButton('دو ساعت بعد میزنم!', {callback: 'dn-l2-' + orderdetailid})],
                 [bot.inlineButton('سه ساعت بعد میزنم!', {callback: 'dn-l3-' + orderdetailid}),
                 bot.inlineButton('چهار ساعت بعد میزنم!', {callback: 'dn-l4-' + orderdetailid})]*/
            ];
        }
        else {
            this.diff = utilM.getLocalTimeDiff(this.date, performDate);
            console.log("this.diff", this.diff)
            return [
                [bot.inlineButton('نمیزنم !', {callback: 'dn-no-' + orderdetailid})],
                [bot.inlineButton('میزنم ', {callback: 'dn-yah-' + orderdetailid + "-" + this.diff})]
            ];
        }
    },
    ibtnGenerator: function (orderdetailid, ordercategorydetailid, tag, performDate) {
        this.date = new Date().getLocalTime();
        performDate = new Date(performDate).getTime();
        // this.date = utilM.getCronTime(this.date);
        if (this.date >= performDate || !performDate) {
            return [
                [bot.inlineButton('نمیزنم !', {callback: 'idn-no-' + ordercategorydetailid + "-" + tag})],
                [bot.inlineButton('انجام شد!', {callback: 'idn-ya-' + ordercategorydetailid + "-" + tag})],
                 /*  [bot.inlineButton('یک ساعت بعد میزنم!', {callback: 'idn-l1-' + orderdetailid + "-" + tag}),
                 bot.inlineButton('دو ساعت بعد میزنم!', {callback: 'idn-l2-' + orderdetailid + "-" + tag})],
                 [bot.inlineButton('سه ساعت بعد میزنم!', {callback: 'idn-l3-' + orderdetailid + "-" + tag}),
                 bot.inlineButton('چهار ساعت بعد میزنم!', {callback: 'idn-l4-' + orderdetailid + "-" + tag})]*/
            ];
        }
        else {
            this.diff = utilM.getLocalTimeDiff(this.date, performDate);
            return [
                [bot.inlineButton('نمیزنم !', {callback: 'idn-no-' + ordercategorydetailid + "-" + tag})],
                [bot.inlineButton('میزنم', {callback: 'idn-yah-' + ordercategorydetailid + "-" + tag + "-" + this.diff})]
            ];
        }
    },
    orderRes: function (msg, params, sticker) {
        //console.log(params)
        // bot.answerCallbackQuery(msg.id,{text:"hhhi",cacheTime:0}).then(function (res) {
        //     console.log(res)
        // })

        this.query = uqM.bannersChannelQ(params[2]);
        //console.log(this.query);
            
        new exeqM.exec(this.query, function (err, banners) {
            // console.log(banners);
            if (!err && banners && banners.length > 0) {

                if (params[1] == "ya") {
                    // banners=uutilM.fixBanners(banners);
                    this.post_data = {
                        username: banners[banners.length - 1].channelTag,
                        msgs: banners
                    };
                    // console.log(this.post_data)
                    new reqhM.getUpdates(this.post_data, function (err, data) {
                        if (!err && data) {
                            // console.log(sticker,banners[0].replytype,"********************************************")
                            // console.log(uutilM.checkBannerSet(data))
//                             console.log('checkBnnerrr',data,uutilM.checkBannerSet(data));
// return;
                            if (uutilM.checkBannerSet(data)) {
                                //bot.answerCallbackQuery(msg.id, {text: varM.msg.done, showAlert: true}).then(function (re) {
                                bot.sendMessage(msg.from.id,
                                    varM.msg.setverify + "\r\nتگ کانال :@" + data[0].channelTag + utilM.getOrderNumber(data[0].vorderid, data[0].orderdetailid)
                                )
                                this.query=" update  bot_banners bb " +
                                     " join  raaz_orderdetail rod on rod.orderdetailid=bb.orderdetailid " +
                                     " SET bb.verify=1,rod.status='ya',sitestatus=6,starttime='" + new Date().getLocalTime() + "'  where rod.status='adminpassed' and rod.orderdetailid= "+data[0].orderdetailid+";";
                                new exeqM.exec(this.query, function (err, results) {

                                })
                                // }).catch(function (err) {
                                //   console.log(err)
                                // })
                                // if (params[2] in schedule.scheduledJobs) {
                                //     schedule.scheduledJobs[params[2]].cancel();
                                //     delete schedule.scheduledJobs[params[2]];
                                // }
                                // new cutilM.updateView(params[2], 'adminpassed');
                            }
                            else {
                                // console.log(msg.id, {text: varM.msg.alert, showAlert: true})
                                // bot.answerCallbackQuery(msg.id, {text: varM.msg.alert, showAlert: true}).then(function (re) {
                                bot.sendMessage(msg.from.id, varM.msg.alert)
                                // }).catch(function (err) {
                                //   console.log(err)
                                // })
                            }
                            // var date = new Date().setSeconds(new Date().getSeconds() + 15);
                            // date = utilM.getCronTime(date);
                            // this.query = " update raaz_orderdetail set status='ya',crontime='" + date + "'," +
                            //     " crontype='2'" +
                            //     " where orderdetailid=" + params[2]+" and status='adminpassed' ";
                            // new exeqM.exec(this.query, function (err, data) {
                            //     schedule.scheduleJob(params[2].toString(), date.toString(), function () {
                            //          console.log("updateView", utilM.getCronTime(new Date()));
                            //     });
                            // });

                        }
                    });
                }
                else if (params[1] == "yah") {
                    if (params[2] in schedule.scheduledJobs) {
                        schedule.scheduledJobs[params[2]].cancel();
                        delete schedule.scheduledJobs[params[2]];
                    }
                    // console.log(banners[0].performDate,new Date(banners[0].performDate),
                    //   new Date(banners[0].performDate).getTime(),
                    //   new Date(banners[0].performDate).getLocalTime());
                    new cutilM.remindOrder(params[2], params[3], new Date(banners[0].performDate), true);
                    // bot.answerCallbackQuery(msg.id, {text: varM.msg.remindyou, showAlert: true})

                    bot.sendMessage(msg.from.id, varM.msg.remindyou)

                }
                else if (params[1].indexOf('l') == 0) {
                    params[1] = params[1].replace('l', '');
                    if (params[2] in schedule.scheduledJobs) {
                        schedule.scheduledJobs[params[2]].cancel();
                        delete schedule.scheduledJobs[params[2]];
                    }
                    new cutilM.remindOrder(params[2], params[1], true)
                }
                else if (params[1] == "no") {
                    new uutilM.rejectBanner(msg, banners[banners.length - 1].vorderid, banners[banners.length - 1].channelTag, true, params[2]);
                }
            }
            else {
                bot.sendMessage(msg.from.id, varM.msg.bannerdelete)
            }
        });
    },
    iorderRes: function (msg, params) {

        console.log(params)
        // return;
        // bot.answerCallbackQuery(msg.id,{text:"hhhi",cacheTime:0}).then(function (res) {
        //     console.log(res)
        // })

        this.query = uqM.iallBannerQ(params[2], params[3]);
        new exeqM.exec(this.query, function (err, banners) {
            if (!err && banners && banners.length > 0) {

                if (params[1] == "ya") {
                    this.post_data = {
                        "username": params[3].replace(/@/gi, ''),
                        msgs: banners
                    }

                    new reqhM.getUpdates(this.post_data, function (err, data) {
                        if (!err && data) {
                            // console.log("checkBannerSet", uutilM.checkBannerSet(data),data)
                            // return;
                            if (uutilM.checkBannerSet(data)) {
                                if (params[2] in schedule.scheduledJobs) {
                                    schedule.scheduledJobs[params[2]].cancel();
                                    delete schedule.scheduledJobs[params[2]];
                                }
                                bot.sendMessage(msg.from.id,varM.msg.setverify + "\r\nتگ کانال :@" +
                                    params[3] + utilM.getOrderNumber(
                                        data[data.length - 1].iorderid,
                                        data[data.length - 1].orderdetailid
                                    )
                                )

                                this.wherein = [];
                                for (bi = 0; bi < data.length; bi++) {
                                    if (data[bi].status != 'banner') {
                                        this.wherein.push(data[bi].bannerid)
                                    }
                                }
                                if (this.wherein&&this.wherein.length>0) {
                                    this.query = " update  raaz_orderdetail set status='ya',starttime='" + new Date().getLocalTime() + "' " +
                                        " where screenshotId IS NULL and ( bannerid in (" + this.wherein.join(",").toString() + ") or " +
                                        " ( channelTag	='" + params[3] + "' and categoryId=" + data[data.length - 1].orderdetailid + "  )) ; ";
                                    // console.log(this.query);
                                    // return;
                                        
                                    new exeqM.exec(this.query, function (err, result) {
                                    })
                                }
                            }
                            else {
                                // bot.answerCallbackQuery(msg.id, {text: varM.msg.alert, showAlert: true})
                                bot.sendMessage(msg.from.id, varM.msg.alert)

                            }
                            // var date = new Date().setSeconds(new Date().getSeconds() + 15);
                            // date = utilM.getCronTime(date);
                            // this.query = " update raaz_orderdetail set status='ya',crontime='" + date + "'," +
                            //     " crontype='2'" +
                            //     " where orderdetailid=" + params[2]+" and status='adminpassed' ";
                            // new exeqM.exec(this.query, function (err, data) {
                            //     schedule.scheduleJob(params[2].toString(), date.toString(), function () {
                            //          console.log("updateView", utilM.getCronTime(new Date()));
                            //     });
                            // });

                        }
                    });
                }
                else if (params[1] == "yah") {
                    if (params[2] in schedule.scheduledJobs) {
                        schedule.scheduledJobs[params[2]].cancel();
                        delete schedule.scheduledJobs[params[2]];
                    }
                    // new cutilM.iremindOrder(params[2], params[4], true);
                    // bot.answerCallbackQuery(msg.id, {text: varM.msg.remindyou, showAlert: true})
                    bot.sendMessage(msg.from.id, varM.msg.remindyou)

                    //this.str="io-"++"-"+params[3]+"-"+.getLocalTime()+"-"+params[4]
                    //new uutilM.isendOrder(msg,this.str.split('-'));
                    // console.log(";;;;",banners[0].performDate,new Date(banners[0].performDate))
                    new cutilM.iremindBanner(params[2], params[3], new Date(banners[0].performDate));
                }
                else if (params[1].indexOf('l') == 0) {
                    params[1] = params[1].replace('l', '');
                    if (params[2] in schedule.scheduledJobs) {
                        schedule.scheduledJobs[params[2]].cancel();
                        delete schedule.scheduledJobs[params[2]];
                    }
                    new cutilM.iremindOrder(params[2], params[1], true)

                }
                else if (params[1] == "no") {

                    new uutilM.rejectBanner(msg, banners[banners.length - 1].iorderid, params[3].replace(/@/gi, ''), false, params[2]);
                }
            }
            else {
                bot.sendMessage(msg.from.id, varM.msg.bannerdelete)
            }
        });
    },
    setForwaredeMessage: function (banners, data, msg, params) {

        this.query = "";
        // console.log(banners,data,msg,params)
        for (si = 0; si < data.length; si++) {
            if (banners[si].status == "sticker" && data[si]) {
                this.obj = {};
                this.obj.from = data[si].result.chat.id;
                this.obj.chatid = msg.from.id;
                this.obj.msgid = data[si].result['message_id'];
                this.obj.date = data[si].result['date'];
                this.obj.filetype = banners[si].filetype;
                this.obj.link = banners[si].link;
                this.obj.orderdetailid = banners[0].orderdetailid;
                this.obj.type = banners[0].type;
                this.obj.status = banners[si].status;
                this.obj.postlink = params[2];
                //console.log(this.obj);
                this.obj.text = "";
                this.query += uqM.insertReplyQ(this.obj);
            }
            else if (data[si] && data[si].result && banners[si].text.trim().indexOf("https://t.me/") != 0)
                this.query += uqM.updateBannerQ(banners[si].bannerid, data[si].result.chat.id, data[si].result['message_id'], msg.from.id);
            else if (banners[si].text && banners[si].text.trim().indexOf("https://t.me/") == 0 && banners[si].status == "banner")
                this.query += uqM.updateBannerQ(banners[si].bannerid, null, null, msg.from.id);
        }
        //console.log(this.query)
        bot.sendMessage(originalchannel.tag, "@" + params[2] + "   " + banners[0].postlimit)
        new exeqM.exec(this.query, function (err, banners) {
            new uutilM.sendOrder(msg, params);
        })
    },
    setForwaredeiMessage: function (banners, data, msg, params) {
        this.query = "";
        //console.log(data)
        for (si = 0; si < banners.length; si++) {
            if (banners[si].status == "banner" && banners[si].text.trim().indexOf("https://t.me/") != 0)
                this.query += uqM.updateBannerQ(banners[si].bannerid, data[si].result.chat.id, data[si].result['message_id'], msg.from.id);
            else if (banners[si].status == "reply") {
                this.obj = {};
                this.obj.from = data[si].result.chat.id;
                this.obj.chatid = msg.from.id;
                this.obj.msgid = data[si].result['message_id'];
                this.obj.date = data[si].result['date'];
                this.obj.filetype = banners[si].filetype;
                this.obj.type = 'reply';
                this.obj.link = banners[si].link;
                // fs.writeFileSync(filename,msg.caption);
                this.obj.orderdetailid = banners[0].orderdetailid;
                this.obj.type = banners[0].type;
                this.obj.status = banners[si].status;
                this.obj.text = banners[si].text;
                this.obj.postlink = params[2];
                this.query += uqM.insertReplyQ(this.obj);
            }
            else if (banners[si].status == "sticker") {
                this.obj = {};
                this.obj.from = data[si].result.chat.id;
                this.obj.chatid = msg.from.id;
                this.obj.msgid = data[si].result['message_id'];
                this.obj.date = data[si].result['date'];
                this.obj.type = banners[si].type;
                this.obj.filetype = banners[si].filetype;
                this.obj.link = banners[si].link;
                this.obj.orderdetailid = banners[0].orderdetailid;
                this.obj.type = banners[0].type;
                this.obj.status = banners[si].status;
                this.obj.postlink = params[2];
                this.obj.text = "";
                this.query += uqM.insertReplyQ(this.obj);
            }
        }
        //if(this.query!="")
        {
            bot.sendMessage(originalchannel.tag, "@" + params[2] + "   " + banners[0].postlimit)
            new exeqM.exec(this.query, function (err, banners) {
                new uutilM.isendOrder(msg, params);
            })
        }
        // else{
        //     new uutilM.isendOrder(msg,params);
        // }

    },
    pushMessages: function (banners, msg, params, i) {
        console.log(banners, "=================")
        this.promises = [];

        for (this.numb = 0; this.numb < banners.length; this.numb++) {
            this.promises.push(uutilM.sendMessage(banners[this.numb]));
        }
        //  console.log(banners,this.promises.length)
        Promise.all(this.promises).then(function (data) {
            // console.dir(data,"-----------------------------------------")
            // console.dir(data,"-----------------------------------------")
            if (!i)
                new uutilM.setForwaredeMessage(banners, data, msg, params);
            else if (i > 0)
                new uutilM.setForwaredeiMessage(banners, data, msg, params);
        }).catch(function (err) {
            console.log(err, "11111111111111111111111")
        })
    },
    sendMessage: function (mydata) {
        return new Promise(function (resolve, reject) {
            mydata.link = mydata.link;
            if (mydata.filetype == "photo") {
                // console.log(originalchannel.tag, mydata.link)
                abot.sendPhoto(originalchannel.id, mydata.link, {caption: mydata.text}).then(function (res2) {
                    resolve(res2);
                }).catch(function (err) {
                    console.log("eeeee.", err);
                    resolve(null);
                })
            }
            else if (mydata.filetype == "video") {
                abot.sendVideo(originalchannel.id, mydata.link, {caption: mydata.text}).then(function (res2) {
                    resolve(res2);
                }).catch(function (err) {
                    console.log(err);
                    resolve(null);
                })
            }
            else if (mydata.filetype == "document") {
                abot.sendDocument(originalchannel.id, mydata.link, {caption: mydata.text}).then(function (res2) {
                    resolve(res2);
                }).catch(function (err) {
                    console.log(err);
                    resolve(null);
                })
            }
            else if (mydata.filetype == "audio") {
                abot.sendAudio(originalchannel.id, mydata.link, {caption: mydata.text}).then(function (res2) {
                    resolve(res2);
                }).catch(function (err) {
                    console.log(err);
                    resolve(null);
                })
            }
            else if (mydata.filetype == "sticker") {
                abot.sendSticker(originalchannel.id, mydata.link).then(function (res2) {
                    resolve(res2);
                }).catch(function (err) {
                    console.log(err);
                    resolve(null);
                })
            }
            else {
                abot.sendMessage(originalchannel.id, mydata.text, {parseMode:'html',webPreview: false}).then(function (res2) {
                    resolve(res2);
                }).catch(function (err) {
                    console.log("eeeee.", err);
                    resolve(null);
                })
            }
        });
    },
    checkBannerSet: function (banners) {
        if(banners&&banners.length>0) {
            this.reply = undefined;
            this.sticker = undefined;
            this.replySticker = 2;
            sticker=banners.searchObject('status','sticker')
            reply=banners.searchObject('status','reply')

            banner=banners.searchObject('status','banner')
            // console.log(sticker);
            // console.log(reply);
            // console.log(banner);


            if(!banner||banner.view==-1){
                return false
            }
            //console.log(reply,);
                
            if(reply&&reply.view==-1&&reply.replytype=="force"&& !sticker){
                return false
            }
            if(reply&&reply.view==-1&&reply.replytype=="optional"&&
                    sticker&&sticker.view==-1
            ){
                return false
            }
            if(sticker&&sticker.view==-1&&(!reply||reply&&reply.view==-1)){
                return false;
            }
            return true;


            // console.log(banner)
            // for (bi = 0; bi < banner.length; bi++) {
            //     if (banner[bi].status == "banner") {
            //
            //         if (banner[bi].view == -1) {
            //             return false;
            //         }
            //         if (banner[bi].view != -1 && banner.length == 1) {
            //             this.replySticker = 0;
            //         }
            //     }
            //     else if (banner[bi].status == "reply") {
            //         this.reply = true;
            //         if (banner[bi].view == -1 && banner[bi].replytype == "optional") {
            //
            //             if (this.reply) {
            //                 this.reply = false;
            //             }
            //             if (this.sticker === false) {
            //                 return false;
            //             }
            //         }
            //         if (banner[bi].view == -1 && banner[bi].replytype == "force" && this.sticker === false) {
            //             return false;
            //         }
            //         if (banner[bi].view == -1 && banner[bi].replytype == "force") {
            //             return false;
            //         }
            //         if (banner[bi].view != -1) {
            //             this.replySticker = 0;
            //         }
            //     }
            //     else if (banner[bi].status == "sticker") {
            //         this.sticker = true;
            //         if (banner[bi].view == -1 && banner[bi].replytype == "optional") {
            //             if (this.sticker) {
            //                 this.sticker = false;
            //             }
            //             if (this.reply === false) {
            //                 return false;
            //             }
            //             this.replySticker++;
            //         }
            //         if (banner[bi].view == -1 && banner[bi].replytype == "force" && this.reply === false) {
            //             return false;
            //         }
            //         if (banner[bi].view != -1) {
            //             this.replySticker = 0;
            //         }
            //     }
            // }
            // console.dir(this.replySticker, this.reply, this.sticker)
            // // if(this.replySticker>0){
            // //   return false;
            // // }
            // return true;
        }
        return false;

    },
    rejectBanner: function (msg, orderid, tag, vip, odcid) {
        this.prefix = "rej-" + orderid.toString() + "-" + tag + "-" + odcid.toString();

        if (!vip) {
            this.prefix = "i" + this.prefix;
        }
        this.btns = [
            [bot.inlineButton('با بنرش مشکل دارم', {callback: this.prefix + '-' + "banner"}),
                bot.inlineButton('با ریپلایش مشکل دارم', {callback: this.prefix + '-' + 'reply'})],
            [bot.inlineButton('با قیمتش مشکل دارم', {callback: this.prefix + '-' + 'price'}),
                bot.inlineButton('با تبلیغ دهنده مشکل دارم', {callback: this.prefix + '-' + 'owner'})],
            [bot.inlineButton('ظرفیت تبلیغ کانالم پره', {callback: this.prefix + '-' + 'full'}),
                bot.inlineButton('با سیستم واریز مشکل دارم', {callback: this.prefix + '-' + 'deposit'})],
            [bot.inlineButton('مشکلات دیگر', {callback: this.prefix + '-' + 'other'})],
            [bot.inlineButton('بازگشت', {callback: this.prefix + '-' + 'back'})]
        ];
        console.log(this.prefix)
        this.btns = bot.inlineKeyboard(this.btns);
        bot.sendMessage(msg.from.id, varM.msg.reject, {replyMarkup: this.btns}).then(function (ilk) {
            fs.writeFileSync(chatpath + msg.from.id, ilk.result.message_id, 'utf8')
        })
    },
    fixBanners: function (banners) {
        if (banners.length > 0) {
            this.query = "";
            this.rid = -1;
            this.sid = -1;
            this.price=null;
            this.tag=null;
            this.suborderid=null;
            this.prequery="";
            banners[0].query = "";
           // console.dir(banners);
                
            for (bi = 0; banners && bi < banners.length; bi++) {
                if (banners[bi].text && banners[bi].text.trim().indexOf("https://t.me/") == 0) {
                    pars = banners[bi].text.trim().replace('https://t.me/', '');
                    pars = pars.split('/');
                    banners[bi].messageid = pars[1]
                    banners[bi].senderid = forwardchannel.id
                }
                if (banners[bi].chatid && banners[bi].chatid != 'undefiend') {

                    if (banners[bi].replyPrice != 0 && banners[bi].status == "reply") {
                        this.rid = banners[bi].bannerid;
                        this.price=banners[0].replyPrice;
                        this.tag=banners[bi].postlink;
                        this.suborderid=banners[bi].orderdetailid;
                    }
                    else if (banners[bi].replyPrice == 0 && banners[bi].status == "reply") {
                        this.rid = banners[bi].bannerid;
                        this.price=banners[0].price;
                        this.tag=banners[bi].postlink;
                        this.suborderid=banners[bi].orderdetailid;
                    }
                    else if (banners[bi].status == "sticker") {
                        this.sid = banners[bi].bannerid;
                        this.price=banners[0].price;
                        this.tag=banners[bi].postlink;
                        this.suborderid=banners[bi].orderdetailid;
                    }
                }
            }
            //console.log();
            if( this.tag){
                this.prequery+=" channelTag='"+ this.tag+"' ,";
            }
            if( this.suborderid){
                this.prequery+=" categoryId="+ this.suborderid+" ,";
            }
            if (this.sid > 0 && !isNaN(this.sid) && this.rid > 0 && !isNaN(this.rid)&&this.price) {
                this.query = " UPDATE `raaz_orderdetail` SET "+this.prequery+" channelCost = CASE WHEN bannerid = " + this.sid + " THEN " + this.price +
                    " WHEN bannerid = " + this.rid + " THEN " + banners[0].replyPrice + " END where bannerid=" + this.sid + " or  bannerid =" + this.rid + ";";
            }
            else if (this.sid > 0 && !isNaN(this.sid)&&this.price) {
                this.query = " UPDATE `raaz_orderdetail` SET   "+this.prequery+" channelCost = CASE WHEN bannerid = "
                    + this.sid + " THEN " +  this.price +
                    " END where bannerid=" + this.sid + ";";
            }
            else if (this.rid > 0 && !isNaN(this.rid)&&this.price) {
                this.query = " UPDATE `raaz_orderdetail` SET  "+this.prequery+" channelCost = CASE WHEN bannerid = " + this.rid + " THEN " +  this.price +
                    " END where bannerid=" + this.rid + ";";
            }
            // if (!(this.sid > 0 && !isNaN(this.sid) && this.rid > 0 && !isNaN(this.rid))) {
            //     this.query = " UPDATE `raaz_orderdetail` SET `channelCost` = CASE WHEN bannerid = " + this.sid + " THEN " + banners[0].price +
            //         " WHEN bannerid = " + this.rid + " THEN " + banners[0].replyPrice + " END where bannerid=" + this.sid + " or  bannerid =" + this.rid + ";";
            // }
            // else if  (!(this.sid > 0 && !isNaN(this.sid))) {
            //     this.query = " UPDATE `raaz_orderdetail` SET `channelCost` = CASE WHEN bannerid = " + this.sid + " THEN " + banners[0].price +
            //         " END where bannerid=" + this.sid + ";";
            // }
            banners[0].query = this.query;
            console.log(this.query);
                
        }
        return banners;
    },
    fixUpdate: function (banners) {
        if (banners.length > 0) {
            this.query = "";
            this.rid = -1;
            this.sid = -1;
            banners[0].query = "";
            for (bi = 0; banners && bi < banners.length; bi++) {
                if (banners[bi].text && banners[bi].text.trim().indexOf("https://t.me/") == 0) {
                    pars = banners[bi].text.trim().replace('https://t.me/', '');
                    pars = pars.split('/');
                    banners[bi].messageid = pars[1]
                    banners[bi].senderid = forwardchannel.id
                }
                if (banners[bi].chatid && banners[bi].chatid != 'undefiend') {
                    if (banners[bi].replyPrice != 0 && banners[bi].status == "reply") {
                        this.rid = banners[bi].bannerid;
                    }
                    else if (banners[bi].status == "sticker") {
                        this.sid = banners[bi].bannerid;
                    }
                }
            }
            if (this.sid > 0 && !isNaN(this.sid) && this.rid > 0 && !isNaN(this.rid)) {
                this.query = " UPDATE `raaz_orderdetail` SET `channelCost` = CASE WHEN bannerid = " + this.sid + " THEN " + banners[0].price +
                    " WHEN bannerid = " + this.rid + " THEN " + banners[0].replyPrice + " END where bannerid=" + this.sid + " or  bannerid =" + this.rid + ";";
            }
            else if (this.sid > 0 && !isNaN(this.sid)) {
                this.query = " UPDATE `raaz_orderdetail` SET `channelCost` = CASE WHEN bannerid = " + this.sid + " THEN " + banners[0].price +
                    " END where bannerid=" + this.sid + ";";
            }
            banners[0].query = this.query;
        }
        return banners;
    },
}
