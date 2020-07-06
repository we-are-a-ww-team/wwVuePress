# Lock



Main类

```java
package com.wykd.jiazhuang.controller;

import com.wykd.jiazhuang.service.SellingReentrantLockTicketService;
import com.wykd.jiazhuang.service.SellingSynchronizedService;
import com.wykd.jiazhuang.service.SellingTicketService;

public class TestLock {

	
	public static void main(String[] args) {
		
		//普通售票
//		SellingTicketService sell = new SellingTicketService();
		
		//使用了Synchronized块的售票
//		SellingSynchronizedService sell = new SellingSynchronizedService();
		
		//使用了ReentrantLock的售票
		SellingReentrantLockTicketService sell = new SellingReentrantLockTicketService();
		
		for (int i = 0; i < 5; i++) {
			new Thread(sell).start();
		}
		
	}
	
}

```

普通购票程序：

```java
package com.wykd.jiazhuang.service;

public class SellingTicketService implements Runnable {

	
	private int tickets  = 100;
	
	@Override
	public void run() {
		
		while(tickets>0) {
			
			if(tickets>0) {
				try {
					Thread.sleep(100);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				System.out.println("正在出售第"+tickets+"票！");
				tickets --;
			}
		}
	}

}

```



## Synchronized

```java
package com.wykd.jiazhuang.service;

public class SellingSynchronizedService implements Runnable {
	private int tickets  = 100;
	@Override
	public void run() {
		synchronized (this) {
			while(tickets>0) {
				if(tickets>0) {
					try {
						Thread.sleep(100);
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					System.out.println("正在出售第"+tickets+"票！");
					tickets --;
				}
			}
		}
	}
}

```



## Lock

```java
package com.wykd.jiazhuang.service;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SellingReentrantLockTicketService implements Runnable {

	//可重入锁
	private Lock lock = new ReentrantLock();
	private int tickets  = 100;
	
	@Override
	public void run() {
		
		lock.lock();
		try {	
			while(tickets>0) {
				if(tickets>0) {
					Thread.sleep(100);
					System.out.println("正在出售第"+tickets+"票！");
					tickets --;
				}
			}
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			lock.unlock();
		}
	}

}

```



## 分布式锁

定义一个接口：

```java
package com.wykd.jiazhuang.lock;

public interface DistributeLock {

	void lock(String key, String value);

	boolean unlock(String key, String value);

	boolean tryLock(String key,String value,int expireTime );
}

```

配置文件：

```yaml
server:
  port: 9053
  servlet:
    context-path: /wykd-distribute-lock
spring:
  application:
    name: service-wykd-distribute-lock
  devtools:
    restart:
      enabled: true
  redis:
    host: 120.24.87.121
    port: 6379
    password: wangwei2048
    database: 1
    jedis:
      pool:
        max-active: 1024
        max-wait: -1
        max-idle: 500
        min-idle: 0
    timeout: 10000  
zookeeper:
  address: 120.24.87.121:2181
  timeout: 4000
```



### redis实现

```java
package com.wykd.jiazhuang.service;


import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.wykd.jiazhuang.lock.DistributeLock;
import com.wykd.jiazhuang.util.JedisClient;

@Component
public class SellingRedisLockTicketService implements Runnable {
	
	private  Logger LOGGER = Logger.getLogger(JedisClient.class);
	
	@Autowired
	private DistributeLock redisLock;
	
	private int tickets  = 100;
	
	@Override
	public void run() {
		String key = "redisLock";
		String value = "redisValue";
		while(tickets>0) {
			redisLock.lock(key,value);
			try {	
				if(tickets>0) {
					Thread.sleep(100);
					System.out.println("正在出售第"+tickets+"票！");
					LOGGER.info("正在出售第"+tickets+"票！");
					tickets --;
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}finally{
				redisLock.unlock(key,value);
			}
		}
	}

}

```



```java
package com.wykd.jiazhuang.lock;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.wykd.jiazhuang.util.JedisClient;

import redis.clients.jedis.JedisPool;

@Component
public class RedisLock implements DistributeLock{

	@Autowired
	private JedisClient redisCLient;
	
	@Autowired
	private JedisPool jedisPool;
	
	public boolean tryLock(String key,String value,int expireTime ) {
	
		String result = redisCLient.setnxAndExpire(key, value,expireTime);
		
		if("OK".equalsIgnoreCase(result)) {
			return true;
		}
		return false;
	}
	
	public boolean unlock(String key,String value) {
		
		Long success = 1L;
		Object result = redisCLient.unlock(key, value);
		if(success.equals(result)) {
			return true;
		}
		return false;
	}
	
	public void lock(String key,String value) {
		
		int expireTime = 10 * 1000;
		
		while(!tryLock(key, value, expireTime)) {
			try {
				Thread.sleep(5);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		
	}
}

```



```java
package com.wykd.jiazhuang.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
 
import redis.clients.jedis.BinaryClient.LIST_POSITION;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.SortingParams;
 
@Component
public class JedisClient{
 
	private static final Logger LOGGER = LoggerFactory.getLogger(JedisClient.class);
	
	@Autowired
	private JedisPool jedisPool;

public String setnxAndExpire(String key, String value,int expireTime) {
		Jedis jedis = null;
		try {
			jedis = jedisPool.getResource();
			String result = jedis.set(key, value, "NX","PX",expireTime);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error(e.getMessage());
			return "";
		} finally {
			returnResource(jedisPool, jedis);
		}
	}
	
	public Object unlock(String key, String value) {
		
		Jedis jedis = null;
		try {
			jedis = jedisPool.getResource();
			String script = "if redis.call('get',KEYS[1]) == ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end";
			
			Object result = jedis.eval(script,Arrays.asList(key),Arrays.asList(value));
			return result;
		}  catch (Exception e) {
			e.printStackTrace();
			LOGGER.error(e.getMessage());
			return "";
		} finally {
			returnResource(jedisPool, jedis);
		}
	}
}
```



```java
 @RequestMapping("getRedis")
    public String getRedis(){
    	
    	for (int i = 0; i < 5; i++) {
			new Thread(sell).start();
		}
        return "OK";
    }
```



### redisson实现

```java
package com.wykd.jiazhuang.service;


import org.redisson.Redisson;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SellingRedissonLockTicketService implements Runnable {

	@Autowired
	private RedissonClient redissonClient;
	
//	private RLock lock = getRLock();
	
	String key = "redisLock";
	String value = "redisValue";
	
//	private RLock getRLock() {
//		RLock rlock = redissonClient.getLock(key);
//		return rlock;
//	}
	
	private int tickets  = 100;
	
	@Override
	public void run() {
		RLock rlock = redissonClient.getLock(key);
		while(tickets>0) {
			rlock.lock();
			try {	
				if(tickets>0) {
					Thread.sleep(100);
					System.out.println("正在出售第"+tickets+"票！");
					tickets --;
				}
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}finally{
				rlock.unlock();
			}
		}
		
	}

}

```

### zookeeper实现

参考：https://blog.csdn.net/crazymakercircle/article/details/85956246

```java
package com.wykd.jiazhuang.lock;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;

import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooDefs;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.wykd.jiazhuang.util.ZookeeperClient;

@Component
public class ZookeeperLock implements DistributeLock {

	private final String basePath = "/zookeeper";
	private String currZkNode = "";
	
	@Autowired
	private ZooKeeper zookeeper;
	
	@Autowired
	private ZookeeperClient zookeeperClient;
	
	
	@Override
	public boolean tryLock(String key, String value, int expireTime) {
		try {
			//1.创建临时顺序节点
			String node = basePath + "/lock";
			//获取根节点状态
	        Stat stat = zookeeper.exists(node, false);
	        //如果根节点不存在，则创建根节点，根节点类型为永久节点
	        if (stat == null) {
				zookeeper.create(node, "zkLock".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
	        }
	        
	        currZkNode = zookeeper.create(node+"/lock_", "zkLock".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
	        
	        List<String> zkLocks = zookeeper.getChildren(node, false);
	        Collections.sort(zkLocks);
			if (zkLocks != null && zkLocks.size() > 0 && currZkNode.equalsIgnoreCase(node + "/" + zkLocks.get(0))) {
	        	// 最小节点与当前节点一致，说明获取到锁
	        	return true;
	        }else {
	        	final CountDownLatch latch = new CountDownLatch(1);
	        	
	        	//等待锁
	        	int index = zkLocks.indexOf(currZkNode.substring(node.length()+1));
	        	zookeeper.exists(node+"/"+zkLocks.get(index),new Watcher() {

					@Override
					public void process(WatchedEvent event) {
						if(Event.EventType.NodeDeleted.equals(event.getType())) {
							//监听前一节点的删除事件
							latch.countDown();
						}
					}
	        		
	        	});
	        	 latch.await();
	        }
	        
	       
		
		//2.查询出所有子节点，并监听前一个节点是否存在
		
		} catch (KeeperException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	@Override
	public void lock(String key, String value) {
		tryLock(value, value, 0);
	}

	@Override
	public boolean unlock(String key, String value) {
		
		
		try {
			zookeeper.delete(currZkNode, -1 );
			currZkNode = "";
			zookeeper.close();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (KeeperException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}



}

```



```java
package com.wykd.jiazhuang.service;

import java.util.concurrent.CountDownLatch;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wykd.jiazhuang.lock.DistributeLock;

@Service
public class SellingZkLockTicketService implements Runnable {

	@Autowired
	private DistributeLock zookeeperLock;
	
	private int tickets  = 100;
	
	private CountDownLatch countDownLatch;
	
	public CountDownLatch getCountDownLatch() {
		return countDownLatch;
	}

	public void setCountDownLatch(CountDownLatch countDownLatch) {
		this.countDownLatch = countDownLatch;
	}

	@Override
	public void run() {
		
		System.out.println("卖票。。。");
		
		try {
			countDownLatch.await();
		} catch (InterruptedException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		zookeeperLock.lock(null, null);
		try {	
			while(tickets>0) {
				if(tickets>0) {
					Thread.sleep(100);
					System.out.println("正在出售第"+tickets+"票！");
					tickets --;
				}
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		}finally{
			zookeeperLock.unlock(null, null);
		}
	}

}

```



```
/**
     * @func 测试zookeeper分布式锁
     * @return
     */
    @RequestMapping("testDistributeZkLock")
    public String testDistributeZkLock(){
    	final CountDownLatch countDown = new CountDownLatch(5);
    	sellingZkLockTicketService.setCountDownLatch(countDown);
    	for (int i = 0; i < 5; i++) {
			new Thread(sellingZkLockTicketService).start();
			countDown.countDown();
		}
        return "OK";
    }
```

## 可重入锁

参考：https://blog.csdn.net/w8y56f/article/details/89554060

> 1.在一个线程过程中，可以反复获得ReentrantLock锁。
>
> 2.可重入锁，加锁的次数，与解锁的次数必须保持一致。否则其他线程获取不到锁。

```java
import java.util.Random;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantTest {
	public static void main(String[] args) {
		ReentrantLock lock = new ReentrantLock();
		
		new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					lock.lock();
					System.out.println("第1次获取锁，这个锁是：" + lock);

					int index = 1;
					while (true) {
						try {
							lock.lock();
							System.out.println("第" + (++index) + "次获取锁，这个锁是：" + lock);
							
							try {
								Thread.sleep(new Random().nextInt(200));
							} catch (InterruptedException e) {
								e.printStackTrace();
							}
							
							if (index == 10) {
								break;
							}
						} finally {
//							lock.unlock();// 这里故意注释，实现加锁次数和释放次数不一样
						}

					}

				} finally {
					lock.unlock();
				}
			}
		}).start();
		
		
		new Thread(new Runnable() {
			
			@Override
			public void run() {
				try {
					lock.lock();
					
					for (int i = 0; i < 20; i++) {
						System.out.println("threadName:" + Thread.currentThread().getName());
						try {
							Thread.sleep(new Random().nextInt(200));
						} catch (InterruptedException e) {
							e.printStackTrace();
						}
					}
				} finally {
					lock.unlock();
				}
			}
		}).start();
		
		
	}
}

```


