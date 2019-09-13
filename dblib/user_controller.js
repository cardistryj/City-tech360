var sequelize = require('./new_seq');
var query_controller = require('./query_controller')
var model = require('./model');
var data_view = require('./data_view')
var data_result = require('../lib/data_result')
var User = model.User;




function addUser(user_info) {
    return checkoutEmail(user_info.email).then(ifexist => {
        if (ifexist) {
            return data_result.goodPromiseOrigin('Email already exists');
        } else {
            return query_controller.createData(User,
                {
                    nickname: user_info.nickname, password: user_info.password, email: user_info.email,
                    type: user_info.type, tel: user_info.tel
                }
                , data_view.DISPLAY_USER_INFO);
        }
    })
}

function checkoutEmail(email) {
    return query_controller.findOne(User, {
        where: { email: email }
    }).then(result => {
        if (result.data) {
            return true;
        } else {
            return false;
        }
    })
}

function checkoutPasswordById(user_id,password){
    return query_controller.findOne(User, {
        where: { id: user_id, password:password },
        attributes: data_view.DISPLAY_USER_INFO
    }).then(result => {
        if (!result.data) {
            result.message = 'Password is wrong';
        }
        return result;
    })
}

function checkoutPassword(email, password) {
    return query_controller.findOne(User, {
        where: { email: email, password: password },
        attributes: data_view.DISPLAY_USER_INFO
    }).then(result => {
        if (!result.data) {
            result.message = 'Email or Password is wrong';
        }
        return result;
    })
}

function updatePassword(user_id,password){
    return query_controller.updateData(User, 
        {password:password}
    , {
            where: { id:user_id },
        })
}

function updateAvator(user_id,url){
    var user_info=new Object();
    user_info.info=new Object();
    user_info.info.avatar=url;
    user_info.user_id=user_id;
    return updateUserInfo(user_info);
}

function updateUserInfo(user_info) {
    return query_controller.updateData(User, 
        user_info.info
    , {
            where: { id: user_info.user_id },
        })
}

function queryUserById(user_id) {
    return query_controller.findOne(User, {
        where: { id: user_id },
        attributes: data_view.DISPLAY_USER_INFO
    })
}

exports.addUser = addUser;
exports.checkoutEmail = checkoutEmail;
exports.checkoutPassword = checkoutPassword;
exports.updateUserInfo = updateUserInfo;
exports.UserType = model.UserType;
exports.queryUserById = queryUserById;
exports.checkoutPasswordById=checkoutPasswordById;
exports.updatePassword=updatePassword;
exports.updateAvator=updateAvator;