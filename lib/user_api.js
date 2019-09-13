var data_result = require('./data_result')
var user_controller = require('../dblib/dbmanager').UserController;
var fs = require('fs')
exports.login = function (req, res) {
    if (req.session.user_id) {
        user_controller.queryUserById(req.session.user_id).then(result => {
            result.message = 'Already login'
            res.json(result);
        })
    } else {
        var user_info = req.body;
        user_controller.checkoutPassword(user_info.email, user_info.password).then(result => {
            if (result.data) {
                req.session.user_id = result.data.id;
            }
            res.json(result);
        })
    }
}

exports.checkLogin = function (req, res) {
    if (req.session.user_id) {
        user_controller.queryUserById(req.session.user_id).then(result => {
            result.message = 'Already login'
            res.json(result);
        })
    } else {
        data_result.goodPromiseOrigin("No Login").then(result => {
            res.json(result);
        })
    }
}
exports.logout = function (req, res) {
    req.session.destroy();
    data_result.goodPromise().then(result => {
        res.json(result);
    })
}

exports.signup = function (req, res) {
    var user_info = req.body
    return user_controller.addUser(user_info)
        .then(result => {
            res.json(result)
        })
}


exports.getUserInfo = function (req, res, next) {
    var user_id = req.session.user_id;
    if (user_id) {
        return user_controller.queryUserById(user_id).then(result => {
            res.json(result)
        })
    } else {
        next();
    }
}

exports.editUserInfo = function (req, res, next) {
    var user_info = new Object();
    user_info.info = req.body;
    if (user_info.info.password) {
        delete user_info.info.password;
    }
    if (user_info.info.avatar) {
        delete user_info.info.avatar;
    }
    for (var i in user_info.info) {
        if (!user_info.info[i]) {
            delete user_info.info[i]
        }

    }
    if (req.session.user_id) {
        user_info.user_id = req.session.user_id;
        return user_controller.updateUserInfo(user_info).then(result => {
            res.json(result);
        })
    } else {
        next();
    }
}

exports.editPassword = function (req, res) {
    var password = req.body.password;
    var user_id = req.session.user_id;
    user_controller.updatePassword(user_id, password).then(result => {
        res.json(result);
    })
}

exports.checkoutPassword = function (req, res) {
    var user_id = req.session.user_id;
    var password = req.body.password;
    user_controller.checkoutPasswordById(user_id, password).then(result => {
        res.json(result);
    })
}


exports.loadAvatar = function (req, res) {

    var user_id = req.session.user_id;
    var file_info = req.file;
    var target = __dirname + '/../resources/avatar/' + user_id;
    var old_target = __dirname + '/../!' + user_id;
    if (fs.existsSync(old_target)) {
        fs.copyFileSync(target, old_target)
    }

    fs.copyFile(file_info.path, target, err => {
        if (err) {
            fs.unlink(file_info.path, err => {
                if (err) {
                    error.error(err);
                }
            });
            data_result.badPromise(err).then(result => {
                res.json(result)
            })
        } else {
            fs.unlink(file_info.path, err => {
                if (err) {
                    error.error(err);
                }
            });

            user_controller.updateAvator(user_id, '/resources/avatar/'+user_id).then(result => {
                if (result.status != 200) {
                    if (fs.existsSync(old_target)) {
                        fs.renameSync(old_target, target);
                    }

                } else {
                    if(fs.existsSync(old_target)){
                        fs.unlinkSync(old_target);
                    }
                }
                res.json(result)
            })
        }
    })
}