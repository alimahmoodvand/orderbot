/**
 * Created by ali on 8/9/17.
 */
module.exports= {

    bannersQ: function (orderdetailid) {
        this.query = " select bb.*,rod.replytype as replytype,rod.postlimit as postlimit,rod.performDate as performDate, " +
            "  rod.screenshotid as screenshotid,rod.productview as view,rod.view as curview,rod.orderid as orderid, " +
            " rod.channelCost as price,cp.channelTag as TelegramId,rod.adminDescription as adminDescription,rod.admintitle as title  " +
            " from  raaz_orderdetail rod join  bot_banners bb on rod.orderdetailid=bb.orderdetailid " +
            " join channel_product cp on cp.channelProductId=rod.productid " +
            " where bb.type=1 and rod.orderdetailid=" + orderdetailid+" and rod.status='adminpassed';";
        return this.query;
    },
    curBannersQ: function (orderdetailid,status) {
        this.query = " SELECT rod.* from raaz_orderdetail rod  " +
            " WHERE rod.orderdetailid=" + orderdetailid+" and rod.status='"+status+"' order by  rod.view desc limit 1";
        return this.query;
    },
    bannersChannelQ: function (orderdetailid) {
        this.query = " select bb.*,cp.channelTag,rod.replytype as replytype,rod.orderid as vorderid,rod.postlimit as postlimit, " +
            " rod.performDate as performDate,rod.fromid as fromid,rod.access_hash as access_hash, rod.screenshotid as screenshotid from  raaz_orderdetail rod" +
            " join  bot_banners bb on rod.orderdetailid=bb.orderdetailid " +
            " join channel_product cp on rod.productid=cp.channelProductId " +
            " where bb.type=1 and rod.orderdetailid=" + orderdetailid+" and rod.status='adminpassed' ;";
        return this.query;
    },
    newMessageQ: function (/*fromids,senderids,messageids*/) {
        this.query = `select * ,count(orderdetailid) as rcount from (select bb.*,cp.channelTag,rod.replytype as 
            replytype,rod.orderid as vorderid,rod.postlimit as postlimit,  rod.performDate as performDate,rod.fromid as
            fromid,rod.access_hash as access_hash, rod.screenshotid as screenshotid,  count(bb.orderdetailid) as bcount 
            ,  ch.chatid as cchatid
            from  raaz_orderdetail rod  join  bot_banners bb on rod.orderdetailid=bb.orderdetailid  join channel_product cp 
            on rod.productid=cp.channelProductId  join channelscopy ch on ch.TelegramId=cp.channelTag   where bb.type=1 and rod.status='adminpassed'
            group by bb.orderdetailid,bb.verify order by bb.verify desc) as tmp
            group by orderdetailid
            having rcount>0 and verify=1;`
        return this.query;

    },
    updateNewMessageQ: function (fromids,senderids,messageids) {
        this.query = " update  bot_banners bb " +
            " join  raaz_orderdetail rod on rod.orderdetailid=bb.orderdetailid " +
            " join channel_product cp on rod.productid=cp.channelProductId " +
            " join channelscopy ch on ch.TelegramId=cp.channelTag  " +
            " and bb.type=1 and rod.status='adminpassed' " +
            " and ch.fromid in (" + fromids+") " +
            " and bb.senderid in (" + senderids+") " +
            " and bb.messageid in (" + messageids+") " +
            " SET verify=1 ;";
        return this.query;
    },
    inewMessageQ: function (/*fromids,senderids,messageids*/) {
        this.query = `select bb.* ,rocd.orderid ,rocd.orderCategoryDetailId 
from  raaz_orderdetail rod  join  bot_banners bb on rod.bannerid=bb.bannerid  join raaz_ordercategorydetail rocd 
on rocd.orderCategoryDetailId=bb.orderdetailid 
  where bb.type=2 and rod.status='adminpassed' and (rocd.status='ya' or rocd.status='adminpassed')  and
bb.status<>'banners' and bb.verify=1 and bb.bannerverify=1 group by bb.orderdetailid,bb.postlink;`
        return this.query;

    },
    iupdateNewMessageQ: function (fwds,fromids,senderids,messageids) {

        this.query = " update  bot_banners bb " +
            " JOIN (SELECT * from bot_banners  where type=2 and status='banner') as bbb on bb.orderdetailid=bbb.orderdetailid " +
            " join  raaz_ordercategorydetail rocd on rocd.orderCategoryDetailId=bb.orderdetailid " +
            //" join channel_product cp on rod.productid=cp.channelProductId " +
            " join channelscopy ch on ch.TelegramId=bb.postlink  " +
            " and bb.type=2 and (rocd.status='ya' or rocd.status='adminpassed')  and bb.chatid is not null " +
            " SET bb.verify = CASE  ";
            for(fi=0;fi<fwds.length;fi++){
                this.query+=" WHEN bb.senderid =" + fwds[fi].senderid+" and bb.messageid= " + fwds[fi].messageid+
                    " and ch.fromid= " + fwds[fi].fromid+" THEN 1 ";
            }
        this.query+=" ELSE bb.verify END,  bb.bannerverify = CASE  ";
        for(fi=0;fi<fwds.length;fi++){
                this.query+=" WHEN bbb.senderid =" + fwds[fi].senderid+" and bbb.messageid= " + fwds[fi].messageid+
                    " and ch.fromid= " + fwds[fi].fromid+" THEN 1 ";
            }
        this.query+=" ELSE bb.bannerverify END   where  ch.fromid in (" + fromids+"); " ;
            // " and ch.fromid in (" + fromids+") " +
            // " SET bb.verify= CASE " +
            // "  ELSE bb.verify END, " +
            // " bb.bannerverify= CASE " +
            // " WHEN bb.senderid in (" + senderids+") and bb.messageid in (" + messageids+") THEN 1 ELSE bb.bannerverify END;"
        return this.query;
    },
    ibannersChannelQ: function (bannerid) {
        this.query = " select bb.*,ch.telegramid,rod.orderdetailid asiorderdetailid,rod.postlimit as postlimit" +
            " from  raaz_orderdetail rod " +
            " join  bot_banners bb on rod.bannerid=bb.bannerid " +
            "  join raaz_ordercategorydetail rocd on rocd.orderCategoryDetailId=bb.orderdetailid " +
            "  join view_categories vc on vc.orderCategoryDetailId = rocd.orderCategoryDetailId" +
            "  join channel_channelcategories cc on cc.categoryId = vc.category " +
            "  join channels ch on ch.telegramid=cc.channeltag " +
            " where bb.postlink=ch.telegramid and bb.type=2 and rod.orderdetailid=" + bannerid+";";
        return this.query;
    },
    ibannersQ: function (orderCategoryDetailId,chatid,tag) {
        this.query = " select bb.*,rocd.replytype as replytype,rocd.postlimit as postlimit,rocd.orderid as orderid,rocd.performDate as performDate, " +
            "  rocd.orderCount as view,rocd.view as curview,cpr.price as price,cpr.replyPrice as replyPrice,'"+tag+"' as channelTag," +
            " if(cpr.channelTag='"+tag+"',3,2) as prority ,rocd.screenshotid as screenshotid, " +
            " rocd.adminDescription as adminDescription,rocd.admintitle as title " +
            " from  raaz_ordercategorydetail rocd join  bot_banners bb on rocd.orderCategoryDetailId=bb.orderdetailid" +
            "  JOIN  channel_price cpr on (cpr.orderCategoryDetailId=rocd.orderCategoryDetailId and (cpr.channelTag='"+tag+"' or cpr.channelTag is null))" +
            " where (bb.`status`='banner' or bb.chatid is null or bb.chatid='"+chatid+"') and (bb.`status`='banner' or postlink is null or postlink='"+tag+"') " +
            "  and  rocd.status!='finished' and bb.type=2 and rocd.orderCategoryDetailId=" + orderCategoryDetailId+
            " and if(cpr.channelTag='"+tag+"',3,2)=(SELECT max(if(cpr1.channelTag='"+tag+"',3,2))FROM channel_price cpr1 " +
            " where cpr1.orderCategoryDetailId=" + orderCategoryDetailId+" and (cpr1.channelTag='"+tag+"' or cpr1.channelTag is null ));";
        return this.query;
    },
    icurBannersQ: function (orderCategoryDetailId,chatid,tag,status) {
        this.query = " SELECT rod.channelTag,rod.starttime,rod.view,rod.channelCost,rocd.orderCategoryDetailId,rocd.orderid,rocd.admintitle,rocd.adminDescription, " +
            " rocd.screenshotid,rocd.performDate,rod.view,rocd.orderCount productview " +
            " from raaz_orderdetail rod join raaz_ordercategorydetail rocd on rocd.orderCategoryDetailId=rod.categoryId and bannerid is not null "+
        " WHERE rocd.orderCategoryDetailId="+orderCategoryDetailId+ " and rod.channelTag='"+tag+ "' and rod.status='"+status+"' order by  rod.view desc limit 1 ";
        return this.query;
    },
    ibannerQ: function (orderCategoryDetailId) {
        this.query = " select bb.*,rocd.orderCount as view,rocd.postlimit as postlimit,rocd.crondata as crondata,rocd.fromid as fromid,rocd.access_hash as access_hash," +
            " rocd.screenshotid as screenshotid,rocd.adminop as adminop ,rocd.orderid as orderid from  raaz_ordercategorydetail rocd join  bot_banners bb on rocd.orderCategoryDetailId=bb.orderdetailid " +
            " where  bb.status='banner' and bb.type=2 and rocd.orderCategoryDetailId=" + orderCategoryDetailId+";";
        return this.query;
    },
    iallBannerQ: function (orderCategoryDetailId,tag) {
        this.query = " select bb.*,rocd.fromid as fromid,rocd.access_hash as access_hash,rocd.replytype as replytype,rocd.orderid as iorderid,rocd.postlimit as postlimit,rocd.performDate as performDate," +
            " rocd.screenshotid as screenshotid  from  raaz_ordercategorydetail rocd join  bot_banners bb on rocd.orderCategoryDetailId=bb.orderdetailid " +
            " where bb.type=2 and  rocd.status!='finished'  and rocd.orderCategoryDetailId=" + orderCategoryDetailId+" and (bb.postlink='"+tag+"' or bb.status='banner');";
        return this.query;
    },
    updateBannerQ: function (bannerid,senderid,messageid,chatid) {
        if(senderid&&messageid)
            this.query ="update bot_banners set chatid='"+chatid+"',senderid='"+senderid+"',messageid='"+messageid+"' where bannerid=" + bannerid+";";
        else
            this.query ="update bot_banners set chatid='"+chatid+"' where bannerid=" + bannerid+";";
        return this.query;
    },
    insertReplyQ: function (obj) {
        this.query = " insert into bot_banners(postlink,chatid,senderid,messageid,time,orderdetailid,status,type,text,link,filetype) " +
            " values('" + obj.postlink + "','" + obj.chatid + "','" + obj.from + "','" + obj.msgid + "','" + obj.date +
            "',"+obj.orderdetailid+",'"+obj.status+"',"+obj.type+",'"
            + obj.text + "','" + obj.link + "','" + obj.filetype + "');";
        this.query+=" insert into raaz_orderdetail(orderid,bannerid,status) " +
            " select rocd.orderid,bb.bannerid,'adminpassed' from  raaz_ordercategorydetail rocd join  bot_banners bb on rocd.orderCategoryDetailId=bb.orderdetailid and bb.type=2 " +
            " where rocd.orderCategoryDetailId='"+obj.orderdetailid+"' and (bb.chatid='"+obj.chatid+"' or bb.chatid is null) order by bannerid desc  limit 1 ;";
        return this.query;
    },
}
