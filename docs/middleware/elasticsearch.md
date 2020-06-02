# ElasticSearch

> **注意：elasticSearch与kibana尽量保持版本一致，可减少不必要的麻烦**

## Docker安装ElasticSearch

```
docker run -d -p 9200:9200 -p 9300:9300 -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" --name=myes elasticsearch:6.4.0
```

```
# linux系统curl命令测试
curl -X GET 127.0.0.1:9200

# 浏览器测试：
http://192.168.113.128:9200/
```



## Docker安装kibana

```
docker run --name mykibana3 -d -p 5601:5601 --link myes -e "ELASTICSEARCH_URL=http://192.168.113.128:9200" kibana:6.4.0
```

```
# 浏览器测试
http://192.168.113.128:5601/
```



## FAQ

### 问题1：创建容器时[Warning] IPv4 forwarding is disabled. Networking will not work.

https://blog.csdn.net/zhydream77/article/details/81902457

### 问题2：启动elasticsearch容器，报错： max virtual memory areas vm.max_map_count [65530] is too low, increase to at leas

https://blog.csdn.net/gulijiang2008/article/details/90447298