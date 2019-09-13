var sequelize= require('./new_seq')

exports.init=initAll;
exports.UserController=require('./user_controller');
exports.SchemeController=require('./scheme_controller');
exports.ProjectController=require('./project_controller')

function initAll(){
  return initModel(sequelize)
}

function initModel(model_class){
  return model_class.sync({force:true}).then(function(result){
    console.log(result);
  })
}



