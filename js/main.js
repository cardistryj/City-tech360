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
              id:'0',
              designName:'123设计方案',
              pic:'1.png',
              surround:'123',
              size:'123',
              greenRate:'123',
              function:'娱乐',
              style:'123',
              viewFactor:'54',
              chairNum:'3',
              isCovered:'345',
            },
            {
              id:'0',
              designName:'瞎几把设计',
              pic:'2.png',
              surround:'无',
              size:'大',
              greenRate:'高',
              function:'无',
              style:'朋克',
              viewFactor:'没有',
              chairNum:'10',
              isCovered:'是',
            },
            {
              id:'0',
              designName:'乱求设计',
              pic:'3.png',
              surround:'有',
              size:'小',
              greenRate:'0%',
              function:'大保健',
              style:'淫欲',
              viewFactor:'晓不得',
              chairNum:'0',
              isCovered:'否',
            },
            {
              id:'0',
              designName:'锤子设计',
              pic:'4.png',
              surround:'晓不得',
              size:'晓求不得',
              greenRate:'你猜',
              function:'没得',
              style:'XXXL',
              viewFactor:'这个真没有',
              chairNum:'-1',
              isCovered:'非也',
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
          console.log(this.factors.lng);
          console.log(this.factors.lat);
          axios
            .post('http://localhost:8888/upload.php', 
            {"name":this.factors.name,"tel" : this.factors.tel, "budget": this.factors.budget, "demand": this.factors.demand, "address": this.factors.address, "lng":this.factors.lng, "lat":this.factors.lat},
            {
              headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
          })
            .then(function(response){
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
          // $.ajax({
          //     url: ,        
          //     type: "post",
          //     dataType:"text",
          //     async: false,
          //     data: {"name":this.factors.name,"tel" : this.factors.tel, "budget": this.factors.budget, "demand": this.factors.demand, "address": this.factors.address, "lng":this.factors.lng, "lat":this.factors.lat},
          //     success: function(result){
          //         // alert(result);
          //         vm.factors.name = "";
          //         vm.factors.tel = "";
          //         vm.factors.budget = "";
          //         vm.factors.demand = "";
          //         vm.factors.address = "";
          //         $("#infotext")[0].innerHTML = "上传成功";
          //         $("#infoscreen").modal("open");
          //     },
          //     error: function (XMLHttpRequest, textStatus, errorThrown){
          //         alert(XMLHttpRequest.status);
          //         alert(XMLHttpRequest.readyState);
          //         alert(textStatus);
          //     }
          // });
          // for (var item in $("#file")[0].files){
          //     if($("#file")[0].files[item] != undefined){
          //         var fileform = new FormData($('#uploadForm'));
          //         fileform.append('name',vm.factors.name);
          //         //fileform.append('files',$("#file")[0].files[item]);
          //         fileform.append('file',$("#file")[0].files[item]);
          //         $.ajax({
          //             url: 'php/fileupload.php',
          //             type: 'POST',
          //             cache: false,
          //             data: fileform,
          //             processData: false,
          //             contentType: false
          //         }).done(function(res) {}).fail(function(res) {});
          //     }
          //     else{
          //         console.log("nofile");
          //     }
          // }
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
        var formdata=new FormData();
        formdata.append("design",file[0]);
        var code=this.gencode();
        console.log(code);

        axios
            .post('http://127.0.0.1:12450/api/private/scheme/add_scheme', {
              "designName":this.name,
              "code":code,
              "formdata":formdata
          })
            .then(function(response){  
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

  setUserFromSesssion();

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

function closeAllModal(){
    $(".modal").modal("close");
}