function showinfo(info){
    $("#infotext")[0].innerHTML = info;
    $("#infoscreen").modal("open");
}

function setUser(username,email,avatar,job,jobdetail,tel){
    sessionStorage.setItem('login',true);
    sessionStorage.setItem('username',username);
    sessionStorage.setItem('email',email);
    sessionStorage.setItem('avatar',avatar);
    sessionStorage.setItem('job',job);
    sessionStorage.setItem('jobdetail',jobdetail);
    sessionStorage.setItem('tel',tel);

    $("#btnSignup").hide();
    $("#btnSignin").hide();
    $("#btnSignupSide").hide();
    $("#btnSigninSide").hide();
    if(avatar == "default"){
        $("#imgAvatar")[0].src = "default.jpg";
        $("#imgAvatarSide")[0].src = "default.jpg";
    }
    else{
        $("#imgAvatar")[0].src = avatar;
        $("#imgAvatarSide")[0].src = avatar;
    } 
    $("#liAvatar").show();
    $("#pUsername")[0].innerHTML = username;
    $("#pUsername").show();
    $("#btnMyproject").show();
    $("#btnMydesign").show();

    // $("#logo-container")[0].style.display = "none";
    $("#liAvatarSide").show();
    $("#infoSide").show();
    $("#signoutSide").show();
    $("#pUsernameSide")[0].innerHTML = username;
    $("#pUsernameSide").show();
    $("#btnMyprojectSide").show();
    $("#btnMydesignSide").show();
    
}

function setUserFromSesssion(){
    var avatar = sessionStorage.getItem('avatar');
    if(isLogin()){
        $("#btnSignup").hide();
        $("#btnSignin").hide();
        $("#btnSignupSide").hide();
        $("#btnSigninSide").hide();
        if(avatar == "default"){
            $("#imgAvatar")[0].src = "default.jpg";
            $("#imgAvatarSide")[0].src = "default.jpg";
        }
        else{
            $("#imgAvatar")[0].src = avatar;
            $("#imgAvatarSide")[0].src = avatar;
        } 
        $("#liAvatar").show();
        $("#pUsername")[0].innerHTML = sessionStorage.getItem('username');
        $("#pUsername").show();
        $("#btnMyproject").show();
        $("#btnMydesign").show();

        //$("#logo-container")[0].style.display = "none";
        $("#liAvatarSide").show();
        $("#infoSide").show();
        $("#signoutSide").show();
        $("#pUsernameSide")[0].innerHTML = sessionStorage.getItem('username');
        $("#pUsernameSide").show();
        $("#btnMyprojectSide").show();
        $("#btnMydesignSide").show();
    }
}

function isLogin(){
    if(sessionStorage.getItem('login') == "true")
        return 1
    else{
        return 0;
    }
}

