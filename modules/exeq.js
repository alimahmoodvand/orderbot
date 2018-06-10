module.exports={
    exec:function(query,cb){
       // console.log(query)
        if(query) {
            async.retry({times: 10, interval: 2000}, function (callback) {
                pool.query(query, function (error, results, fields) {
                    if (error) {
                        console.log("sql error ", error);
                        // process.exit(0);
                        // g=lk;
                        callback(error, null);

                    }
                    else {
                        results = JSON.stringify(results);
                        // results=results.replace(/undefined/gi).replace(/null/gi,'');
                        callback(null, JSON.parse(results));
                    }
                    // callback(null,results);
                });
            }, function (err, data) {
                if (err) {
                    g = lk;
                }
                cb(err, data)
            })
        }
        else{
            cb("error query empty",null)
        }
    }
}
