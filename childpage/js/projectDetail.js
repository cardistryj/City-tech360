(function($){
  $(function(){
    $('.button-collapse').sideNav();
    $('.parallax').parallax();
  }); // end of document ready
})(jQuery); // end of jQuery name space

var vm=new Vue({
  el:'#project',
  data:{
    project_id:'',
    name:'',
    author:'',
    tel:'',
    budget:'',
    budgetMod:'',
    demand:'',
    address:'',
    lng:'',
    lat:'',
    state:'',
    final_scheme:'',
    ifAuthor:false,
    ifOwner:false,
    ifOwner_:false,
    ifModified:false,
    designs:[],
    message:[],
  },
  methods:{
    switchDesign:function(event){
      var el = event.currentTarget;      
      for(var design of this.designs){
        design.ifchecked=false;
        if(design.id===$(el).attr('id')){
          design.ifchecked=true;
        }
      }
    },
    enableBudget:function(){
      this.budget='';
      $('#budget').removeAttr('disabled');
      this.ifModified=true;
    },
    updateProject:function(){
      axios
            .get('http://localhost:8888/initProjectDetail.php', {params:{id:this.project_id,budget:this.budgetMod,state:this.state}},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(function(response){
                alert('保存成功');
                vm.ifModified=false;
                vm.budget=vm.budgetMod;
                vm.budgetMod='';
                $('#budget').attr('disabled','disabled');   
                $('#budgetlabel').removeClass('active');             
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    vote:function(event){
      var el = event.currentTarget;      
      axios
            .get('http://localhost:8888/initProjectDetail.php', {params:{id:this.project_id,design_id:$(el).attr('id')}},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(function(response){
              for(design of vm.designs){
                if(design.id===$(el).attr('id')){
                  design.voted++;
                  break;
                }
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    finalize:function(event){
      var el = event.currentTarget;      
      axios
            .get('http://localhost:8888/initProjectDetail.php', {params:{id:this.project_id,final_scheme:$(el).attr('id')}},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(function(response){
              vm.final_scheme=$(el).attr('id');
              var order=0;
              for(design of vm.designs){
                if(design.id===vm.final_scheme)
                  order=vm.designs.indexOf(design);
              }
              vm.designs.splice(0,1,...vm.designs.splice(order, 1 , vm.designs[0]));
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    init:function(project){
      var project_id=GetRequest()['id'];
      axios
            .get('http://localhost:8888/initProjectDetail.php', {params:{id:project_id}},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(function(response){
                jsonData = response.data;
                vm.project_id=project_id;
                vm.name=jsonData['name'];
                vm.author=jsonData['author'];
                vm.tel=jsonData['tel'];
                vm.budget=jsonData['budget'];
                vm.demand=jsonData['demand'];
                vm.address=jsonData['address'];
                vm.state=jsonData['state'];
                vm.lng=jsonData['lng'];
                vm.lat=jsonData['lat'];
                vm.ifAuthor=jsonData['ifAuthor'];
                vm.final_scheme=jsonData['final_scheme'];
                for(var design of jsonData['designs']){
                  design.ifchecked=false;
                  if(vm.final_scheme===design.id)
                    vm.designs.unshift(design);
                  else
                    vm.designs.push(design);
                }
                vm.designs[0].ifchecked=true;
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    }
  }
})

var map = new BMap.Map("bdmap");
map.centerAndZoom(new BMap.Point(121.443186, 31.225499),9);
var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
var top_left_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL});
map.addControl(mapType1);
map.addControl(top_left_navigation);