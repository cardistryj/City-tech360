# city360-backend

## API文档

* 公共接口以/api/public/开头
* 私有接口（用户登录后才可操作）以/api/private/开头
* body参数类型为application/json

### User API

### 登录

* public

* method: post
* url: user/login
* body参数
  * email
  * password 

### 注册

* public

* method: post
* url: user/siginup
* body参数
  * nickname
  * password
  * email
  * type
  * tel

### 编辑个人信息

* private
* method: post
* url: user/edit_person_info
* body
  * nickname
  * password
  * birth
  * tel

### 查看个人信息

* public
* method: get
* url: user/personal_info/:user_id



