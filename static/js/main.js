// 修复 经纬度 的 问题

var UploadComp = {
  template: '#uploadModal',
  data:function(){
    return {
      factors:{
        name:'',
        tel:'',
        budget:'',
        demand:'',
        address:'',
      },
      ifinvalid:false,
    }
  },
  methods:{
    check:function(){
      if (!this.factors.address||!this.factors.tel||!this.factors.demand||!this.factors.name)
      {
          alert("请填写必要信息");
          this.ifinvalid=true;
          return false;
      } 
      if(this.$refs.cover.files[0]===undefined){
        alert("请上传项目封面");
        return false;
      }
      return true;
    },
    getFormData:function(){
      if(!this.check())
        return null;
      var formdata=new FormData();
      formdata.append("pic",this.$refs.cover.files[0]);
      formdata.append("name",this.factors.name);
      formdata.append("tel",this.factors.tel);
      formdata.append("budget",this.factors.budget);
      formdata.append("demand",this.factors.demand);
      formdata.append("project_address",this.factors.address);
      return formdata;
    },
    showaidesign:function(){  // 父组件
      if(!this.check())
        return
      this.$emit('switch','choose-elem-comp');
    },
  },
  mounted:function(){
    initMap();
    addPreview('#file','#previewfile');
  }
}

var SelectPanelComp = {
  template:"#aiSelectFull",
  data:function(){
    return {
      A:'0',
      B:'0',
      C:'0',
      D:'0',
      E:'0',
      F1:'0',
      F2:'0',
      F3:'0',
      G:'0',
      H:'0'
    }
  },
  methods:{
    gencode:function(){
      return 'A'+this.A+'B'+this.B+'C'+this.C+'D'+this.D+'E'+this.E+'F'+(this.F1==='0'?'':this.F1)+(this.F2==='0'?'':this.F2)+(this.F3==='0'?'':this.F3)+'G'+this.G+'H'+this.H;
    },
    check:function(){
      if(this.A==='0'){
        alert("请选择：尺寸");
        return false;
      }
      if(this.B==='0'){
        alert("请选择：围合");
        return false;
      }
      if(this.C==='0'){
        alert("请选择：绿地比例");
        return false;
      }
      if(this.D==='0'){
        alert("请选择：功能");
        return false;
      }
      if(this.E==='0'){
        alert("请选择：风格");
        return false;
      }
      if(this.F1==='0'&&this.F2==='0'&&this.F3==='0'){
        alert("请选择：景观要素");
        return false;
      }
      if(this.G==='0'){
        alert("请选择：座椅数量");
        return false;
      }
      if(this.H==='0'){
        alert("请选择：是否需要顶棚");
        return false;
      }
      return true;
    },
  },
  mounted:function(){
    initChip();
  }
}

var ChooseElemComp = {
  template:"#aidesignModal",
  components:{
    SelectPanelComp
  },
  methods:{
    showupload:function(){  //return to uploadModal
      this.$emit('switch','upload-comp');
    },
    showdesign:function(){  //父组件
      if(!this.$refs.panel.check())
        return;
      var code=this.$refs.panel.gencode();
      this.$emit('switch','transition-comp',code);
    },
  },
}

// 可以 考虑 异步 加载 图片 优化性能
var TransitionComp = {
  template:'#loader',
}

var PresentComp = {
  template:'#designModal',
  props:['solutions'],
  methods:{
    getSecondary:function(){
      return this.solutions.slice(1);
    },
    showaidesign:function(){
      this.$emit('switch','choose-elem-comp');
    },
    present: function (order) {
      this.$emit('present',order);
    },
    publishproject:function(){
      this.$emit('publish');
    },
  },
  computed:{
    firstSolution:function(){
      if(this.solutions.length===0)
        return {};
      else
        return this.solutions[0];
    }
  }
}

var uploadScreen={
    template: '#uploadTemplate',
    data : function(){
      return {
      currentComp:'upload-comp',
      lng:0,
      lat:0,
      solutions:[],
      refresh:true
    }},
    components:{
      UploadComp,
      ChooseElemComp,
      TransitionComp,
      PresentComp
    },
    methods: {
      setCoor:function(lng,lat){
        this.lng=lng;
        this.lat=lat;
      },
        switchModal:function(modal, code=''){
          this.currentComp=modal;
          if(modal==='transition-comp'){
            axios
            .post('/api/public/scheme/query_scheme', {code})
            .then(response => {
              this.currentComp='present-comp';
              this.solutions.splice(0);
              console.log(response)
              jsonData = response.data.data;
              for(var i=0;i<4;i++){
                  jsonData[i].designName = jsonData[i].name;
                  jsonData[i].surround = decodeSurround(jsonData[i].surround);
                  jsonData[i].size = decodeSize(jsonData[i].size);
                  jsonData[i].greenRate = decodeGreenRate(jsonData[i].green_rate);
                  jsonData[i].function = decodeFunction(jsonData[i].func);
                  jsonData[i].style = decodeStyle(jsonData[i].style);
                  jsonData[i].viewFactor = decodeViewFactor(jsonData[i].view_factor);
                  jsonData[i].chairNum = decodeChairNum(jsonData[i].chair_num);
                  jsonData[i].isCovered = decodeIfCovered(jsonData[i].is_covered);
                  this.solutions.push(jsonData[i]);
              }
            })
            .catch(function (error) { // 请求失败处理
              console.log(error);
            });
          }
        },
        present: function (order) {
          this.solutions.splice(0,1,...this.solutions.splice(order, 1 , this.solutions[0]));
        },
        setCoor:function(lng,lat){
          this.lng=lng;
          this.lat=lat;
        },
        publish:function(){
          var formdata=this.$children[0].getFormData();
          formdata.append("lng",this.lng);
          formdata.append("lat",this.lat);
          for(var i=0;i<4;++i){
            formdata.append("designs",Number(this.solutions[i].id));
          }
          axios
            .post('/api/private/project/upload_project', 
            formdata,
            {headers:{
                  'Content-Type': 'multipart/form-data'
          }})
            .then(response =>{
              console.log(response)
              $("#uploadscreen").modal("close");
              showinfo('发布成功');
              this.refresh=false;
              this.$nextTick(()=>{  
                this.refresh = true;
                this.currentComp='upload-comp';
                this.lng=0;
                this.lat=0;
              });
            })
            .catch(function (error) { // 请求失败处理
              console.log(error);
            });
        }
      }
  }

var DesignComp = {
  template:"#aiadddesignModal",
  components:{
    SelectPanelComp
  },
  data:function(){
    return {
      name:'',
    }
  },
  methods:{
    uploaddesign:function(){
      if(!this.$refs.panel.check())
        return;
      var code=this.$refs.panel.gencode();
      var file=this.$refs.file.files;
      if(file[0]===undefined){
        alert("请上传设计图纸");
        return;
      }
      var formdata=new FormData();
      formdata.append("scheme",file[0]);
      formdata.append("name",this.name);
      formdata.append("code",code);
      this.$emit('submit',formdata);
    }
  },
  mounted:function(){
    addPreview('#fileImage','#preview');
  }
}

var designScreen = {
  template:'#designTemplate',
  data:function(){
    return {
    refresh:true,
  }},
  components:{
    DesignComp
  },
  methods:{
    submit:function(formdata){
      axios
        .post('/api/private/scheme/add_scheme', formdata,{
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      })
        .then(response=>{  
          console.log(response);
          showinfo('上传成功');
          $("#designscreen").modal("close");              
          this.refresh=false;
          this.$nextTick(()=>{  
            this.refresh = true;
          });
        })
        .catch(function (error) { // 请求失败处理
        console.log(error);
        });
    }
  },
}

var examplePanel = {
  template:'#examplePanel',
  data:function(){
    return{examples:[
      {
        img:'img/20-400x293.jpg',
        name:'同济新村院落空间',
        detail:'学生实践平台'
      },
      {
        img:'img/19.jpg',
        name:'四平体育弄',
        detail:'激发社区活力'
      },
      {
        img:'img/13.jpg',
        name:'创智农园',
        detail:'增强邻里互动社交'
      }
    ]
  }}
}

var paralPanel={
  template:"#paral",
  props:['src']
}

var vm = new Vue({
  el:"#indexPage",
  components:{
    uploadScreen,
    designScreen,
    examplePanel,
    paralPanel
  },
  methods:{
    setCoor:function(lng,lat){
      this.$refs.upload.setCoor(lng,lat);
    }
  }
})

function addPreview(fileId, previewId){
  var fileInput = $(fileId);
  var preview = $(previewId);
      //respond when the content of the 'file' item change
      fileInput.change(function () {
        //clear the old background
        preview.attr("src","");
        var file = fileInput.get(0).files[0];
        
        if (file===undefined){
            preview.slideUp('slow');
        }
        else if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
            fileInput.get(0).value='';
            preview.hide();
            alert('不是有效的图片文件!'); 
        }
        else{
        var reader = new FileReader();
        //respond once the filreader finish its uploading process
        reader.onload = function(e) {
            var data = e.target.result;
            preview.attr("src",data);
            preview.slideDown('slow');
        };
        reader.readAsDataURL(file);
        }
    });
}

function initChip(){
  $('.chips').material_chip();
  $(".chip").click(function(){
    for(item=0;item < this.parentNode.children.length;item++){
      //  console.log(this.parentNode.children)
        this.parentNode.children[item].style.backgroundColor = "#e4e4e4";
        this.parentNode.children[item].style.color = "rgba(0, 0, 0, 0.6)";
    }
    if(this.style.backgroundColor != "teal"){
        this.style.backgroundColor = "teal";
        this.style.color = "white";
        $(this).parent().find('.chip').removeClass('selected');  //清除其他选择
        $(this).addClass('selected');  //选择
    }else{
        $(this).removeClass('selected');  //重新选择
        this.style.backgroundColor = "#e4e4e4";
        this.style.color = "rgba(0, 0, 0, 0.6)";
    }
  });

//新增多选
  $(".chipf").click(function(){
      if(this.style.backgroundColor != "teal"){
          this.style.backgroundColor = "teal";
          this.style.color = "white";
      }else{
       //   $(this).removeClass('selected');  //重新选择
          this.style.backgroundColor = "#e4e4e4";
          this.style.color = "rgba(0, 0, 0, 0.6)";
      }
  });
}

function initMap(){
  var map = new BMap.Map("bdmap");
  map.centerAndZoom(new BMap.Point(121.443186-0.95206, 31.225499+0.52422),9);
  var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
  var top_left_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL});
  map.addControl(mapType1);
  map.addControl(top_left_navigation);

  map.addEventListener("click", e=>{
    $("#coords")[0].value = "lng: " + e.point.lng + ", lat: " + e.point.lat;
    vm.setCoor(e.point.lng,e.point.lat);
    map.clearOverlays();
    var marker = new BMap.Marker(e.point);
    map.addOverlay(marker);
    console.log(e.point);
  });
}