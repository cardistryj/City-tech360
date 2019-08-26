//用户操作
var userSigninURL = "http://localhost:8888/usersignin.php";
var userSignupURL = "http://localhost:8888/usersignup.php";

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
    var jobdetail;
    if( $("[href=#signupDesigner]").hasClass("active")){
        job = 1;
        jobdetail = $("#job")[0].innerHTML;
        if(!jobdetail){
            alert("请填写职业");
            $("#job").addClass("invalid");
            return;
        }
    }
    if($("[href=#signupGov]").hasClass("active")){
        job = 2;
        jobdetail = $("#govname")[0].value;
        if(!jobdetail){
            alert("请填写政府机构");
            $("#govname").addClass("invalid");
            return;
        }
    }
    if($("[href=#signupCmt]").hasClass("active")){
        job = 3;
        jobdetail = $("#cmtname")[0].value;
        if(!jobdetail){
            alert("请填写居委会名称");
            $("#cmtname").addClass("invalid");
            return;
        }
    }
    if($("[href=#signupCtz]").hasClass("active")){
        job = 4;
        jobdetail = $("#ctzname")[0].value;
        if(!jobdetail){
            alert("请填写居住地址");
            $("#ctzname").addClass("invalid");
            return;
        }
    }
    if($("[href=#signupWrk]").hasClass("active")){
        job = 5;
        jobdetail = $("#wrkname")[0].value;
        if(!jobdetail){
            alert("请填写施工单位名称");
            $("#wrkname").addClass("invalid");
            return;
        }
    }
    var tel = $("#telnum")[0].value;
    var birth = "none";
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
            "job":job,
            "jobdetail":jobdetail,
            "email":email,
            "tel":tel,
            "birth":birth,
            "avatar":avatar
        },
        success: function(result){
            console.log(result);
            if(result=="上传成功"){
                $("#username")[0].value = "";
                $("#mailaddr")[0].value = "";
                $("#password")[0].value = "";
                $("#password-re")[0].value = "";
                $("#telnum")[0].value = "";
                $("#govname")[0].value = "";
                showinfo("注册成功");
                setUser(username,email,avatar,job,jobdetail,tel);
            }
            else if(result == "用户名重复"){
                $("#username").addClass("invalid");
                showinfo("用户名重复");
            }
            else if(result == "邮箱重复"){
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
            jsonResult =  JSON.parse(result);
            if(jsonResult.login=="0"){
                showinfo(jsonResult.errortype);
            }
            else if(jsonResult.login=="1"){
                setUser(jsonResult.nickname,jsonResult.email,jsonResult.avatar,jsonResult.job,jsonResult.jobdetail,jsonResult.tel);
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
    sessionStorage.setItem('login',false);
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('avatar');
    sessionStorage.removeItem('job');
    sessionStorage.removeItem('jobdetail');
    sessionStorage.removeItem('tel');
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

    showinfo("已登出");
}