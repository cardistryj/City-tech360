var query_controller = require('./query_controller');
var data_view = require('./data_view');
var model = require('./model');
var sequelize = require('./new_seq');
var error=require('../lib/error')
var Project = model.Project;
var ProjectStatusType = model.ProjectStatusType;

const PROJECT_INCLUDE=[{ model: model.User, as: 'Author', attributes: data_view.DISPLAY_USER_INFO },
{ model: model.Comment, include: [{ model: model.User,attributes:data_view.DISPLAY_USER_INFO }] },
{ model: model.Scheme }]
exports.createProjectData = function (project_name, author_id, demand, project_address, lng, lat, pic_url,budget) {
    var re= {
        name: project_name, demand: demand, lng: lng, lat: lat,
        project_address: project_address, author_id: author_id, pic_url: pic_url
    }
    if(budget){
        re.budget=budget;
    }
    return re;
}
exports.addProject = function (projrct_data,scheme_array) {
    return query_controller.createData(Project, projrct_data).then(result=>{
        if(result.data){
            query_controller.addAssociation(Project,'Scheme',{
                where:{id:result.data.id}
            },
            scheme_array)
        }
        return Promise.resolve(result);
    })
}
exports.updateProjectStatus = function (user_id, project_id, status) {
    return query_controller.updateData(Project, { state: status }, {
        where: { author_id: user_id, id: project_id }
    })
}
exports.queryProjectById = function (project_id) {
    return query_controller.findOne(Project, {
        where: { id: project_id },
        include: PROJECT_INCLUDE
    })
}

exports.queryAllProject=function(offset,limit){
    return query_controller.findAll(Project,{
        include: PROJECT_INCLUDE,
        limit: limit,
        offset: offset
    })
}

exports.queryProjectByAuthor=function(offset,limit,user_id){
    return query_controller.findAll(Project,{
        where:{author_id:user_id},
        include: PROJECT_INCLUDE,
        limit: limit,
        offset: offset
    })
}

/*exports.voteForScheme = function (project_id, design_id) {
    return query_controller.updateData(model.AlternativeScheme, {
        vote_num: sequelize.col('vote_num') + 1
    }, {
            where: { ProjectId: project_id, SchemeId: design_id }
        })
}*/
exports.addNewScheme = function (project_id, design_id) {
    return query_controller.addAssociation(Project, 'Scheme',
        { where: { id: project_id } },
        design_id
    )
}

exports.addComment=function(project_id,user_id,message){
    return query_controller.createData(model.Comment,{ProjectId:project_id,UserId:user_id,message:message})
}

exports.voteForScheme=function(project_id,scheme_id,user_id){
    return query_controller.findOne(model.VotedData,{
        where:{ProjectId:project_id,UserId:user_id}
    }).then(result=>{
        //console.log("dddd",result);
        if(!result.data){
            
            return sequelize.transaction(t=>{
                return query_controller.updateData(model.AlternativeScheme, {
                                        ///666,fn函数将第一个参数直接解析为js语句
                    vote_num: sequelize.fn('1 + abs', sequelize.col('vote_num'))
                }, {
                        where: { ProjectId: project_id, SchemeId: scheme_id }
                    }).then(result=>{
                        //console.log("update",result);
                        if(result.data>0){
                            return query_controller.addAssociation(Project,'User',{
                                where:{id:project_id}
                            },
                            user_id)
                        }else{
                            return result;
                        }
                    })
            }).then(result=>{

                return result;
            },err=>{
                return err;
            })
        }else{
            result.message="Already vote";
            return result;
        }
    })
}

exports.updateBudget=function(user_id,project_id,budget){
    return query_controller.updateData(Project, { budget: budget }, {
        where: { author_id: user_id, id: project_id }
    })
}

exports.setFinalScheme=function(user_id,project_id,final_scheme){
    return query_controller.findOne(model.AlternativeScheme,{
        where:{ProjectId:project_id,SchemeId:final_scheme}
    }).then(result=>{
        if(result.data){
            return query_controller.findOne(Project,{
                where:{author_id:user_id,id:project_id}
            }).then(result=>{
                //console.log(result)
                if(result.data){
                    return sequelize.transaction(t=>{
                        return query_controller.updateData(Project,{
                            final_scheme:final_scheme,state:model.ProjectStatusType.FINISHED
                        },{where:{author_id:user_id,id:project_id}}).then(result=>{
                            //console.log(result)
                            return query_controller.setAssociation(Project,"User",{
                                where:{id:project_id}
                            },[]).then(data=>{
                                //console.log(data)
                                return result
                            })
                        })
                    }).then(result=>{
                        //console.log(result)
                        return result;
                    },err=>{
                        //console.log(err)
                        return err;
                    })
                }else{
                    result.message+="\nCan't adjust the project"
                    return result;
                }
            })
        }else{

            result.message+="\nThis scheme can't be set";
            
            return result;
        }
    })
}