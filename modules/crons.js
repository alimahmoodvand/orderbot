/**
 * Created by ali on 8/2/17.
 */
module.exports= {
    recovery:function (cb) {
        this.query=`select cronReverse(crontime) as rcrontime,orderCategoryDetailId,cronType,orderid,status,crontime,performDate
         from raaz_ordercategorydetail where (status='ya' or status='later' or status='adminpassed') and DATE(performDate)>=(DATE(NOW())- INTERVAL 1 DAY)
          and ((adminop!='cancel' and adminop!='canceling') or adminop is null);
         select cronReverse(crontime) as rcrontime,cronType,orderdetailid,orderid,status,crontime,performDate
         from raaz_orderdetail where ( status='later' or status='ya'  or status='adminpassed') and bannerid is null and screenshotid is not null
          and DATE(performDate)>=(DATE(NOW())- INTERVAL 1 DAY)
          and ((adminop!='cancel' and adminop!='canceling') or adminop is null);`;
        cb();
        return;
        exeqM.exec(this.query,function (err,data) {
          if(!err&&data){
            this.rdate=utilM.getRCronTime(new Date());
            this.date=utilM.getCronTime(new Date());
            for(this.ic=0;data[0]&&this.ic<data[0].length;this.ic++){
                   cron=data[0][this.ic];

                  if(cron.cronType==2) {
                    if(cron.rcrontime<=this.rdate ){
                      new cutilM.iupdateView(cron.orderCategoryDetailId,cron.status,null);
                    }else{
                  //    console.log("scheduledJobs",cron.orderCategoryDetailId, cron.crontime)
                      job=cutilM.iupdateView.bind(null,cron.orderCategoryDetailId,cron.status,null)
                      schedule.scheduleJob(cron.orderCategoryDetailId.toString(), cron.crontime.toString(),
                        job/*;function () {
                      new cutilM.iupdateView(cron.orderCategoryDetailId,cron.status,null);
                      }*/);
                    }

                  }
                  else if(cron.cronType==4){
                      // console.log(cron.rcrontime<=this.rdate ,cron.rcrontime,this.rdate )
                    if(cron.rcrontime<=this.rdate ){
                      new cutilM.iremindBanner(cron.orderCategoryDetailId,null,new Date(cron.performDate))
                     // new cutilM.iupdateView(cron.orderCategoryDetailId,cron.status,null);
                    }else{
                 //     console.log("scheduledJobs",cron.orderCategoryDetailId.toString(), cron.crontime.toString())
                      job=cutilM.iremindBanner.bind(null,cron.orderCategoryDetailId,null,new Date(cron.performDate))
                      schedule.scheduleJob(cron.orderCategoryDetailId.toString(), cron.crontime.toString(), job);
                    }
                  }
              }
            for(this.ic=0;data[1]&&this.ic<data[1].length ;this.ic++){
                   cron=data[1][this.ic];
                  // console.log(cron.cronType,this.rdate,cron.rcrontime)
                  if(cron.cronType==2) {
                    if(cron.rcrontime<=this.rdate ){
                      new cutilM.updateView(cron.orderdetailid,cron.status);
                    }else{
                  //    console.log("scheduledJobs",cron.orderdetailid.toString(), cron.crontime.toString())
                      job=cutilM.updateView.bind(null,cron.orderdetailid,cron.status);
                      schedule.scheduleJob(cron.orderdetailid.toString(), cron.crontime.toString(), job);
                    }

                  }
                  else if(cron.cronType==3){
                    if(cron.rcrontime<=this.rdate ){
                      //new cutilM.iremindBanner(cron.orderCategoryDetailid,'-',new Date(cron.performDate))
                     // new cutilM.iupdateView(cron.orderCategoryDetailId,cron.status,null);
                      new cutilM.remindOrder(cron.orderdetailid,cron.status,false)
                    }else{
                      console.log("scheduledJobs",cron.orderdetailid.toString(), cron.crontime.toString())
                      job=cutilM.remindOrder.bind(null,cron.orderdetailid,cron.status,false)
                      schedule.scheduleJob(cron.orderdetailid.toString(), cron.crontime.toString(), job);

                    }
                  }
              }
            //  console.log("schedule.scheduleJob",schedule.scheduledJobs)
            cb();
          }
          else{
            cb();
          }
        })
    }
}
