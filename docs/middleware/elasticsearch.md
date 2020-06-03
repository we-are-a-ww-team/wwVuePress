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

## 安装成功测试

```
http://192.168.113.128:9200/
```

查询结果：

```
{
  "name": "8Y6Xk3t",
  "cluster_name": "docker-cluster",
  "cluster_uuid": "SYeuLps0TQ6TNWqeGn1oog",
  "version": {
    "number": "6.4.0",   # 版本号
    "build_flavor": "default",
    "build_type": "tar",
    "build_hash": "595516e",
    "build_date": "2018-08-17T23:18:47.308994Z",
    "build_snapshot": false,
    "lucene_version": "7.4.0",
    "minimum_wire_compatibility_version": "5.6.0",
    "minimum_index_compatibility_version": "5.0.0"
  },
  "tagline": "You Know, for Search"
}
```



## Postman基本操作

基本操作参考：http://www.ruanyifeng.com/blog/2017/08/elasticsearch.html

### 查看所有索引

```
http://192.168.113.128:9200/_cat/indices?v
```

查询结果：

```
health status index    uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .kibana  pviTLLzeSF25eAt5ln62XQ   1   0          1            0        4kb            4kb
yellow open   weather2 0U_DrUAZTnaHqj3qcmi16w   5   1          0            0      1.2kb          1.2kb
yellow open   weather  yrAkKoz5T_eqewE7IsVRHQ   5   1          0            0      1.2kb          1.2kb
yellow open   accounts BZu5GbEMRYehoA3BCoW3cg   5   1          3            0     14.9kb         14.9kb
yellow open   customer mqavwNUbQ6WE9LRGSNQ6dg   5   1          1            0      7.6kb          7.6kb
```

### 查看索引下的映射关系

```
http://192.168.113.128:9200/accounts/_mapping?pretty
```

返回结果：

```
{
  "accounts": {   # index
    "mappings": {
      "person": {     # type
        "properties": {
          "desc": {     # field1
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "title": {     # field2
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "user": {     # field3
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    }
  }
}
```



### 查看索引下所有的记录

```
http://192.168.113.128:9200/accounts/person/_search
```

查询结果：

```
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 4,
    "max_score": 1.0,
    "hits": [
      {
        "_index": "accounts",
        "_type": "person",
        "_id": "OLoHeHIBHqYqLAHVq9Fl",
        "_score": 1.0,
        "_source": {
          "user": "王五-2",
          "title": "程序员",
          "desc": "管理员"
        }
      },
      {
        "_index": "accounts",
        "_type": "person",
        "_id": "2",
        "_score": 1.0,
        "_source": {
          "user": "李四",
          "title": "程序员",
          "desc": "开发管理远      积分来看看积分"
        }
      },
      {
        "_index": "accounts",
        "_type": "person",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "user": "张三",
          "title": "工程师",
          "desc": "数据库管理"
        }
      },
      {
        "_index": "accounts",
        "_type": "person",
        "_id": "Nrr8d3IBHqYqLAHV6tGZ",
        "_score": 1.0,
        "_source": {
          "user": "王五",
          "title": "程序员",
          "desc": "管理员"
        }
      }
    ]
  }
}
```

### 新增一个用户

```
# 新增用户指定ID
# POST http://192.168.113.128:9200/accounts/person/1

###########################################################

# 新增用户不指定ID
POST http://192.168.113.128:9200/accounts/person

{
  "user": "王五",
  "title": "程序员",
  "desc": "管理员"
}

返回结果：
{
    "_index": "accounts",
    "_type": "person",
    "_id": "OboSeHIBHqYqLAHVMdGv",   # 未指定id时，生成随机数
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 1,
    "_primary_term": 1
}
```

### 删除一个用户

```
DELETE http://192.168.113.128:9200/accounts/person/2
```

### 修改一个用户

```
# 注意:1修改用PUT方式；2修改必须传ID
PUT http://192.168.113.128:9200/accounts/person/OboSeHIBHqYqLAHVMdGv

{
  "user": "赵六",
  "title": "程序员---",
  "desc": "管理员-----"
}

返回结果：
{
    "_index": "accounts",
    "_type": "person",
    "_id": "OboSeHIBHqYqLAHVMdGv",
    "_version": 2,     # 修改成功后，版本号+1
    "result": "updated",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 2,
    "_primary_term": 1
}

```



### 查询一个用户

```
# 查询某个用户
GET http://192.168.113.128:9200/accounts/person/2?pretty=true

返回结果：
{
  "_index": "accounts",
  "_type": "person",
  "_id": "2",
  "_version": 2,
  "found": true,
  "_source": {
    "user": "李四",
    "title": "程序员",
    "desc": "开发管理远      积分来看看积分"
  }
}
```

## Kibana操作

```
# 查询user包含“王五”的记录

GET _search
{
  "query": {
    "match": {"user": "王五"}
  }
}
```

返回结果：

```
{
  "took": 6,
  "timed_out": false,
  "_shards": {
    "total": 21,
    "successful": 21,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 2,
    "max_score": 1.3862944,
    "hits": [
      {
        "_index": "accounts",
        "_type": "person",
        "_id": "Nrr8d3IBHqYqLAHV6tGZ",
        "_score": 1.3862944,
        "_source": {
          "user": "王五",
          "title": "程序员",
          "desc": "管理员"
        }
      },
      {
        "_index": "accounts",
        "_type": "person",
        "_id": "OLoHeHIBHqYqLAHVq9Fl",
        "_score": 0.5753642,
        "_source": {
          "user": "王五-2",
          "title": "程序员",
          "desc": "管理员"
        }
      }
    ]
  }
}
```

## FAQ

### 问题1：创建容器时[Warning] IPv4 forwarding is disabled. Networking will not work.

https://blog.csdn.net/zhydream77/article/details/81902457

### 问题2：启动elasticsearch容器，报错： max virtual memory areas vm.max_map_count [65530] is too low, increase to at leas

https://blog.csdn.net/gulijiang2008/article/details/90447298