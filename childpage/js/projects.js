var vm = new Vue({
    el: '#project',
    data: {
        projects: [
        ]
    },
    methods:{
        getDetail:function(event){
            var el = event.currentTarget;
            window.location.href='projectDetail.html?id='+$(el).attr('id');
        },
        init:function(){
            axios
            .get('http://localhost:8888/initProject.php', {},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(function(response){
                jsonData = response.data;
                for(var project of jsonData){
                    vm.projects.push(project);
                }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
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

