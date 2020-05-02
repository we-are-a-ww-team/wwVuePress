# IO流

## BIO

**常用IO流：**

![io流](./io.assets/io.jpg)

### InputStream OutputStream

#### 普通版

```java
//服务端代码示例：
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
                Socket socket = serverSocket.accept();  //accept ===> socket阻塞
                OutputStream out = socket.getOutputStream();
                InputStream in = socket.getInputStream();
        ) {

            byte[] bytes = new byte[2048];
            int len = -1;
            String result = "";
            while ((len = in.read(bytes)) != -1) {  //read ===> io阻塞
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



#### 线程池增强版

> 服务端增加线程池，每个客户端的连接，由线程池分配一个线程进行数据接收。

```java
//服务端代码：
package com.wykd.bio.inputstream.threadpool;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class InputStreamServer {

    public static void main(String[] args) {

        new InputStreamServer().startServer();
    }


    public void startServer() {

        ExecutorService executorService = Executors.newFixedThreadPool(50);

        ServerSocket serverSocket = null;
        try {
            serverSocket = new ServerSocket(9090);
        } catch (IOException e) {
            e.printStackTrace();
        }

        while (true) {
            try {
                Socket socket = serverSocket.accept();
                //用线程池管理分配线程，接收客户端的消息
                executorService.submit(new ThreadHandler(socket));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }


    }

    class ThreadHandler implements Runnable {

        private Socket socket;

        public ThreadHandler(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            try (
                    OutputStream out = socket.getOutputStream();
                    InputStream in = socket.getInputStream();
            ) {

                System.out.println("当前线程名："+Thread.currentThread().getName());
                byte[] bytes = new byte[2048];
                int len = -1;
                String result = "";
                while ((len = in.read(bytes)) != -1) {
                    result += new String(bytes, 0, len);
                }
                System.out.println("接收到客户端消息===>" + result);

            } catch (IOException e) {
                e.printStackTrace();
                try {
                    this.socket.close();
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        }
    }
}

```

```java
//客户端01代码：
package com.wykd.bio.inputstream.threadpool;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class InputStreamClient1 {

    public static void main(String[] args) {
        startClient();
    }

    public static void startClient() {
        try (
                Socket socket = new Socket("localhost", 9090);
                OutputStream out = socket.getOutputStream();
                InputStream in = socket.getInputStream();
        ) {

            System.out.println("向服务端发送消息！");
            out.write("hello world 01".getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

```java
//客户端02代码：
package com.wykd.bio.inputstream.threadpool;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class InputStreamClient2 {

    public static void main(String[] args) {
        startClient();
    }

    public static void startClient() {
        try (
                Socket socket = new Socket("localhost", 9090);
                OutputStream out = socket.getOutputStream();
                InputStream in = socket.getInputStream();
        ) {
            System.out.println("向服务端发送消息！");
            out.write("hello world 02".getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

执行结果：

```
当前线程名：pool-1-thread-1
接收到客户端消息===>hello world 01
当前线程名：pool-1-thread-2
接收到客户端消息===>hello world 02
```

#### 多路复用增强版

> 采用nio，模拟多路复用

```java
//服务端代码：
package com.wykd.bio.inputstream.nio;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.ArrayList;
import java.util.List;

/**
 * 用nio模拟多路复用
 */
public class InputStreamServer {

    public static void main(String[] args) {

        try {
            new InputStreamServer().startServer();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    List<SocketChannel> socketChannelList = new ArrayList<SocketChannel>();
    ByteBuffer byteBuffer = ByteBuffer.allocate(512);

    public void startServer() throws IOException {

        // 类似于new ServerSocket("8081");
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        SocketAddress socketAddress = new InetSocketAddress("127.0.0.1",8081);
        serverSocketChannel.bind(socketAddress);

        serverSocketChannel.configureBlocking(false); //将socket的accept设置为非阻塞
        while (true){

            for (SocketChannel tempSocketChannel : socketChannelList) {
                int read = tempSocketChannel.read(byteBuffer);
                if(read>0){
                    byteBuffer.flip();
                    byte[] bs = new byte[read];
                    byteBuffer.get(bs);
                    String content = new String(bs);
                    System.out.println(content);
                    byteBuffer.flip();
                }
            }

            SocketChannel socketChannel = serverSocketChannel.accept();
            if(socketChannel != null){
                socketChannel.configureBlocking(false);   //将read设置为非阻塞
                socketChannelList.add(socketChannel);
            }
        }
    }
}

```

```java
//客户端代码1：
package com.wykd.bio.inputstream.nio;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class InputStreamClient1 {

    public static void main(String[] args) {
        startClient();
    }

    public static void startClient() {
        try (
                Socket socket = new Socket("localhost", 8081);
                OutputStream out = socket.getOutputStream();
                InputStream in = socket.getInputStream();
        ) {

            System.out.println("向服务端发送消息！");
            out.write("hello world 01".getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

```java
//客户端代码1：
package com.wykd.bio.inputstream.nio;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class InputStreamClient2 {

    public static void main(String[] args) {
        startClient();
    }

    public static void startClient() {
        try (
                Socket socket = new Socket("localhost", 8081);
                OutputStream out = socket.getOutputStream();
                InputStream in = socket.getInputStream();
        ) {
            System.out.println("向服务端发送消息！");
            out.write("hello world 02".getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

运行服务端，客户端01，客户端02，执行结果如下：

```
hello world 01
hello world 02
```

### FileInputStream OutputStream

```java
//代码示例：
package com.wykd.bio.fileinputstream;

import java.io.*;

public class TestFileCopy {


    public static void main(String[] args) throws IOException {
        long start1 = System.currentTimeMillis();
        copy01(new File("d:\\copy/src.txt"), new File("d:\\copy/desc1.txt"));
        System.out.println("copy01耗时===>"+(System.currentTimeMillis()-start1));

        long start2 = System.currentTimeMillis();
        copy02(new File("d:\\copy/src.txt"), new File("d:\\copy/desc2.txt"));
        System.out.println("copy02耗时===>"+(System.currentTimeMillis()-start2));

        long start3 = System.currentTimeMillis();
        copy03(new File("d:\\copy/src.txt"), new File("d:\\copy/desc3.txt"));
        System.out.println("copy03耗时===>"+(System.currentTimeMillis()-start3));

        long start4 = System.currentTimeMillis();
        copy04(new File("d:\\copy/src.txt"), new File("d:\\copy/desc4.txt"));
        System.out.println("copy04耗时===>"+(System.currentTimeMillis()-start4));

        long start5 = System.currentTimeMillis();
        copy05(new File("d:\\copy/src.txt"), new File("d:\\copy/desc5.txt"));
        System.out.println("copy05耗时===>"+(System.currentTimeMillis()-start5));

        long start6 = System.currentTimeMillis();
        copy06(new File("d:\\copy/src.txt"), new File("d:\\copy/desc6.txt"));
        System.out.println("copy06耗时===>"+(System.currentTimeMillis()-start6));

        long start7 = System.currentTimeMillis();
        copy07(new File("d:\\copy/src.txt"), new File("d:\\copy/desc7.txt"));
        System.out.println("copy07耗时===>"+(System.currentTimeMillis()-start7));
    }

    /*
     *  字节流，每次读写单个字节
     */
    public static void copy01(File src, File desc) throws IOException {
        FileInputStream fis = new FileInputStream(src);
        FileOutputStream fos = new FileOutputStream(desc);
        int len = 0;
        while ((len = fis.read()) != -1) {
            fos.write(len);
        }
        fos.close();
        fis.close();
    }

    /*
     * 字节流，每次读写 一个字节数组
     */
    public static void copy02(File src, File desc) throws IOException {
        FileInputStream fis = new FileInputStream(src);
        FileOutputStream fos = new FileOutputStream(desc);
        int len = 0;
        byte[] bytes = new byte[1024];
        while ((len = fis.read(bytes)) != -1) {
            fos.write(bytes, 0, len);
        }
        fos.close();
        fis.close();
    }

    /*
     * 字节流缓冲区流，每次读写1个字节
     */
    public static void copy03(File src, File desc) throws IOException {
        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(src));
        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(desc));
        int len = 0;
        while ((len = bis.read()) != -1) {
            bos.write(len);
        }
        bos.close();
        bis.close();
    }

    /*
     * 字节流缓冲区流，每次读写1个字节数组
     */
    public static void copy04(File src, File desc) throws IOException {
        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(src));
        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(desc));
        int len = 0;
        byte[] bytes = new byte[1024];
        while ((len = bis.read(bytes)) != -1) {
            bos.write(bytes, 0, len);
        }
        bos.close();
        bis.close();
    }

    /**
     * 复制copy04方法，字节数组长度增加一倍
     * @param src
     * @param desc
     * @throws IOException
     */
    public static void copy05(File src, File desc) throws IOException {
        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(src));
        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(desc));
        int len = 0;
        byte[] bytes = new byte[2048];
        while ((len = bis.read(bytes)) != -1) {
            bos.write(bytes, 0, len);
        }
        bos.close();
        bis.close();
    }

    /**
     * 用字符流拷贝文件
     * @param src
     * @param dest
     * @throws IOException
     */
    public static void copy06(File src ,File dest) throws IOException {
        //创建字符输入流缓冲流对象,构造方法传递字符输入流,包装数据源文件
        BufferedReader bfr = new BufferedReader(new FileReader(src));
        BufferedWriter bfw = new BufferedWriter(new FileWriter(dest));
        String line = null;
        while((line = bfr.readLine())!=null){
            bfw.write(line);
        }
        bfr.close();
        bfw.close();
    }

    /**
     * 使用转换流，字符流拷贝文件
     * @param src
     * @param dest
     * @throws IOException
     */
    public static void copy07(File src ,File dest) throws IOException {
        InputStreamReader isr = new InputStreamReader(new FileInputStream(src),"utf-8");
        OutputStreamWriter osw= new OutputStreamWriter(new FileOutputStream(dest),"utf-8")
        BufferedReader bfr = new BufferedReader(isr);
        BufferedWriter bfw = new BufferedWriter(osw);
        String line = null;
        while((line = bfr.readLine())!=null){
            bfw.write(line);
        }
        bfr.close();
        bfw.close();
    }
}
```

```
复制一个12M的文件，执行结果如下：

copy01耗时===>34636
copy02耗时===>63
copy03耗时===>254
copy04耗时===>23
copy05耗时===>20
copy06耗时===>128
copy07耗时===>86
```



## NIO