# ElasticSearch

> **注意：elasticSearch与kibana尽量保持版本一致，可减少不必要的麻烦**

## 安装

### Docker安装ElasticSearch

```
docker run -d -p 9200:9200 -p 9300:9300 -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" --name=myes elasticsearch:6.4.0
```

```
# linux系统curl命令测试
curl -X GET 127.0.0.1:9200

# 浏览器测试：
http://192.168.113.128:9200/
```



### Docker安装kibana

```
docker run --name mykibana3 -d -p 5601:5601 --link myes -e "ELASTICSEARCH_URL=http://192.168.113.128:9200" kibana:6.4.0
```

```
# 浏览器测试
http://192.168.113.128:5601/
```

### 安装成功测试

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

### Docker安装客户端Head安装

参考：https://www.cnblogs.com/afeige/p/10771140.html

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

### match 匹配查询

```
# 匹配某个字段
GET _search
{
  "query": {
    "match": {"name":"大家"}
  }
}

# 匹配索引下的某个字段  match
GET testdoct/testbean/_search
{
  "query": {
    "match": {"name":"大家"}
  }
}
```

### 所有数据查询
```
# 查询所有，默认10条记录
GET testdoct/testbean/_search
{
  "query":{
    "match_all": {}
  }
}

# 只返回name字段,且只返回5条数据
GET testdoct/testbean/_search
{
  "size": 5, 
  "_source":["name"],
  "query":{
    "match_all": {}
  }
}
```
### 精准匹配
```
# standard分词器，把中文分割为一个一个字，查词组会查询不到结果
GET testdoct/testbean/_search
{
  "query":{
    "term":{"name":"谛"}
  }
}
```

### 查询 query_string
```
# query_string
GET testdoct/testbean/_search
{"query":{
    "query_string": {
      "default_field": "name",  //默认字段
      "query": "轩谛"
    }
  }
}
```



## 中文分词器：

安装参考：https://blog.csdn.net/u012211603/article/details/90757253

### standard分词器

```
# 标准分词器
POST testdoct/_analyze
{
  "analyzer": "standard", 
  "text":"我们都是Java程序员"
}


返回结果：
{
  "tokens": [
    {
      "token": "我",
      "start_offset": 0,
      "end_offset": 1,
      "type": "<IDEOGRAPHIC>",
      "position": 0
    },
    {
      "token": "们",
      "start_offset": 1,
      "end_offset": 2,
      "type": "<IDEOGRAPHIC>",
      "position": 1
    },
    {
      "token": "都",
      "start_offset": 2,
      "end_offset": 3,
      "type": "<IDEOGRAPHIC>",
      "position": 2
    },
    {
      "token": "是",
      "start_offset": 3,
      "end_offset": 4,
      "type": "<IDEOGRAPHIC>",
      "position": 3
    },
    {
      "token": "java",
      "start_offset": 4,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "程",
      "start_offset": 8,
      "end_offset": 9,
      "type": "<IDEOGRAPHIC>",
      "position": 5
    },
    {
      "token": "序",
      "start_offset": 9,
      "end_offset": 10,
      "type": "<IDEOGRAPHIC>",
      "position": 6
    },
    {
      "token": "员",
      "start_offset": 10,
      "end_offset": 11,
      "type": "<IDEOGRAPHIC>",
      "position": 7
    }
  ]
}


```

### ik_smart分词器：

```
# ik分词器
POST testdoct/_analyze
{
  "analyzer": "ik_smart", 
  "text":"我们都是Java程序员"
}

返回结果：
{
  "tokens": [
    {
      "token": "我们",
      "start_offset": 0,
      "end_offset": 2,
      "type": "CN_WORD",
      "position": 0
    },
    {
      "token": "都是",
      "start_offset": 2,
      "end_offset": 4,
      "type": "CN_WORD",
      "position": 1
    },
    {
      "token": "java",
      "start_offset": 4,
      "end_offset": 8,
      "type": "ENGLISH",
      "position": 2
    },
    {
      "token": "程序员",
      "start_offset": 8,
      "end_offset": 11,
      "type": "CN_WORD",
      "position": 3
    }
  ]
}
```

### ik_max_word分词器：

```
# ik分词器
POST testdoct/_analyze
{
  "analyzer": "ik_max_word", 
  "text":"我们都是Java程序员"
}

{
  "tokens": [
    {
      "token": "我们",
      "start_offset": 0,
      "end_offset": 2,
      "type": "CN_WORD",
      "position": 0
    },
    {
      "token": "都是",
      "start_offset": 2,
      "end_offset": 4,
      "type": "CN_WORD",
      "position": 1
    },
    {
      "token": "java",
      "start_offset": 4,
      "end_offset": 8,
      "type": "ENGLISH",
      "position": 2
    },
    {
      "token": "程序员",
      "start_offset": 8,
      "end_offset": 11,
      "type": "CN_WORD",
      "position": 3
    },
    {
      "token": "程序",
      "start_offset": 8,
      "end_offset": 10,
      "type": "CN_WORD",
      "position": 4
    },
    {
      "token": "员",
      "start_offset": 10,
      "end_offset": 11,
      "type": "CN_CHAR",
      "position": 5
    }
  ]
}
```



## Java代码实现

### TransportClient连接

pom.xml

```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>transport</artifactId>
    <version>6.2.4</version>
</dependency>
```

> 查询记录

```java
public static void main( String[] args )
    {
        //指定集群
        Settings settings = Settings.builder().put("cluster.name","docker-cluster").build();
        try {
            //创建连接
            TransportClient client = new PreBuiltTransportClient(settings)
                                        .addTransportAddress(new TransportAddress(InetAddress.getByName("120.24.170.89"),9300));

            //查找索引：demo    类型：person    id:1
            GetResponse response = client.prepareGet("demo","person","1").execute().actionGet();
            System.out.println(response.getSourceAsString());

            client.close();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }

    }
```



### ElasticsearchTemplate连接

引入spring-boot-starter-data-elasticsearch的包

```xml
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
     <version>2.1.10.RELEASE</version>
 </dependency>
```

application.yml

```yml
server:
  port: 9030
  servlet:
    context-path: /ww-es
spring:
  elasticsearch:
    rest:
      uris: http://120.24.170.89:9200
  data:
    elasticsearch:
      cluster-name: docker-cluster
      cluster-nodes: 120.24.170.89:9300
      repositories:
        enabled: true
```

ElasticsearchTemplate代码示例：

```java
package com.wykd.es.tamplate.dao;

import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.client.Client;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Iterator;


@RunWith(SpringRunner.class)
@SpringBootTest
public class ElasticsearchTemplateTest {

    @Autowired
    ElasticsearchTemplate elasticsearchTemplate;
    @Test
    public void test2(){
        Client client = elasticsearchTemplate.getClient();
        //查询index=book   type=book  id=zcvgiHIBBtMsYtNUJZFY的记录
        GetResponse response = client.prepareGet("book", "book", "zcvgiHIBBtMsYtNUJZFY").get();
        System.out.println(response.getSource());
    }


}

```

### ElasticsearchRepository连接

```java
package com.wykd.es.tamplate.dao;


import com.wykd.es.tamplate.vo.Book;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends ElasticsearchRepository<Book, String> {
    List<Book> findByPrice(Integer price);
}

```

实体类：

```java
package com.wykd.es.tamplate.vo;

import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@Document(indexName = "book",type = "book", shards = 1,replicas = 0, refreshInterval = "-1")
public class Book {

    //注意 实现的实体类必须指定id属性 不然会报异常
    private Integer id;
    private String bookName;
    private String author;
    private String publish;
    private Integer price;

    @Override
    public String toString() {
        return "Book{" +
                "id=" + id +
                ", bookName='" + bookName + '\'' +
                ", author='" + author + '\'' +
                ", publish='" + publish + '\'' +
                ", price=" + price +
                '}';
    }
}

```

接口类：继承ElasticsearchRepository类

```java
package com.wykd.es.tamplate.dao;


import com.wykd.es.tamplate.vo.Book;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends ElasticsearchRepository<Book, String> {
    List<Book> findByPrice(Integer price);
}
```

测试类：

```java
package com.wykd.es.tamplate.dao;

import com.wykd.es.tamplate.vo.Book;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Iterator;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BookRepositoryTest {

    @Autowired
    BookRepository bookRepository;

    @Test
    public  void  test1(){
        Book book=new Book();
        book.setAuthor("张三");
        book.setBookName("javv从入门到放弃");
        book.setPrice(24);
        book.setPublish("出版社");
        bookRepository.save(book);


        Iterable<Book> all = bookRepository.findAll();
        Iterator<Book> iterator = all.iterator();
        while(iterator.hasNext()) {
            Book next = iterator.next();
            System.out.println(next);
        }
    }
}

```

## 基本信息查看命令

```
http://192.168.113.128:9200/_cat/
```

## 跨域问题

```
# 修改elasticsearch.yml
http.cors.enabled: true
http.cors.allow-origin: "*"
```

## ELK

### Filebeat+LogStash+ES+Kibana

参考：https://blog.csdn.net/forezp/article/details/98322521

## FAQ

### 问题1：创建容器时[Warning] IPv4 forwarding is disabled. Networking will not work.

https://blog.csdn.net/zhydream77/article/details/81902457

### 问题2：启动elasticsearch容器，报错： max virtual memory areas vm.max_map_count [65530] is too low, increase to at leas

https://blog.csdn.net/gulijiang2008/article/details/90447298