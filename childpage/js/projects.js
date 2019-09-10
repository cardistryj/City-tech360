var vm = new Vue({
    el: '#project',
    data: {
        projects: []
    },
    methods:{
        getDetail:function(event){
            var el = event.currentTarget;
            window.location.href='projectDetail.html?id='+$(el).attr('id');
        },
        init:function(){
            if(GetRequest()['1']===undefined){
                axios
                .get('/api/public/project/query_all', {},{
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
                })
                .then(function(response){
                    jsonData = response.data.data;
                    for(var project of jsonData){
                        project.state=decodeStatus(project.state);
                        vm.projects.push(project);
                    }
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
                    for(var project of jsonData){
                        project.state=decodeStatus(project.state);
                        vm.projects.push(project);
                    }
                })
                .catch(function (error) { // 请求失败处理
                console.log(error);
                });
            }
        },
        display:function(event){
            var el = event.currentTarget;
            $(el).find('a').css('visibility','visible');
        },
        hide:function(event){
            var el = event.currentTarget;
            $(el).find('a').css('visibility','hidden');            
        }
    }
})

