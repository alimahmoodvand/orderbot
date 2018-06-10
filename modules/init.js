/**
 * Created by ali on 7/31/17.
 */
module.exports={
    init:function () {
        const TeleBot = require('telebot');
        global.schedule = require('node-schedule');
        global.querystring = require('querystring');
        global.utf8 = require('utf8');
        global.dateFormat = require('dateformat');
        global.http = require('http');
        global.fs = require('fs');
        global.mysql = require('mysql');
        global.async = require('async');
        global.randomstring = require("randomstring");
        global.request = require("request");
        global.path = require("path");
        global.json2csv = require('json2csv');
        // var time = require('time');
        // global.now = new time.Date();
        //
        // now.setTimezone("Asia/Tehran");


        // <VirtualHost *:80>
        // ServerName 141.105.69.162
        // Redirect "/" "https://141.105.69.162/"
        // </VirtualHost>


        global.token="429094126:AAEAmrbq9a-kWf_oPzQxnfkogJGcYlypubk";
        global.bot = new TeleBot({token:token, // Required. Telegram Bot API token.
            webhook: {
                cert: '/etc/ssl/certs/apache-selfsigned.crt',
                key: '/etc/ssl/private/apache-selfsigned.key',
                url: 'https://199.127.99.12/userbot.php?port=1120',
                host: 'localhost',
                port: 1120,
                maxConnections: 100
            },usePlugins: ['askUser']
        });
        // global.bot = new TeleBot(token);
        global.atoken="466160592:AAEK2-vbZ3VVezMWSPsMJA77uvwrrQWammY";
        global.abot = new TeleBot({token:atoken, // Required. Telegram Bot API token.
            webhook: {
                cert: '/etc/ssl/certs/apache-selfsigned.crt',
                key: '/etc/ssl/private/apache-selfsigned.key',
                url: 'https://199.127.99.12/userbot.php?port=1121',
                host: 'localhost',
                port: 1121,
                maxConnections: 100
            },usePlugins: ['askUser']
        });
        global.express=require('express')
        global.app=new express();
        global.port=5000;
        bodyParser = require('body-parser');
        global.moment = require('moment-jalaali')
      // moment().tz('Asia/Tehran')
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        global.wsM=require('./ws')
        global.routerM=require('./router')
        global.uphM=require('./updateshandler')
        global.botM=require('./botmanager')
        global.abotM=require('./adminbotmanager')
        global.exeqM=require('./exeq')
        global.utilM=require('./util')
        global.autilM=require('./adminutil')
        global.uutilM=require('./userutil')
        global.cutilM=require('./cronutil')
        global.aqM=require('./adminqueries')
        global.uqM=require('./userqueries')
        global.cronM=require('./crons')
        global.reqhM=require('./requesthandler')
        global.varM=require('./vars')
        global.reM=require('./reminder')
       global.imgUrl="http://199.127.99.12:8080/orderbot/"
        global.kilo=1000;
        global.hour=3600;
      global.originalchannel={
            id:"-1001240644181",
            tag:"@raaz_co_banner"
        };
        global.sschannel={
            id:"-1001301791390",
            tag:"@raazscreenshot"
        };
      global.forwardchannel={
        id:"-1001394495729",
        tag:"@raazforward"
      };
        global.admins=[
         {
            id:"241733745",
            username:"raaz co"
        },{   id:"71536363",
            username:"ali mv"
    }];
        global.screenshot="screenshot";
        global.pool  = mysql.createPool({
            connectionLimit : 100,
            host            : 'localhost',
            user            : 'root',
            password        : '@Rmin3737g0nzales@',
            database        : 'raaz_website1',
            multipleStatements: true,
          timezone: 'utc' ,

          sql_mode:'only_full_group_by',
            charset:'utf8mb4'
        });
        //insert into bot_banners(senderid,messageid,time,orderdetailid,status,type,text,link,filetype)  select '-1001007801221','61193','1502196609',orderdetailid,'main',1,x'00631064806320020062e06280631064606af062706310020064506280627063106a9000a000a00d70020063406cc062e0020064106310632062706460647002000d7000a000a0040006f006600660069006300690061006c005000650072007300690061006e0054007700690074007400650072','AgADBAADFqoxGyxrSVDbtKY15LKGo1PpaBkABMlMOI7hzDhP5voCAAEC','photo' from raaz_orderdetail where status='banner' order by orderdetailid DESC limit
        global.filename="text.txt";
        global.httpCredRequest = {
            host: 'localhost',
            port: '80',
            path: '/myphp/MadelineProtoBot/MadelineProto/api/addtochannel.php',
            method: 'POST',
            headers: {
                'ciphers': 'DES-CBC3-SHA',
                // 'Content-Type': 'application/json'
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
       // reqhM.addTochannel({"username":"OfficialPersianTwitter"});
      // bot.sendPhoto("@testviewchannel", rootPath+"img/9xtk1HjCZnsnqE8qYph7p4Bc3bQ0OduKFYrlPbOo.jpg").then(function (res2) {
      //   console.log("eeeee.",res2);
      // }).catch(function (err) {
      //   console.log("eeeee.",err);
      // })
    }
}
