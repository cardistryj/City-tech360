const Sequelize =require('sequelize');
const dbinfo=require('./dbinfo')();
var sequelize= new Sequelize(dbinfo.database,dbinfo.user,dbinfo.password,dbinfo.dbconf);
module.exports=sequelize;