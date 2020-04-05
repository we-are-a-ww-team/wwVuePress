# docker 安装redis

cd /wangwei/app/redis-5.0.4/

## 启动redis
src/redis-server redis6380.conf

## 启动哨兵
src/redis-server sentinel.conf --sentinel

## 连接服务器
src/redis-cli -p 6380 -h 172.18.74.148 -a wangwei2048

