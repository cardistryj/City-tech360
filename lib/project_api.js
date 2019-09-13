var project_controller = require('../dblib/project_controller');
var user_controller=require('../dblib/user_controller')
var error=require('./error')
var data_result=require('./data_result')
const fs = require('fs')
exports.queryAllProject = function (req, res) {
    var body = req.body;
    var limit = 10;
    var offset = 0;
    if (body.page) {
        offset = limit * page
    }
    project_controller.queryAllProject(offset, limit).then(result => {
        res.json(result);
    })
}

exports.queryProjectByMe = function (req, res) {
    var user_id = req.session.user_id;
    var body = req.body;
    var limit = 10;
    var offset = 0;
    if (body.page) {
        offset = limit * page
    }
    project_controller.queryProjectByAuthor(offset, limit, user_id).then(result => {
        console.log(user_id);
        console.log(result)
        res.json(result);
    })
}

exports.queryProjectById = function (req, res) {
    var project_id = req.body.project_id;
    console.log(project_id);
    project_controller.queryProjectById(project_id).then(result => {
        if (result.data) {
            result.data.is_me = (result.data.Author.id == req.session.user_id);
        }
        res.json(result);
    })
}

exports.createProject = function (req, res) {
    var info = req.body;
    var date=new Date();
    var user_id = req.session.user_id;
    var path = user_id + date.getTime();
    var file_info = req.file;
    var target = __dirname + '/../resources/project/' + path;
    console.log(target);
    fs.copyFile(file_info.path, target, err => {
        if (err) {
            fs.unlink(file_info.path, err => {
                if (err) {
                    error.error(err);
                }
            });
            error.error(err);
            data_result.badPromise(err).then(result => {
                res.json(result)
            })
        } else {
            fs.unlink(file_info.path, err => {
                if (err) {
                    error.error(err);
                }
            });
            var budget='';
            if(info.budget){
                budget=info.budget;
            }
            var project = project_controller.createProjectData(info.name, user_id, info.demand, info.project_address,
                 info.lng, info.lat, '/resources/project/' + path,budget)

            project_controller.addProject(project,info.designs).then(result => {
                if (result.status != 200) {
                    fs.unlink(target, err => {
                        if (err) {
                            error.error(err);
                        }
                    });
                }
                error.error(result);
                res.json(result)
            })
        }
    })
}

exports.addComent=function(req,res){
    user_id=req.session.user_id;
    message=req.body.message;
    project_id=req.body.project_id;
    project_controller.addComment(project_id,user_id,message).then(result=>{
        user_controller.queryUserById(user_id).then(data=>{
            result.data.User=data.data;
            res.json(result);
        })
        
    })
}

exports.voteScheme=function(req,res){
    user_id=req.session.user_id;
    project_id=req.body.project_id;
    scheme_id=req.body.scheme_id;
    project_controller.voteForScheme(project_id,scheme_id,user_id).then(result=>{
        res.json(result);
    })
}

exports.updateProjectStatus=function(req,res){
    user_id=req.session.user_id;
    project_id=req.body.project_id;
    status=req.body.status;
    project_controller.updateProjectStatus(user_id,project_id,status).then(result=>{
        res.json(result);
    })
}

exports.updateBudget=function(req,res){
    user_id=req.session.user_id;
    project_id=req.body.project_id;
    budget=req.body.budget;
    project_controller.updateBudget(user_id,project_id,budget).then(result=>{
        res.json(result);
    })
}

exports.setFinalScheme=function(req,res){
    console.log(req.body)
    user_id=req.session.user_id;
    project_id=req.body.id;
    final_scheme=req.body.final_scheme;
    project_controller.setFinalScheme(user_id,project_id,final_scheme).then(result=>{
        res.json(result);
    })
}