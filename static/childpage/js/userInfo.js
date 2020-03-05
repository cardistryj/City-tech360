var vm=new Vue({
  el:'#userInfo',
  data:{
    avatar:'',
    email:'',
    type:'',
    nickname:'',
    nickname_mod:'',
    password:'',
    password_copy:'',
    password_ver:'',
    tel:'',
    tel_mod:'',
    address:'',
    address_mod:'',
    ifHover:0,
    ifModified:false,
    passwordStep:1,
  },
  watch:{
    'this.$refs.avatar.offsetWidth': function(val){
      this.$refs.avatar.offsetHeight=val;
    },
  },
  methods:{
    saveInfo:function(){
      axios
            .post('/api/private/user/edit_person_info', {nickname:(this.nickname_mod===''?this.nickname:this.nickname_mod)
                ,tel:(this.tel_mod===''?this.tel:this.tel_mod),address:(this.address_mod===''?this.address:this.address_mod)},{})
            .then(function(response){
              console.log(response.data);
              if(response.data.message==='success'){
                showinfo('修改成功');
                setTimeout(()=>{
                  window.location.reload();
                },1000)
              }
              else{
                alert('操作失败');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    shownewpassword:function(){
      axios
            .post('/api/private/user/check_password', {password:sha1(this.password_ver)},{
            })
            .then(response=>{
              if(response.data.message==='success'){
                this.passwordStep=2;
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
                setTimeout(()=>{
                  window.location.reload();
                },1000)
              }
              else{
                showinfo('操作失败');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
    uploadavatar:function(){
      var file=this.$refs.file.files;
        if(file[0]===undefined){
          alert("请选择新的头像");
          return;
        }
        let formdata=new FormData();
        formdata.append("avatar",file[0]);

        axios
            .post('/api/private/user/upload_avatar', formdata,{
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response=>{  
              if(response.data.message==='success'){
                showinfo('上传成功');
                setTimeout(()=>{
                  window.location.reload();
                },1000)
              }
              else{
                showinfo('操作失败');
              }
            })
            .catch(function (error) { // 请求失败处理
            console.log(error);
            });
    },
  },
  created:function(){
    axios
    .get('/api/private/user/get_my_info', {},{})
    .then(response=>{
        jsonData = response.data.data;
        this.avatar=jsonData.avatar;
        this.type=decodeRole(jsonData.type);
        this.nickname=jsonData.nickname;
        this.tel=jsonData.tel;
        this.email=jsonData.email;
        this.address=jsonData.address;
    })
    .catch(function (error) { // 请求失败处理
      console.log(error);
    });
  },
  mounted:function(){
    initFile();
  }
})

function initFile(){
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
    })
}