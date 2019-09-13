const express = require('express');
const session = require('express-session')
const body_parser=require('body-parser')
const multer=require('multer')
const data_result=require('./lib/data_result')
const user_api=require('./lib/user_api')
const scheme_api=require('./lib/scheme_api')
const project_api=require('./lib/project_api')
const app = express();
const upload=multer({dest:'./upload_tmp'});
const PUBLIC_API_PATH='/api/public/';
const PRIVATE_API_PATH='/api/private/'
app.use(session({
    secret: 'city360',
    cookie: {
        maxAge: 60 * 1000 *5
    },
    saveUninitialized: false,
    resave: false
}))

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:false}));
app.use('/api/private',(req,res,next)=>{
    if(req.session.user_id){
        next();
    }else{
        data_result.goodPromiseOrigin('Need login').then(data=>{
            res.json(data);
        })
    }
})

/*app.use('/private',(req,res,next)=>{
    if(req.session.user_id){
        next();
    }else{
        res.redirect('/public/index.html')
    }
})*/

app.get('/',(req,res)=>{
    //res.redirect('/public/index.html')
    res.redirect('/index.html')
})


// User api
app.post(PUBLIC_API_PATH+'user/login',user_api.login);
app.post(PUBLIC_API_PATH+'user/signup',user_api.signup);
app.get(PUBLIC_API_PATH+'user/check_login_status',user_api.checkLogin);
app.get(PRIVATE_API_PATH+'user/get_my_info',user_api.getUserInfo);

app.post(PRIVATE_API_PATH+'user/edit_person_info',user_api.editUserInfo);
app.get(PRIVATE_API_PATH+'user/logout',user_api.logout);
app.post(PRIVATE_API_PATH+'user/edit_password',user_api.editPassword);
app.post(PRIVATE_API_PATH+'user/check_password',user_api.checkoutPassword);
app.post(PRIVATE_API_PATH+'user/upload_avatar',upload.single('avatar'),user_api.loadAvatar);

// Scheme api
app.post(PRIVATE_API_PATH+'scheme/add_scheme',upload.single('scheme') ,scheme_api.addScheme);
app.post(PUBLIC_API_PATH+'scheme/query_scheme',scheme_api.querySimilarScheme);


//Project api
app.post(PUBLIC_API_PATH+'project/query_by_id',project_api.queryProjectById);
app.get(PUBLIC_API_PATH+'project/query_all',project_api.queryAllProject);
app.post(PRIVATE_API_PATH+'project/query_by_me',project_api.queryProjectByMe);
app.post(PRIVATE_API_PATH+'project/upload_project',upload.single('pic'),project_api.createProject);
app.post(PRIVATE_API_PATH+'project/add_comment',project_api.addComent);
app.post(PRIVATE_API_PATH+'project/vote_for_scheme',project_api.voteScheme);
app.post(PRIVATE_API_PATH+'project/set_project_status',project_api.updateProjectStatus);
app.post(PRIVATE_API_PATH+'project/set_final_scheme',project_api.setFinalScheme)
app.post(PRIVATE_API_PATH+'project/set_budget',project_api.updateBudget)

app.use('/resources',express.static('resources'));
app.use(express.static('static'));

app.use((req,res,next)=>{
    data_result.badPromise('Page not found').then(result=>{
        res.json(result)
    })
})
app.listen(12450,()=>{
    console.log('listen port 12450')
})