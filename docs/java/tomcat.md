# Tomcat

## Tomcat配置文件

## Tomcat性能调优

## 手写简易版框架

[手写简易版Tomcat](/java/handwriter_tomcat.html)

## Tomcat源码项目构建

参考1：https://www.cnblogs.com/zhiyouwu/p/11654442.html

参考2：https://blog.csdn.net/u013857458/article/details/81866366





## Http长连接

关键类：

```
# tomcat保持长连接的伪代码如下：
boolean keepalive = true
while(keepalive){
	socket取数据
	解析请求行
	解析请求头
	
	connection = get("Connection")
	if(connection == "Close"){
		keepalive = false;
	}else{
		keepalive = true;
	}
	
	servlet处理业务逻辑
	响应
}
socket.close
```













