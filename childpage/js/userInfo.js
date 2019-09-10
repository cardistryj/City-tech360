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
            .post('/api/private/user/edit_person_info', {nickname:this.nickname_mod,tel:this.tel_mod,address:this.address_mod},{})
            .then(function(response){
              console.log(response.data);
              if(response.data.message==='success'){
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
              }
              else{
                alert('操作失败');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
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
      axios
            .post('/api/private/user/check_password', {password:sha1(this.password_ver)},{
            })
            .then(function(response){
              if(response.data.message==='success'){
                vm.oldpassword=false;
                vm.newpassword=true;
              }
              else{
                alert('密码不正确');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    submit:function(){
      if(this.password!==this.password_copy){
        alert('输入密码不一致');
        return;
      }
      axios
            .post('/api/private/user/edit_password', {password:sha1(this.password)},{})
            .then(function(response){
              if(response.data.message==='success'){
                showinfo('修改密码成功!');
              }
              else{
                alert('操作失败');
              }
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

        axios
            .post('/api/private/user/upload_avatar', formdata,{
            headers: {'Content-Type': 'multipart/form-data'} //加上这个
        })
            .then(function(response){  
              if(response.data.message==='success'){
                console.log(response.data);
                showinfo('上传成功');
                vm.avatar=$('#preview').attr('src');
                //$('#avatar').css('height',$('#avatar').width());
                $('#uploadmodal').modal('close');
              }
              else{
                alert('操作失败');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    init:function(){
      axios
            .get('/api/private/user/get_my_info', {},{})
            .then(function(response){
                jsonData = response.data.data;
                console.log(jsonData);
                vm.avatar=jsonData['avatar'];
                vm.type=decodeRole(jsonData['type']);
                vm.nickname=jsonData['nickname'];
                vm.tel=jsonData['tel'];
                vm.email=jsonData['email'];
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