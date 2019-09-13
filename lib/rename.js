var fs=require('fs');
var error=require('./error')
const PATH='../resources/scheme/';
var urls=fs.readdirSync(PATH);
var i=1;
for(var url of urls){
    fs.rename(PATH+url,PATH+i+url,err=>{
        if(err){
            error.error(err);
        }
    });
    ++i;
}