/**
 * Created by winty on 2016/11/11.
 */
var mongoose=require('mongoose');

//用户Schema定义
var userSchema = new mongoose.Schema({
    userName: String, //用户名的类型为字符串
    portraitUrl:String, //用户头像
    password: {
        type: String, //密码的类型为字符串
        require: true //非空
    },
    created: {
        type: Date, //创建日期的类型为日期类型
        "default": Date.now //默认值为创建时间
    },
    isAdmin:{
        type:Boolean,
        "default":false
    },
    isPublic:{
        type:Boolean,
        "default":true
    },
    myShares:{
        shares:[{type:mongoose.Schema.ObjectId,ref:'share'}],
        "default":[]
    },
    myFocus:{
        users:[this],
        "default":[]
    },
    myCollections:{
        shares:[{type:mongoose.Schema.ObjectId,ref:'share'}],
        "default":[]
    },
    myLikes:{
        shares:[{type:mongoose.Schema.ObjectId,ref:'share'}],
        "default":[]
    },
    myComments:{
        shares:[{type:mongoose.Schema.ObjectId,ref:'share'}],
        "default":[]
    }
});

//评论Schema定义
var commentSchema = new mongoose.Schema({
    content: {
        type: String, //评论内容的类型为字符串
        require: true //非空
    },
    created: {
        type: Date, //创建日期的类型为日期类型
        "default": Date.now //默认值为创建日期
    },
    subComment: [this], //自评论的类型为评论类型，也就是本身类型
    userId: {
        type: mongoose.Schema.Types.ObjectId, //评论用户的引用
        ref: 'user', //引用自User Model
        require: true //非空
    }
});

//分享Schema定义
var shareSchema = new mongoose.Schema({
    content: String, //分享内容为字符串
    images:[{type:String}],//存图片id
    created: {
        type: Date, //创建时间类型为日期类型
        "default": Date.now //默认值为创建日期
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, //发布者的引用
        ref: 'user', //引用自User Model
        require: true //非空
    },
    collectionNum:{
        type:Number,
        "default":0
    },
    likeNum:{
        type:Number,
        "default":0
    },
    comment: [commentSchema] //subDocument，子文档，即该分享的评论
});



mongoose.model('user',userSchema);
mongoose.model('share',shareSchema);
mongoose.model('comment',commentSchema);
