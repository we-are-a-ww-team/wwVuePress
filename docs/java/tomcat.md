# Tomcat

## Tomcat配置文件

## Tomcat性能调优

## HandWritten-Tomcat

### BIO版本

核心类：HttpServlet，Request，Response，Tomcat

```java
package com.wykd.tomcat;

public abstract class WHttpServlet {

	public abstract void doGet(WRequest request , WResponse response) ;
	
	public abstract void doPost(WRequest request , WResponse response) ;
	
	public void service(WRequest request , WResponse response) {
		if(request.getMethod().equalsIgnoreCase("GET")) {
			doGet(request, response);
		}else if(request.getMethod().equalsIgnoreCase("POST")) {
			doPost(request, response);
		}
	}
}
```

```java
package com.wykd.tomcat;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class WRequest {

    private String url;
    private String method;
    private String hostName;
    private InputStream inputStream;

    public WRequest() {
    }

    public WRequest(InputStream inputStream) {
        this.inputStream = inputStream;
        parseInputStream();
    }

    public void parseInputStream() {

        byte[] bytes = new byte[1024];
        int len = 0;
        String str = "";
        try {
            if ((len = inputStream.read(bytes)) != -1) {
                str = new String(bytes, 0, len);
                System.out.println(str);
            }

            String[] strs = str.split(" ");
            System.out.println(strs[0]);

            String[] strs2 = str.split("\r\n");
            System.out.println(strs2[1]);

            String[] strs3 = strs2[1].split(" ");
            System.out.println(strs3[1]);

            this.setMethod(strs[0]);
            this.setHostName(strs3[1]);
            this.setUrl(strs[1]);

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }


    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }


}

```

```java
package com.wykd.tomcat;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

public class WResponse {
	private OutputStream outputStream ;

	public WResponse() {
	}
	
	public WResponse(OutputStream outputStream) {
		this.outputStream = outputStream;
		
		
	}
	
	
	public void write(String content) {
		
		StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append("HTTP/1.1 200 OK\n").append("Content-Type: text/html\n").append("\r\n")
                .append("<html><body>").append(content).append("</body></html>");
        try {
			this.outputStream.write(stringBuffer.toString().getBytes());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally {
			 try {
				this.outputStream.flush();
				this.outputStream.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	
}

```

```java
package com.wykd.tomcat;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;

import com.wykd.servlet.HelloServlet;
import com.wykd.xml.ParseServletXML;

public class WTomcat {

	
	public static void main(String[] args) {
			start();
	}

	private static void start()  {
		
		ServerSocket serverSocket = null;
		OutputStream outPutStream = null;
		InputStream inputStream = null;
		try {
			serverSocket = new ServerSocket(8080);
			
			while(true) {
				Socket socket = serverSocket.accept();
				outPutStream = socket.getOutputStream();
				inputStream = socket.getInputStream();
				
				WRequest request = new WRequest(inputStream);
				WResponse response = new WResponse(outPutStream);
				
				dispatch(request,response);
				
				socket.close();
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally {
			try {
				serverSocket.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}

	private static void dispatch(WRequest request, WResponse response) {
		
		String methodName = request.getMethod();
		String url = request.getUrl();
		
		System.out.println("methodName====>"+methodName);
		System.out.println("url====>"+url);
		
		
		//找到对应的servelt，然后执行对应的get,post方法
//		new HelloServlet().service(request, response);
		
		Map<String,String> servletMap = new ParseServletXML().getServletURLMap();
		String className = servletMap.get(url);
		
		if(className != null && !className.equals("")) {
			try {
				Class<WHttpServlet> clazz = (Class<WHttpServlet>) Class.forName(className);
				try {
					WHttpServlet whttpServlet = (WHttpServlet) clazz.newInstance();
					whttpServlet.service(request, response);
					
				} catch (InstantiationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
}

```

解析xml辅助类：

```java
package com.wykd.xml;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.alibaba.fastjson.JSON;

public class ParseServletXML {

	private static Map<String,String> servletURLMap = new HashMap<String,String>();
	
	public static Map<String, String> getServletURLMap() {
		return servletURLMap;
	}

	public static void setServletURLMap(Map<String, String> servletURLMap) {
		ParseServletXML.servletURLMap = servletURLMap;
	}

	public ParseServletXML() {
		setMappingData();
	}
	
	public static void setMappingData() {

		Map<String,String> servletMap = new HashMap<String,String>();
		Map<String,String> servletMappingMap = new HashMap<String,String>();
		
		SAXReader reader = new SAXReader();
		InputStream is = 
				ParseServletXML.class.getClassLoader().getResourceAsStream("web.xml");
		try {
			Document document = reader.read(is);
			Element root = document.getRootElement();
	        List<Element> childElements = root.elements();
	        for (Element child : childElements) {
	        	
	        	System.out.println(child.getName());
	        	
	        	if("servlet".equalsIgnoreCase(child.getName())) {
	        		List<Element> child01s = child.elements();
	        		String servletName = "";
        			String servletClass = "";
	        		for (Element child01 : child01s) {
	        			System.out.println(child01.getText());
	        			
	        			if("servlet-name".equalsIgnoreCase(child01.getName())) {
	        				servletName = child01.getText();
	        			}
	        			if("servlet-class".equalsIgnoreCase(child01.getName())) {
	        				servletClass = child01.getText();
	        			}
	        		}
	        		servletMap.put(servletName, servletClass);
	        	}
	        	
	        	if("servlet-mapping".equalsIgnoreCase(child.getName())) {
	        		List<Element> child01s = child.elements();
	        			
        			String servletName = "";
        			String urlPattern = "";
	        		for (Element child01 : child01s) {
	        			System.out.println(child01.getText());
	        			
	        			if("servlet-name".equalsIgnoreCase(child01.getName())) {
	        				servletName = child01.getText();
	        			}
	        			if("url-pattern".equalsIgnoreCase(child01.getName())) {
	        				urlPattern = child01.getText();
	        			}
	        		}
	        		servletMappingMap.put(servletName, urlPattern);
	        	}
	        }
	        
	        Set set = servletMap.keySet();
	        Iterator<String> it = set.iterator();  
	        while (it.hasNext()) {  
	          String str = it.next();  
	          System.out.println("=====>"+str);  
	          
	          String servletClass = servletMap.get(str);
	          String url = servletMappingMap.get(str);
	          
	          servletURLMap.put(url,servletClass);
	          
	        }  
	        
	        
	        System.out.println(JSON.toJSONString(servletURLMap));
	        
			
			
		} catch (DocumentException e) {
			e.printStackTrace();
		}

	}
}

```

web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app>
	<servlet>
		<servlet-name>helloServlet</servlet-name>
		<servlet-class>com.wykd.servlet.HelloServlet</servlet-class>
	</servlet>

	<servlet-mapping>
		<servlet-name>helloServlet</servlet-name>
		<url-pattern>/helloServlet</url-pattern>
	</servlet-mapping>
</web-app>
```

pom.xml引入2个jar

```xml
<dependencies>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.68</version>
        </dependency>

        <dependency>
            <groupId>dom4j</groupId>
            <artifactId>dom4j</artifactId>
            <version>1.6.1</version>
        </dependency>

    </dependencies>
```

编写一个servlet

```java
package com.wykd.servlet;

import com.wykd.tomcat.WHttpServlet;
import com.wykd.tomcat.WRequest;
import com.wykd.tomcat.WResponse;

public class HelloServlet extends WHttpServlet{

	@Override
	public void doGet(WRequest request, WResponse response) {
		response.write("hello");
	}

	@Override
	public void doPost(WRequest request, WResponse response) {
		response.write("hello");
	}

	
}

```

发送请求：

```
http://localhost:8080/helloServlet

返回结果：

hello
```



### Netty版本

引入netty的包

```xml
 <dependency>
            <groupId>io.netty</groupId>
            <artifactId>netty-all</artifactId>
            <version>4.1.49.Final</version>
        </dependency>
```

WTomcat启动类：

```java
package com.wykd.netty.tomcat;

import com.wykd.netty.xml.ParseServletXML;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;

import java.util.Map;

public class WTomcat {


    public static void main(String[] args) {

    	new WTomcat().start(8080);
    }

    private void start(int port) {

		EventLoopGroup bossGroup = new NioEventLoopGroup();
		EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {


            ServerBootstrap serverChannel = new ServerBootstrap();
            serverChannel.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        protected void initChannel(SocketChannel clientChannel) throws Exception {
							//顺序有要求，责任链模式，返回客户端，response编码必须是第一层
                            //HttpResponseEncoder编码器,
                            clientChannel.pipeline().addLast(new HttpResponseEncoder());
							//HttpRequestDecoder解码器，解析http协议->request
                            clientChannel.pipeline().addLast(new HttpRequestDecoder());
							//业务处理
                            clientChannel.pipeline().addLast(new WTomcatHandler());
                        }
                    })
                    .option(ChannelOption.SO_BACKLOG, 128)
                    .childOption(ChannelOption.SO_KEEPALIVE, true);


            ChannelFuture f = serverChannel.bind(port).sync();
            System.out.println("tomcat 已启动");
            f.channel().closeFuture().sync();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
			bossGroup.shutdownGracefully();
			workerGroup.shutdownGracefully();
        }

    }


    class WTomcatHandler extends ChannelInboundHandlerAdapter{

		@Override
		public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {

			if(msg instanceof HttpRequest){
				HttpRequest req = (HttpRequest) msg;

				WRequest request = new WRequest(ctx,req);

				WResponse response = new WResponse(ctx,req);
				dispatch(request,response);
			}
		}


		private  void dispatch(WRequest request, WResponse response) {

			String methodName = request.getMethod();
			String url = request.getUrl();

			System.out.println("methodName====>" + methodName);
			System.out.println("url====>" + url);


			//找到对应的servelt，然后执行对应的get,post方法
//		new HelloServlet().service(request, response);

			Map<String, String> servletMap = new ParseServletXML().getServletURLMap();
			String className = servletMap.get(url);

			if (className != null && !className.equals("")) {
				try {
					Class<WHttpServlet> clazz = (Class<WHttpServlet>) Class.forName(className);
					try {
						WHttpServlet whttpServlet = (WHttpServlet) clazz.newInstance();
						whttpServlet.service(request, response);

					} catch (InstantiationException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} catch (IllegalAccessException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}


				} catch (ClassNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}
}

```

WRequest类：

```java
package com.wykd.netty.tomcat;

import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.QueryStringDecoder;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

public class WRequest {

    private String url;
    private String method;
    private String hostName;

    private ChannelHandlerContext ctx;
    private HttpRequest req;

    private Map<String, List<String>> parameters;

    public WRequest() {
    }


    public WRequest(ChannelHandlerContext ctx, HttpRequest req) {
        this.req =req;
        this.ctx = ctx;
    }


    public String getHostName() {
        return hostName;
    }


    public String getUrl() {
        return req.uri();
    }


    public String getMethod() {
        return req.getMethod().name();
    }

    public Map<String, List<String>> getParameters() {
        QueryStringDecoder decoder = new QueryStringDecoder(req.uri());
        return decoder.parameters();
    }


}

```

WResponse类：

```java
package com.wykd.netty.tomcat;

import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.*;

import java.io.IOException;
import java.io.OutputStream;

public class WResponse {

	private ChannelHandlerContext ctx;
	private HttpRequest req;

	public WResponse() {
	}
	
    public WResponse(ChannelHandlerContext ctx, HttpRequest req) {
		this.ctx = ctx;
		this.req = req;
    }


    public void write(String content) {
		
		try{

			if(content == null || content.length() ==0){
				return ;
			}

			FullHttpResponse response = new DefaultFullHttpResponse(
					HttpVersion.HTTP_1_1, HttpResponseStatus.OK,
					Unpooled.wrappedBuffer(content.getBytes("UTF-8"))
			);

			response.headers().set("Content-Type","text/html");
			ctx.write(response);

		}catch (Exception e){
			e.printStackTrace();
		}finally {
			ctx.flush();
			ctx.close();
		}
	}
	
	
}

```

WHttpServlet类，内容无变化

```java
package com.wykd.netty.tomcat;

public abstract class WHttpServlet {

	public abstract void doGet(WRequest request , WResponse response) ;

	public abstract void doPost(WRequest request , WResponse response) ;
	
	public void service(WRequest request , WResponse response) {
		if(request.getMethod().equalsIgnoreCase("GET")) {
			doGet(request, response);
		}else if(request.getMethod().equalsIgnoreCase("POST")) {
			doPost(request, response);
		}
	}
	
}

```

web.xml增加以下内容：

```xml
<servlet>
		<servlet-name>userServlet</servlet-name>
		<servlet-class>com.wykd.netty.servlet.UserServlet</servlet-class>
	</servlet>

	<servlet-mapping>
		<servlet-name>userServlet</servlet-name>
		<url-pattern>/userServlet</url-pattern>
	</servlet-mapping>
```

UserServlet

```java
package com.wykd.netty.servlet;

import com.wykd.netty.tomcat.WHttpServlet;
import com.wykd.netty.tomcat.WRequest;
import com.wykd.netty.tomcat.WResponse;

public class UserServlet extends WHttpServlet {

	@Override
	public void doGet(WRequest request, WResponse response) {
		response.write("user");
	}

	@Override
	public void doPost(WRequest request, WResponse response) {
		response.write("user");
	}

	
}

```

发送请求：

```
http://localhost:8080/helloServlet

返回结果：

user
```



## Tomcat源码项目构建

参考1：https://www.cnblogs.com/zhiyouwu/p/11654442.html

参考2：https://blog.csdn.net/u013857458/article/details/81866366





## Http长连接

关键类：

```
# tomcat保持长连接的伪代码如下：
boolean keepalive = true
while(keepalive){
	socket取数据
	解析请求行
	解析请求头
	
	connection = get("Connection")
	if(connection == "Close"){
		keepalive = false;
	}else{
		keepalive = true;
	}
	
	servlet处理业务逻辑
	响应
}
socket.close
```













