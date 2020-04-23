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

## 手写客户端