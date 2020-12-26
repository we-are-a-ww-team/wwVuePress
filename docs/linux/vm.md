# Virtual Machine

## 虚拟机部署docker步骤：

第一步：查看IP，先安装ifconfig，宿主机ping一下虚拟机的ip（ens33），

第二步：用ssh客户端访问虚拟机

第三步：宿主机访问虚拟机的web服务，先安装nginx，用curl验证。后安装防火墙，关闭防火墙，用宿主机浏览器访问

第四步：安装docker，更改docker的镜像国内hub地址，拉取镜像，并安装镜像



## 一、查看虚拟机ip

### 1.1 无法ping通www.baidu.com，需要设置IP

https://blog.csdn.net/qq_41606300/article/details/108750302

### 1.2 yum执行报错1

> 新创建的虚拟机，执行yum install docker报错：Loaded plugins: fastestmirror

参考：https://blog.csdn.net/qq_35023116/article/details/89603442



### 1.3 yum执行报错2

> 执行yum install docker报错：could not retrieve mirrorlist http://mirrorlist.centos.org ***”

参考：https://blog.csdn.net/jackiesimpson/article/details/80200578



### 1.4 用yum安装ifconfig

参考：https://www.cnblogs.com/dxqNet/p/11479395.html



### 1.5 宿主机连接虚拟机

解决办法：防火墙开放80端口

firewall-cmd --state  查看firewall是否运行

firewall-cmd --list-port  查看已开放的端口

firewall-cmd --permanent --add-port=80/tcp   添加端口

firewall-cmd --reload  重启防火墙



## 二、宿主机访问虚拟机Web服务

### 2.1 yum安装nginx

先需要yum安装**gcc、pcre-devel、zlib-devel、openssl-devel**等等

参考：https://www.cnblogs.com/xxoome/p/5866475.html



### 2.2 yum安装jdk

参考：https://blog.csdn.net/qq_42815754/article/details/82968464



## 2.3 运行jar命令

nohup java -jar proj_springboot.jar > log.out &

https://blog.csdn.net/Java_Mike/article/details/80383126



------



## 三、docker的FAQ

### 3.1：无法拉取镜像，需要更改docker hub为国内镜像

解决办法：https://blog.csdn.net/qq_39270265/article/details/87910334



### 3.2：重启docker，才生效

service docker stop     

service docker start



### 3.3：elasticsearch的docker容器启动后，随机被销毁

解决办法：elasticsearch的容器默认为2G，需要设置虚拟机的内存大小：-e "ES_JAVA_OPTS=-Xms512m -Xmx512m"



### 3.4Docker安装 elasticsearch 报错max virtual memory areas vm.max_map_count [65530] is too low

解决办法：增加虚拟内存：https://blog.csdn.net/xingfei_work/article/details/81463978





### 3.5: 安装kafka,以及zookeeper

https://www.cnblogs.com/yaohuiqin/p/12530245.html

**注意：zookeeper必须先启动**



3.5查看zookeeper与kafka的网络

docker inspect kafkanet