# Jquery

## 前后端参数传递

前端：

```javascript

var formData = new FormData();
formData.append("userId","123456");  //FormData作为参数，则不能再传json参数
$.ajax({
    type : "post",
    url : "/getUserList/10/1",
    data : formData,
    processData : false,
    contentType : false,
    success : function(data){
        if (data=="error") {
            alert("提交失败!");
        }else{
            console.info(data);
        }}
});

var formData = "{\"userName\":\"laowang\"}";  //Json串参数
$.ajax({
    type : "post",
    url : "/getUserList/10/1?userId=123456",
    data : formData,
    processData : false,
    contentType : false,
    success : function(data){
        if (data=="error") {
            alert("提交失败!");
        }else{
            console.info(data);
        }}
});
        
```

后端：


```java
/**
*	后台接收参数的3种方式：json参数，url变量，url参数，
*/
@GetMapping("/getUserList/{pageSize}/{pageIndex}") 
public Page<UserVO> getUserList(
     @RequestBody(required = false) UserVO queryVO,   //json参数
     @PathVariable(value = "pageSize",required = false) Integer pageSize, //url变量
     @PathVariable(value = "pageIndex",required = false) Integer pageIndex,
     @RequestParam(value = "userId",required = false) String userId){  //url参数
                                                       }
```

