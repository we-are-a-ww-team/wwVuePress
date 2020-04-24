# Redis

> redis为什么快？

1. C语言编写
2. resp协议
3. 单线程（6.x之后为多线程）
4. 内存运算
5. 多路I/O复用

## 五种数据结构

### String

### Hash

```
hmset user:1 name wang age 18	设置用户1的姓名，年龄
hgetall user:1   	获取user:1的所有的属性和值
```

经典场景：**购物车**

```
hmset cart:001 prod:1 1 prod:2 1 prod:3 3    购物车给商品1设置1，商品2设置1，商品3设置3
hgetall cart:001	查询购物车中的所有商品数量
```

### List

```
模拟栈：lpush+lpop     先进后出

```

```
模拟队列：lpush+rpop   先进先出

```

```
模拟阻塞队列：blocking-queue   blpop
```

```
lrange [keyname] 0 -1   从集合中取所有记录
```

经典场景: **公众号订阅者消息**

```
lpush msg:001 100 101 102 103 104    给订阅了某公众号的用户001，添加
lrange msg:001 0 -1  列出所有消息
```

### Set

```
sadd [key] [value1] [value2] [value3]	添加元素到集合中
smenbers [key]			查出集合所有元素
srem [key] [value1]     删除某元素
scard [key]				查询集合长度
```

经典场景：**抽奖**，**微博的共同关注**

```
sadd active:001 u001 u002 u003 u004 u005 u006
srandomember active:001 2   从集合active001中取出2个用户

sinter [key1] [key2]  找出key1与key2的交集
sunion		并集
sdiffer  	差集
```

### ZSet

经典场景：**排行榜**，**微信的点赞**

```
zadd [key] [score]  
zrange [key] 0 -1    按照分值取值 

zincrby topic:0423 1 art:001  给0423的art001文章增加点击数
```



## 分布式锁

## session共享

## 手写Redis客户端

```java
package com.wykd.redis.handwriting;


import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;


public class WWRedisClient {

    private String host;
    private int port;

    public WWRedisClient(String host, int port) throws IOException {
       this.host = host;
       this.port = port;
    }

    public static void main(String[] args) throws IOException {
        WWRedisClient redisClient = new WWRedisClient("192.168.113.128", 6379);
        redisClient.set("hello", "hello redis");
        System.out.println("取值结果为："+redisClient.get("hello"));
    }

    public void set(String key, String val) throws IOException {
        StringBuffer sb = new StringBuffer();
        sb.append("*3").append("\r\n");		//*3 代表发送命令有3部分：set key value
        sb.append("$3").append("\r\n");  	//$3 SET的长度为3
        sb.append("SET").append("\r\n");

        sb.append("$").append(key.getBytes().length).append("\r\n");
        sb.append(key).append("\r\n");

        sb.append("$").append(val.getBytes().length).append("\r\n");
        sb.append(val).append("\r\n");
        System.out.println("发送set命令===>");
        System.out.println(sb.toString());

        try(Socket socket = new Socket(host, port);
            OutputStream output = socket.getOutputStream();
        ){
            output.write(sb.toString().getBytes());
        }catch(Exception e){
            e.printStackTrace();
        }
    }

    public String get(String key) throws IOException {
        StringBuffer sb = new StringBuffer();
        sb.append("*2").append("\r\n");
        sb.append("$3").append("\r\n");
        sb.append("GET").append("\r\n");

        sb.append("$").append(key.getBytes().length).append("\r\n");
        sb.append(key).append("\r\n");
        System.out.println("发送get命令===>");
        System.out.println(sb.toString());

        try(Socket socket = new Socket(host, port);
            OutputStream output = socket.getOutputStream();
            InputStream in = socket.getInputStream();
        ){
            output.write(sb.toString().getBytes());
            byte[] bytes = new byte[1024];
            in.read(bytes);

            String returnValue = new String(bytes).split("\r\n")[1];

            return returnValue;
        }catch(Exception e){
            e.printStackTrace();
        }
        return "";
    }


}
```

**redis底层命令发送源码：**

```java
private static void sendCommand(RedisOutputStream os, byte[] command, byte[]... args) {
        try {
            os.write((byte)42);
            os.writeIntCrLf(args.length + 1);
            os.write((byte)36);
            os.writeIntCrLf(command.length);
            os.write(command);
            os.writeCrLf();
            byte[][] var3 = args;
            int var4 = args.length;

            for(int var5 = 0; var5 < var4; ++var5) {
                byte[] arg = var3[var5];
                os.write((byte)36);
                os.writeIntCrLf(arg.length);
                os.write(arg);
                os.writeCrLf();
            }

        } catch (IOException var7) {
            throw new JedisConnectionException(var7);
        }
    }
```

## 