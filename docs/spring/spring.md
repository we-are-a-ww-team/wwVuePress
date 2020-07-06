# Spring 

## 整体架构图

> **Core**：包含Spring基本的核心工具类，Spring的其他组件都需要使用这个包中的工具类，是最基本的核心包
>
> **Beans**：该模块是访问配置文件、创建和管理bean以及Spring的IOC操作的所有类，该模块的核心是BeanFactory
>
> **Context**：该模块是基于core和bean构建，相当于对bean进行封装及扩展来对外提供使用，ApplicationContext接口是Context模块的核心
>
> ![spring-context](./spring.assets/spring-context.png)
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





## **Spring源码构建及解读：**

### 源码构建

参考1：https://www.cnblogs.com/enjoyjava/p/11622555.html

参考2：https://blog.csdn.net/bskfnvjtlyzmv867/article/details/81171802

**查看构建spring-framework的gradle的版本**：

https://blog.csdn.net/chenweijiSun/article/details/104814564

**在源码中创建测试模块**

```
# 创建一个gradle模块，build.gradle添加下面依赖
compile(project(":spring-context"))
```

配置类：

```
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@ComponentScan("com.wykd.app")
@Configuration
public class AppConfig {
}
```

Demo类：

```

import org.springframework.stereotype.Component;
@Component
public class Demo {
	public void test(){
		System.out.println("hello , 恭喜 , Spring源码5.0.2版本第一次构建成功！");
	}

}

```

测试类：

```

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Test {

	public static void main(String[] args) {
		AnnotationConfigApplicationContext ctx =
				new AnnotationConfigApplicationContext(AppConfig.class);
		Demo demo = (Demo) ctx.getBean("demo");
		demo.test();

	}
}

```

执行结果如下：

```
hello , 恭喜 , Spring源码5.0.2版本第一次构建成功！
```



### 源码解读

参考地址：https://www.jianshu.com/p/922125d40eb4

```
public AnnotationConfigApplicationContext(Class<?>... annotatedClasses) {
		
		//调用了父类的构造方法，初始化了一个IOC容器：DefaultListableBeanFactory ，并把默认的spring内置的bean注册到容器中
		this();
		
		//将指定的配置类注册到容器中
		register(annotatedClasses);
		
		//扫描工程中的bean对象，注册到容器中，执行BeanFactoryPostProcess的实现类 --> 实例化 --> 执行BeanPostProcess的实现类
		refresh();
	}
```



```
### Bean定义：
DefaultListableBeanFactory  IOC容器
	实现了BeanDefinitionRegistry接口
DefaultListableBeanFactory.beanDefinitionMap
BeanDefinition


### Bean定义修改：
BeanFactoryPostProcess   开发人员修改BeanDefinition

BeanDefinitionRegistryPostProcessor 继承了BeanFactoryPostProcess接口，注册bean定义到容器中

ConfigurationClassPostProcessor 实现了BeanDefinitionRegistryPostProcessor接口，PriorityOrdered接口，用于框架实现BeanDefinition的定义

BeanPostProcessor  修改bean实例


### 修改实例
ImportBeanDefinitionRegistrar  传入的参数，DefaultListableBeanFactory，从而修改其中的map中的bean定义
```





### BeanFactoryPostProcess

![202006162019](./spring.assets/202006162019.png)

### 单例线程池

![1593251280178](./spring.assets/1593251280178.png)

![1593251201945](./spring.assets/1593251201945.png)

![1593251339219](./spring.assets/1593251339219.png)



doGetBean的关键代码

```java
// Create bean instance.
//创建单例模式Bean的实例对象
if (mbd.isSingleton()) {
    //这里使用了一个匿名内部类，创建Bean实例对象，并且注册给所依赖的对象
    sharedInstance = getSingleton(beanName, () -> {
        try {
            //创建一个指定Bean实例对象，如果有父级继承，则合并子类和父类的定义
            return createBean(beanName, mbd, args);
        }
        catch (BeansException ex) {
            //显式地从容器单例模式Bean缓存中清除实例对象
            destroySingleton(beanName);
            throw ex;
        }
    });
    //获取给定Bean的实例对象
    bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
}				
```



```java
//真正创建Bean的方法
	protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
			throws BeanCreationException {

		// Instantiate the bean.
		//封装被创建的Bean对象
		BeanWrapper instanceWrapper = null;
		if (mbd.isSingleton()) {
			instanceWrapper = this.factoryBeanInstanceCache.remove(beanName);
		}
		if (instanceWrapper == null) {
			instanceWrapper = createBeanInstance(beanName, mbd, args);
		}
		final Object bean = instanceWrapper.getWrappedInstance();
		//获取实例化对象的类型
		Class<?> beanType = instanceWrapper.getWrappedClass();
		if (beanType != NullBean.class) {
			mbd.resolvedTargetType = beanType;
		}

		// Allow post-processors to modify the merged bean definition.
		//调用PostProcessor后置处理器
		synchronized (mbd.postProcessingLock) {
			if (!mbd.postProcessed) {
				try {
					applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);
				}
				catch (Throwable ex) {
					throw new BeanCreationException(mbd.getResourceDescription(), beanName,
							"Post-processing of merged bean definition failed", ex);
				}
				mbd.postProcessed = true;
			}
		}

		// Eagerly cache singletons to be able to resolve circular references
		// even when triggered by lifecycle interfaces like BeanFactoryAware.
		//向容器中缓存单例模式的Bean对象，以防循环引用
		boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
				isSingletonCurrentlyInCreation(beanName));
		if (earlySingletonExposure) {
			if (logger.isDebugEnabled()) {
				logger.debug("Eagerly caching bean '" + beanName +
						"' to allow for resolving potential circular references");
			}
			//这里是一个匿名内部类，为了防止循环引用，尽早持有对象的引用
			addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
		}

		// Initialize the bean instance.
		//Bean对象的初始化，依赖注入在此触发
		//这个exposedObject在初始化完成之后返回作为依赖注入完成后的Bean
		Object exposedObject = bean;
		try {
			//将Bean实例对象封装，并且Bean定义中配置的属性值赋值给实例对象
			populateBean(beanName, mbd, instanceWrapper);
			//初始化Bean对象
			exposedObject = initializeBean(beanName, exposedObject, mbd);
		}
		catch (Throwable ex) {
			if (ex instanceof BeanCreationException && beanName.equals(((BeanCreationException) ex).getBeanName())) {
				throw (BeanCreationException) ex;
			}
			else {
				throw new BeanCreationException(
						mbd.getResourceDescription(), beanName, "Initialization of bean failed", ex);
			}
		}

		if (earlySingletonExposure) {
			//获取指定名称的已注册的单例模式Bean对象
			Object earlySingletonReference = getSingleton(beanName, false);
			if (earlySingletonReference != null) {
				//根据名称获取的已注册的Bean和正在实例化的Bean是同一个
				if (exposedObject == bean) {
					//当前实例化的Bean初始化完成
					exposedObject = earlySingletonReference;
				}
				//当前Bean依赖其他Bean，并且当发生循环引用时不允许新创建实例对象
				else if (!this.allowRawInjectionDespiteWrapping && hasDependentBean(beanName)) {
					String[] dependentBeans = getDependentBeans(beanName);
					Set<String> actualDependentBeans = new LinkedHashSet<>(dependentBeans.length);
					//获取当前Bean所依赖的其他Bean
					for (String dependentBean : dependentBeans) {
						//对依赖Bean进行类型检查
						if (!removeSingletonIfCreatedForTypeCheckOnly(dependentBean)) {
							actualDependentBeans.add(dependentBean);
						}
					}
					if (!actualDependentBeans.isEmpty()) {
						throw new BeanCurrentlyInCreationException(beanName,
								"Bean with name '" + beanName + "' has been injected into other beans [" +
								StringUtils.collectionToCommaDelimitedString(actualDependentBeans) +
								"] in its raw version as part of a circular reference, but has eventually been " +
								"wrapped. This means that said other beans do not use the final version of the " +
								"bean. This is often the result of over-eager type matching - consider using " +
								"'getBeanNamesOfType' with the 'allowEagerInit' flag turned off, for example.");
					}
				}
			}
		}

		// Register bean as disposable.
		//注册完成依赖注入的Bean
		try {
			registerDisposableBeanIfNecessary(beanName, bean, mbd);
		}
		catch (BeanDefinitionValidationException ex) {
			throw new BeanCreationException(
					mbd.getResourceDescription(), beanName, "Invalid destruction signature", ex);
		}

		return exposedObject;
	}
```





## ApplicationEvent

参考：https://www.jianshu.com/p/ef2cee8c5dd1