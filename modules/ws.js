module.exports= {
    start: function (prt) {
        app.listen(prt || port, function () {
            console.log('WS is running on port', port);
        });
    },
    setConfig: function () {
        app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);

            // Pass to next layer of middleware

            next();

         // console.log(req.body,req.originalUrl);
        });
    },
    routing: function () {
        app.post('*', function (req, res) {
            req.originalUrl = req.originalUrl.replace('/', '');
            if (req.originalUrl){
                try{
                    new routerM[req.originalUrl](req, res);
                }
                catch(err){
                    console.log(err)
                }
            }
            else
                res.send(new Date().toString())
        })
        app.get('*', function (req, res) {
           console.log(new Date().getTime().toString());
               res.end(new Date().getTime().toString())
        })
    },
}
