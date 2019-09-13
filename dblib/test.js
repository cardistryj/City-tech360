var dbmanager=require('./dbmanager');
var scheme_controller=dbmanager.SchemeController;
var user_controller=dbmanager.UserController;
var project_controller=dbmanager.ProjectController
/*scheme_controller.querySimilarScheme(scheme_controller.createSchemeData('','',-1,1,1,1,1,1,1,1,1)
,0).then(
    data=>{
        console.log(data);
    }
)*/
/*user_controller.checkoutEmail('r2oot@root.com').then(data=>{
    console.log(data)
});*/
/*user_controller.checkoutPassword('root@root.com','iuiouiouiu').then(data=>{
    console.log(data);
})*/
/*user_controller.addUser('sys', 'iuiouiouiu', 'roo2t@root.com', user_controller.UserType.DESIGNER).then(data=>{
    console.log(data);
})*/

/*user_controller.updateUserInfo(1,'system','ddd','1998-10-27','1111111').then(data=>{
    console.log(data);
})*/

/*project_controller.addProject(project_controller.createProjectData('1',1,'a','a','s','s','sss.jpg')).then(data=>{
    console.log(data);
    return project_controller.queryProjectById(1)
}).then(data=>{
    console.log(data);
}).then(function(){
    return project_controller.addComment(1,1,'dddd').then(data=>{
        console.log(data);
    });
})*/
/*project_controller.addNewScheme(1,4).then(data=>{
    console.log(data);
})*/
/*project_controller.queryProjectById(1).then(data=>{
    console.log(data.data.Comments);
})*/
/*scheme_controller.queryCount().then(result=>{
    console.log(result)
})*/
//console.log(typeof new Array());