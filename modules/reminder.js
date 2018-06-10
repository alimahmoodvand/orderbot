module.exports= {
    reminderVip: function () {
        this.rdate=utilM.getRCronTime(new Date())
        this.ndate=utilM.getCronTime(new Date().setSeconds(new Date().getSeconds() + (0.33 * hour)))
        this.query = " select rod.*,ch.chatid from raaz_orderdetail rod join channelscopy ch on ch.TelegramId= rod.channelTag " +
            " where rod.bannerid is null and rod.screenshotid is not null and rod.performDate <NOW() and rod.status='adminpassed' " +
            " and ch.chatid is not null and ( cronTime is null or cronReverse(cronTime) <'"+this.rdate+"' ) ; " +
            " update raaz_orderdetail set cronTime='"+this.ndate+"'"+
            " where bannerid is null and screenshotid is not null and performDate <NOW() and status='adminpassed' " +
            " and ( cronTime is null or cronReverse(cronTime) <'"+this.rdate+"' ) ; " ;
// console.log(this.query);
// return;
            new exeqM.exec(this.query, function (err, result) {
            if(!err&&result&&result.length==2){
                if(result[0]&&result[0].length>0) {
                    this.msgs = [];
                    result=result[0];
                   // console.log(result.length);
                    for (ri = 0; ri < result.length; ri++) {
                        this.btns = [];
                        this.btns.push([bot.inlineButton("ویژه -" + result[ri].productView + " - " + result[ri].channelTag,
                            {callback: "po-" + result[ri].orderDetailId + "-" + result[ri].channelTag + "-" + new Date(result[ri].performDate).getTime()})]);
                        this.btns = bot.inlineKeyboard(this.btns);
                        this.msgs.push({
                            chatid: result[ri].chatid,
                            text: varM.msg.reminderinprogress + "\r\nتگ کانال :@" + result[ri].channelTag + utilM.getOrderNumber(result[ri].orderId, result[ri].orderDetailId),
                            replyMarkup: this.btns
                        })
                    }
                   // console.log(this.msgs);


                    new autilM.sendBulk(this.msgs)
                }
                // bot.sendMessage(banners[0].cchatid, varM.msg.reminderinprogress + ": @" + banners[0].channelTag, {replyMarkup: this.btns})
                //     .then(function (ilk) {
                //         fs.writeFileSync(chatpath + banners[0].cchatid, ilk.result.message_id, 'utf8')
                //     })
            }
        })
    },
    reminderMass:function () {
        this.query = "  update raaz_ordercategorydetail set status='ya',sitestatus=5  " +
            " where  screenshotid is not null and  performDate <NOW() and  status='adminpassed'; ";
        // console.log(this.query);
        // return;
        new exeqM.exec(this.query, function (err, result) {
            if(!err&&result&&result.length>0){
            }
        })
    },
}