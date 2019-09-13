function showinfo(info){
    $("#infotext")[0].innerHTML = info;
    $("#infoscreen").modal("open");
}

function setUser(username,email,avatar,job,tel){
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
    $('#imgAvatar').css('height',$('#imgAvatar').width());
    $('#imgAvatarSide').css('height',$('#imgAvatarSide').width());
    $("#liAvatar").show();
    $("#pUsername")[0].innerHTML = username;
    $("#pUsername").show();
    $("#btnMyproject").show();
    $("#btnMyprojectSide").show();
    var role="";
    if(job===1){
        role="设计师";
        $('#uploaddesign').show();
    }
    else{
        if(job===2)
        role="政府机构";
        else if(job===3)
        role="居委会";
        else if(job===4)
        role="居民";
        else if(job===5)
        role="施工方";
    }
    $('#role')[0].innerHTML="角色："+role;
    $('#roleSide')[0].innerHTML="角色："+role;
    
    // $("#logo-container")[0].style.display = "none";
    $("#liAvatarSide").show();
    $("#infoSide").show();
    $("#signoutSide").show();
    $("#pUsernameSide")[0].innerHTML = username;
    $("#pUsernameSide").show();
}
