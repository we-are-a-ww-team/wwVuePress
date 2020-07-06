# Zookeeper

## Docker安装

```
# 拉Zookeeper镜像
docker pull zookeeper:3.4.14

# 在宿主机创建文件夹：/usr/local/zookeeper/conf，/usr/local/zookeeper/data，/usr/local/zookeeper/datalog
# 创建容器
docker run -d --name myzk  -p 2181:2181 -p 2888:2888 -p 3888:3888 --restart always -v /usr/local/zookeeper/conf:/conf  -v /usr/local/zookeeper/data:/data -v /usr/local/zookeeper/datalog:/datalog zookeeper:3.4.14 
```

进入容器，docker exec -it myzk /bin/bash

运行客户端：zkCli.sh

![1593871173477](./zookeeper.assets/1593871173477.png)

## 基本命令

```
# 创建节点
[zk: localhost:2181(CONNECTED) 3] create /zookeeper/wang laowang
Created /zookeeper/wang

# 查看节点
[zk: localhost:2181(CONNECTED) 4] ls /zookeeper
[hello, wang, quota]

# 设置hello节点
[zk: localhost:2181(CONNECTED) 6] set /zookeeper/hello  world

# 获取hello节点
[zk: localhost:2181(CONNECTED) 6] get /zookeeper/hello 
world
```

## Springboot集成zookeeper

参考：https://blog.csdn.net/qq_15199097/article/details/89920570



## 客户端：zookeeper

引入jar包

```xml
 <dependency>
     <groupId>org.apache.zookeeper</groupId>
     <artifactId>zookeeper</artifactId>
     <version>3.4.6</version>
</dependency>
```

Java代码如下：

```Java
public class TestZookeeperClient {


    public static void main(String[] args) {

        try {
            ZooKeeper zk = new ZooKeeper("192.168.113.129:2181",3000,new Watcher(){
                @Override
                public void process(WatchedEvent watchedEvent) {
                }
            });

            //新增永久节点
//            zk.create("/wang/test2","hello test1".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);

            //修改节点信息
//            zk.setData("/wang/test2","离开的解放路口".getBytes(),-1);

            //临时节点
//            zk.create("/wang/test3","hello test1".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);

            //创建永久序列节点
//            zk.create("/wang/test4","hello".getBytes(),ZooDefs.Ids.OPEN_ACL_UNSAFE,CreateMode.PERSISTENT_SEQUENTIAL);
//            zk.create("/wang/test4","hello".getBytes(),ZooDefs.Ids.OPEN_ACL_UNSAFE,CreateMode.PERSISTENT_SEQUENTIAL);


            //创建临时序列节点
//            zk.create("/wang/test5","hello".getBytes(),ZooDefs.Ids.OPEN_ACL_UNSAFE,CreateMode.EPHEMERAL_SEQUENTIAL);
//            zk.create("/wang/test5","hello".getBytes(),ZooDefs.Ids.OPEN_ACL_UNSAFE,CreateMode.EPHEMERAL_SEQUENTIAL);
//            Thread.sleep(100*1000);


//            List<String> childs = zk.getChildren("/wang", new Watcher() {
//                @Override
//                public void process(WatchedEvent watchedEvent) {
//
//                }
//            });
//            System.out.println(JSON.toJSONString(childs));


            //注意：该写法只能监听一次
            zk.exists("/wang/hello", new Watcher() {
                @Override
                public void process(WatchedEvent watchedEvent) {
                    if(Event.EventType.NodeDeleted.equals(watchedEvent.getType())){
                        System.out.println("节点被删除了！！");
                    }
                    if(Event.EventType.NodeDataChanged.equals(watchedEvent.getType())){
                        System.out.println("修改了值！！");
                    }
                }
            });


            System.in.read();

            zk.close();


        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (KeeperException e) {
            e.printStackTrace();
        }


    }

}
```



