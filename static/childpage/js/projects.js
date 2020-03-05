var vm = new Vue({
    el: '#project',
    data: {
        projects: [],
    },
    methods:{
        addProject:function(projects){
            for(var project of projects){
                project.state=decodeStatus(project.state);
                project.visObj={visibility: 'hidden'}
                this.projects.push(project);
            }
        },
        getDetail:function(id){
            window.location.href='projectDetail.html?id='+id;
        },
    },
    created:function(){
        if(GetRequest()['1']===undefined){
            axios
            .get('/api/public/project/query_all', {},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(response=>{
                jsonData = response.data.data;
                this.addProject(jsonData);
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
        }
        else{
            axios
            .post('/api/private/project/query_by_me', {},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(function(response){
                jsonData = response.data.data;
                this.addProject(jsonData);
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
        }
    }
})

