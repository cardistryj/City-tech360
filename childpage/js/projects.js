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
            .get('http://127.0.0.1:12450/api/public/project/query_all', {},{
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

