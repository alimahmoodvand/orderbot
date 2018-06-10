/**
 * Created by ali on 7/31/17.
 */
module.exports={
    updates:function (req,res) {
        res.send(JSON.stringify({status:200}));
        if(!(req.body&&req.body.length>0))
            return;
       // console.log(req.body.length)
        this.newmsg=req.body.searchObjects('_','updateNewChannelMessage');
        if(this.newmsg&&this.newmsg.length>0){
            new uphM.updateNewChannelMessage(this.newmsg);
            new uphM.iupdateNewChannelMessage(this.newmsg);
        }
    },
    views:function (req,res) {
        res.send(JSON.stringify({status:200}));
        if(!(req.body&&req.body.length>0))
            return;
            new uphM.updateViews(req.body.searchObjects('type','1'));
            new uphM.iupdateViews(req.body.searchObjects('type','2'));
    },
    reminders:function (req,res) {
        res.send(JSON.stringify({status:200}));
        // if (global.gc) {
        //     global.gc();
        //     console.log("Garbage collection run");
        // } else {
        //     console.log('Garbage collection unavailable.  Pass --expose-gc '
        //         + 'when launching node to enable forced garbage collection.');
        // }
        new reM.reminderVip();
        new reM.reminderMass();
    },
}