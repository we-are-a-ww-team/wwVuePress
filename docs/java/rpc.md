# RPC

## HandWritten-RPC

### BIO版本

> 准备三个工程：rpc-client，rpc-server，rpc-server-api
>
> rpc-client,rpc-server分别依赖rpc-server-api的包

#### **rpc-client工程代码示例**

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>ww-handwritten-rpc</artifactId>
        <groupId>com.wykd</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <packaging>jar</packaging>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>7</source>
                    <target>7</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
    <artifactId>ww-rpc-clent</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.57</version>
        </dependency>

        <!-- 依赖rpc服务端的接口包 -->
        <dependency>
            <groupId>com.wykd</groupId>
            <artifactId>ww-rpc-server-api</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>

</project>
```

**RpcClient启动类：**

```java
package com.wykd.rpc.client;

import com.wykd.hw.rpc.server.service.api.IUserService;
import com.wykd.rpc.client.proxy.RpcProxy;

public class RpcClient {
	public static void main(String[] args) {
		String ip ="localhost";
		int port = 9094;
        //入参为rpcServer的接口，获取动态代理对象
		IUserService userService = RpcProxy.getServiceApiProxy(IUserService.class, ip, port);
        //调用动态代理的对象，触发InvocationHandler实现类的invoke方法
		System.out.println(userService.getUserById("1000"));
		
	}
}
```

**RpcProxy类（动态代理，生成一个代理对象）：**

```java

package com.wykd.rpc.client.proxy;

import java.lang.reflect.Proxy;

public class RpcProxy {

	public static <T> T getServiceApiProxy(Class<T> cls,String ip,int port) {
		RpcHandler handler = new RpcHandler(ip,port);
        //第一个参数为：类加载器；第二个参数为接口类，new Class[] {cls}，而不能写成：cls.getInterfaces()；第三个参数为实现了InvocationHandler接口的实现类
		return (T) Proxy.newProxyInstance(cls.getClassLoader(), new Class[] {cls},handler);
	}
}

```

**RpcHandler类（动态代理业务处理类）：**

> 实现了InvocationHandler接口
>
> 实现invoke方法

```java

package com.wykd.rpc.client.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

import com.wykd.hw.rpc.server.vo.RpcRequest;
import com.wykd.rpc.client.sender.RpcSender;

public class RpcHandler implements InvocationHandler {
	private String ip;
	private int port;

	public RpcHandler(String ip, int port) {
		super();
		this.ip = ip;
		this.port = port;
	}

	public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
		
		System.out.println("发送消息");
		
		//远程发送信息
		
		RpcSender sender = new RpcSender();
		RpcRequest rpcRequest = new RpcRequest();
		rpcRequest.setClassName(method.getDeclaringClass().getName());
		rpcRequest.setMethodName(method.getName());
		rpcRequest.setParameters(args);
		rpcRequest.setParamTypes(method.getParameterTypes());
		
		return sender.sender(ip, port, rpcRequest);
	}
	
}

```

**RpcSender类（IO流处理，发送消息）：**

```java
package com.wykd.rpc.client.sender;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

import com.alibaba.fastjson.JSON;
import com.wykd.hw.rpc.server.vo.RpcRequest;

public class RpcSender {

	public Object sender(String ip, int port, RpcRequest rpcRequest) {

		try (Socket socket = new Socket(ip, port);
				InputStream in = socket.getInputStream();
				OutputStream out = socket.getOutputStream();) {

			out.write((JSON.toJSONString(rpcRequest)).getBytes());
			out.flush();
			socket.shutdownOutput();

			StringBuffer buf = new StringBuffer();
			byte[] bytes = new byte[1024];
			int len = -1;

			while ((len = in.read(bytes)) != -1) {
				buf.append(new String(bytes, 0, len));
			}

			return buf.toString();

		} catch (Exception e) {
			e.printStackTrace();
		} 
		return null;

	}

}

```

#### rpc-server-Api工程代码示例

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>ww-handwritten-rpc</artifactId>
        <groupId>com.wykd</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>
    <artifactId>ww-rpc-server-api</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

</project>
```

**IUserService接口类：**

```
package com.wykd.hw.rpc.server.service.api;

public interface IUserService {
	String getUserById(String id);
}

```

**RpcRequest传输对象类：**

```java
package com.wykd.hw.rpc.server.vo;

import java.io.Serializable;

public class RpcRequest implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private String className;  //要调用的接口的包名+类名，用于反射得到对象实例。
	private String methodName;	//要调用的方法，用于反射得到method
	private Class[] paramTypes;	//传参的类型（与入参一一对应）
	private Object[] parameters; //传参
	
	public String getMethodName() {
		return methodName;
	}
	public void setMethodName(String methodName) {
		this.methodName = methodName;
	}
	public String getClassName() {
		return className;
	}
	public void setClassName(String className) {
		this.className = className;
	}
	public Class[] getParamTypes() {
		return paramTypes;
	}
	public void setParamTypes(Class[] paramTypes) {
		this.paramTypes = paramTypes;
	}
	public Object[] getParameters() {
		return parameters;
	}
	public void setParameters(Object[] parameters) {
		this.parameters = parameters;
	}
	
	
}

```

#### rpc-server工程代码示例

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>ww-handwritten-rpc</artifactId>
        <groupId>com.wykd</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>ww-rpc-server</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>7</source>
                    <target>7</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
    <packaging>jar</packaging>
    <dependencies>

        <!-- 引入接口工程 -->
        <dependency>
            <groupId>com.wykd</groupId>
            <artifactId>ww-rpc-server-api</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>3.8.1</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.57</version>
        </dependency>

    </dependencies>

</project>
```

**rpc服务端启动类：**

> 启动一个ServerSocket，监听端口

```java
package com.wykd.hw.rpc.server;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

import com.wykd.hw.rpc.server.receive.RpcReceive;
import com.wykd.hw.rpc.server.service.UserServiceImpl;
import com.wykd.hw.rpc.server.service.api.IUserService;

public class RpcServer {

	public static void main(String[] args) {
		
		
		IUserService userService = new UserServiceImpl();
		int port = 9094;
		try {
			publish(userService,port);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	public static void publish(IUserService service ,int port) throws IOException {
		
		ServerSocket ss = new ServerSocket(port);
		while(true) {
			Socket socket = ss.accept();
			System.out.println(socket != null);
			if(socket != null) {
				RpcReceive handler = new RpcReceive(service);
				handler.dealWithStream(socket);
			}
		}
	}
}

```

**RpcReceive类（IO流处理，接收数据）：**

```java
package com.wykd.hw.rpc.server.receive;

import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.net.Socket;

import com.alibaba.fastjson.JSON;
import com.wykd.hw.rpc.server.service.api.IUserService;
import com.wykd.hw.rpc.server.vo.RpcRequest;

public class RpcReceive {

	private IUserService service;

	public RpcReceive(IUserService service) {
		super();
		this.service = service;
	}

	public void dealWithStream(Socket socket) {

		System.out.println("处理流");
//		ObjectInputStream ois = null;
//		ObjectOutputStream oos  = null;
		try(
				InputStream in = socket.getInputStream();	
				OutputStream out = socket.getOutputStream();
				) {
			
			StringBuffer buf = new StringBuffer();
			byte[] bytes = new byte[1024];
			int len = -1;
			
			while((len=in.read(bytes)) != -1) {
				buf.append(new String(bytes,0,len));
			}
			
			RpcRequest rpcRequest = JSON.parseObject(buf.toString(), RpcRequest.class);
			
			Object returnObj = getRemoteValue(rpcRequest);
			out.write((JSON.toJSONString(returnObj)).getBytes());
			out.flush();
			
//			System.out.println("=========2");
//			InputStream in = socket.getInputStream();
//			System.out.println("=========1");
//			 ois = new ObjectInputStream(in);
//			 oos = new ObjectOutputStream(socket.getOutputStream());
//			System.out.println("============");
//			RpcRequest rpcRequest = (RpcRequest) ois.readObject();
//			System.out.println(JSON.toJSONString(rpcRequest));
//			oos.writeObject(getRemoteValue(rpcRequest));
//			oos.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}  finally {
		}
	}

	private Object getRemoteValue(RpcRequest rpcRequest) {
		
		try {
			Class obj = Class.forName(rpcRequest.getClassName());
			Method method = obj.getMethod(rpcRequest.getMethodName(),rpcRequest.getParamTypes());
			return method.invoke(service, rpcRequest.getParameters());
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return null;
	}
}

```

**UserServiceImpl类（业务处理类）：**

```java
package com.wykd.hw.rpc.server.service;

import com.wykd.hw.rpc.server.service.api.IUserService;

public class UserServiceImpl implements IUserService {


    public String getUserById(String id) {
        return "laowang";
    }

}

```



### Netty版本