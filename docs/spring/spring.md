# Spring 

## 整体架构图

> **Core**：包含Spring基本的核心工具类，Spring的其他组件都需要使用这个包中的工具类，是最基本的核心包
>
> **Beans**：该模块是访问配置文件、创建和管理bean以及Spring的IOC操作的所有类，该模块的核心是BeanFactory
>
> **Context**：该模块是基于core和bean构建，相当于对bean进行封装及扩展来对外提供使用，ApplicationContext接口是Context模块的核心
>
> 
>
> **BeanFactory与ApplicationContext 的区别：**
>
>  BeanFactory 容器实例化后并不会自动实例化 Bean，只有当 Bean
> 被使用时 BeanFactory 容器才会对该 Bean 进行实例化与依赖关系的装配
>
> ApplicationContext 容器实例化后会自动对所有的单实例 Bean 进行实例化与
> 依赖关系的装配，使之处于待用状态。



![这里写图片描述](./spring.assets/20180505214030958.png)

### 各模块依赖关系

> 注意：Spring-jdbc依赖于spring-tx

![1587300978943](./spring.assets/1587300978943.png)

### 版本命名规则

> Snapshot：快照版
>
> Release：稳定版
>
> GA：正式版
>
> M：里程碑版本
>
> RC：终测版

### BeanFactory核心类

> BeanFactory：定义容器
>
> BeanDefinition：存放配置
>
> BeanDefinitionReader：读取配置

![ListableBeanFactory](./spring.assets/ListableBeanFactory-1587480527303.png)





## **Spring源码构建：**

参考：https://www.cnblogs.com/enjoyjava/p/11622555.html

**查看构建spring-framework的gradle的版本**：

https://blog.csdn.net/chenweijiSun/article/details/104814564







## 