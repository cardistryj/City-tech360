var vm=new Vue({
    el: '#uploadscreen',
    data : {
      factors:{
        name:'',
        author:'',
        street:'',
        tel:'',
        budget:'',
        demand:'',
        address:''
      },
      ifshowupload:true,
      ifshowaidesign:false,
      ifshowdesign:false,
      ifinvalid:false,
      solutions:[
            {
              name:'123',
              img:'1.png',
              detail:'123',
              size:'123',
              shape:'123',
              type:'23',
              designage:'4',
              outdoor:'54',
              district:'3',
              region:'345',
              function:'345'
            },
            {
              name:'2',
              img:'2.png',
              detail:'2',
              size:'2',
              shape:'2',
              type:'2',
              designage:'2',
              outdoor:'2',
              district:'2',
              region:'2',
              function:'2'
            },
            {
              name:'3',
              img:'3.png',
              detail:'3',
              size:'3',
              shape:'3',
              type:'3',
              designage:'3',
              outdoor:'3',
              district:'3',
              region:'3',
              function:'3'
            },
            {
              name:'4',
              img:'4.png',
              detail:'4',
              size:'4',
              shape:'4',
              type:'4',
              designage:'4',
              outdoor:'4',
              district:'4',
              region:'4',
              function:'4'
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
          if (!this.factors.author||!this.factors.address||!this.factors.tel||!this.factors.demand||!this.factors.name)
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
        showdesign(){
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
          this.ifshowdesign=true;

          console.log(code);
        
          axios
            .get('php/finddesign.php', {"demand":code})
            .then(function(response){
                jsonData = JSON.parse(response);
                for(var i=0;i<4;i++){
                    this.solutions[i].name = jsonData[i].name;
                    this.solutions[i].img = jsonData[i].img;
                    this.solutions[i].detail = jsonData[i].detail;
                    this.solutions[i].size = jsonData[i].size;
                    this.solutions[i].shape = jsonData[i].shape;
                    this.solutions[i].type = jsonData[i].type;
                    this.solutions[i].designage = jsonData[i].designage;
                    this.solutions[i].outdoor = jsonData[i].outdoor;
                    this.solutions[i].district = jsonData[i].district;
                    this.solutions[i].region = jsonData[i].region;
                    this.solutions[i].function = jsonData[i].function;
                }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
        },
      }
  })

  var vm_design=new Vue({
    el:'#designscreen',
    data:{
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
      gencode:function(){
        return 'A'+this.A+'B'+this.B+'C'+this.C+'D'+this.D+'E'+this.E+'F'+(this.F1==='0'?'':this.F1)+(this.F2==='0'?'':this.F2)+(this.F3==='0'?'':this.F3)+(this.F4==='0'?'':this.F4)+'G'+this.G+'H'+this.H;
      },
      uploaddesign(){
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
        var formdata=new FormData();
        formdata.append("design",file[0]);
        var code=this.gencode();
        console.log(code);

        axios
            .post('php/finddesign.php', {
              "demand":code,
              "formdata":formdata
          })
            .then(function(response){  
              alert("上传成功");
              $("#aiadddesignModal").modal('close');
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
          detail:'同济新村老旧院落型住宅改造'
        },
        {
          img:'img/13.jpg',
          name:'四平体育弄',
          detail:'社区公共空间改造设计'
        },
        {
          img:'img/9.jpg',
          name:'创智农园',
          detail:'将建筑废料堆放处改造成社区花园'
        }
      ]
    }
  })

$('.carousel.carousel-slider').carousel({full_width: true});
 $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    if(GetQueryString("fun")=="upload")
      $("#uploadscreen").modal('open');
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
  var uploadcoords;

  setUserFromSesssion();

  function showInfo(e){
      uploadcoords = e.point;
      $("#coords")[0].value = "lng: " + e.point.lng + ", lat: " + e.point.lat
      map.clearOverlays();
      var marker = new BMap.Marker(e.point);
      map.addOverlay(marker);
    };
  
  map.addEventListener("click", showInfo);

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

// function showdesign(){
//   $("#aidesignModal")[0].style.display = "none";
//   $("#designModal")[0].style.display = "block";

//   $.ajax({
//     url: "php/finddesign.php",        
//     type: "post",
//     dataType:"text",
//     async: false,
//     data: {"code":code},
//     success: function(result){
//          //alert(result);
//         //////////////////////////////////////////////////此处使用vue 四个设计方案

//          jsonData = eval(result);
//          $("#ai_name")[0].innerHTML = jsonData[0].name;
//          $("#ai_img")[0].src = "designdataimg/"+jsonData[0].img;
//          $("#ai_detail")[0].innerHTML = jsonData[0].detail;
//          $("#ai_label")[0].innerHTML = "大小:"+jsonData[0].size
//                                     +";形态:"+jsonData[0].shape
//                                     +";属性:"+jsonData[0].type
//                                     +";年限:"+jsonData[0].designage
//                                     +";场所:"+jsonData[0].outdoor
//                                     +";位置:"+jsonData[0].district
//                                     +";环境:"+jsonData[0].region
//                                     +";功能:"+jsonData[0].function;
//         $("#ai_name2")[0].innerHTML = jsonData[1].name;
//         $("#ai_p2")[0].innerHTML = jsonData[1].detail;
//         $("#ai_img2")[0].src = "designdataimg/" + jsonData[1].img;
//         $("#ai_btn2")[0].onclick = function(){
//             $("#ai_name")[0].innerHTML = jsonData[1].name;
//             $("#ai_img")[0].src = "designdataimg/"+jsonData[1].img;
//             $("#ai_detail")[0].innerHTML = jsonData[1].detail;
//             $("#ai_label")[0].innerHTML = "大小:"+jsonData[1].size
//                                         +";形态:"+jsonData[1].shape
//                                         +";属性:"+jsonData[1].type
//                                         +";年限:"+jsonData[1].designage
//                                         +";场所:"+jsonData[1].outdoor
//                                         +";位置:"+jsonData[1].district
//                                         +";环境:"+jsonData[1].region
//                                         +";功能:"+jsonData[1].function;
//             window.location.href="#designModal";
//         };

//         $("#ai_name3")[0].innerHTML = jsonData[2].name;
//         $("#ai_p3")[0].innerHTML = jsonData[2].detail;
//         $("#ai_img3")[0].src = "designdataimg/" + jsonData[2].img;
//         $("#ai_btn3")[0].onclick = function(){
//             $("#ai_name")[0].innerHTML = jsonData[2].name;
//             $("#ai_img")[0].src = "designdataimg/"+jsonData[2].img;
//             $("#ai_detail")[0].innerHTML = jsonData[2].detail;
//             $("#ai_label")[0].innerHTML = "大小:"+jsonData[2].size
//                                         +";形态:"+jsonData[2].shape
//                                         +";属性:"+jsonData[2].type
//                                         +";年限:"+jsonData[2].designage
//                                         +";场所:"+jsonData[2].outdoor
//                                         +";位置:"+jsonData[2].district
//                                         +";环境:"+jsonData[2].region
//                                         +";功能:"+jsonData[2].function;
//             window.location.href="#designModal";
//         };

//         $("#ai_name4")[0].innerHTML = jsonData[3].name;
//         $("#ai_p4")[0].innerHTML = jsonData[3].detail;
//         $("#ai_img4")[0].src = "designdataimg/" + jsonData[3].img;
//         $("#ai_btn4")[0].onclick = function(){
//             $("#ai_name")[0].innerHTML = jsonData[3].name;
//             $("#ai_img")[0].src = "designdataimg/"+jsonData[3].img;
//             $("#ai_detail")[0].innerHTML = jsonData[3].detail;
//             $("#ai_label")[0].innerHTML = "大小:"+jsonData[3].size
//                                         +";形态:"+jsonData[3].shape
//                                         +";属性:"+jsonData[3].type
//                                         +";年限:"+jsonData[3].designage
//                                         +";场所:"+jsonData[3].outdoor
//                                         +";位置:"+jsonData[3].district
//                                         +";环境:"+jsonData[3].region
//                                         +";功能:"+jsonData[3].function;
//             window.location.href="#designModal";
//         };

//     },
//     error: function (XMLHttpRequest, textStatus, errorThrown){
//         alert(XMLHttpRequest.status);
//         alert(XMLHttpRequest.readyState);
//         alert(textStatus);
//     }
// });
//}

function publish(){
    // if(isLogin())
        ajaxtest();
    // else
    //     showinfo("请先登录");
}

function closeAllModal(){
    $(".modal").modal("close");
}

function showallAiSelect(){
    $("#aiSelect")[0].innerHTML = $("#aiSelectFull")[0].innerHTML;
}