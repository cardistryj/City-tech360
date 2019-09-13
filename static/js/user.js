//用户操作
var userSigninURL = "/api/public/user/login";
var userSignupURL = "/api/public/user/signup";

function newuser(){
    var username = $("#username")[0].value;
    var email = $("#mailaddr")[0].value;
    var password = $("#password")[0].value;
    var passwordre = $("#password-re")[0].value;

    if(!username){
        alert("请填写用户名");
        $("#username").addClass("invalid");
        return
    }
    if(!email){
        alert("请填写邮箱");
        $("#mailaddr").addClass("invalid");
        return
    }
    if(!password){
        alert("请填写密码");
        $("#password").addClass("invalid");
        return
    }
    if(!passwordre){
        alert("请填写确认密码");
        $("#password-re").addClass("invalid");
        return
    }
    if( $("#mailaddr").hasClass("invalid")){
        alert("输入邮箱格式不合法")
        return;
    }


    var job;
    if( $("[href=#signupDesigner]").hasClass("active")){
        job = 1;
    }
    else if($("[href=#signupGov]").hasClass("active")){
        job = 2;
    }
    else if($("[href=#signupCmt]").hasClass("active")){
        job = 3;
    }
    else if($("[href=#signupCtz]").hasClass("active")){
        job = 4;
    }
    else if($("[href=#signupWrk]").hasClass("active")){
        job = 5;
    }
    var tel = $("#telnum")[0].value;
    var avatar = "default";

    if(passwordre != password){
        alert("两次输入的密码不一致！");
        $("#password").addClass("invalid");
        $("#password-re").addClass("invalid");
        return;
    }
    
    var sha1password = sha1(password.toString());

    $.ajax({
        url:userSignupURL,
        type: "post",
        dataType:"text",
        async: false,
        data: {
            "nickname":username,
            "password":sha1password,
            "type":job,
            "email":email,
            "tel":tel,
        },
        success: function(result){
            console.log(result);
            jsonResult=JSON.parse(result);
            if(jsonResult.message==="success"){
                $("#username")[0].value = "";
                $("#mailaddr")[0].value = "";
                $("#password")[0].value = "";
                $("#password-re")[0].value = "";
                $("#telnum")[0].value = "";
                $("#signupscreen").modal('close');
                showinfo("注册成功");
                //setUser(username,email,avatar,job,tel);
            }
            else if(jsonResult.message === "Email already exists"){
                $("#mailaddr").addClass("invalid");
                showinfo("邮箱重复");
            }  
        },
        error: function (XMLHttpRequest, textStatus, errorThrown){
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
    
}

function signin(){
    var email = $("#email_login")[0].value;
    var password = $("#password_login")[0].value;
    var sha1password = sha1(password.toString());

    $.ajax({
        url:userSigninURL,
        type: "post",
        dataType:"text",
        async: false,
        data: {
            "email":email,
            "password":sha1password,
        },
        success: function(result){
            console.log(result);
            jsonResult =  JSON.parse(result);
            $("#loginscreen").modal("close");
            if(jsonResult.message!=="success"){
                showinfo(jsonResult.message);
            }
            else{
                setUser(jsonResult.data.nickname,jsonResult.data.email,jsonResult.data.avatar,jsonResult.data.type,jsonResult.data.tel);
                showinfo("登录成功");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown){
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
}

function signout(){
    $("#btnSignup").fadeIn('slow');
    $("#btnSignin").fadeIn('slow');
    $("#imgAvatar").src = "default.jpg";
    $("#liAvatar").fadeOut('slow');
    $("#pUsername")[0].innerHTML = "";
    $("#btnMyproject").fadeOut('slow');
    $("#btnMydesign").fadeOut('slow');
    $("#btnSignupSide").fadeIn('slow');
    $("#btnSigninSide").fadeIn('slow');
    $("#imgAvatarSide").src = "default.jpg";
    $("#liAvatarSide").fadeOut('slow');
    $("#infoSide").fadeOut('slow');
    $("#signoutSide").fadeOut('slow');
    $("#pUsernameSide")[0].innerHTML = "";
    $("#btnMyprojectSide").fadeOut('slow');
    $("#btnMydesignSide").fadeOut('slow');
    $('#uploaddesign').fadeOut('slow');
    $.ajax({
        url:'/api/private/user/logout',
        type: "get",
        dataType:"text",
        async: false,
        data: {},
        success: function(result){
            console.log(result);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown){
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });

    showinfo("已登出");
}