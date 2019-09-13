const uploadURL = "php/upload.php";
const deleteURL = "/php/delete.php";
const signupURL = "/php/signup.php";

function ajaxtest()
{
    if (!vm.factors.address||!vm.factors.tel||!vm.factors.demand||!vm.factors.name)
    {
        alert("请填写必要信息");
        vm.ifinvalid=true;
        return;
    } 

    if(uploadcoords != undefined)
    {
        $.ajax({
            url: uploadURL,        
            type: "post",
            dataType:"text",
            async: false,
            data: {"name":vm.factors.name, "author": vm.factors.author, "street": vm.factors.street,"tel" : vm.factors.tel, "budget": vm.factors.budget, "demand": vm.factors.demand, "address": vm.factors.address, "lng":uploadcoords.lng, "lat":uploadcoords.lat},
            success: function(result){
                // alert(result);
                vm.factors.name = "";
                vm.factors.author = "";
                vm.factors.street = "";
                vm.factors.tel = "";
                vm.factors.budget = "";
                vm.factors.demand = "";
                vm.factors.address = "";
                $("#infotext")[0].innerHTML = "上传成功";
                $("#infoscreen").modal("open");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown){
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        });
    }
    else
    {
        $.ajax({
            url: uploadURL,        
            type: "post",
            dataType:"text",
            async: false,
            data: {"name":vm.factors.name, "author": vm.factors.author, "street": vm.factors.street,"tel" : vm.factors.tel, "budget": vm.factors.budget, "demand": vm.factors.demand, "address": vm.factors.address, "lng":"0", "lat":"0"},
            success: function(result){
                // alert("上传成功");
                vm.factors.name = "";
                vm.factors.author = "";
                vm.factors.street = "";
                vm.factors.tel = "";
                vm.factors.budget = "";
                vm.factors.demand = "";
                vm.factors.address = "";
                $("#infotext")[0].innerHTML = "上传成功";
                $("#infoscreen").modal("open");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown){
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        });
    }
    for (var item in $("#file")[0].files){
        if($("#file")[0].files[item] != undefined){
            var fileform = new FormData($('#uploadForm'));
            fileform.append('name',vm.factors.name);
            //fileform.append('files',$("#file")[0].files[item]);
            fileform.append('file',$("#file")[0].files[item]);
            $.ajax({
                url: 'php/fileupload.php',
                type: 'POST',
                cache: false,
                data: fileform,
                processData: false,
                contentType: false
            }).done(function(res) {}).fail(function(res) {});
        }
        else{
            console.log("nofile");
        }
    }

}

// function deleteAjax(id){
//     var passwd = $("#passwd")[0].value;
//     $("#passwd")[0].value = "";
//     $.ajax({
//         url: deleteURL,        
//         type: "post",
//         dataType:"text",
//         async: false,
//         data: {"id":id,"passwd":passwd},
//         success: function(result){
//             alert(result);
//         },
//         error: function (XMLHttpRequest, textStatus, errorThrown){
//             alert(XMLHttpRequest.status);
//             alert(XMLHttpRequest.readyState);
//             alert(textStatus);
//         }
//     });

// }

// function signup(type){
//     var username = $("#username")[0].value;
//     var email = $("#email")[0].value;
//     var passwd = $("#password")[0].value;
//     var passwd_re = $("#password-re")[0].value;
//     if(type == "designer"){
//         var job = $("#job")[0].innerHTML;
//         if(passwd_re == passwd){
//             $.ajax({
//                 url: signupURL,        
//                 type: "post",
//                 dataType:"text",
//                 async: false,
//                 data: {
//                     "username" : username,
//                     "email" : email,
//                     "passwd" : passwd,
//                     "type" : type,
//                     "job" : job
//                         },
//                 success: function(result){
//                     alert(result);
//                     var data = loadData();
//                     $("#cardholder")[0].innerHTML = "";
//                     for (item in data) {
//                         var div = newcard(data[item].name,data[item].author,data[item].street,data[item].tel,data[item].budget,data[item].demand,data[item].time,data[item].address,data[item].lng,data[item].lat,data[item].id);
//                         $("#cardholder")[0].appendChild(div);
//                     }
//                 },
//                 error: function (XMLHttpRequest, textStatus, errorThrown){
//                     alert(XMLHttpRequest.status);
//                     alert(XMLHttpRequest.readyState);
//                     alert(textStatus);
//                 }
//             });
//         }
//         else
//             alert("两次输入的密码不一致");
//     }
// }