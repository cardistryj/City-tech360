var vm=new Vue({
    el: '#uploadscreen',
    data : {
      factors:{
        name:'',
        tel:'',
        budget:'',
        demand:'',
        address:'',
        lng:'',
        lat:'',
      },
      ifshowupload:true,
      ifshowaidesign:false,
      ifshowdesign:false,
      ifinvalid:false,
      ifshowloader:false,
      solutions:[
            {
              id:'',
              designName:'',
              pic:'',
              surround:'',
              size:'',
              greenRate:'',
              function:'',
              style:'',
              viewFactor:'',
              chairNum:'',
              isCovered:'',
            },
            {
              id:'',
              designName:'',
              pic:'',
              surround:'',
              size:'',
              greenRate:'',
              function:'',
              style:'',
              viewFactor:'',
              chairNum:'',
              isCovered:'',
            },
            {
              id:'',
              designName:'',
              pic:'',
              surround:'',
              size:'',
              greenRate:'',
              function:'',
              style:'',
              viewFactor:'',
              chairNum:'',
              isCovered:'',
            },
            {
              id:'',
              designName:'',
              pic:'',
              surround:'',
              size:'',
              greenRate:'',
              function:'',
              style:'',
              viewFactor:'',
              chairNum:'',
              isCovered:'',
            }
      ],
      A:'0',
      B:'0',
      C:'0',
      D:'0',
      E:'0',
      F1:'0',
      F2:'0',
      F3:'0',
      F4:'0',
      G:'0',
      H:'0'
    },
    methods: {
        reset:function(){
          this.factors.name = "";
          this.factors.tel = "";
          this.factors.budget = "";
          this.factors.demand = "";
          this.factors.address = "";
          this.factors.lng = "";
          this.factors.lat = "";
          this.A='0';
          this.B='0';
          this.C='0';
          this.D='0';
          this.E='0';
          this.F1='0';
          this.F2='0';
          this.F3='0';
          this.F4='0';
          this.G='0';
          this.H='0';
          this.ifshowupload=true;
          this.ifshowaidesign=false;
          this.ifshowdesign=false;
          this.ifshowloader=false;
        },
        present: function (event) {
          var order=event.currentTarget.getAttributeNode('id');
          order=parseInt(order.value.substring(order.value.length-1))-1;
          this.solutions.splice(0,1,...this.solutions.splice(order, 1 , this.solutions[0]));
          window.location.href="#designModal";
        },
        gencode:function(){
          return 'A'+this.A+'B'+this.B+'C'+this.C+'D'+this.D+'E'+this.E+'F'+(this.F1==='0'?'':this.F1)+(this.F2==='0'?'':this.F2)+(this.F3==='0'?'':this.F3)+(this.F4==='0'?'':this.F4)+'G'+this.G+'H'+this.H;
        },
        showupload:function(){
          this.ifshowupload=true;
          this.ifshowaidesign=false;
        },
        showaidesign:function(){
          if (!this.factors.address||!this.factors.tel||!this.factors.demand||!this.factors.name)
          {
              alert("请填写必要信息");
              this.ifinvalid=true;
              return;
          }
          this.ifinvalid=false;
          this.ifshowupload=false;
          this.ifshowaidesign=true;
          this.ifshowdesign=false;
        },
        showdesign:function(){
          if(this.A==='0'){
            alert("请选择：尺寸");
            return;
          }
          if(this.B==='0'){
            alert("请选择：围合");
            return;
          }
          if(this.C==='0'){
            alert("请选择：绿地比例");
            return;
          }
          if(this.D==='0'){
            alert("请选择：功能");
            return;
          }
          if(this.E==='0'){
            alert("请选择：风格");
            return;
          }
          if(this.F1==='0'&&this.F2==='0'&&this.F3==='0'&&this.F4==='0'){
            alert("请选择：景观要素");
            return;
          }
          if(this.G==='0'){
            alert("请选择：座椅数量");
            return;
          }
          if(this.H==='0'){
            alert("请选择：是否需要顶棚");
            return;
          }
          var code=this.gencode();
          this.ifshowaidesign=false;
          this.ifshowloader=true;
          console.log(code);
        
          axios
            .post('http://127.0.0.1:12450/api/public/scheme/query_scheme', {code:code})
            .then(function(response){
                vm.ifshowloader=false;
                vm.ifshowdesign=true;
                console.log(response);
                jsonData = response.data.data;
                for(var i=0;i<4;i++){
                  vm.solutions[i].id = jsonData[i].id;
                    vm.solutions[i].designName = jsonData[i].name;
                    vm.solutions[i].pic = jsonData[i].pic;
                    vm.solutions[i].surround = jsonData[i].surround;
                    vm.solutions[i].size = jsonData[i].size;
                    vm.solutions[i].greenRate = jsonData[i].green_rate;
                    vm.solutions[i].function = jsonData[i].func;
                    vm.solutions[i].style = jsonData[i].style;
                    vm.solutions[i].viewFactor = jsonData[i].view_factor;
                    vm.solutions[i].chairNum = jsonData[i].chair_num;
                    vm.solutions[i].isCovered = jsonData[i].is_covered;
                }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
        },
        publishproject:function(){
          if (!this.factors.address||!this.factors.tel||!this.factors.demand||!this.factors.name)
          {
              alert("请填写必要信息");
              this.ifinvalid=true;
              return;
          } 
          var file=document.getElementById("file").files;
          if(file[0]===undefined){
            alert("请上传项目封面");
            return;
          }
          var formdata=new FormData();
          formdata.append("pic",file[0]);
          formdata.append("name",this.factors.name);
          formdata.append("tel",this.factors.tel);
          formdata.append("budget",this.factors.budget);
          formdata.append("demand",this.factors.demand);
          formdata.append("project_address",this.factors.address);
          formdata.append("lng",this.factors.lng);
          formdata.append("lat",this.factors.lat);
          for(var i=0;i<4;++i){
            formdata.append("designs",Number(this.solutions[i].id));
          }
          axios
            .post('/api/private/project/upload_project', 
            formdata,
            {headers:{
                  'Content-Type': 'multipart/form-data'
          }})
            .then(function(response){
              console.log(response)
              $("#uploadscreen").modal("close");
              showinfo('发布成功');
              resetProject();
              resetMap();
              resetFile();
              vm.reset();
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
        }
      }
  })

  var vm_design=new Vue({
    el:'#designscreen',
    data:{
      name:'',
      A:'0',
      B:'0',
      C:'0',
      D:'0',
      E:'0',
      F1:'0',
      F2:'0',
      F3:'0',
      F4:'0',
      G:'0',
      H:'0'
    },
    methods:{
      reset:function(){
        this.A='0';
        this.B='0';
        this.C='0';
        this.D='0';
        this.E='0';
        this.F1='0';
        this.F2='0';
        this.F3='0';
        this.F4='0';
        this.G='0';
        this.H='0';
      },
      gencode:function(){
        return 'A'+this.A+'B'+this.B+'C'+this.C+'D'+this.D+'E'+this.E+'F'+(this.F1==='0'?'':this.F1)+(this.F2==='0'?'':this.F2)+(this.F3==='0'?'':this.F3)+(this.F4==='0'?'':this.F4)+'G'+this.G+'H'+this.H;
      },
      uploaddesign:function(){
        if(this.A==='0'){
          alert("请选择：尺寸");
          return;
        }
        if(this.B==='0'){
          alert("请选择：围合");
          return;
        }
        if(this.C==='0'){
          alert("请选择：绿地比例");
          return;
        }
        if(this.D==='0'){
          alert("请选择：功能");
          return;
        }
        if(this.E==='0'){
          alert("请选择：风格");
          return;
        }
        if(this.F1==='0'&&this.F2==='0'&&this.F3==='0'&&this.F4==='0'){
          alert("请选择：景观要素");
          return;
        }
        if(this.G==='0'){
          alert("请选择：座椅数量");
          return;
        }
        if(this.H==='0'){
          alert("请选择：是否需要顶棚");
          return;
        }
        var file=document.getElementById("fileImage").files;
        if(file[0]===undefined){
          alert("请上传设计图纸");
          return;
        }
        var code=this.gencode();
        var formdata=new FormData();
        formdata.append("scheme",file[0]);
        formdata.append("name",this.name);
        formdata.append("code",code);
        axios
            .post('http://127.0.0.1:12450/api/private/scheme/add_scheme', formdata,{
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          })
            .then(function(response){  
              console.log(response);
              vm_design.reset();
              showinfo('上传成功');
              $("#aiadddesignModal").modal("close");              
              resetDesign();
              resetDesignFile();
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
      }
    }
  })

  var vm_=new Vue({
    el:'#masonry',
    data:{
      examples:[
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
    }
  })

$('.carousel.carousel-slider').carousel({full_width: true});
 $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });

  var fileInput = $('#fileImage');
  var preview = $('#preview');
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

  function showmodal(){
    if(isLogin())
            $("#uploadscreen").modal('open');
          else
            alert("请先登录");
  }

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

  var map = new BMap.Map("bdmap");
  map.centerAndZoom(new BMap.Point(121.443186-0.95206, 31.225499+0.52422),9);
  var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
  var top_left_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_SMALL});
  map.addControl(mapType1);
  map.addControl(top_left_navigation);

  init();

  function showInfoMap(e){
      $("#coords")[0].value = "lng: " + e.point.lng + ", lat: " + e.point.lat;
      vm.factors.lng=e.point.lng;
      vm.factors.lat=e.point.lat;
      map.clearOverlays();
      var marker = new BMap.Marker(e.point);
      map.addOverlay(marker);
      console.log(e.point);
    };

  function resetMap(){
    $("#coords")[0].value = "";
      map.clearOverlays();
  }

  function resetFile(){
    $('#uploadModal > div:nth-child(3) > div:nth-child(8)').empty();
    $('#uploadModal > div:nth-child(3) > div:nth-child(8)').append('<form action="#"><div class="file-field input-field"><div class="btn purple lighten-4">'+
        '<span>上传附件</span><form id="uploadForm" enctype="multipart/form-data"><input id="file" type="file" name="file" multiple>'+
        '</form></div><div class="file-path-wrapper"><input class="file-path validate" type="text" placeholder="上传一个或多个文件"></div></div></form>');
  }

  function resetDesignFile(){
    $('#aiadddesignModal > div.row.center.centered.z-depth-2 > div').empty();
    $('#uploadModal > div:nth-child(3) > div:nth-child(8)').append('<form action="#"><div class="file-field input-field"><div class="btn purple lighten-4">'+
        '<span>上传图片</span><form id="formImage" enctype="multipart/form-data"><input id="fileImage" accept="image/*" type="file" name="file" multiple>'+
        '</form></div><div class="file-path-wrapper"><input class="file-path validate" type="text" placeholder="上传您创作的设计方案"></div></div></form>');
  }
  
  map.addEventListener("click", showInfoMap);

  function resetProject(){
    $('#uploadModal > div:nth-child(3) > div > label').removeClass('active');
    $('#uploadModal > div:nth-child(3) > div > input').removeClass('valid');
    $('#aidesignModal div.chip').css('color','rgba(0, 0, 0, 0.6)');
    $('#aidesignModal div.chip').css('background-color','#e4e4e4');
    $('#aidesignModal div.chipf').css('color','rgba(0, 0, 0, 0.6)');
    $('#aidesignModal div.chipf').css('background-color','#e4e4e4');
}

function resetDesign(){
    $('#aiadddesignModal div.chip').css('color','rgba(0, 0, 0, 0.6)');
    $('#aiadddesignModal div.chip').css('background-color','#e4e4e4');
    $('#aiadddesignModal div.chipf').css('color','rgba(0, 0, 0, 0.6)');
    $('#aiadddesignModal div.chipf').css('background-color','#e4e4e4');
}

  function GetQueryString(param) { //param为要获取的参数名 注:获取不到是为null  
    var currentUrl = window.location.href; //获取当前链接  
    var arr = currentUrl.split("?");//分割域名和参数界限  
    if (arr.length > 1) {  
        arr = arr[1].split("&");//分割参数  
        for (var i = 0; i < arr.length; i++) {  
            var tem = arr[i].split("="); //分割参数名和参数内容  
            if (tem[0] == param) {  
                return tem[1];  
            }  
        }  
        return null;  
    }  
    else {  
        return null;  
    }  
}  

function openSignupscreen(){
  $("#signupscreen").modal('open');
  $('ul.tabs').tabs('select_tab', 'signupDesigner');
}

function closeAllModal(){
    $(".modal").modal("close");
}