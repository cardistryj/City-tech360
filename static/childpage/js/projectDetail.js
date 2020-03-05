var schemeComp = {
  template:"#scheme",
  data:function(){
    return {
      curDesign:'',
      designs:[],
      final_scheme:'',
      ifvoted:false
    }
  },
  props:[
    'ifauthor','project_id'
  ],
  methods:{
    init:function(designs, final){
      this.final_scheme=final;
      for(var design of designs){
        design.ifchecked=false;
        design.size=decodeSize(design.size);
        design.surround=decodeSurround(design.surround);
        design.green_rate=decodeGreenRate(design.green_rate);
        design.func=decodeFunction(design.func);
        design.style=decodeStyle(design.style);
        design.view_factor=decodeViewFactor(design.view_factor);
        design.chair_num=decodeChairNum(design.chair_num);
        design.is_covered=decodeIfCovered(design.is_covered);
        if(final===design.id)
          this.designs.unshift(design);
        else
          this.designs.push(design);
      }
      this.curDesign=this.designs[0].id;
    },
    vote:function(id){
      axios
            .post('/api/private/project/vote_for_scheme', {project_id:Number(this.project_id),scheme_id:parseInt(id)},{})
            .then(response=>{
              var jsonData=response.data;
              if(jsonData.message==='success'){
                for(let i=0;i<this.designs.length;i++){
                  if(this.designs[i].id===id){
                    this.designs[i].AlternativeScheme.vote_num++;
                    break;
                  }
                }
                showinfo('投票成功！');
                this.ifvoted=true;
              }
              else if(jsonData.message==='Already vote'){
                this.ifvoted=true;
                showinfo('已投过票！');
              }
              else if(jsonData.message==='Need login'){
                showinfo('请先登录');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    finalize:function(id){
      axios
            .post('/api/private/project/set_final_scheme', {id:Number(this.project_id),final_scheme:parseInt(id)},{
            })
            .then(response=>{
              var jsonData=response.data;
              if(jsonData.message==='success'){
                this.final_scheme=parseInt(id);
                var order=0;
                for(design of this.designs){
                  if(design.id===this.final_scheme)
                    order=this.designs.indexOf(design);
                }
                this.designs.splice(0,1,...this.designs.splice(order, 1 , this.designs[0]));
                this.$emit('infoPar');
                showinfo('操作成功');
                window.location.href="#alternativeScheme";
              }
              else if(jsonData.message==='Need login'){
                showinfo('请先登录');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
  }
}

var commentComp = {
  template:"#comment",
  data:function(){
    return {
      ifHover:false,
      comment:'',
      messages:[],
    }
  },
  props:[
    'ifauthor','project_id'
  ],
  watch:{
    'this.$refs.avatar.offsetWidth': function(val){
      this.$refs.avatar.offsetHeight=val;
    },
  },
  methods:{
    addComment:function(){
      if(this.comment==='')
        return;
      axios
      .post('/api/private/project/add_comment', {project_id:this.project_id,message:this.comment},{
      })
      .then(response=>{
        var jsonData=response.data;
        if(jsonData.message==='success'){
          showinfo('评论成功');
          this.comment='';
          this.$refs.dropdown.style.display="none";
          jsonData.data.User.type=decodeRole(jsonData.data.User.type);
          this.messages.push(jsonData.data);
        }
        else if(jsonData.message==='Need login'){
          showinfo('请先登录');
        }
      })
      .catch(function (error) { // 请求失败处理
      console.log(error);
      });
    },
    init:function(message){
      this.messages.splice(0,0,...jsonData['Comments']);
      for(message of this.messages){
        message.User.type=decodeRole(message.User.type);
      }
    }
  }
}

var vm=new Vue({
  el:'#project',
  data:{
    project_id:'',
    pic_url:'',
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
    ifAuthor:false,
    ifHover:false,
    ifHover_:false,
    ifModified:false
  },
  computed:{
    showStatus:function(){
      return decodeStatus(this.state);
    },
  },
  components:{
    schemeComp,
    commentComp
  },
  methods:{
    finalize:function(){
      this.state=5;
    },
    enableBudget:function(){
      this.ifModified=true;
    },
    updateProject:function(){
      axios
            .post('/api/private/project/set_project_status', {project_id:this.project_id,status:this.state},{
            })
            .then(function(response){
              var jsonData=response.data;
              if(jsonData.message==='success'){
                showinfo('修改成功')
              }
              else if(jsonData.message==='Need login'){
                showinfo('请先登录');
              }           
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
      axios
            .post('/api/private/project/set_budget', {project_id:this.project_id,budget:this.budgetMod===''?this.budget:this.budgetMod},{
            })
            .then(function(response){
              var jsonData=response.data;
              if(jsonData.message==='success'){
                showinfo('修改成功');
                setTimeout(()=>{
                  window.location.reload();
                },1000)
              }
              else if(jsonData.message==='Need login'){
                showinfo('请先登录');
              }             
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
  },
  mounted:function(){
    var project_id=GetRequest()['id'];
      axios
            .post('/api/public/project/query_by_id', {project_id:project_id})
            .then(response=>{
                jsonData = response.data.data;
                console.log(jsonData);
                this.project_id=project_id;
                this.pic_url=jsonData.pic_url;
                this.name=jsonData.name;
                this.author=jsonData.Author.nickname
                this.tel=jsonData.Author.tel;
                this.budget=jsonData.budget;
                this.demand=jsonData.demand;
                this.address=jsonData.project_address;
                this.state=jsonData.state;
                this.lng=jsonData.lng;
                this.lat=jsonData.lat;
                this.ifAuthor=jsonData.is_me;                
                this.$refs.schemeComp.init(jsonData.Schemes, jsonData.final_scheme);
                this.$refs.commentComp.init(jsonData.Comments);
                window.initMap(this.lng,this.lat);
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
  }
})

function initMap(lng,lat){
  var map = new BMap.Map("bdmap");
  map.centerAndZoom(new BMap.Point(lat, lng),9);
  var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
  var top_left_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL});
  map.addControl(mapType1);
  map.addControl(top_left_navigation);
}