var vm=new Vue({
  el:'#userInfo',
  data:{
    avatar:'',
    email:'',
    type:'',
    nickname:'',
    nickname_ori:'',
    nickname_mod:'',
    password:'',
    password_copy:'',
    password_ori:'',
    password_ver:'',
    tel:'',
    tel_ori:'',
    tel_mod:'',
    address:'',
    address_ori:'',
    address_mod:'',
    ifHover0:false,
    ifHover1:false,
    ifHover2:false,
    ifHover3:false,
    ifHover4:false,
    ifModified:false,
    oldpassword:false,
    newpassword:false,
  },
  methods:{
    saveInfo:function(){
      axios
            .get('http://localhost:8888/initProjectDetail.php', {params:{nickname:this.nickname,tel:this.tel,address:this.address}},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(function(response){
                showinfo('修改成功');
                vm.ifModified=false;
                vm.nickname=vm.nickname_mod===''?vm.nickname_ori:vm.nickname_mod;
                vm.nickname_mod='';
                vm.tel=vm.tel_mod===''?vm.tel_ori:vm.tel_mod;
                vm.tel_mod='';
                vm.address=vm.address_mod===''?vm.address_ori:vm.address_mod;
                vm.address_mod='';
                $('#nickname').attr('disabled','disabled');   
                $('#nicknamelabel').removeClass('active'); 
                $('#tel').attr('disabled','disabled');   
                $('#tellabel').removeClass('active'); 
                $('#address').attr('disabled','disabled');   
                $('#addresslabel').removeClass('active'); 
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    getType:function(){
      switch(this.type){
        case 1:
          return '设计师';
        case 2:
          return '政府机构';
        case 3:
          return '居委会';
        case 4:
          return '居民';
        case 5:
          return '施工方';
      }
    },
    editInfo:function(){
      this.ifModified=true;
      $('#nickname').removeAttr('disabled');
      $('#tel').removeAttr('disabled');
      $('#address').removeAttr('disabled');
      this.nickname='';
      this.tel='';
      this.address='';
    },
    resetPassword:function(){
      this.oldpassword=true;
    },
    shownewpassword:function(){
      // TODO 使用 sha1(this.password_ver)
      if((this.password_ver)===this.password_ori){
         this.oldpassword=false;
         this.newpassword=true;
      }
      else
        alert('密码不正确');
    },
    submit:function(){
      if(this.password!==this.password_copy){
        alert('输入密码不一致');
        return;
      }
      axios
            .post('http://localhost:8888/initUser.php', {new_password:sha1(this.password)},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(function(response){
                showinfo('修改密码成功!');
                $('.modal').modal('close');
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    uploadavatar:function(){
      var file=document.getElementById("fileImage").files;
        if(file[0]===undefined){
          alert("请选择新的头像");
          return;
        }
        let formdata=new FormData();
        formdata.append("avatar",file[0]);
        console.log(formdata.get('avatar'));

        axios
            .post('http://localhost:8888/uploadAvatar.php', formdata,{
            headers: {'Content-Type': 'multipart/form-data'} //加上这个
        })
            .then(function(response){  
              console.log(response.data);
              showinfo('上传成功');
              vm.avatar=$('#preview').attr('src');
              $('#avatar').css('height',$('#avatar').width());
              $('#uploadmodal').modal('close');
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    init:function(){
      axios
            .get('http://localhost:8888/initUser.php', {},{
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} //加上这个
            })
            .then(function(response){
                jsonData = response.data;
                console.log(jsonData);
                vm.avatar=jsonData['avatar'];
                vm.type=jsonData['type'];
                vm.nickname=jsonData['nickname'];
                vm.password_ori=jsonData['password'];
                vm.tel=jsonData['tel'];
                vm.address=jsonData['address'];
                vm.nickname_ori=vm.nickname;
                vm.tel_ori=vm.tel;
                vm.address_ori=vm.address;
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    }
  }
})

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