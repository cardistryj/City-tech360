const Sequelize = require('sequelize');

const Model = Sequelize.Model;
var sequelize = require('./new_seq');

const UserType = {
  GOVERNMENT: 2,
  RESIDENT: 4,
  COMMITTEE: 3,
  DESIGNER: 1,
  CONSTRUCTION: 5
}

const ProjectStatusType = {
  STARTED: 1,
  DESIGNING: 2,
  VOTING: 3,
  BUILDING: 4,
  FINISHED: 5
}

class User extends Model { };

User.init({
  nickname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[UserType.COMMITTEE, UserType.CONSTRUCTION, UserType.DESIGNER, UserType.GOVERNMENT, UserType.RESIDENT]]
    }

  },
  tel: {
    type: Sequelize.STRING,
  },
  birth: {
    type: Sequelize.DATE
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '/resources/avatar/default.jpg'
  },
  address: {
    type: Sequelize.STRING
  }

},
  {
    sequelize,
    modelName: 'User'
  })

class Scheme extends Model { };
Scheme.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pic: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  /*designer:{
    type:Sequelize.INTEGER,
    references:{
      model:User,
      key:'id'
    }
  },*/
  size: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 1,
      max: 6
    }
  },
  surround: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 1,
      max: 4
    }
  },
  green_rate: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 1,
      max: 3
    }
  },
  func: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 1,
      max: 3
    }
  },
  style: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 1,
      max: 2
    }
  },
  view_factor: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 1,
      max: 7
    }
  },
  chair_num: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 1,
      max: 3
    }
  },
  is_covered: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 1,
      max: 2
    }
  },
  search_key: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
},
  {
    sequelize,
    modelName: 'Scheme'
  });

Scheme.belongsTo(User, { as: 'Designer', foreignKey: 'designer' });



class Project extends Model { };
Project.init({
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  /*author_id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    references:{
      model:User,
      key:'id'
    }
  },*/
  budget: {
    type: Sequelize.STRING
  },
  demand: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lng: {
    type: Sequelize.STRING
  },
  lat: {
    type: Sequelize.STRING
  },
  project_address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  state: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: ProjectStatusType.STARTED,
    validate: {
      isIn: [[ProjectStatusType.STARTED, ProjectStatusType.DESIGNING,
      ProjectStatusType.VOTING, ProjectStatusType.BUILDING, ProjectStatusType.FINISHED]]
    }
  },
  final_scheme: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: Scheme,
      key: 'id'
    },
    defaultValue:null
  },
  pic_url:{
    type: Sequelize.STRING
  }
},
  {
    sequelize,
    modelName: 'Project',
    createdAt: 'create_time'
  })

Project.belongsTo(User, { as: 'Author', foreignKey: 'author_id' })

class Comment extends Model { };
Comment.init({
  message: {
    type: Sequelize.TEXT,
    allowNull: false
  }
},
  {
    sequelize,
    modelName: 'Comment'
  });

Project.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Project);

class AlternativeScheme extends Model { };
AlternativeScheme.init({
  vote_num: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
},
  {
    sequelize,
    modelName: 'AlternativeScheme'
  })

Project.belongsToMany(Scheme,{through:AlternativeScheme});
Scheme.belongsToMany(Project, { through: AlternativeScheme });

class VotedData extends Model{};
VotedData.init({
  
},{
  sequelize,
  modelName:"VotedData"
})
Project.belongsToMany(User,{through:VotedData});
User.belongsToMany(Project,{through:VotedData});

exports.User = User;
exports.Scheme = Scheme;
exports.Project = Project;
exports.Comment = Comment;
exports.AlternativeScheme = AlternativeScheme;
exports.VotedData=VotedData;
exports.UserType = UserType;
exports.ProjectStatusType=ProjectStatusType;