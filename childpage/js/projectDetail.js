
var vm=new Vue({
  el:'#project',
  data:{
    project_id:'',
    name:'',
    author:'',
    tel:'',
    budget:'',
    budgetMod:'',
    budgetOri:'',
    demand:'',
    address:'',
    lng:'',
    lat:'',
    state:'',
    final_scheme:null,
    ifAuthor:false,
    ifHover:false,
    ifHover_:false,
    ifHover__:false,
    ifModified:false,
    comment:'',
    designs:[],
    messages:[],
  },
  methods:{
    switchDesign:function(event){
      var el = event.currentTarget;      
      for(var design of this.designs){
        design.ifchecked=false;
        if(design.id===parseInt($(el).attr('id'))){
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
            .post('/api/private/project/set_project_status', {project_id:this.project_id,status:this.state},{
            })
            .then(function(response){
              var jsonData=response.data;
              console.log(jsonData);
              if(jsonData.message==='success'){
                showinfo('修改成功')
              }
              else if(jsonData.message==='Need login'){
                alert('请先登录');
              }           
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
      axios
            .post('/api/private/project/set_budget', {project_id:this.project_id,budget:this.budgetMod},{
            })
            .then(function(response){
              var jsonData=response.data;
              console.log(jsonData);
              if(jsonData.message==='success'){
                showinfo('修改成功');
                vm.ifModified=false;
                vm.budget=vm.budgetMod===''?vm.budgetOri:vm.budgetMod;
                vm.budgetMod='';
                $('#budget').attr('disabled','disabled');   
                $('#budgetlabel').removeClass('active');   
              }
              else if(jsonData.message==='Need login'){
                alert('请先登录');
              }             
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    vote:function(event){
      var el = event.currentTarget;      
      axios
            .post('/api/private/project/vote_for_scheme', {project_id:this.project_id,scheme_id:$(el).attr('id')},{
                
            })
            .then(function(response){
              var jsonData=response.data;
              if(jsonData.message==='success'){
                for(design of vm.designs){
                  if(design.id===parseInt($(el).attr('id'))){
                    design.voted++;
                    break;
                  }
                }
                $("[name='vote']").addAttr('disabled');
              }
              else if(jsonData.message==='Already vote'){
                $("[name='vote']").addAttr('disabled');
                alert('已投过票！');
              }
              else if(jsonData.message==='Need login'){
                alert('请先登录');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    finalize:function(event){
      var el = event.currentTarget;    
      console.log(parseInt($(el).attr('id')));  
      axios
            .post('/api/private/project/set_final_scheme', {id:Number(this.project_id),final_scheme:parseInt($(el).attr('id'))},{
            })
            .then(function(response){
              var jsonData=response.data;
              console.log(jsonData);
              if(jsonData.message==='success'){
                vm.final_scheme=$(el).attr('id');
                var order=0;
                for(design of vm.designs){
                  if(design.id===vm.final_scheme)
                    order=vm.designs.indexOf(design);
                }
                vm.designs.splice(0,1,...vm.designs.splice(order, 1 , vm.designs[0]));
              }
              else if(jsonData.message==='Need login'){
                alert('请先登录');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    stop:function(event){
      event.stopPropagation();
    },
    addComment:function(){
      if(this.comment==='')
        return;
      axios
      .post('/api/private/project/add_comment', {project_id:this.project_id,message:this.comment},{
      })
      .then(function(response){
        var jsonData=response.data;
        console.log(jsonData);
        if(jsonData.message==='success'){
          showinfo('评论成功');
          $('#commentdropdown').hide();
          vm.messages.push(jsonData.data);
        }
        else if(jsonData.message==='Already vote'){
          alert('已投过票！');
        }
        else if(jsonData.message==='Need login'){
          alert('请先登录');
        }
      })
      .catch(function (error) { // 请求失败处理
      console.log(error);
      });
    },
    init:function(project){
      var project_id=GetRequest()['id'];
      axios
            .post('/api/public/project/query_by_id', {project_id:project_id})
            .then(function(response){
                jsonData = response.data.data;
              console.log(jsonData);
                vm.project_id=project_id;
                vm.name=jsonData['name'];
                vm.author=jsonData['Author']['nickname']
                vm.tel=jsonData['Author']['tel'];
                vm.budget=jsonData['budget'];
                vm.budgetOri=vm.budget;
                vm.demand=jsonData['demand'];
                vm.address=jsonData['project_address'];
                vm.state=jsonData['state'];
                vm.lng=jsonData['lng'];
                vm.lat=jsonData['lat'];
                vm.ifAuthor=jsonData['is_me'];
                vm.final_scheme=jsonData['final_scheme'];
                for(var design of jsonData['Schemes']){
                  console.log(design);
                  design.ifchecked=false;
                  if(vm.final_scheme===design.id)
                    vm.designs.unshift(design);
                  else
                    vm.designs.push(design);
                }
                vm.messages.splice(0,0,...jsonData['Comments']);
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