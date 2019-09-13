(function($){
  $(function(){
    $('.button-collapse').sideNav();
    $('.parallax').parallax();
  }); // end of document ready
})(jQuery); // end of jQuery name space

function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
      }
  }
  return theRequest;
}

$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});

function showinfo(info){
  $("#infotext")[0].innerHTML = info;
  $("#infoscreen").modal("open");
}

function closeAllModal(){
  $(".modal").modal("close");
  window.location.reload();
}

function openSignupscreen(){
  $("#signupscreen").modal('open');
  $('ul.tabs').tabs('select_tab', 'signupDesigner');
}

function init(){
  $.ajax({
    url:'/api/public/user/check_login_status',
    type: "get",
    dataType:"text",
    async: false,
    data: {},
    success: function(result){
        jsonResult=JSON.parse(result);
        if(jsonResult.message==="Already login"){
          setUser(jsonResult.data.nickname,jsonResult.data.email,jsonResult.data.avatar,jsonResult.data.type,jsonResult.data.tel);          
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown){
        alert(XMLHttpRequest.status);
        alert(XMLHttpRequest.readyState);
        alert(textStatus);
    }
});
}