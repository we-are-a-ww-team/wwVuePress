# JVM

> 线程独有内存：栈内存
>
> 共享内存：堆内存，方法区

## 栈内存

> 栈内存包括3个方面：
>
> 1.程序计数器。
>
> 2.虚拟机栈：每一个方法，会启用一个栈帧。每个栈帧包括：**局部变量表，操作数栈**，动态连接等
>
> 3.本地方法栈：native方法，调用系统的C语言方法，可通过linux命令查看，如：man 2 select

出栈入栈示例：

```java
package com.wykd.jvm;

public class JVMTest {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;
        int c = a * b;
        System.out.println(c);
    }
}
```

```java
编译命令：	 javac JVMTest.java
反编译命令：  javap -v JVMTest.class > jvm.txt
执行命令：    java com.wykd.jvm.JVMTest
```

字节码反编译结果为：

字节码指令，参考：https://www.cnblogs.com/longjee/p/8675771.html

```
Classfile /D:/Alex_Java/workspace/idea_workspace/wykd-java/ww-basic/src/main/java/com/wykd/jvm/JVMTest.class
  Last modified 2020-5-4; size 418 bytes
  MD5 checksum 69259f29d94aef33546f535d3e75fa35
  Compiled from "JVMTest.java"
public class com.wykd.jvm.JVMTest
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #5.#14         // java/lang/Object."<init>":()V
   #2 = Fieldref           #15.#16        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = Methodref          #17.#18        // java/io/PrintStream.println:(I)V
   #4 = Class              #19            // com/wykd/jvm/JVMTest
   #5 = Class              #20            // java/lang/Object
   #6 = Utf8               <init>
   #7 = Utf8               ()V
   #8 = Utf8               Code
   #9 = Utf8               LineNumberTable
  #10 = Utf8               main
  #11 = Utf8               ([Ljava/lang/String;)V
  #12 = Utf8               SourceFile
  #13 = Utf8               JVMTest.java
  #14 = NameAndType        #6:#7          // "<init>":()V
  #15 = Class              #21            // java/lang/System
  #16 = NameAndType        #22:#23        // out:Ljava/io/PrintStream;
  #17 = Class              #24            // java/io/PrintStream
  #18 = NameAndType        #25:#26        // println:(I)V
  #19 = Utf8               com/wykd/jvm/JVMTest
  #20 = Utf8               java/lang/Object
  #21 = Utf8               java/lang/System
  #22 = Utf8               out
  #23 = Utf8               Ljava/io/PrintStream;
  #24 = Utf8               java/io/PrintStream
  #25 = Utf8               println
  #26 = Utf8               (I)V
{
  public com.wykd.jvm.JVMTest();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0

  public static void main(java.lang.String[]);			//对应代码中的main方法
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=4, args_size=1
         0: bipush        10				//将10，压入栈
         2: istore_1						//将栈顶的变量取出，移入局部变量表的1号位置
         3: iconst_5						//将5压入栈
         4: istore_2						//将栈顶的变量取出，移入局部变量表的2号位置
         5: iload_1							//将局部变量表的1号变量，压入栈顶
         6: iload_2							//将局部变量表的2号变量，压入栈顶
         7: imul							//取出并计算栈顶的2个变量，并压入栈顶
         8: istore_3						//将栈顶的变量取出，移入局部变量表的3号位置
         9: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
        12: iload_3							//从局变量的3号位置，取出变量，并压入栈顶
        13: invokevirtual #3                  // 调用System.out的打印方法，Method java/io/PrintStream.println:(I)V
        16: return
      LineNumberTable:
        line 5: 0
        line 6: 3
        line 7: 5
        line 8: 9
        line 9: 16
}
SourceFile: "JVMTest.java"

```

导致异常情况：

StackOverFlowException：通常由于递归导致，嵌套执行的层数超出jvm的默认层数，导致溢出。

OutOfMemoryException：线程总共占用的内存过大，导致内存溢出。一个线程默认占用1M内存；解决办法，将Xss改小，如：改为128K，Xss该小后，还能增加并发线程数的能力。

## 堆内存