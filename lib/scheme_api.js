const scheme_controller = require('../dblib/dbmanager').SchemeController;
const data_result = require('./data_result')
const error = require('./error')
const fs = require('fs')
exports.addScheme = function (req, res) {
    var scheme_info = req.body;
    var file_info = req.file;
    var user_id = req.session.user_id;
    var date = new Date();
    var path = user_id + date.getTime();
    if (scheme_info.name) {
        path += scheme_info.name;
    }
    var target = __dirname + '/../resources/scheme/' + path;
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
            var scheme=scheme_controller.transformSchemeCode(scheme_info.code);
            scheme.name=scheme_info.name;
            scheme.pic='resources/scheme/' + path;
            scheme.designer=user_id;
            scheme_controller.addScheme(scheme).then(result => {
                    if (result.status != 200) {
                        fs.unlink(target, err => {
                            if (err) {
                                error.error(err);
                            }
                        });
                    }
                    res.json(result)
                })
        }
    })

}

exports.querySimilarScheme = function (req, res) {
    var code=req.body.code;
    var scheme=scheme_controller.transformSchemeCode(code);
    scheme_controller.querySimilarScheme(scheme,0).then(result=>{
        res.json(result);
    })
}