/**
 * Created by ali on 8/9/17.
 */
module.exports= {
    bannerQ: function (obj) {
        this.query = " insert into bot_banners(postlink,senderid,messageid,time,orderdetailid,status,type,text,link,filetype,initview) " +
            " values( '" + obj.postlink + "','" + obj.from + "','" + obj.msgid + "','" + obj.date +
            "',(select orderdetailid from raaz_orderdetail where status='banner' order by orderdetailid DESC limit 1),'banner',1,'"
            + obj.text + "','" + obj.link + "','" + obj.type + "',"+ obj.view+")" +
            " ;" +
            " update raaz_orderdetail set status='reply',fromid='" + (obj.fromid||-1) + "',access_hash='" + (obj.access_hash||-1) + "' " +
            " where status='banner' order by orderdetailid DESC limit 1;";
        return this.query;
        //,startmembers='" +(obj.membercount||-1)+ "'
    },
    replyQ: function (obj) {
        this.query = " insert into bot_banners(postlink,senderid,messageid,time,orderdetailid,status,type,text,link,filetype,initview) " +
            " values( '" + obj.postlink + "','" + obj.from + "','" + obj.msgid + "','" + obj.date +
            "',(select orderdetailid from raaz_orderdetail where status='reply' order by orderdetailid DESC limit 1),'reply',1,'" +
            obj.text + "','" + obj.link + "','" + obj.type +"',0);"+
            // "select orderid from raaz_orderdetail where status='reply' order by orderdetailid DESC limit 1;" +
            " update raaz_orderdetail set status='replytype' where status='reply' order by orderdetailid DESC limit 1;"
        return this.query;
    },
    replyTypeQ: function (replytype) {
        this.query =" update raaz_orderdetail set status='postlimit',replytype='"+replytype+"' where status='replytype' order by orderdetailid DESC limit 1;"
        return this.query;
    },
    postLimitQ: function (postlimit) {
        // this.query ="select orderid from raaz_orderdetail where status='postlimit' order by orderdetailid DESC limit 1;"
        this.query =" update raaz_orderdetail set status='screenshot',postlimit="+postlimit+" where status='postlimit' order by orderdetailid DESC limit 1;"
        return this.query;
    },
    screenShotQ: function (msgid) {
        this.query ="select orderid,orderdetailid from raaz_orderdetail where status='screenshot' order by orderdetailid DESC limit 1;" +
            " update raaz_orderdetail set status='waitforverify',screenshotid='"+msgid+"' where status='screenshot' order by orderdetailid DESC limit 1;"
        return this.query;
    },
    date: function (date) {
        this.query ="select orderid from raaz_orderdetail where status='date' order by orderdetailid DESC limit 1;" +
            " update raaz_orderdetail set status='adminpassed',begintime='"+date+"' where status='date' order by orderdetailid DESC limit 1;"
        return this.query;
    },
    cancelQ: function (cancel,orderdetailid) {
        siteStatus=-2;
        if(cancel=="finish"){
            siteStatus=6;
        }
        this.query ="select orderid,orderdetailid from raaz_orderdetail where orderdetailid="+orderdetailid+" order by orderdetailid DESC limit 1;" +
            " update raaz_orderdetail set adminop='"+cancel+"',sitestatus="+siteStatus+" where orderdetailid="+orderdetailid+" order by orderdetailid DESC limit 1;"
        return this.query;
    },
    ibannerQ: function (obj) {
        this.query = " insert into bot_banners(postlink,senderid,messageid,time,orderdetailid,status,type,text,link,filetype,initview) " +
            " values('" + obj.postlink + "','" + obj.from + "','" + obj.msgid + "','" + obj.date +
            "',(select orderCategoryDetailid from raaz_ordercategorydetail where status='banner' order by orderCategoryDetailid DESC limit 1),'banner',2,'"
            +obj.text + "','" + obj.link + "','" + obj.type +"',"+ obj.view+");"+
            " update raaz_ordercategorydetail set status='reply',fromid='" + obj.fromid + "',access_hash='" + (obj.access_hash||-1) + "' where status='banner' order by orderCategoryDetailid DESC limit 1;";
        return this.query;
        // startmembers='" + obj.membercount + "',
    }
    ,
    ireplyQ: function (obj) {
        this.query = " insert into bot_banners(senderid,messageid,time,orderdetailid,status,type,text,link,filetype,initview) " +
            " values( '" + obj.from + "','" + obj.msgid + "','" + obj.date +
            "',(select orderCategoryDetailid from raaz_ordercategorydetail where status='reply' order by orderCategoryDetailid DESC limit 1),'reply',2,'" +
            obj.text + "','" + obj.link + "','" + obj.type +"',0);"+
            // "select orderid from raaz_ordercategorydetail where status='reply' order by orderCategoryDetailid DESC limit 1;" +
            " update raaz_ordercategorydetail set status='replytype' where status='reply' order by orderCategoryDetailid DESC limit 1;"
        return this.query;
    },
    ireplyTypeQ: function (replytype) {
        this.query =" update raaz_ordercategorydetail set status='postlimit',replytype='"+replytype+"' where status='replytype' order by orderCategoryDetailId DESC limit 1;"
        return this.query;
    },
    ipostLimitQ: function (postlimit) {
        // this.query ="select orderCategoryDetailid,orderid from raaz_ordercategorydetail where status='postlimit' order by orderCategoryDetailid DESC limit 1;"
        this.query =" update raaz_ordercategorydetail set status='screenshot',postlimit="+postlimit+" where status='postlimit' order by orderCategoryDetailId DESC limit 1;"
        return this.query;
    },
    iscreenShotQ: function (msgid) {
        this.query ="select orderCategoryDetailid,orderid,performDate from raaz_ordercategorydetail where status='screenshot' order by orderCategoryDetailid DESC limit 1;" +
            " update raaz_ordercategorydetail set status='waitforverify',screenshotid='"+msgid+"' where status='screenshot' order by orderCategoryDetailid DESC limit 1;"
        return this.query;
    },
    idate: function (date) {
        this.query ="select orderCategoryDetailid,orderid from raaz_ordercategorydetail where status='date' order by orderCategoryDetailid DESC limit 1;" +
            " update raaz_ordercategorydetail set status='adminpassed',begintime='"+date+"' where status='date' order by orderCategoryDetailid DESC limit 1;"
        return this.query;
    },
    icancelQ: function (cancel,orderdetailid) {
        siteStatus=-2;
        if(cancel=="finish"){
            siteStatus=6;
        }
        this.query ="select orderid,orderCategoryDetailid from raaz_ordercategorydetail where orderCategoryDetailid="+orderdetailid+" order by orderCategoryDetailid DESC limit 1;" +
            " update raaz_ordercategorydetail set adminop='"+cancel+"',sitestatus="+siteStatus+" where orderCategoryDetailid="+orderdetailid+" order by orderCategoryDetailid DESC limit 1;"
        return this.query;
    },
    endbannerset: function () {
        this.query=/*" select orderid from raaz_orderdetail where  status='reply' order by orderdetailid DESC limit 1;" +*/
            "update raaz_orderdetail set status='postlimit',replytype='optional' where status='reply' order by orderdetailid DESC limit 1;" ;
        return this.query;
    },
    endibannerset: function () {
        this.query=/*" select  orderid from raaz_ordercategorydetail where  status='reply' order by orderCategoryDetailid DESC limit 1;" +*/
            "update raaz_ordercategorydetail set status='postlimit',replytype='optional' where status='reply' order by orderCategoryDetailid DESC limit 1;" ;
        return this.query;
    }
}
