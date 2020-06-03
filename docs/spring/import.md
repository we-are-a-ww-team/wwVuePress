# 注入Bean的7种方式

参考：https://blog.csdn.net/everyok/article/details/81350905

测试类：

```java
package com.wykd.bean;

import com.alibaba.fastjson.JSON;
import com.wykd.bean.demo3.Demo03Config;
import com.wykd.bean.demo4.Demo04Config;
import com.wykd.bean.demo4.DemoService04;
import com.wykd.bean.demo5.Demo05Config;
import com.wykd.bean.demo6.Demo06Config;
import com.wykd.bean.demo6.DemoService06;
import com.wykd.bean.demo7.Demo07Config;
import com.wykd.bean.demo7.DemoService07;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class TestImpotBeanApp {


    public static void main(String[] args) {

        test1();
        System.out.println("");
        test2();
        System.out.println("");
        test3();
        System.out.println("");
        test4();
        System.out.println("");
        test5();
        System.out.println("");
        test6();
        System.out.println("");
        test7();

    }


    /**
     * xml方式
     */
    public static void test1() {
        ApplicationContext ctx = new ClassPathXmlApplicationContext("application.xml");

        //获取所有的bean名称
        System.out.println(JSON.toJSONString(ctx.getBeanDefinitionNames()));

        IDemoService helloService = (IDemoService) ctx.getBean("demoService01");
        System.out.println(helloService.hello());

    }

    /**
     * 包扫描方式，扫描@Component注解的类，等价与Springboot项目中 @ComponentScan("")
     */
    public static void test2() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext("com.wykd.bean.demo2");
        //获取所有的bean名称
        System.out.println(JSON.toJSONString(ctx.getBeanDefinitionNames()));
        IDemoService helloService = (IDemoService) ctx.getBean("demoService02");
        System.out.println(helloService.hello());
    }

    /**
     * @Configuration + @Bean
     */
    public static void test3() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(Demo03Config.class);
        //获取所有的bean名称
        System.out.println(JSON.toJSONString(ctx.getBeanDefinitionNames()));
        IDemoService helloService = (IDemoService) ctx.getBean("demoService03");
        System.out.println(helloService.hello());
    }

    /**
     * @Configuration + @Import(Object.class)
     */
    public static void test4() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(Demo04Config.class);
        //获取所有的bean名称
        System.out.println(JSON.toJSONString(ctx.getBeanDefinitionNames()));

        IDemoService helloService = (IDemoService) ctx.getBean(DemoService04.class.getName());
        System.out.println(helloService.hello());
    }

    /**
     * @Configuration + @Import(ImportBeanDefinitionRegistrar.class)
     */
    public static void test5() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(Demo05Config.class);
        //获取所有的bean名称
        System.out.println(JSON.toJSONString(ctx.getBeanDefinitionNames()));
        IDemoService helloService = (IDemoService) ctx.getBean("demoService05");
        System.out.println(helloService.hello());
    }

    /**
     * @Configuration + @Import(ImportSelector.class)
     */
    public static void test6() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(Demo06Config.class);
        //获取所有的bean名称
        System.out.println(JSON.toJSONString(ctx.getBeanDefinitionNames()));

        IDemoService helloService = (IDemoService) ctx.getBean(DemoService06.class.getName());
        System.out.println(helloService.hello());
    }

    /**
     * @Configuration + Enable注解
     */
    public static void test7() {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(Demo07Config.class);
        //获取所有的bean名称
        System.out.println(JSON.toJSONString(ctx.getBeanDefinitionNames()));

        IDemoService helloService = (IDemoService) ctx.getBean(DemoService07.class.getName());
        System.out.println(helloService.hello());
    }

}


```



```java
package com.wykd.bean;

public interface IDemoService {

    String hello();
}
```

pom.xml增加依赖：

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.2.0.RELEASE</version>
</dependency>
```

## Demo01：读取xml

application.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="demoService01" class="com.wykd.bean.demo1.DemoService01" />
</beans>

```

```java
package com.wykd.bean.demo1;

import org.springframework.stereotype.Service;

@Service
public class DemoService01 implements IDemoService01 {

    @Override
    public String hello() {
        return "hello demo01";
    }
}

```

## Demo02：@component

```java
package com.wykd.bean.demo2;

import org.springframework.stereotype.Service;

@Component
public class DemoService02 implements IDemoService02 {

    @Override
    public String hello() {
        return "hello demo02";
    }
}
```

## Demo03：@Bean

```java
package com.wykd.bean.demo3;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Demo03Config {

    @Bean
    public DemoService03 demoService03(){
        return new DemoService03();
    }
}
```

```java
package com.wykd.bean.demo3;

import com.wykd.bean.IDemoService;
import org.springframework.stereotype.Service;

@Service
public class DemoService03 implements IDemoService {

    @Override
    public String hello() {

        return "hello demo03";
    }
}
```

## Demo04：@Import(Object.class)

```java
package com.wykd.bean.demo4;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(DemoService04.class)
public class Demo04Config {

}
```

```java
package com.wykd.bean.demo4;

import com.wykd.bean.IDemoService;
import org.springframework.stereotype.Service;

/**
 * 功能：
 * Created by [Alex]
 * 2020/5/11 16:07
 */
public class DemoService04 implements IDemoService {

    @Override
    public String hello() {

        return "hello demo04";
    }
}
```

## Demo05：@Import(ImportBeanDefinitionRegistrar.class)

修改bean属性：https://my.oschina.net/qrmc/blog/1811091

```java
package com.wykd.bean.demo5;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(Demo05BeanDefinitionRegistrar.class)
public class Demo05Config {

}
```

```java
package com.wykd.bean.demo5;

import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.type.AnnotationMetadata;

public class Demo05BeanDefinitionRegistrar  implements ImportBeanDefinitionRegistrar {

    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {

        BeanDefinitionBuilder userService = BeanDefinitionBuilder.rootBeanDefinition(DemoService05.class);
        //通过registry就可以注入到容器里啦
        registry.registerBeanDefinition("demoService05", userService.getBeanDefinition());
    }
}
```

```java
package com.wykd.bean.demo5;

import com.wykd.bean.IDemoService;

public class DemoService05 implements IDemoService {

    @Override
    public String hello() {

        return "hello demo05";
    }
}
```

## Demo06：@Import(ImportSelector.class)

```java
package com.wykd.bean.demo6;

import com.wykd.bean.demo5.Demo05BeanDefinitionRegistrar;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(Demo06ImportSelector.class)
public class Demo06Config {

}
```

```java
package com.wykd.bean.demo6;

import com.wykd.bean.demo7.EnableHelloService;
import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.type.AnnotationMetadata;

public class Demo06ImportSelector implements ImportSelector {

    @Override
    public String[] selectImports(AnnotationMetadata annotationMetadata) {

        return new String[]{DemoService06.class.getName()};
    }
}
```

```java
package com.wykd.bean.demo6;

import com.wykd.bean.IDemoService;

public class DemoService06 implements IDemoService {

    @Override
    public String hello() {

        return "hello demo06";
    }
}
```

## Demo07：@Enable注解

```java
package com.wykd.bean.demo7;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@EnableHelloService("hello ,i am demo07")
public class Demo07Config {

}
```

```java
package com.wykd.bean.demo7;

import com.wykd.bean.demo6.Demo06ImportSelector;
import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.type.AnnotationMetadata;

import java.util.Map;

public class Demo07ImportSelector implements ImportSelector {

    @Override
    public String[] selectImports(AnnotationMetadata annotationMetadata) {

        //获取Enable注解的赋值
        Map<String , Object> map = annotationMetadata.getAnnotationAttributes(EnableHelloService.class.getName(),true);
        for(Map.Entry<String, Object> entry : map.entrySet()){
            System.out.println( entry.getKey() + " =========> " + entry.getValue());
        }

        return new String[]{DemoService07.class.getName()};
    }
}
```

```java
package com.wykd.bean.demo7;

import org.springframework.context.annotation.Import;
import org.springframework.core.annotation.AliasFor;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Documented
@Target(ElementType.TYPE)
@Import(Demo07ImportSelector.class)
public @interface EnableHelloService {

    String value() default "";

}
```

```java
package com.wykd.bean.demo7;

import com.wykd.bean.IDemoService;

public class DemoService07 implements IDemoService {

    @Override
    public String hello() {

        return "hello demo07";
    }
}
```

打印结果：

```
["demoService01"]
hello demo01

["org.springframework.context.annotation.internalConfigurationAnnotationProcessor","org.springframework.context.annotation.internalAutowiredAnnotationProcessor","org.springframework.context.annotation.internalCommonAnnotationProcessor","org.springframework.context.event.internalEventListenerProcessor","org.springframework.context.event.internalEventListenerFactory","demoService02"]
hello demo02

["org.springframework.context.annotation.internalConfigurationAnnotationProcessor","org.springframework.context.annotation.internalAutowiredAnnotationProcessor","org.springframework.context.annotation.internalCommonAnnotationProcessor","org.springframework.context.event.internalEventListenerProcessor","org.springframework.context.event.internalEventListenerFactory","demo03Config","demoService03"]
hello demo03

["org.springframework.context.annotation.internalConfigurationAnnotationProcessor","org.springframework.context.annotation.internalAutowiredAnnotationProcessor","org.springframework.context.annotation.internalCommonAnnotationProcessor","org.springframework.context.event.internalEventListenerProcessor","org.springframework.context.event.internalEventListenerFactory","demo04Config","com.wykd.bean.demo4.DemoService04"]
hello demo04

["org.springframework.context.annotation.internalConfigurationAnnotationProcessor","org.springframework.context.annotation.internalAutowiredAnnotationProcessor","org.springframework.context.annotation.internalCommonAnnotationProcessor","org.springframework.context.event.internalEventListenerProcessor","org.springframework.context.event.internalEventListenerFactory","demo05Config","demoService05"]
hello demo05

["org.springframework.context.annotation.internalConfigurationAnnotationProcessor","org.springframework.context.annotation.internalAutowiredAnnotationProcessor","org.springframework.context.annotation.internalCommonAnnotationProcessor","org.springframework.context.event.internalEventListenerProcessor","org.springframework.context.event.internalEventListenerFactory","demo06Config","com.wykd.bean.demo6.DemoService06"]
hello demo06

value =========> hello ,i am demo07
["org.springframework.context.annotation.internalConfigurationAnnotationProcessor","org.springframework.context.annotation.internalAutowiredAnnotationProcessor","org.springframework.context.annotation.internalCommonAnnotationProcessor","org.springframework.context.event.internalEventListenerProcessor","org.springframework.context.event.internalEventListenerFactory","demo07Config","com.wykd.bean.demo7.DemoService07"]
hello demo07
```