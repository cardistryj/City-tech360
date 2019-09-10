
function decodeSize(size){
    switch(size){
        case 1:
            return '8M*8M';
        case 2:
            return '7M*7M';
        case 3:
            return '6M*6M';
        case 4:
            return '12M*6M';
        case 5:
            return '9M*6M';
        case 6:
            return '8M*4M';
        default:
            return '';
    }
}

function decodeSurround(surround){
    switch(surround){
        case 1:
            return '一面围合';
        case 2:
            return '两面围合（对侧）';
        case 3:
            return '两面围合（斜侧）';
        case 4:
            return '三面围合';
        default:
            return '';
    }
}

function decodeGreenRate(greenRate){
    switch(greenRate){
        case 1:
            return '低于30%';
        case 2:
            return '30%-70%';
        case 3:
            return '大于70%';
        default:
            return '';
    }
}

function decodeFunction(func){
    switch(func){
        case 1:
            return '休憩为主';
        case 2:
            return '活动为主';
        case 3:
            return '景观为主';
        default:
            return '';
    }
}

function decodeStyle(style){
    switch(style){
        case 1:
            return '古典';
        case 2:
            return '现代';
        default:
            return '';
    }
}

function decodeViewFactor(viewFactor){
    var result='';
    if(viewFactor&1)
        result+='水池，';
    if(viewFactor&2)
        result+='雕塑，';
    if(viewFactor&4)
        result+='凉亭，';
    if(result.length!==0){
        result=result.substring(0,result.length-1);
    }
    return result;
}

function decodeChairNum(chairNum){
    switch(chairNum){
        case 1:
            return '低于5个';
        case 2:
            return '5-10个';
        case 3:
            return '10个以上';
        default:
            return '';
    }
}

function decodeIfCovered(ifcovered){
    switch(ifcovered){
        case 1:
            return '需要';
        case 2:
            return '不需要';
    }
}

function decodeRole(role){
    switch(role){
        case 1:
            return '设计师';
        case 2:
            return '政府机构';
        case 3:
            return '居委会';
        case 4:
            return '居民';
        case 5:
            return '施工方';
        default:
            return '';
    }
}

function decodeStatus(status){
    switch(status){
        case 1:
            return '提出';
        case 2:
            return '设计中';
        case 3:
            return '征求意见';
        case 4:
            return '施工中';
        case 5:
            return '已完成';
        default:
            return '';
    }
}