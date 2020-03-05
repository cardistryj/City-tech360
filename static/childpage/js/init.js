function showinfo(info){
  $("#infotext")[0].innerHTML = info;
  $("#infoscreen").modal("open");
}

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


function closeAllModal(){
  $(".modal").modal("close");
}

function inittabs(){
  $('ul.tabs').tabs();
}

var navigation = {
  template:'#nav',
  props:[ // child 和 parent 指示 页面跳转 的 根路径，静态 传递 即可
    'child','parent','role','src','name'
  ],
  watch:{
    'this.$refs.avatar.offsetWidth': function(val){
      this.$refs.avatar.offsetHeight=val;
    },
    'this.$refs.avatarSide.offsetWidth':function(val){
      this.$refs.avatarSide.offsetHeight=val;
    }
  },
  computed:{
    roleName:function(){
      switch(this.role){
        case 1: return "设计师";
        case 2: return "政府机构";
        case 3: return "居委会";
        case 4: return "居民";
        case 5: return "施工方";
        default: return "";
      }
    }
  },
  methods:{
    logout:function(){
      this.$emit('signout');
    }
  }
}

var login = {
  template:'#loginModal',
  data:function(){
    return {
      email:'',
      password:'',
      refresh:true
    }
  },
  methods:{
    signin:function(){
      var sha1password = sha1(this.password.toString());
      axios
      .post('/api/public/user/login',{
        email:this.email,
        password:sha1password
      })
      .then(response=>{
            $("#loginscreen").modal("close");
            this.refresh=false;
            if(response.data.message!=="success"){
                showinfo(response.data.message);
            }
            else{
                this.$emit('set',response.data.data)
                showinfo("登录成功");
                setTimeout(()=>{
                  window.location.reload();
                },1000)
            }
            this.$nextTick(()=>{
              this.refresh = true;
              this.email = '';
              this.password = '';
            })
      })
    }
  }
}

var signup = {
  template:'#signupModal',
  data:function(){
    return {
      name:'',
      email:'',
      password:'',
      passwordre:'',
      tel:'',
      invalidth:0,
      job:0,
      refresh:true
    }
  },
  methods:{
    signup:function(){
      if(!this.check())
        return;
      var sha1password = sha1(this.password);
      axios
      .post('/api/public/user/signup',{
        "nickname":this.name,
        "password":sha1password,
        "type":this.job,
        "email":this.email,
        "tel":this.tel,
    })
      .then(response=>{
        jsonResult=response.data;
        if(jsonResult.message==="success"){
          this.refresh=false;
          this.$nextTick(()=>{
            this.refresh=true;
            this.name=this.email=this.password=this.passwordre=this.tel='';
            this.invalidth=this.job=0;
            inittabs();
          })
          showinfo("注册成功");
        }
        else if(jsonResult.message === "Email already exists"){
            this.invalidth=2;
            alert("邮箱重复");
        }  
        })
      .catch(function(error){
        console.log(error);
      })
    },
    check:function(){
      if(!this.name){
        this.invalidth=1;
        alert('请填写用户名');
        return false;
      }
      else if(!this.email){
        this.invalidth=2;
        alert('请填写邮箱');
        return false;
      }
      else if(!this.password){
        this.invalidth=3;
        alert('请填写密码');
        return false;
      }
      else if(!this.passwordre){
        this.invalidth=4;
        alert('请确认密码');
        return false;
      }
      else if(this.passwordre!==this.password){
        this.invalidth=5;
        alert('两次密码不一致');
        return false;
      }
      else if($(this.$refs.mail).hasClass('invalid')){
        this.invalidth=2;
        alert('邮箱地址不合法');
        return false;
      }
      else if(this.job==0){
        alert('请选择您的身份');
        return false;
      }
      this.invalidth=0;
      return true;
    }
  },
}

var vm_user =new Vue({
  el:'#user',
  components:{
    navigation,
    login,
    signup
  },
  data:{
    role:'',
    src:'',
    name:''
  },
  methods:{
    check_login_status:function(callback, elsecall){
      axios
      .get('/api/public/user/check_login_status')
      .then(response=>{
        var jsonResult = response.data;
        if(jsonResult.message==="Already login"){
          callback(jsonResult.data);
        }
        else{
          if(elsecall)
          elsecall();
        }
      })
      .catch(function(error){
        console.log(error);
      });
    },
    setUser:function(userInfo){
        this.role=userInfo.type;
        this.src=userInfo.avatar;
        this.name=userInfo.nickname;
    },
    signout:function(){
      axios
      .get('/api/private/user/logout')
      .then(response=>{
        this.role='';
        this.src='';
        this.name='';
        showinfo("已登出");
        setTimeout(()=>{
          window.location.reload();
        },1000)
      })
      .catch(error=>{
        console.log(error);
      })
    }
  },
  mounted:function(){
    this.check_login_status(this.setUser);
  }
})