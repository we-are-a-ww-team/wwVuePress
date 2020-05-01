# IO流

## BIO

### 字节流

#### InputStream OutputStream

服务端代码示例：

```java
package com.wykd.bio.inputstream;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class InputStreamServer {

    public static void main(String[] args) {
        startServer();
    }


    public static void startServer() {
        try (
                ServerSocket serverSocket = new ServerSocket(9090);
                Socket socket = serverSocket.accept();
                OutputStream out = socket.getOutputStream();
                InputStream in = socket.getInputStream();
        ) {

            byte[] bytes = new byte[2048];
            int len = -1;
            String result = "";
            while ((len = in.read(bytes)) != -1) {
                result += new String(bytes, 0, len);
                System.out.println("接收数据！");
            }
            System.out.println("接收到客户端消息===>" + result);

            out.write("这是来自服务端的消息！".getBytes());
            out.flush();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

客户端代码示例：

```java
package com.wykd.bio.inputstream;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class InputStreamClient {

    public static void main(String[] args) {
        satrtClient();
    }

    public static void satrtClient() {
        try (
                Socket socket = new Socket("localhost", 9090);
                OutputStream out = socket.getOutputStream();
                InputStream in = socket.getInputStream();
        ) {

            System.out.println("向服务端发送消息！");
            out.write("hello world".getBytes());
            out.flush();

            socket.shutdownOutput();  //该句话非常关键，不关闭输出流的话，但不会关闭socket连接，服务端会一直阻塞在读取方法。

            byte[] bytes = new byte[2048];
            int len = 0;
            String result = "";
            while ((len = in.read(bytes)) != -1) {
                result += new String(bytes, 0, len);
            }
            System.out.println("接收到服务端消息===>" + result);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

分别启动服务端，以及客户端。

输出结果：

```
服务端打印：

接收数据！
接收到客户端消息===>hello world

客户端打印：

向服务端发送消息！
接收到服务端消息===>这是来自服务端的消息！
```



### 字符流

## NIO