# 单例模式

> **懒汉模式**：懒汉比较懒，只有需要的时候，才进行初始化。
>
> **饿汉模式**：饿汉太饿了，只能勤奋苦干，一开始就初始化
>
> **注册模式**：Map可保存很多单例，借助ConcurrentHashMap的key唯一，实现单例。且线程安全。

## 懒汉模式

```java
package com.wykd.pattern;

public class LazySingleton {

    private volatile static LazySingleton instance = null;

    //私有的默认构造函数
    private LazySingleton() {
    }

    //静态工厂方法
    public static LazySingleton getInstance() {
        if (instance == null) {
            synchronized (LazySingleton.class) {
                if (instance == null) {
                    instance = new LazySingleton();
                }
            }

        }
        return instance;
    }


}

```



## 饿汉模式

```java
package com.wykd.pattern;

/**
 * 饿汉模式: 饿汉 太饿了，只能勤奋，需要一开始就初始化
 */
public class HungrySingleton {

    private static final HungrySingleton instance = new HungrySingleton();

    //私有的默认构造函数
    private HungrySingleton(){}

    //静态工厂方法
    public static HungrySingleton getInstance(){
        return instance;
    }


    public static void main(String[] args) {
        System.out.println(HungrySingleton.getInstance() == HungrySingleton.getInstance());
    }

}

```



## 注册模式

```java
package com.wykd.pattern;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RegisterSingleton {

    static private Map<String, Object> registry = new ConcurrentHashMap();

    //受保护的默认构造函数，如果为继承关系，则可以调用，克服了单例类不能为继承的缺点
    protected RegisterSingleton() {
    }

    //静态工厂方法，返回此类的唯一实例
    public static RegisterSingleton getInstance(String name) {
        if (registry.get(name) == null) {
            try {
                registry.put(name, Class.forName(name).newInstance());
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
        return (RegisterSingleton) registry.get(name);
    }


}

```

