# nginx

> ***Nginx*** 是一个高性能的[HTTP](https://baike.baidu.com/item/HTTP)和[反向代理](https://baike.baidu.com/item/反向代理/7793488)web服务器，以及电子邮件（IMAP/POP3）代理服务器。
>
> 能够支持高达**50,000** 个并发连接数的响应

## nginx安装

linux系统安装nginx参考网站：https://www.cnblogs.com/xxoome/p/5866475.html

先安装：**gcc、pcre-devel、zlib-devel、openssl-devel**

```
yum -y install gcc pcre-devel zlib-devel openssl openssl-devel
```

**安装:**

```
## 解压
tar -zxvf nginx-1.9.9.tar.gz

##进入nginx目录
cd nginx-1.9.9
## 配置
./configure --prefix=/usr/local/nginx

# make
make
make install
```

**验证:**

```
curl -XGET localhost:80
```



## nginx启动关闭

```
#启动nginx
./nginx/sbin/nginx

#关闭nginx
./nginx/sbin/nginx -s stop

#重新加载
./nginx/sbin/nginx -s reload
```



## nginx配置文件



## 正向代理与反向代理

参考：https://www.cnblogs.com/taostaryu/p/10547132.html

![img](./nginx.assets/1350514-20190313105354768-2077480083.png)

## nginx集群实现

使用keepalived实现nginx的高可用

参考： https://www.cnblogs.com/youzhibing/p/7327342.html#!comments

## 配置解读

```
#user  administrator; # 配置用户
worker_processes  2; #允许生成的进程数，默认为1

error_log  /var/log/nginx/error.log warn;  #日志路径以及级别【debug|info|notice|warn|error|crit|alert|emerg】

events {
    worker_connections  1024;    #最大连接数，默认为512
}

http {
    include       /etc/nginx/mime.types;     #文件扩展名与文件类型映射表
    default_type  application/octet-stream;  #默认文件类型，默认为text/plain

    log_format  myFormat  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';   #自定义格式myFormat

    access_log  /var/log/nginx/access.log  myFormat;    # 服务日志 以myFormat定义的格式
    
    keepalive_timeout   65;  #连接超时时间，默认为75s，可以在http，server，location块。
    types_hash_max_size 2048;
    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;

 	server {
        listen       80;
        server_name  localhost;

        location / {
            root 	/usr/local/nginx/html;  #根目录
            index 	index.html;  #设置默认页
            #deny 127.0.0.1;  #拒绝的ip
            #allow 172.18.5.54; #允许的ip  
        }
	}
    
}
```

### location的匹配规则

```
规则1：请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。

规则2：首先精确匹配【=】  其次以xx开头匹配【^~】 然后是按文件中顺序的正则匹配  最后是交给 【/】 通用匹配。

规则3：
# 精准匹配：
location = / {
    proxy_pass http://tomcat:8080/index
}

# 以xx开头
location ^~ /static/ {                              
    root /webroot/static/;
}

# 以xx结尾
location ~* \.(gif|jpg|jpeg|png|css|js|ico)$ {     
    root /webroot/res/;
}


```





### $remote_addr变量

> RemoteAddress  ?
>
> X-Real-IP ?
>
> X-Forwarded-For ?
>
> - $remote_addr
> 若有多层代理，则获取到上一级代理的IP
> - $proxy_add_x_forwarded_for
> 获取到结果例如：(223.104.6.125, 10.10.10.45)，第一个是用户的真实IP，第二个是一级代理的IP，依此类推。

```
http{
	server{
        location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;

            proxy_pass http://127.0.0.1:9009/;
            proxy_redirect off;
        }
    }
}
```

### $host变量

例：http://localhost:88/test1/test2/test.php

```html
$host：localhost
$server_port：88
$request_uri：http://localhost:88/test1/test2/test.php
```

```
server {  
    listen       80;                                                         
    server_name  localhost;                                               
    client_max_body_size 1024M;

    location / {
        proxy_pass http://tomcat:8080;   
        proxy_set_header Host $host:$server_port;    
    }
}
```





### 错误页面准发

```
http{
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```

### 引入其他配置文件

```
http {
	include /etc/nginx/conf.d/*.conf;     # 将其他目录下的配置文件引入进来
}
```





### **跨域问题解决**

```
#设置需要跨域的指定文件
location ^~ /res/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET,POST';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
    alias /data/web/res/;
} 
```

## 反向代理+负载均衡

```
http{
	
	# nginx默认为：轮询
	# 权重：如：A weight=1; B weight=2;  则访问为:ABBABBABB
	# ip_hash; 让相同的ip访问相同的服务器
	upstream mysvr {   
      server 127.0.0.1:7878 ;
      server 192.168.10.121:3333 backup;  #热备：当其中一台服务器出现故障，才启用
    }
    
    server {
        listen       8080;   #监听端口
        server_name  www.mydomain.com;   #监听域名  
        
        location  / {       
           proxy_pass  	http://mysvr;  #请求转向mysvr 定义的服务器列表    
        } 
    }
}
```

### 动静分离

![1587395269885](./nginx.assets/1587395269885.png)





## 配置多个域名

```
http {
    
    server {
        listen       80;
		server_name  test1.hbusy.com;  

        location / {
            root   html;
            index  index_test1.html index_test1.htm;
        }
    }
     
    upstream visitip{
        server 192.168.0.11:3107;
    }  
     
    server {
        listen       80;
        server_name  test2.hbusy.com www.test2.hbusy.com;

        location / {
            proxy_pass   http://visitip;
            proxy_set_header Host $host:$server_port;  # 客户端的域名，以及端口
            proxy_set_header X-Real-IP $remote_addr;   # 
            proxy_set_header REMOTE-HOST $remote_addr;
            
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            client_max_body_size    2000m;

            proxy_connect_timeout 3600;
            proxy_send_timeout 3600;
            proxy_read_timeout 3600;
        }
    }
}

```