# Docker

## Docker简介

Docker 是一个开源的应用容器引擎，基于Go语言，并遵从 Apache2.0 协议开源。

Docker 可以让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Linux或Windows 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口,更重要的是容器性能开销极低。

## 比较Docker与虚拟机

## docker镜像与容器



## 常见命令

```
service docker start
service docker stop

docker search redis  搜索镜像：
docker pull redis    拉取镜像
docker images  		 查看镜像
docker rmi [imageName]  删除镜像

docker ps  查看容器
	（docker ps -a 查看所有容器，包括未启动的容器）
docker rm [containerName]  删除容器
docker exec -it [containerName] /bin/bash   进入镜像

docker logs [containerName]   查看镜像的日志

//TODO
docker run -p 6379:6379 -d redis:latest redis-server  启动一个redis容器
	（-p  映射端口）
	（-v  挂载文件目录，即映射一个宿主机目录）
	（-d  后台运行）
	（--name 容器命名）
```


