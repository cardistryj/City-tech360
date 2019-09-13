var dbmanager = require('./dbmanager');
var user_controller=dbmanager.UserController;
var scheme_controller=dbmanager.SchemeController;
var error=require('../lib/error');
var fs = require('fs');
const IMG_PATH = '../resources/scheme';

const SYS_ID = 1;

dbmanager.init().then(function () {
    return user_controller.addUser({nickname:'sys', password:'iuiouiouiu', email:'root@root.com',
     type:user_controller.UserType.DESIGNER,tel:'00000000'})
}
).then(function (data) {
    var urls = fs.readdirSync(IMG_PATH);
    for (var url of urls) {
        var perm = url.split('.')[0].split(/[a-zA-Z]/);
        var index=perm[0];
        var size = Number(perm[1]);
        var surround = Number(perm[2]);
        var green_rate = Number(perm[3]);
        var func = Number(perm[4]);
        var style = Number(perm[5]);
        var factor = 0;
        var chair_num = Number(perm[7]);
        var is_covered = 2;
        if (typeof (perm[8]) != 'undefined') {
            is_covered = Number(perm[8]);
        }
        for (item of perm[6]) {
            factor |= (1<<Number(item)-1);
        }
        var scheme = scheme_controller.createSchemeData('方案' + index, '/resources/scheme/'+url, SYS_ID,
            size, surround, green_rate, func, style, factor, chair_num, is_covered);
            scheme_controller.addScheme(scheme).then(data => {
            if (data.status != 200) {
                return error.error(JSON.stringify(data.message));
            }
        });
    }

    return Promise.resolve();
}).catch(err=>{
    error.error(err);
});