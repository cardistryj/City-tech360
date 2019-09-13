(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space

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