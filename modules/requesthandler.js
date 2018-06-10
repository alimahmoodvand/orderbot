/**
 * Created by ali on 8/12/17.
 */
module.exports= {
    getUpdates:function (data,cb) {
        //console.log(data)
        this.async=require('async')
        this.async.retry({times: 10, interval: 15000},function (callback) {
            this.post_data={
                username:data.username,
                msgs:[]
            };

            for(di=0;di<data.msgs.length;di++){
                this.post_data.msgs.push(data.msgs[di]);
            }
            
            this.post_data.msgs=JSON.stringify(this.post_data.msgs);

                
            this.post_data = querystring.stringify(this.post_data);
            // console.log(this.post_data);
            // return;
            // console.log(this.post_data)
            httpCredRequest.path="/myphp/MadelineProtoBot/MadelineProto/api/checkdone.php";
            this.post_req = http.request(httpCredRequest, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                   // console.log(chunk);
                    try {
                        if (res.statusCode == 200)
                            callback(null, JSON.parse(chunk));
                        else
                            callback(chunk, null);
                    }
                    catch (err){
                       // console.log(err.message);
                            
                        callback(chunk, null);
                    }
                });

            });
            this.post_req.on('error',function (err) {
                callback(err,null);
            })
            this.post_req.write(this.post_data);
            this.post_req.end();
        },function(err, result) {
            cb(err,result)
        })

    },
    getMembers:function (data,cb) {
        //console.log(data)
        this.async=require('async')
        this.async.retry({times: 10, interval: 15000},function (callback) {
            this.post_data = querystring.stringify(data);
           // console.log(this.post_data)
            httpCredRequest.path="/myphp/MadelineProtoBot/MadelineProto/api/getmember.php";
            this.post_req = http.request(httpCredRequest, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                   // console.log(chunk);
                    try {
                        if (res.statusCode == 200)
                            callback(null, JSON.parse(chunk));
                        else
                            callback(chunk, null);
                    }
                    catch (err){
                        callback(chunk, null);
                    }
                });

            });
            this.post_req.on('error',function (err) {
                callback(err,null);
            })
            this.post_req.write(this.post_data);
            this.post_req.end();
        },function(err, result) {
            cb(err,result)
        })

    },
    igetUpdates:function (data,cb) {
       // console.log(data)
        this.async = require('async')
        this.async.retry({times: 10, interval: 15000}, function (callback) {
                this.post_data = JSON.stringify(data);

                httpCredRequest.path = "/getmessage"
                this.post_req = http.request(httpCredRequest, function (res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        //  console.log(res.statusCode);
                        if (res.statusCode == 200)
                            callback(null, JSON.parse(chunk));
                        else
                            callback(chunk, null);
                    });

                });
                this.post_req.on('error', function (err) {
                    callback(err, null);
                })
                this.post_req.write(this.post_data);
                this.post_req.end();
            }
            , function (err, result) {
                cb(err, result)
            })
    },
    getBulkUpdates:function (data,cb) {
            this.async=require('async')
            this.async.retry({times: 10, interval: 15000},function (callback) {
                this.post_data = JSON.stringify(data);
                httpCredRequest.path = "/getupdates"
                this.post_req = http.request(httpCredRequest, function (res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                         console.log(res.statusCode,chunk);
                        if (res.statusCode == 200)
                            callback(null, JSON.parse(chunk));
                        else
                            callback(chunk, null);
                    });

                });
                this.post_req.on('error', function (err) {
                    callback(err, null);
                })
                this.post_req.write(this.post_data);
                this.post_req.end();
            },function(err, result) {
                        cb(err,result)
                    })
    },
    getBulkTargetsUpdates:function (data,cb) {
    this.async=require('async')
    this.async.retry({times: 10, interval: 15000},function (callback) {
        this.post_data = querystring.stringify(data);
        httpCredRequest.path = "/myphp/MadelineProtoBot/MadelineProto/api/checklimit.php"
        this.post_req = http.request(httpCredRequest, function (res) {
            res.setEncoding('utf8');
            let mychunk = [];
            res.on('data', function (chunk) {
                try {
                    if (res.statusCode == 200)
                        callback(null, JSON.parse(chunk));
                    else
                        callback(chunk, null);
                }
                catch (err) {
                    console.log(err.message)
                    callback(chunk, null);
                }
            });
            res.on('end', function () {

            })
        });
        this.post_req.on('error', function (err) {
            console.log(err)
            callback(err, null);
        })
        this.post_req.write(this.post_data);
        this.post_req.end();

    },function(err, result) {
      cb(err,result)
    })
  } ,
    getOtherChannels:function (data,cb) {
    this.async=require('async')
    this.async.retry({times: 10, interval: 15000},function (callback) {
        this.post_data = querystring.stringify(data);
        // console.log(this.post_data);
        // return;
            
        httpCredRequest.path = "/myphp/MadelineProtoBot/MadelineProto/api/checkchannels.php"
        this.post_req = http.request(httpCredRequest, function (res) {
            res.setEncoding('utf8');
            let mychunk = [];
            res.on('data', function (chunk) {
                try {
                    if (res.statusCode == 200)
                        callback(null, JSON.parse(chunk));
                    else
                        callback(chunk, null);
                }
                catch (err) {
                    console.log(err.message)
                    callback(chunk, null);
                }
            });
            res.on('end', function () {

            })
        });
        this.post_req.on('error', function (err) {
            console.log(err)
            callback(err, null);
        })
        this.post_req.write(this.post_data);
        this.post_req.end();

    },function(err, result) {
      cb(err,result)
    })
  } ,
    igetOtherChannels:function (data,cb) {
        this.async=require('async')
        this.async.retry({times: 10, interval: 15000},function (callback) {
            this.post_data = querystring.stringify(data);
            // console.log(this.post_data);
            // return;
            httpCredRequest.path = "/myphp/MadelineProtoBot/MadelineProto/api/icheckchannels.php"
            this.post_req = http.request(httpCredRequest, function (res) {
                res.setEncoding('utf8');
                let mychunk = [];
                res.on('data', function (chunk) {
                    try {
                        if (res.statusCode == 200)
                            callback(null, JSON.parse(chunk));
                        else
                            callback(chunk, null);
                    }
                    catch (err) {
                        console.log(err.message)
                        callback(chunk, null);
                    }
                });
                res.on('end', function () {

                })
            });
            this.post_req.on('error', function (err) {
                console.log(err)
                callback(err, null);
            })
            this.post_req.write(this.post_data);
            this.post_req.end();

        },function(err, result) {
            cb(err,result)
        })
    } ,
    igetBulkTargetsUpdates:function (data,cb) {
        this.async=require('async')
        this.async.retry({times: 10, interval: 15000},function (callback) {
            this.post_data = querystring.stringify(data);
            // console.log(this.post_data);
            //     return
            httpCredRequest.path = "/myphp/MadelineProtoBot/MadelineProto/api/ichecklimit.php"
            this.post_req = http.request(httpCredRequest, function (res) {
                res.setEncoding('utf8');
                let mychunk = [];
                res.on('data', function (chunk) {
                    try {
                        if (res.statusCode == 200)
                            callback(null, JSON.parse(chunk));
                        else
                            callback(chunk, null);
                    }
                    catch (err) {
                        console.log(err.message)
                        callback(chunk, null);
                    }
                });
                res.on('end', function () {

                })
            });
            this.post_req.on('error', function (err) {
                console.log(err)
                callback(err, null);
            })
            this.post_req.write(this.post_data);
            this.post_req.end();

        },function(err, result) {
            cb(err,result)
        })
    } ,
    getMessageInfo:function (data,cb) {
    //console.log(data)
    this.async=require('async')
    this.async.retry({times: 10, interval: 15000},function (callback) {
      this.post_data = querystring.stringify(data);
     console.dir(this.post_data);
      httpCredRequest.path="/myphp/MadelineProtoBot/MadelineProto/api/messageinfo.php"
      this.post_req = http.request(httpCredRequest, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
           console.log(res.statusCode,chunk);
          if(res.statusCode==200)
            callback(null,JSON.parse(chunk));
          else
            callback(chunk,null);
        });

      });
      this.post_req.on('error',function (err) {
         // console.console.log(err);

        callback(err,null);
      })
      this.post_req.write(this.post_data);
      this.post_req.end();
    },function(err, result) {
      cb(err,result)
    })
  },
    addTochannel:function (data,cb) {
        //console.log(data)
        this.async=require('async')
        this.async.retry({times: 10, interval: 15000},function (callback) {
            this.post_data = querystring.stringify(data);
            httpCredRequest.path="/myphp/MadelineProtoBot/MadelineProto/api/addtochannel.php"
            //console.log(httpCredRequest)
            this.post_req = http.request(httpCredRequest, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                      console.log(res.statusCode,chunk);
                    if(res.statusCode==200)
                        callback(null,JSON.parse(chunk));
                    else
                        callback(chunk,null);
                });

            });
            this.post_req.on('error',function (err) {
                console.log(err)
                callback(err,null);
            })
            this.post_req.write(this.post_data);
            this.post_req.end();
        },function(err, result) {
            cb(err,result)
        })
    }
}
