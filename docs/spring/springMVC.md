# SpringMVC

## HandWritten-SpringMVC

添加依赖：

```xml
 <dependency>
     <groupId>org.apache.tomcat</groupId>
     <artifactId>servlet-api</artifactId>
     <version>6.0.53</version>
</dependency>
```

web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://xmlns.jcp.org/xml/ns/javaee" xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd" metadata-complete="true" version="4.0">
  <servlet>
    <servlet-name>ServletDemo1</servlet-name>
    <servlet-class>com.wykd.servlet.WDispatchServlet</servlet-class>
    <load-on-startup>1</load-on-startup>
  </servlet>
  <servlet-mapping>
    <servlet-name>ServletDemo1</servlet-name>
    <url-pattern>/*</url-pattern>
  </servlet-mapping>
</web-app>
```

application.properties:

```properties
scan-package=com.wykd
```

注解类：

```java
//WAutoWaird类
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WAutoWaird {
	String value() default "";
}

//WController类
@Target({ElementType.TYPE})    // 类上面
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WController {
	String value() default "";
}

//WRequestParam类
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WRequestParam {
	String value() default "";
}

//WRestMapping类
@Target({ElementType.TYPE,ElementType.METHOD})    // 类上面，以及方法上面
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WRestMapping {
	String value();
}

//WService类
@Target({ElementType.TYPE})    // 类上面
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WService {
	String value() default "";
}
```

分发类：

```java
package com.wykd.servlet;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.lang.annotation.Annotation;
import java.lang.reflect.AnnotatedType;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.wykd.annotation.WRequestParam;
import com.wykd.annotation.WAutoWaird;
import com.wykd.annotation.WController;
import com.wykd.annotation.WRestMapping;
import com.wykd.annotation.WService;

public class WDispatchServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private Properties properties = new Properties(); // 配置文件

	private List<String> classNameList = new ArrayList<String>();   //存储包名+类名

	private Map<String, Object> classNameMap = new HashMap<String, Object>();   //存储"类注解名"与"实例"

	private Map<String, Method> methodNameMap = new HashMap<String, Method>();  //存储"链接"与"方法"

	@Override
	public void init() throws ServletException {
		super.init();

		/** 1.获取配置文件的扫描路径 */
		String packagePath = getScanPackagePath();
		System.out.println("获取配置文件的scan-package为："+packagePath);
		
		
		/** 2.根据扫描地址，循环获取文件的路径，并将文件放入List集合中 */
		scanPackageClass(packagePath);
		System.out.println("类路径集合："+JSON.toJSONString(this.classNameList,true));
		

		/** 3.通过反射将Controller类，Service类实例化，保存到map容器中 ,并且将实例设置为 属性 */
		set2ClassMap();
		System.out.println("类路径集合："+JSON.toJSONString(this.classNameMap,true));
		
		
		/** 4.将链接和对应的方法保存在Map中 */
		set2MethodMap();
		System.out.println("方法集合："+JSON.toJSONString(this.methodNameMap,true));
		
		
		
	}

	private void set2MethodMap() {
		
		for (String clazzName : classNameMap.keySet()) {
		
			Object obj = (Object) classNameMap.get(clazzName);
			Class clazz = obj.getClass();			
			
			if(clazz.isAnnotationPresent(WController.class)) {
				WRestMapping restMapping = (WRestMapping) clazz.getAnnotation(WRestMapping.class);
				String clazzMapping = restMapping.value();
				
				Method[] methods = clazz.getDeclaredMethods();
				for (int i = 0; i < methods.length; i++) {
					
					Method method = methods[i];
					WRestMapping restMapping2 = method.getAnnotation(WRestMapping.class);
					String methodMapping = restMapping2.value();
							
					methodNameMap.put("/"+clazzMapping+"/"+methodMapping, method);
				}
				
				//给成员变量属性设置值
				Field[] fields = clazz.getDeclaredFields();
				for (int j = 0; j < fields.length; j++) {
					Field field = fields[j];
					
					field.setAccessible(true);
					try {
						if(field.isAnnotationPresent(WAutoWaird.class)) {
							WAutoWaird autoWaird = field.getAnnotation(WAutoWaird.class);
							field.set(obj, classNameMap.get(field.getName()));   //给obj的Filed属性设置 实例
						}
						
					} catch (IllegalArgumentException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (IllegalAccessException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
				}
				
			}
			
			
		}
		
		
	}

	/**
	 * 将实例设置到Map中
	 */
	private void set2ClassMap() {
		
		for (Iterator iterator = classNameList.iterator(); iterator.hasNext();) {
			String classNamePath = (String) iterator.next();
			
			try {
				Class clazz = this.getClass().forName(classNamePath);
				boolean isControllClass = clazz.isAnnotationPresent(WController.class);
				if(isControllClass) {
					//Controll类
					WController anno = (WController) clazz.getAnnotation(WController.class);
					String controllName = anno.value();
					if("".equals(controllName)) {
						controllName = classNamePath.substring(classNamePath.lastIndexOf(".")+1);
						controllName = getLowerFirstChar(controllName);
					}
					classNameMap.put(controllName, clazz.newInstance());
					
				}
				boolean isServiceClass = clazz.isAnnotationPresent(WService.class);
				if(isServiceClass) {
					//Service类
					WService anno = (WService) clazz.getAnnotation(WService.class);
					String serviceName = anno.value();
					if("".equals(serviceName)) {
						serviceName = classNamePath.substring(classNamePath.lastIndexOf(".")+1);
						serviceName = getLowerFirstChar(serviceName);
					}
					classNameMap.put(serviceName, clazz.newInstance());
					
				}
				
				
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
	}

	/**
	 * 	首字母小写
	 * @param controllName
	 * @return
	 */
	private String getLowerFirstChar(String controllName) {
		
		String returnValue = "";
		for (int i = 0; i < controllName.length(); i++) {
			char a = controllName.charAt(i);
			if(i == 0) {
				a += 32;
			}
			returnValue += a;
		}
		System.out.println("首字母小写 ===>"+returnValue);
		
		return returnValue;
	}

	private void scanPackageClass(String packagePath) {
		
		packagePath = packagePath.replaceAll("\\.", "/");
//		System.out.println(packagePath);
		URL url = this.getClass().getClassLoader().getResource(packagePath);
//		System.out.println(url.getFile());
		
		File packageFile = new File(url.getFile());
		File[] files = packageFile.listFiles();
		for (int i = 0; i < files.length; i++) {
			File file = files[i];
			if(!file.isDirectory()) {
				
//				System.out.println("扫描的文件名为："+packagePath +"/"+ file.getName());
				
				String absolutePaht = (packagePath +"/"+ file.getName())
						.replaceAll("/", "\\.")
						.replaceAll(".class", "");
				
				
//				System.out.println("扫描的文件名为======================>"+absolutePaht);
				
				classNameList.add(absolutePaht);
			}else {
				scanPackageClass(packagePath +"/"+ file.getName());
			}
		}
		
		
	}

	/**
	 * 	获取配置的值
	 * 
	 * @return
	 */
	private String getScanPackagePath() {

		InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream("application.properties");
		try {
			properties.load(inputStream);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return properties.getProperty("scan-package");
	}

	/**
	 * Default constructor.
	 */
	public WDispatchServlet() {
		// TODO Auto-generated constructor stub
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String contextPath = request.getContextPath();
		String uri = request.getRequestURI();
		System.out.println("uri ===>"+uri);
		
		String controllerClassName = uri.replaceAll(contextPath, "");
		System.out.println("controllerClassName ===>"+controllerClassName);
		
		String className = controllerClassName.split("/")[1];
		Object clazz = (Object) this.classNameMap.get(className);
		
		
		Method method = this.methodNameMap.get(controllerClassName);
		
		AnnotatedType[] annotationType =  method.getAnnotatedParameterTypes();
		System.out.println(JSON.toJSONString(annotationType));
		
		Class[] paramTypes = method.getParameterTypes();
		System.out.println(JSON.toJSONString(paramTypes));
		
		
//		Parameter[] params = method.getParameters();
//		for (int i = 0; i < params.length; i++) {
//			Parameter param = params[i];
//			System.out.println("参数的名词 ===>" + param.getName());
//		}
////		
//		Map<String, String[]> paramMap =  request.getParameterMap();
//		System.out.println(JSON.toJSONString(paramMap));
		
		
		Object[] args = dealArgs(request,response,method);
		
		
		Object returnValue = null;
		try {
			returnValue = method.invoke(clazz,args);
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		PrintWriter out = response.getWriter();
		out.println(JSON.toJSONString(returnValue));
		out.flush();
		out.close();
	}

	/**
	 * 参数处理
	 * @param request
	 * @param response
	 * @param method
	 * @return
	 */
	private Object[] dealArgs(HttpServletRequest request, HttpServletResponse response, Method method) {
	
		Class[] paramTypes =  method.getParameterTypes();
		Object[] args = new Object[paramTypes.length] ;
		
		for (int i = 0; i < paramTypes.length; i++) {
			
			Annotation[] anno = method.getParameterAnnotations()[i];
			WRequestParam anno2 = (WRequestParam) anno[0];
			System.out.println(anno2.value());
			
			if("int".equals(paramTypes[i].getName())) {
				args[i] = Integer.parseInt(request.getParameter(anno2.value()));
			}
			else if("java.lang.String".equals(paramTypes[i].getName())){
				args[i] = request.getParameter(anno2.value());
			}
			else {
				
				System.out.println(paramTypes[i].getName());
				
				try {
					Class clazz = this.getClass().forName(paramTypes[i].getName());
					Object instance = clazz.newInstance();
					
					Field[] fields = clazz.getDeclaredFields();
					
					for (int j = 0; j < fields.length; j++) {
						Field field = fields[j];
						
						Object parameterValue = request.getParameter(field.getName());
						
						System.out.println("field.getType() ===>"+field.getType());
						
						if("int".equals(field.getType().getName())) {
							parameterValue = (Integer.parseInt(request.getParameter(field.getName())));
						}
						
						field.setAccessible(true);
						field.set(instance, parameterValue);
					}
					args[i] = instance;
					
				} catch (ClassNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IllegalArgumentException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (InstantiationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				
			}
		}
		
		return args;
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
//		response.getWriter();
	}

}

```



```java
package com.wykd.controller;

import java.io.PrintWriter;
import java.util.Map;

import com.wykd.annotation.WRequestParam;
import com.wykd.annotation.WAutoWaird;
import com.wykd.annotation.WController;
import com.wykd.annotation.WRestMapping;
import com.wykd.service.HelloService;
import com.wykd.vo.User;

@WRestMapping("helloController")
@WController
public class HelloController {

	@WAutoWaird
	private HelloService helloService;
	
	@WRestMapping("hello")
	public Map hello(@WRequestParam("id") int id ,@WRequestParam("name")String name ) {
		System.out.println("hello world");
		
		System.out.println("参数的值===》 id:" + id +" name："+ name);
		
		return helloService.hello();
	}
	
	
	@WRestMapping("nihao")
	public String nihao(@WRequestParam("user") User user) {
		return user.getName() + user.getId();
//		helloService.hello();
	}
	
}

```



```java
package com.wykd.service;

import java.util.HashMap;
import java.util.Map;

import com.wykd.annotation.WService;

@WService("helloService")
public class HelloService {
	public Map hello() {
		Map map = new HashMap();
		map.put("hello", "hello world");
		return map;
	}
}
```

```java
package com.wykd.vo;

public class User {

	private int id ;
	private String name ;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}

```

请求连接：

```html
http://localhost:8080/w_spring_web/helloController/hello?id=123&name=wang
```

## 源码解读：

DispatcherServlet 加载：

![1587481249045](./spring.assets/1587481249045.png)

