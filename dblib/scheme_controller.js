var sequelize = require('./new_seq');
var query_controller=require('./query_controller')
var model = require('./model');
var data_view=require('./data_view')
var Scheme = model.Scheme;


//exports.getSchemeSearchKey=getSchemeSearchKey;
function getSchemeSearchKey(scheme) {
    var re = 0;
    re += scheme.is_covered << SchemeValueBit.IS_COVERED;
    re += scheme.chair_num << SchemeValueBit.CHAIR_NUM;
    re += scheme.view_factor << SchemeValueBit.VIEW_FACTOR;
    re += scheme.style << SchemeValueBit.STYLE;
    re += scheme.func << SchemeValueBit.FUNC;
    re += scheme.green_rate << SchemeValueBit.GREEN_RATE;
    re += scheme.surround << SchemeValueBit.SURROUND;
    re += scheme.size << SchemeValueBit.SIZE;
    return re;
}

// 0~1bit:   is_covered
// 2~3bit:   chair_num
// 4~6bit:   view_factor
// 7~8bit:   style
// 9~10bit:  func
// 11~12bit: green_rate
// 13~14bit: surround
// 15~17bit: size
const SchemeValueBit = {
    IS_COVERED: 0,
    CHAIR_NUM: 2,
    VIEW_FACTOR: 4,
    STYLE: 7,
    FUNC: 9,
    GREEN_RATE: 11,
    SURROUND: 13,
    SIZE: 16
}

function createSchemeData(name, pic, designer, size, surround, green_rate, func, style, view_factor, chair_num, is_covered) {
    var temp = new Object();
    temp.name = name;
    temp.pic = pic;
    temp.designer = designer;
    temp.size = size;
    temp.surround = surround;
    temp.green_rate = green_rate;
    temp.func = func;
    temp.style = style;
    temp.view_factor = view_factor;
    temp.chair_num = chair_num;
    temp.is_covered = is_covered;
    return temp;
}


function addScheme(scheme) {
    scheme.search_key = getSchemeSearchKey(scheme);
    return query_controller.createData(Scheme,scheme)
}

function querySimilarScheme(scheme, offset) {
    var search_key = getSchemeSearchKey(scheme);
    if (!offset) {
        offset = 0;
    }
    return query_controller.findAll(Scheme,{
        attributes:data_view.DISPLAY_SCHEME_INFO,
        order: [[sequelize.fn('scheme_cmp', sequelize.col('search_key'), search_key), 'DESC']],
        limit: 10,
        offset: offset,
        include:[{model:model.User,as:'Designer',attributes:data_view.DISPLAY_USER_INFO}]
    })
}

exports.createSchemeData = createSchemeData;
exports.addScheme = addScheme;
exports.querySimilarScheme = querySimilarScheme;
exports.transformSchemeCode=function(url){
    var perm = url.split(/[a-zA-Z]/);
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
        factor |= (1 << Number(item) - 1);
    }
    return createSchemeData("","","",size, surround, green_rate, func, style, factor, chair_num, is_covered);
}