var data_result = require('../lib/data_result')
function getJsonFromArray(data) {
    if (data) {
        var re = new Array();
        for (var i = 0; i < data.length; ++i) {
            if (data[i].toJSON) {
                re[i] = data[i].toJSON();
            } else {
                re[i] = data[i];
            }

        }
        return re;
    }else{
        return null;
    }
}

function getJsonFromModel(data) {
    if (data) {
        if (data.toJSON) {
            return data.toJSON();
        } else {
            return data;
        }

    } else {
        return null;
    }

}
exports.findAll = function (model, para) {
    return model.findAll(para).then(
        data => {
            return data_result.goodPromise((getJsonFromArray(data)));
        }, err => {
            return data_result.badPromise(err);
        }
    )
}

exports.findOne = function (model, para) {
    return model.findOne(para).then(
        data => {
            return data_result.goodPromise(getJsonFromModel(data));
        }, err => {
            return data_result.badPromise(err);
        }
    )
}

exports.createData = function (model, para, display_attribute) {
    return model.build(para)
        .save()
        .then(data => {
            var temp = getJsonFromModel(data);
            if (display_attribute) {
                var re = new Object();
                for (index of display_attribute) {
                    re[index] = temp[index];
                }
            } else {
                re = temp;
            }

            return data_result.goodPromise(re);
        }, err => {
            return data_result.badPromise(err);
        })
}

exports.updateData = function (model, new_info, condition) {
    return model.update(new_info, condition).then(data => {
        return data_result.goodPromise(data);
    }, err => {
        return data_result.badPromise(err);
    })
}

exports.addAssociation = function (source, target_name, model_condition, new_association) {
    return source.findOne(model_condition).then(result => {
        return result['add' + target_name + 's'](new_association)
    }).then(data => {
        return data_result.goodPromise(getJsonFromArray(data));
    }, err => {
        return data_result.badPromise(err);
    })
}

exports.removeAssociation=function(source,target_name,model_condition,remove_codition){
    return source.findOne(model_condition).then(result=>{
        return result['remove'+target_name+'s'](remove_codition)
    }).then(data=>{
        return data_result.goodPromise(getJsonFromArray(data));
    },err=>{
        return data_result.badPromise(err);
    })
}

exports.setAssociation=function (source, target_name, model_condition, new_association) {
    return source.findOne(model_condition).then(result => {
        return result['set' + target_name + 's'](new_association)
    }).then(data => {
        return data_result.goodPromise(getJsonFromArray(data));
    }, err => {
        return data_result.badPromise(err);
    })
}