/**
 * Created by winty on 2016/11/24.
 */
module.exports.doError=function(req,res){
    var message={
        'title':'你还没有登陆哦，请先登录！',
        'link':'/login'
    }
    res.render('error', { message:message });
}


